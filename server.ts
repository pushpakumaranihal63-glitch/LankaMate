import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { setupAdminBackend } from "./src/server/adminBackend";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Mount Secure Admin Backend APIs & Middleware
  setupAdminBackend(app);

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "LankaMate Server" });
  });

  // Category-specific OSM search query terms optimized for Sri Lanka naming conventions
  const CATEGORY_SEARCH_QUERIES: Record<string, string[]> = {
    hotel: ["hotel", "resort", "guest house", "homestay"],
    restaurant: ["restaurant", "cafe", "food"],
    fuel: ["filling station", "ceypetco", "fuel", "petrol"],
    bank: ["Bank", "Commercial Bank", "BOC", "ATM"],
    hospital: ["hospital", "medical centre", "clinic"],
    car_service: ["garage", "repair", "mechanic", "auto repair"],
    pharmacy: ["Pharmacy", "Chemist", "Osusala"],
    supermarket: ["Supermarket", "Cargills", "Keells", "Food City"],
    attraction: ["temple", "museum", "attraction", "landmark"],
  };

  // In-memory cache for nearby places to prevent Nominatim rate-limits and accelerate responses
  interface CacheEntry {
    places: any[];
    timestamp: number;
  }
  const nearbyPlacesCache = new Map<string, CacheEntry>();
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // OpenStreetMap Nearby Places Proxy Endpoint (CORS-safe, Sri Lanka bounded, Rate-Limit resilient)
  app.get("/api/places/nearby", async (req, res) => {
    try {
      const category = (req.query.category as string) || "hotel";
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radiusKm = parseFloat(req.query.radius as string) || 25;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Valid lat and lng required", places: [] });
      }

      // Check cache first
      const cacheKey = `${category}_${lat.toFixed(2)}_${lng.toFixed(2)}_${radiusKm >= 20 ? "wide" : "close"}`;
      const cached = nearbyPlacesCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return res.json({ places: cached.places });
      }

      // Calculate approximate bounding box degrees (1 degree lat ~= 111 km)
      const degDelta = Math.max(0.08, (radiusKm / 111) * 1.3);
      const minLat = (lat - degDelta).toFixed(5);
      const maxLat = (lat + degDelta).toFixed(5);
      const minLng = (lng - degDelta).toFixed(5);
      const maxLng = (lng + degDelta).toFixed(5);
      const viewbox = `${minLng},${maxLat},${maxLng},${minLat}`;
      const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

      const queryList = CATEGORY_SEARCH_QUERIES[category] || [category];
      const mergedPlaces: any[] = [];
      const seenIds = new Set<string | number>();
      const seenLocs = new Set<string>();

      const addPlaceIfValid = (item: any) => {
        const id = item.place_id || item.osm_id;
        if (id && seenIds.has(id)) return;
        if (id) seenIds.add(id);

        const latNum = parseFloat(item.lat);
        const lngNum = parseFloat(item.lon);
        if (isNaN(latNum) || isNaN(lngNum)) return;

        // Proximity deduplication within ~30m
        const locKey = `${latNum.toFixed(4)}_${lngNum.toFixed(4)}`;
        if (seenLocs.has(locKey)) return;
        seenLocs.add(locKey);

        mergedPlaces.push(item);
      };

      // 1. Query primary term from Nominatim with timeout
      try {
        const primaryTerm = queryList[0];
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          primaryTerm
        )}&viewbox=${viewbox}&bounded=1&countrycodes=lk&limit=50`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const nomRes = await fetch(nominatimUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "LankaMate-Traveler-App/1.0 (contact: info@lankamate.lk)",
            "Accept-Language": "en",
          },
        });
        clearTimeout(timeoutId);

        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (Array.isArray(nomData)) {
            for (const item of nomData) {
              addPlaceIfValid(item);
            }
          }
        }
      } catch {
        // Continue to supplementary queries / Photon fallback
      }

      // 2. Query Photon OSM API (High performance, no rate-limit, OpenStreetMap data)
      try {
        const photonTerm = queryList[0];
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          photonTerm
        )}&lat=${lat}&lon=${lng}&bbox=${bbox}&limit=50`;

        const pController = new AbortController();
        const pTimeoutId = setTimeout(() => pController.abort(), 4000);

        const pRes = await fetch(photonUrl, {
          signal: pController.signal,
          headers: { "Accept-Language": "en" },
        });
        pTimeoutId && clearTimeout(pTimeoutId);

        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData.features)) {
            for (const f of pData.features) {
              const p = f.properties || {};
              const coords = f.geometry?.coordinates;
              if (!coords || coords.length < 2) continue;

              // Only include places in Sri Lanka
              if (p.countrycode && p.countrycode.toLowerCase() !== "lk") continue;

              addPlaceIfValid({
                place_id: p.osm_id || Math.floor(Math.random() * 10000000),
                osm_id: p.osm_id,
                osm_type: p.osm_type || "node",
                lat: String(coords[1]),
                lon: String(coords[0]),
                display_name: `${p.name || p.street || category}, ${p.city || p.district || "Sri Lanka"}`,
                name: p.name,
                address: {
                  city: p.city,
                  town: p.city,
                  suburb: p.district,
                  road: p.street,
                  country: "Sri Lanka",
                  country_code: "lk",
                },
              });
            }
          }
        }
      } catch {
        // ignore
      }

      // Cache the result if places were found
      if (mergedPlaces.length > 0) {
        nearbyPlacesCache.set(cacheKey, {
          places: mergedPlaces,
          timestamp: Date.now(),
        });
      }

      return res.json({ places: mergedPlaces });
    } catch (err) {
      console.error("OSM Proxy Error:", err);
      return res.json({ places: [] });
    }
  });

  // Payment Transactions in-memory store
  interface ServerPaymentTransaction {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: 'Pending' | 'Processing' | 'Successful' | 'Failed' | 'Cancelled' | 'Refunded';
    paymentMethod: string;
    mode: 'demo' | 'live';
    customerName: string;
    customerEmail: string;
    bookingTitle: string;
    gatewayRef?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
  }
  const paymentOrders = new Map<string, ServerPaymentTransaction>();

  // Payment Endpoints
  app.post("/api/payment/create-order", (req, res) => {
    try {
      const { amount, currency, bookingTitle, customerName, customerEmail, paymentMethod, mode } = req.body;
      const orderId = `LK-ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

      const transaction: ServerPaymentTransaction = {
        id: transactionId,
        orderId,
        amount: Number(amount) || 0,
        currency: currency || 'USD',
        status: mode === 'demo' ? 'Pending' : 'Pending',
        paymentMethod: paymentMethod || 'visa',
        mode: mode === 'live' ? 'live' : 'demo',
        customerName: customerName || 'Valued Traveler',
        customerEmail: customerEmail || 'guest@lankamate.lk',
        bookingTitle: bookingTitle || 'Sri Lanka Tour & Stay Booking',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      paymentOrders.set(orderId, transaction);
      return res.json({ success: true, transaction });
    } catch (err: any) {
      console.error("Create order error:", err);
      return res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  app.post("/api/payment/confirm-demo", (req, res) => {
    try {
      const { orderId, simulateResult } = req.body;
      const order = paymentOrders.get(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (simulateResult === 'failed') {
        order.status = 'Failed';
        order.failureReason = 'Simulated card decline or insufficient test funds.';
        order.updatedAt = new Date().toISOString();
        return res.json({ success: false, transaction: order });
      }

      order.status = 'Successful';
      order.gatewayRef = `LK-DEMO-GATEWAY-${Date.now().toString(36).toUpperCase()}`;
      order.updatedAt = new Date().toISOString();

      return res.json({ success: true, transaction: order });
    } catch (err: any) {
      console.error("Demo confirmation error:", err);
      return res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  app.get("/api/payment/order/:id", (req, res) => {
    const order = paymentOrders.get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json({ success: true, transaction: order });
  });

  // Gemini text-to-speech for Sinhala and Arabic translation playback.
  app.post("/api/tts", async (req, res) => {
    const { text, language } = req.body ?? {};

    if (typeof text !== "string" || !text.trim() || text.trim().length > 500) {
      return res.status(400).json({ error: "Valid text of at most 500 characters is required." });
    }
    if (language !== "si" && language !== "ar") {
      return res.status(400).json({ error: "Unsupported speech language." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Speech service is temporarily unavailable." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const voiceByLanguage: Record<"si" | "ar", string> = {
        si: "Kore",
        ar: "Kore",
      };
      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash-tts",
        input: [
          {
            type: "user_input",
            content: [{ type: "text", text: text.trim() }],
          },
        ],
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [{ voice: voiceByLanguage[language] }],
        },
      });

      const audioData = interaction.output_audio?.data;
      if (!audioData) {
        return res.status(502).json({ error: "Speech audio could not be generated." });
      }

      res.setHeader("Content-Type", "audio/wav");
      return res.send(Buffer.from(audioData, "base64"));
    } catch (err: any) {
      console.error("Gemini TTS request failed with status:", err?.status ?? "unknown");
      return res.status(503).json({ error: "Speech service is temporarily unavailable." });
    }
  });
  // Translation endpoint powered by Gemini AI
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLang, targetLang } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      if (sourceLang === targetLang) {
        return res.json({ translatedText: text, sourceLang, targetLang });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "Translation service is temporarily unavailable. Please try again.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const langNames: Record<string, string> = {
        en: "English",
        si: "Sinhala (සිංහල)",
        ta: "Tamil (தமிழ்)",
        zh: "Simplified Chinese (简体中文)",
        ja: "Japanese (日本語)",
        ko: "Korean (한국어)",
        de: "German (Deutsch)",
        fr: "French (Français)",
        es: "Spanish (Español)",
        ru: "Russian (Русский)",
        ar: "Arabic (العربية)",
        hi: "Hindi (हिन्दी)",
        it: "Italian (Italiano)",
        tr: "Turkish (Türkçe)",
      };

      const sourceName = langNames[sourceLang] || sourceLang;
      const targetName = langNames[targetLang] || targetLang;

      const prompt = `Translate the following text from ${sourceName} into ${targetName}.
RULES:
1. Provide an authentic, natural, culturally appropriate translation.
2. DO NOT translate Sri Lankan proper names and monuments incorrectly (e.g., Sigiriya, Kandy, Galle Fort, Sri Dalada Maligawa, Ella, Mirissa, Kottu, Hoppers, Ruwanwelisaya should retain their recognized identity or phonetic script).
3. Output ONLY the translated text. Do not add quotes, introductory text, explanations, or notes.

Text to translate:
"""
${text}
"""`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
        },
      });

      const translated = response.text ? response.text.trim().replace(/^["']|["']$/g, "") : text;
      return res.json({ translatedText: translated, sourceLang, targetLang });
    } catch (err: any) {
      console.error("Translation API Error:", err);
      return res.status(503).json({
        error: "Translation service is temporarily unavailable. Please try again.",
      });
    }
  });

  // Gemini AI Travel Assistant endpoint
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, history, language } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback intelligent response generator if API key is not configured
        const fallbackAnswer = generateOfflineTravelResponse(message, language || "en");
        return res.json({
          reply: fallbackAnswer,
          isOfflineFallback: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const langNames: Record<string, string> = {
        en: "English",
        si: "Sinhala",
        ta: "Tamil",
        zh: "Simplified Chinese",
        ja: "Japanese",
        ko: "Korean",
        de: "German",
        fr: "French",
        es: "Spanish",
        ru: "Russian",
        ar: "Arabic",
        hi: "Hindi",
        it: "Italian",
        tr: "Turkish",
      };
      const preferredLanguage = langNames[language] || "English";

      const systemInstruction = `You are "LankaMate AI", an expert, friendly, and culturally knowledgeable local Sri Lankan travel assistant. 
Your role is to help foreign tourists and local travelers discover Sri Lanka ("The Pearl of the Indian Ocean").
Provide clear, warm, authentic, and practical advice covering:
- Destinations (Sigiriya, Ella, Kandy, Galle, Mirissa, Yala, Nuwara Eliya, Jaffna, Trincomalee, Anuradhapura, etc.)
- Authentic Sri Lankan food (Kottu, Hoppers, String Hoppers, Rice & Curry, Pol Sambol, Seafood, etc.)
- Transport (Scenic trains like Kandy-Ella blue train, Tuk-tuks and PickMe/Uber apps, highway express buses, private chauffeur drivers)
- Culture & Temple etiquette (modest clothing covering shoulders & knees, removing hats/shoes, no backs to Buddha statues)
- Weather & Monsoons (Southwest monsoon May-Sept vs Northeast monsoon Dec-Feb, explaining why Sri Lanka is a year-round destination)
- Currencies, SIM cards (Dialog/Mobitel at BIA airport), safety, and emergency numbers (1990 for Ambulance, 1912 for Tourist Police)
- Cost estimations in both Sri Lankan Rupees (LKR) and USD approx.

Tone: Enthusiastic, warm ("Ayubowan!"), highly structured with bullet points where appropriate, concise yet comprehensive.

CRITICAL MULTILINGUAL INSTRUCTION:
The user's preferred language is ${preferredLanguage}. Unless the user specifically asks in a different language, respond fluently and naturally in ${preferredLanguage}. If the user writes their query in a specific language (such as Korean, Japanese, Chinese, Sinhala, Tamil, German, French, Spanish, Russian, Arabic, Hindi, Italian), respond in that exact language. Keep Sri Lankan proper nouns recognizable.`;

      // Build contents array if history exists
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history.slice(-6)) {
          const textContent = h.text || (Array.isArray(h.parts) && h.parts[0]?.text) || (typeof h.parts === 'string' ? h.parts : "");
          if (h.role && textContent) {
            contents.push({
              role: h.role === "user" ? "user" : "model",
              parts: [{ text: textContent }],
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Ayubowan! I am here to help you plan your journey in Sri Lanka.";
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error("Gemini Assistant Error:", err);
      // If API error occurs, provide a helpful fallback answer based on user query
      const fallback = generateOfflineTravelResponse(req.body?.message || "", req.body?.language || "en");
      return res.json({
        reply: fallback,
        isOfflineFallback: true,
        errorNotice: "Generated using LankaMate Local Knowledge Base.",
      });
    }
  });

  // Speech-to-text endpoint using Gemini audio transcription
  app.post("/api/speech-to-text", async (req, res) => {
    try {
      const { audio, mimeType, language } = req.body;

      if (!audio || typeof audio !== "string") {
        return res.status(400).json({ error: "Audio data is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: "Speech recognition service is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const langNames: Record<string, string> = {
        en: "English",
        si: "Sinhala",
        ta: "Tamil",
        zh: "Chinese",
        ja: "Japanese",
        ko: "Korean",
        de: "German",
        fr: "French",
        es: "Spanish",
        ru: "Russian",
        ar: "Arabic",
        hi: "Hindi",
        it: "Italian",
        tr: "Turkish",
      };
      const langName = langNames[language] || (Object.values(langNames).includes(language) ? language : "English");

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: audio,
                  mimeType: mimeType || "audio/webm",
                },
              },
              {
                text: `Transcribe the spoken audio in this clip. The user is speaking ${langName}. Return ONLY the transcribed text, nothing else. If the audio is silent or unclear, return an empty string.`,
              },
            ],
          },
        ],
        config: {
          temperature: 0,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      const transcript = (response.text || "").trim();
      return res.json({ transcript });
    } catch (err: any) {
      console.error("Speech-to-text error:", err);
      return res.status(500).json({ error: "Could not transcribe audio. Please try again." });
    }
  });

  // Serve static assets from public folder
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LankaMate Server running at http://0.0.0.0:${PORT}`);
  });
}

function generateOfflineTravelResponse(prompt: string, lang: string = "en"): string {
  const p = prompt.toLowerCase();

  // Multilingual keyword sets for common travel topics
  const transportKW = ["train", "railway", "station", "ticket", "bus", "tuk", "tuk-tuk", "tuktuk", "pickme", "uber", "taxi", "driver", "chauffeur", "expressway", "transport", "how to get", "how to go", "how to travel",
    // Sinhala
    "දුම්රිය", "බස්", "ටියුක්", "ට්‍රයින්", "ස්ටේෂන්", "ටිකට්", "කොහොමද යන්නේ", "කොහොමද යන්න", "යන්න ඕන", "යන්න",
    // Tamil
    "ரயில்", "பஸ்", "டக்ஸ்", "ஸ்டேஷன்", "டிக்கெட்", "எப்படி போக", "போக",
    // Other languages
    "列車", "電車", "기차", "Zug", "tren", "поезд", "قطار", "रेल", "treno"];
  const templeKW = ["temple", "dress", "etiquette", "wear", "monk", "buddha", "sacred", "shoes", "knees", "shoulders",
    "දේවාල", "විහාර", "බුදු", "සංඝ", "ඇඳුම", "ගමන්",
    "கோவில்", "புத்தர்", "ஆடை",
    "寺", "절", "Tempel", "templo", "храм", "معبد"];
  const foodKW = ["food", "kottu", "eat", "dish", "hopper", "street", "curry", "rice", "restaurant", "meal", "seafood",
    "කෑම", "කොත්තු", "හොපර්", "බත්", "කරි", "ආහාර",
    "உணவு", "கொඤ்து", "சாதம்", "கறி",
    "食べ物", "음식", "Essen", "comida", "еда", "طعام", "खाना", "cibo"];
  const wildlifeKW = ["yala", "safari", "leopard", "national park", "elephant", "wildlife", "animal", "bird",
    "යාල", "සතුන්", "වන", "ඇතා", "කොළ",
    "யால", "விலங்கு", "யானை",
    "サファリ", "사파리", "Safari", "safari", "сафари", " سفاري"];
  const weatherKW = ["weather", "monsoon", "season", "rain", "climate", "best time", "when to visit", "hot", "cold", "temperature",
    "කාලගුණ", "වැසි", "ඍතු", "උණුසුම",
    "வானிலை", "மழை", "பருவ",
    "天気", "날씨", "Wetter", "clima", "погода", "طقس", "मौसम", "tempo"];
  const itineraryKW = ["itinerary", "7 day", "7-day", "plan", "days", "trip", "route", "schedule", "day plan",
    "චාරිකා", "සංචාර", "දින", "සැලසුම",
    "சுற்றுப்பயணம்", "நாட்கள்", "திட்டம்",
    "旅行計画", "여행", "Reiseplan", "itinerario", "маршрут", "رحلة", "यात्रा", "itinerario"];
  const destinationKW = ["sigiriya", "ella", "kandy", "galle", "mirissa", "nuwara eliya", "jaffna", "trincomalee", "anuradhapura", "polonnaruwa", "dambulla", "colombo", "kataragama", "bentota", "arugam", "nuwara", "badulla", "matale", "ratnapura",
    "සීගිරිය", "ඇල්ල", "මහනුවර", "ගාල්ල", "මිරිස්ස", "නුවර", "යාපනය", "ත්‍රිකුණාමලය", "අනුරාධපුර", "පොළොන්නරුව", "දඹුල්ල", "කොළඹ", "කතරගම", "බදුල්ල", "මාතල",
    "சிகிரியா", "எல்லா", "கண்டி", "காலி", "யாழ்ப்பாணம்", "திருகோணமலை", "அனுராதபுரம்", "பொலந்நறுவ", "கட்டரகாம"];

  const hasAny = (keywords: string[]) => keywords.some((kw) => p.includes(kw.toLowerCase()));

  if (hasAny(transportKW)) {
    return `**Sri Lanka Scenic Blue Train Guide & Ticket Booking** 🚂

**1. Ticket Booking Guidance & Procedures:**
• **Online Advance Booking:** Sri Lanka Railways opens ticket reservations exactly **30 days in advance at 10:00 AM Sri Lanka Time (04:30 UTC)** via the official government portal (**seatreservation.railway.gov.lk**) or through local mobile operators (Mobitel/Dialog ticketing counters).
• **High Demand:** Tickets for the peak Kandy–Ella route sell out within minutes of release during tourist season (December–April & July–August), so be logged in right when tickets open.

**2. Reserved vs. Unreserved Seats:**
• **1st Class Reserved:** Air-conditioned, assigned seats with sealed tinted windows.
• **2nd Class Reserved (Recommended):** Guaranteed assigned seats with openable windows, overhead ceiling fans, and access to doorways for panoramic photography.
• **3rd Class Reserved:** Budget-friendly guaranteed seating, bench style with open windows.
• **Unreserved (2nd & 3rd Class):** Sold only on the day of travel directly at station ticket counters ~1 hour before departure.

**3. Most Scenic Train Routes:**
• **Kandy to Ella (The Classic Route):** 6.5 to 7 hours passing terraced tea estates, misty valleys, St. Clair's Falls, and high-altitude mountain tunnels.
• **Nanu Oya (Nuwara Eliya) to Ella:** The most dramatic 2.5-hour highland segment if you prefer a shorter trip.
• **Ella to Badulla:** 1 hour crossing the famous Demodara Nine Arches Bridge.
• **Colombo to Galle (Coastal Line):** Tracks run mere meters from crashing Indian Ocean waves and palm-fringed beaches.

**4. Booking & Travel Tips:**
• **Seating Orientation:** From Kandy to Nanu Oya, sit on the **right side** for the best valley and waterfall views. From Nanu Oya to Ella, sit on the **left side** for panoramic tea plantation sweeps.
• **Etiquette & Refreshments:** Be courteous at carriage doors; pack bottled water and snacks, or purchase hot vegetable samosas and tea from station vendors.`;
  }

  if (hasAny(templeKW)) {
    return `**Sacred Temple Dress Code & Etiquette in Sri Lanka** 🛕

**1. Cover Shoulders and Knees:**
• Both men and women must wear clothing that completely covers the shoulders, chest, and knees. Sleeveless tops, tank tops, and short shorts are strictly prohibited at temple gates.
• Keep a lightweight sarong or shawl in your daypack to wrap around shoulders or waist whenever entering sacred grounds.

**2. Modest & Respectful Attire:**
• Choose loose-fitting, non-revealing clothing suitable for warm weather. Avoid transparent fabrics or aggressive graphic tees.

**3. Remove Shoes and Hats Where Required:**
• All footwear and headwear must be removed before entering the inner sacred precinct, stupa terraces, and image houses. Dedicated shoe-keeping counters are available at temple gates (nominal tip of 50–100 LKR).
• **Tip:** Stone courtyards can become hot at midday; wear thick white socks to protect feet while adhering to no-shoe rules.

**4. White or Light-Coloured Clothing:**
• White or light pastel clothing is customary for Buddhist devotees in Sri Lanka, symbolizing purity and respect. While not mandatory for foreigners, it is warmly appreciated.

**5. Follow Each Temple's Specific Rules:**
• **Temple of the Sacred Tooth Relic (Kandy):** Strict security checks; drumming rituals (*Tevava*) occur at 5:30 AM, 9:30 AM, and 6:30 PM.
• **Dambulla Cave Temples:** Footwear must be removed before the rocky cave courtyard.
• **Hindu Kovils (e.g., Nallur in Jaffna):** Male devotees and visitors must remove their shirts and enter bare-chested.
• **Buddha Statues:** **NEVER turn your back directly to a Buddha statue** to take a selfie or pose for photos.
• **Monks:** Greet Buddhist monks with palms pressed together (*Ayubowan*). Women should never touch a monk or hand items directly into their hands.`;
  }

  if (hasAny(foodKW)) {
    return `**Ultimate Sri Lankan Street Food Guide** 🥘

**1. Iconic Street Food Specialties:**
• **Kottu Roti:** Chopped godamba flatbread stir-fried on an iron griddle with vegetables, eggs, spices, and chicken, beef, or molten cheese.
• **Hoppers (Appa):** Bowl-shaped crispy fermented rice batter and coconut milk pancakes with soft centers. Try Egg Hoppers paired with fiery *lunu miris* and sweet-spicy *seeni sambol*.
• **String Hoppers (Idiyappam):** Delicate steamed rice flour vermicelli nests eaten with mild coconut milk sodhi curry and fresh *pol sambol*.
• **Isso Wade:** Crunchy, deep-fried spiced lentil patties topped with whole seasoned prawns and fried curry leaves, served with fresh lime juice.
• **Egg Roti:** Fresh godamba roti folded with a whole egg, onions, and green chilies, toasted crisp and served with rich curry gravy.

**2. Popular Places & Street Food Hubs:**
• **Galle Face Green (Colombo):** Sunset ocean promenade famous for hot prawn isso wade, kottu, and fresh king coconut water.
• **Aluthkade Street (Colombo 12):** Lively late-night street food hub famous for cheese kottu, grilled meats, and faluda.
• **Pettah Market (Colombo):** Bustling market stalls for hot samosas, wade, and spiced tea.
• **Local "Hotels" (Bath Kades):** Family eateries found across Kandy, Galle, and coastal towns serving authentic curries.
• **Southern Beach Shacks (Mirissa & Weligama):** Freshly caught seafood displays grilled over coals right on the sand.

**3. Basic Food Safety Tips:**
• Choose busy stalls with high local turnover where food is prepared sizzling hot before your eyes.
• Drink sealed bottled or filtered water, or enjoy freshly opened King Coconuts (*Thambili*).
• Use travel hand sanitizer before eating, as traditional food is enjoyed with the right hand.`;
  }

  if (hasAny(wildlifeKW)) {
    return `**Yala National Park Wildlife Safari Guide** 🐆

**1. Safari Planning & Booking:**
• Safaris run in two main shifts: **Morning Safari (6:00 AM – 10:00 AM)** and **Afternoon Safari (2:30 PM – 6:30 PM)**, as well as full-day options.
• Block 1 has the highest leopard density; tickets can be arranged at Palatupana entrance gate or through your lodge.

**2. Best Times to Visit:**
• **Dry Season (February to July):** Wildlife viewing peaks as animals gather around waterholes and lagoons.
• Early mornings offer active birdlife and elephants; late afternoons are prime for spotting leopards basking on sun-warmed rocks.
• Note: Block 1 typically closes for 3–4 weeks in September/October for habitat rejuvenation.

**3. Safari Vehicle Guidance:**
• Hire a dedicated 4x4 open-top safari jeep with raised seating, suspension, and an experienced driver-tracker who knows animal calls and tracks.
• Reserve a private jeep for your party to ensure unrestricted 360-degree viewing and photography.

**4. Wildlife Safety Guidelines:**
• Remain completely inside the vehicle at all times.
• Speak only in quiet whispers; turn off camera flashes and phone ringers.
• Never attempt to feed or approach wild animals, and keep all arms/legs within the vehicle.

**5. Animals Commonly Seen:**
• Sri Lankan leopards (*Panthera pardus kotiya*), wild Asian elephants, sloth bears, spotted deer, mugger crocodiles, water buffalo, jackals, and over 215 bird species.

**6. Respect Park Rules & Conservation:**
• Obey park speed limits (25 km/h), maintain zero littering, and never pressure your driver to harass or crowd animals.`;
  }

  if (hasAny(weatherKW)) {
    return `**Sri Lanka Weather, Seasons & Monsoon Guide** ⛅

**1. Sri Lanka's Main Monsoon Seasons:**
Sri Lanka experiences two distinct monsoon cycles:
• **Yala (Southwest Monsoon): May to September**
  Brings rain to the southwestern coast (Colombo, Galle, Bentota) and central hill country.
• **Maha (Northeast Monsoon): October/November to February**
  Brings rain to the northern and eastern plains (Jaffna, Trincomalee, Pasikudah) and the Cultural Triangle.
• **Inter-Monsoonal Periods (March–April & October–November):**
  Warm, sunny mornings with occasional late-afternoon showers.

**2. Regional Weather Differences:**
• **South & West Coasts (Colombo, Galle, Mirissa):** Best from **December through April** with calm seas and sunny skies.
• **East Coast (Trincomalee, Arugam Bay):** Best from **May through September** with blue skies and top surfing/diving conditions.
• **Central Hill Country (Nuwara Eliya, Ella):** Cooler alpine climate year-round (12°C–22°C); Nuwara Eliya can drop to 10°C at night.
• **Cultural Triangle (Sigiriya):** Warm semi-arid climate (29°C–34°C) with sunshine through most months.

**3. Travel Considerations:**
• Sri Lanka is a true year-round destination: whenever one coast experiences rain, the opposite coast enjoys dry, sunny weather.
• Pack light breathable cottons, sun protection, an umbrella, and a light fleece for highland tea country.
• *Note:* Please check local day-to-day forecasts for live weather updates.`;
  }

  if (hasAny(itineraryKW)) {
    return `**Classic 7-Day Sri Lanka Itinerary (Highlights Circuit)** 🗺️

• **Day 1: Colombo (Arrival & Coastal Heritage)**
  Touchdown at BIA Airport, explore Colombo Fort and Gangaramaya Temple, and enjoy a sunset street-food stroll on Galle Face Green tasting hot prawn isso wade.

• **Day 2: Sigiriya & Dambulla (Cave Temples & 5th Century Lion Rock)**
  Explore the five painted cave sanctuaries of Dambulla Rock Cave Temple filled with 150+ Buddha statues, followed by a golden-hour climb of the monumental Sigiriya Lion Rock Fortress.

• **Day 3: Kandy (The Sacred Royal Capital)**
  Scenic drive via Matale spice gardens to Kandy; explore Peradeniya Royal Botanical Gardens and attend evening drumming rituals (*Tevava*) at the Temple of the Sacred Tooth Relic.

• **Day 4: Nuwara Eliya (Highland Tea Country & Waterfalls)**
  Wind upward into misty mountains past Ramboda Falls; tour a working Ceylon tea factory at Pedro Estate and enjoy Victorian High Tea at The Grand Hotel.

• **Day 5: Ella (The Famous Blue Train & Nine Arches Bridge)**
  Board the world-famous blue train from Nanu Oya to Ella through emerald tea hills; photograph Demodara Nine Arches Bridge and hike Little Adam’s Peak for sunset.

• **Day 6: Yala National Park (Leopard & Elephant Big Game Safari)**
  Descend past Ravana Falls to the southern dry plains; embark on an afternoon 4x4 open-top safari game drive in Yala Block 1 tracking wild leopards and elephants.

• **Day 7: Galle & Southern Coast (UNESCO Fort to Colombo Departure)**
  Travel along the southern coastline past Weligama Bay; explore 400-year-old ramparts and the lighthouse of UNESCO Galle Dutch Fort before returning via Expressway E01 to BIA Airport.`;
  }

  // Destination-specific or general travel question — provide a useful contextual answer
  // instead of a generic welcome message
  if (hasAny(destinationKW)) {
    return `**Sri Lanka Travel Guide** 🇱🇰

Here are some key tips for traveling in Sri Lanka:

• **Transport Options:** Buses and trains connect most cities. The scenic Kandy–Ella train is highly recommended. For shorter trips, use PickMe or Uber tuk-tuks. For intercity travel, highway express buses are fast and affordable.
• **Best Time to Visit:** December to April for the south and west coasts; May to September for the east coast. Sri Lanka is a year-round destination.
• **Cultural Etiquette:** Cover shoulders and knees at temples. Remove shoes and hats before entering sacred areas. Never pose with your back to a Buddha statue.
• **Food:** Try kottu roti, hoppers, string hoppers, and rice & curry at local eateries for authentic flavors.
• **Emergency Numbers:** 1990 (Ambulance), 1912 (Tourist Police).

For more specific guidance, please ask about transport routes, hotel recommendations, or day-by-day itinerary planning!`;
  }

  return `**Ayubowan! 🙏 LankaMate Travel Guide** 🇱🇰

Here are some key travel tips for Sri Lanka:

• **Getting Around:** Trains (especially the scenic Kandy–Ella route), highway express buses, PickMe/Uber tuk-tuks, and private chauffeur drivers are all great options.
• **Must-Visit Places:** Sigiriya Lion Rock, Temple of the Tooth in Kandy, Galle Dutch Fort, Yala National Park, Ella's Nine Arches Bridge, and Mirissa beach.
• **Food to Try:** Kottu roti, egg hoppers, string hoppers, isso wade, and authentic rice & curry.
• **Temple Etiquette:** Cover shoulders and knees, remove shoes/hats, and never turn your back to a Buddha statue.
• **Best Seasons:** South/West coast: December–April. East coast: May–September.
• **Emergency:** Dial 1990 for ambulance, 1912 for Tourist Police.

Please ask me about specific destinations, transport routes, food recommendations, or itinerary planning, and I will provide detailed guidance!`;
}

startServer();
