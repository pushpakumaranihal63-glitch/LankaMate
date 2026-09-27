export interface QuickAskItem {
  label: string;
  prompt: string;
  answer: string;
}

export const QUICK_ASK_ITEMS: QuickAskItem[] = [
  {
    label: 'Blue Train Tickets',
    prompt: 'How do I book reserved seats on the Kandy to Ella blue train?',
    answer: `**Sri Lanka Scenic Blue Train Guide & Ticket Booking** 🚂

**1. Ticket Booking Guidance & Procedures:**
• **Online Advance Booking:** Sri Lanka Railways opens ticket reservations exactly **30 days in advance at 10:00 AM Sri Lanka Time (04:30 UTC)** via the official government portal (**seatreservation.railway.gov.lk**) or through local mobile operators (Mobitel/Dialog ticketing counters).
• **High Demand:** Tickets for the peak Kandy–Ella route sell out within minutes of release during tourist season (December–April & July–August), so be logged in right when tickets open.

**2. Reserved vs. Unreserved Seats:**
• **1st Class Reserved:** Air-conditioned, assigned seats with sealed tinted windows. Extremely comfortable, but sealed windows make taking photos and feeling the mountain breeze difficult.
• **2nd Class Reserved (Recommended):** Guaranteed assigned seats with openable windows, overhead ceiling fans, and access to doorways for panoramic photography.
• **3rd Class Reserved:** Budget-friendly guaranteed seating, bench style with open windows.
• **Unreserved (2nd & 3rd Class):** Sold only on the day of travel directly at station ticket counters ~1 hour before departure. Tickets cannot sell out, but trains can be very packed and finding a seat is not guaranteed.

**3. Most Scenic Train Routes:**
• **Kandy to Ella (The Classic Route):** 6.5 to 7 hours passing terraced tea estates, misty valleys, St. Clair's Falls, and high-altitude mountain tunnels.
• **Nanu Oya (Nuwara Eliya) to Ella:** The most dramatic 2.5-hour highland segment if you prefer a shorter trip.
• **Ella to Badulla:** 1 hour crossing the famous Demodara Nine Arches Bridge and looping the Demodara railway spiral.
• **Colombo to Galle (Coastal Line):** Tracks run mere meters from crashing Indian Ocean waves and palm-fringed beaches.

**4. Booking & Travel Tips:**
• **Seating Orientation:** From Kandy to Nanu Oya, the **right side** offers the best valley and waterfall views. From Nanu Oya to Ella, sit on the **left side** for panoramic tea plantation sweeps.
• **Doorway Etiquette:** Be courteous with fellow travelers when taking photos at carriage doors. Never lean out dangerously while entering tunnels or passing signal posts.
• **Refreshments:** Pack bottled water, wet wipes, and snacks; station platform vendors also board to sell piping hot tea, roasted peanuts, and spicy vegetable samosas.`,
  },
  {
    label: 'Temple Dress Code',
    prompt: 'What is the required dress code for visiting the Temple of the Tooth and Sigiriya?',
    answer: `**Sacred Temple Dress Code & Etiquette in Sri Lanka** 🛕

**1. Cover Shoulders and Knees:**
• Both men and women must wear clothing that completely covers the shoulders, chest, and knees.
• **Prohibited Clothing:** Sleeveless tops, tank tops, crop tops, short shorts, mini skirts, and see-through or low-cut garments will result in refused entry at temple gates.
• **Tip:** Keep a sarong, lightweight scarf, or shawl in your daypack to wrap around shoulders or waist whenever entering sacred grounds.

**2. Modest & Respectful Attire:**
• Choose loose-fitting, comfortable, non-revealing garments suitable for warm weather.
• Avoid clothing with aggressive graphics, political slogans, or inappropriate messaging.

**3. Remove Shoes and Hats Where Required:**
• All footwear (shoes, sandals, flip-flops) and headwear (hats, caps, beanies) must be removed before entering the inner sacred precinct, stupa terraces, and image houses.
• Designated shoe-keeping counters (*chekku*) are situated at temple gates for a nominal tip of 50–100 LKR.
• **Pro-Tip:** Stone courtyards can become blistering hot in midday sun. Wear thick white socks so your feet are protected from burning stone surfaces while remaining in compliance with no-shoe rules.

**4. White or Light-Coloured Clothing:**
• White or pale pastel clothing is the traditional attire worn by Buddhist devotees in Sri Lanka, symbolizing purity, humility, and reverence.
• While foreign visitors are not strictly required to wear white, doing so is warmly appreciated and respected by locals.

**5. Follow Each Temple's Specific Rules:**
• **Temple of the Sacred Tooth Relic (Kandy):** Strict security checks; cover knees down to shins. Drumming rituals (*Tevava*) occur at 5:30 AM, 9:30 AM, and 6:30 PM.
• **Dambulla Cave Temples:** You must remove footwear before stepping onto the rocky cave courtyard. Keep your ticket handy after the lower gate check.
• **Hindu Kovils (e.g., Nallur Kandaswamy Kovil in Jaffna):** Male devotees and visitors are required to remove their shirts and enter bare-chested out of religious humility.
• **Buddha Statues:** **NEVER turn your back directly to a Buddha statue** to take a selfie or pose for photos; doing so is considered a grave offense in Sri Lankan culture.
• **Monks:** Greet Buddhist monks with palms pressed together (*Ayubowan* or *Vandana*). Women should never touch a Buddhist monk or hand items directly into their hands.`,
  },
  {
    label: 'Best Street Food',
    prompt: 'Where can I find the best street food and kottu in Colombo?',
    answer: `**Ultimate Sri Lankan Street Food Guide** 🥘

**1. Iconic Street Food Specialties:**
• **Kottu Roti:** The undisputed king of Sri Lankan night food! Chopped godamba roti tossed on a blazing iron griddle with crunchy shredded cabbage, carrots, onions, eggs, aromatic curry spices, and your choice of chicken, beef, or molten cheese. You will hear the rhythmic *clack-clack* of blades from blocks away.
• **Hoppers (Appa):** Bowl-shaped crispy fermented rice batter and coconut milk pancakes with lace-thin edges and a soft, fluffy steamed center. Try **Egg Hoppers** with a runny sunny-side-up egg in the middle, served alongside fiery *lunu miris* (onion-chili sambol) and sweet-spicy *seeni sambol*.
• **String Hoppers (Idiyappam):** Delicate steamed nests of rice flour vermicelli. Usually served in stacks of 5–10 for breakfast or dinner, paired with fragrant *kiri sodhi* (mild turmeric coconut gravy), dhal, and freshly scraped *pol sambol* (coconut relish).
• **Isso Wade (Prawn Fritters):** Crispy, golden-fried red lentil (dhal) patties crowned with whole seasoned tiger prawns and fried curry leaves. Crunchy, savory, and finished with a squeeze of fresh lime juice and chili paste.
• **Egg Roti:** Soft, freshly stretched godamba flatbread folded around an egg, green chilies, and onions, toasted crisp and served with rich vegetable or chicken curry gravy.

**2. Popular Places & Street Food Hubs:**
• **Galle Face Green (Colombo):** The historic ocean promenade where locals gather at sunset for spicy isso wade from street carts, freshly cracked king coconuts, and sea breezes.
• **Aluthkade Street (Colombo 12):** Colombo's bustling late-night street food strip, famous for cheese kottu, beef babath, brain masala, and fresh fruit faluda.
• **Pettah Market Stalls (Colombo):** Bustling market alleys serving hot vegetable samosas, wade, ulundu wade, and spiced chai tea.
• **Local "Hotels" (Bath Kades):** Found across Kandy, Galle, Matara, and Negombo—these small family eateries serve authentic lunch rice and curry buffets and evening kottu.
• **Southern Beach Shacks (Mirissa & Weligama):** Freshly caught seafood displays (red snapper, tuna, calamari, jumbo prawns) grilled right before you on the sand.

**3. Basic Food Safety Tips:**
• **Look for High Turnover:** Choose busy stalls where locals and families line up; high food turnover guarantees ingredients are cooked fresh and piping hot.
• **Watch the Cooking:** Pick stalls where food is prepared in front of you on sizzling hot griddles or freshly pulled from bubbling oil.
• **Water & Refreshments:** Drink only sealed bottled or filtered water. For natural, hygienic hydration, enjoy fresh roadside **King Coconut (*Thambili*)** sliced open directly in front of you.
• **Hand Hygiene:** Carry travel hand sanitizer or wet wipes, as traditional street food is eaten with your clean right hand.`,
  },
  {
    label: 'Yala Safari Guide',
    prompt: 'What are the best tips for seeing leopards on a safari in Yala National Park?',
    answer: `**Yala National Park Wildlife Safari Guide** 🐆

**1. Safari Planning & Booking:**
• **Game Drive Sessions:** Safaris run in two main shifts: **Morning Safari (6:00 AM – 10:00 AM)** and **Afternoon Safari (2:30 PM – 6:30 PM)**. Full-day safaris (6:00 AM – 6:00 PM) are also available.
• **Park Zones:** Block 1 contains the highest recorded leopard density on earth and is the most popular; Block 5 and neighboring Lunugamvehera offer quieter wilderness experiences with fewer vehicles.
• **Tickets:** Entry permits are issued by the Department of Wildlife Conservation (DWC) at the Palatupana entrance gate or arranged in advance by your lodge/tour operator.

**2. Best Times to Visit:**
• **Dry Season (February to July):** Wildlife viewing peaks during the dry season as vegetation thins out and animals gather around remaining waterholes and lagoons.
• **Time of Day:** Early mornings (6:00–8:30 AM) offer the best cool-weather bird activity and active elephants; late afternoons (3:30–6:00 PM) are ideal for spotting leopards basking on sun-warmed granite boulders (*gneiss rocks*).
• **Note:** Block 1 typically closes for 3–4 weeks between September and October for wildlife conservation and dry-season habitat rest.

**3. Safari Vehicle Guidance:**
• **Book a Certified 4x4 Jeep:** Always hire a dedicated, raised open-top 4x4 safari jeep with high-ground clearance, sturdy shock absorbers, and a canvas sun roof.
• **Driver & Tracker:** An experienced local driver-tracker who knows animal calls, footprints, and radio alerts makes all the difference between a frustrating search and an unforgettable sighting.
• **Avoid Overcrowding:** Reserve a private jeep for your party (up to 4–6 passengers) rather than a shared 12-person bench truck to ensure 360-degree viewing and photography angles.

**4. Wildlife Safety Guidelines:**
• **Never Exit the Vehicle:** You must remain completely inside the safari vehicle at all times, except at designated ocean rest stops (such as Patanangala beach).
• **Quiet Observation:** Speak only in low whispers near wildlife. Turn off phone ringtones, camera beep sounds, and flash photography.
• **Do Not Feed Wildlife:** Feeding wild animals is strictly illegal and disrupts their natural hunting habits.
• **Keep Limbs Inside:** Do not lean excessively outside the vehicle or hang over railings.

**5. Animals Commonly Seen:**
• **Sri Lankan Leopard (*Panthera pardus kotiya*):** The apex predator of the island; solitary and most often spotted resting on rock crests or tree boughs.
• **Asian Elephant:** Herds with calves feeding near tanks, solitary bull tuskers, and swimming elephants.
• **Sloth Bear:** Most active during palu fruit season (May–June).
• **Other Fauna:** Spotted deer (*chital*), sambar deer, mugger crocodiles, wild water buffalo, golden jackals, toque macaques, and over 215 bird species including painted storks, sea eagles, and peacocks.

**6. Respect Park Rules & Conservation:**
• Obey park speed limits (25 km/h) to protect crossing wildlife.
• Strictly **zero littering**—pack out all plastic bottles and wrappers.
• Never urge your driver to chase an animal or block another jeep's viewing corridor; ethical safari practices protect Yala's precious ecosystem.`,
  },
  {
    label: 'Weather & Seasons',
    prompt: 'Explain the dual monsoons in Sri Lanka and which coast is sunny in October?',
    answer: `**Sri Lanka Weather, Seasons & Monsoon Guide** ⛅

**1. Sri Lanka's Main Monsoon Seasons:**
Because Sri Lanka is situated near the equator in the Indian Ocean, it does not have spring, summer, autumn, and winter. Instead, its climate is governed by two major monsoons and two inter-monsoonal periods:
• **Yala (Southwest Monsoon): May to September**
  Brings rainfall to the southwestern coastal belt (Colombo, Galle, Bentota, Mirissa) and the central hill country (Nuwara Eliya, Ella).
• **Maha (Northeast Monsoon): October/November to February**
  Brings rain to the northern and eastern plains (Jaffna, Trincomalee, Pasikudah, Batticaloa) and the Cultural Triangle.
• **Inter-Monsoonal Periods (March–April & October–November):**
  Characterized by warm sunshine in the mornings with occasional localized afternoon thunderstorms.

**2. Regional Weather Differences Across the Island:**
• **South & West Coasts (Colombo, Galle, Bentota, Weligama, Mirissa):**
  - *Best Season:* **December through April** (Golden sunshine, dry warm days around 28°C–31°C, and calm turquoise seas ideal for swimming and whale watching).
• **East Coast (Trincomalee, Arugam Bay, Pasikudah):**
  - *Best Season:* **May through September** (While the southwest receives rain, the East Coast enjoys bright blue skies, calm seas for diving in Pigeon Island, and world-class surf in Arugam Bay).
• **Central Hill Country (Kandy, Nuwara Eliya, Ella):**
  - *Climate:* Nuwara Eliya sits at 1,868m elevation with crisp, cool alpine weather (12°C–20°C by day, dropping to 10°C at night). Ella and Kandy enjoy pleasant spring-like warmth (20°C–26°C).
• **Cultural Triangle & North (Sigiriya, Anuradhapura, Jaffna):**
  - *Climate:* Dry-zone semi-arid climate with warm sunny temperatures (29°C–34°C) throughout most of the year.

**3. Best Travel Considerations & Planning Tips:**
• **Sri Lanka is a Year-Round Destination:** There is *never* a bad month to visit the island; you simply shift between the South/West and the North/East coasts depending on the time of year.
• **Pack for Variable Microclimates:** If your trip includes both tropical southern beaches and highland tea country, pack light, breathable cottons, sun protection (SPF 50, sunglasses), an umbrella/light rain jacket, and a fleece sweater for the chilly highland evenings.
• *Note on Live Weather:* Sri Lanka's tropical microclimates mean short afternoon rain showers often clear into radiant golden sunsets. Always consult official local forecasts for current day-to-day weather.`,
  },
  {
    label: '7-Day Itinerary',
    prompt: 'Suggest a balanced 7-day Sri Lanka itinerary for a first-time visitor.',
    answer: `**Classic 7-Day Sri Lanka Itinerary (Highlights Circuit)** 🗺️

Here is the quintessential 7-day route connecting Sri Lanka's ancient heritage, highland tea country, scenic railway, wildlife, and coastal fortress:

• **Day 1: Colombo (Arrival & Coastal Culture)**
  - *Morning:* Arrive at Colombo Bandaranaike International Airport (BIA). Meet your driver and check in to your oceanfront hotel.
  - *Afternoon:* Explore historic Colombo Fort colonial architecture, Old Dutch Hospital, and Gangaramaya Buddhist Temple on Beira Lake.
  - *Evening:* Stroll Galle Face Green promenade at sunset tasting freshly cooked prawn *isso wade* and dinner in the city.

• **Day 2: Sigiriya & Dambulla (Cave Temples & Ancient Sky Palace)**
  - *Morning:* Drive north into the Cultural Triangle (~3.5 hrs). Ascend stone steps into the five sacred painted cave sanctuaries of Dambulla Rock Cave Temple housing 150+ Buddha statues.
  - *Afternoon:* Village lunch of red rice and curries served on fresh banana leaves.
  - *Evening:* Late afternoon climb of the iconic 200m Sigiriya Lion Rock Fortress to explore King Kashyapa’s 5th-century palace ruins and frescoes at golden hour.

• **Day 3: Kandy (The Sacred Royal Capital)**
  - *Morning:* Scenic drive south through Matale spice gardens to Kandy, the last royal capital of ancient Sri Lanka.
  - *Afternoon:* Stroll around scenic Kandy Lake and wander through Peradeniya Royal Botanical Gardens with giant Javan fig trees and orchid pavilions.
  - *Evening:* Witness the sacred evening drumming rituals (*Tevava*) at Sri Dalada Maligawa (Temple of the Sacred Tooth Relic).

• **Day 4: Nuwara Eliya (Emerald Tea Country & Highlands)**
  - *Morning:* Ascend into the misty highlands past roaring Ramboda Falls and terraced tea hills (~2.5 hrs).
  - *Afternoon:* Guided Pedro Tea Estate tour to observe Ceylon tea withering and rolling, followed by tea tasting. Stroll past Gregory Lake and the Victorian 1894 Post Office.
  - *Evening:* Traditional High Tea on the manicured lawns of The Grand Hotel as cool mountain mist descends.

• **Day 5: Ella (The World-Famous Blue Train & Mountain Pass)**
  - *Morning:* Board the legendary Blue Train from Nanu Oya station to Ella (~2.5 hrs), winding past deep cloud valleys and waterfalls.
  - *Afternoon:* Walk down through eucalyptus and pine groves to Demodara Nine Arches Bridge to watch the mountain train rattle across the colonial stone viaduct.
  - *Evening:* Sunset hike on Little Adam's Peak, followed by dinner and passionfruit juices at Cafe Chill in vibrant Ella town.

• **Day 6: Yala National Park (Big Game Wildlife Safari)**
  - *Morning:* Descend the mountain pass past cascading Ravana Falls towards the southern dry-zone scrub forests (~2.5 hrs).
  - *Afternoon:* Check into your safari lodge and board an open-top 4x4 safari jeep with a certified tracker at 2:30 PM.
  - *Evening:* Thrilling game drive through Yala Block 1 tracking wild Sri Lankan leopards, Asian elephants, sloth bears, and crocodiles. Campfire dinner under the stars.

• **Day 7: Galle & Southern Coast (UNESCO Fort to Colombo/Departure)**
  - *Morning:* Scenic drive along the palm-fringed southern coast past Weligama Bay and traditional stilt fishermen.
  - *Afternoon:* Explore 400-year-old living UNESCO Galle Dutch Fort—walk coral-stone bastions, visit Galle Lighthouse, and browse Pedlar Street artisan boutiques.
  - *Evening:* Farewell sunset dinner from the ramparts before taking the modern Southern Expressway (E01) directly to BIA Airport (~2 hrs) for your flight home.`,
  },
];

export function getQuickAskAnswer(labelOrPrompt: string): string {
  const normalized = labelOrPrompt.toLowerCase().trim();
  const matched = QUICK_ASK_ITEMS.find(
    (item) =>
      item.label.toLowerCase() === normalized ||
      item.prompt.toLowerCase() === normalized ||
      normalized.includes(item.label.toLowerCase())
  );
  if (matched) return matched.answer;

  // Keyword-based fallback matching for free-form queries
  if (normalized.includes('train') || normalized.includes('ticket') || normalized.includes('nanu oya') || normalized.includes('railway') || normalized.includes('station')) {
    return QUICK_ASK_ITEMS[0].answer;
  }
  if (normalized.includes('temple') || normalized.includes('dress') || normalized.includes('wear') || normalized.includes('monk') || normalized.includes('shoes') || normalized.includes('buddha') || normalized.includes('tooth')) {
    return QUICK_ASK_ITEMS[1].answer;
  }
  if (normalized.includes('food') || normalized.includes('kottu') || normalized.includes('hopper') || normalized.includes('curry') || normalized.includes('eat') || normalized.includes('dish') || normalized.includes('street') || normalized.includes('seafood')) {
    return QUICK_ASK_ITEMS[2].answer;
  }
  if (normalized.includes('yala') || normalized.includes('safari') || normalized.includes('leopard') || normalized.includes('elephant') || normalized.includes('national park') || normalized.includes('udawalawe') || normalized.includes('minneriya')) {
    return QUICK_ASK_ITEMS[3].answer;
  }
  if (normalized.includes('weather') || normalized.includes('monsoon') || normalized.includes('rain') || normalized.includes('season') || normalized.includes('climate') || normalized.includes('when to visit')) {
    return QUICK_ASK_ITEMS[4].answer;
  }
  if (normalized.includes('itinerary') || normalized.includes('7 day') || normalized.includes('7-day') || normalized.includes('plan') || normalized.includes('route') || normalized.includes('days') || normalized.includes('trip')) {
    return QUICK_ASK_ITEMS[5].answer;
  }

  // Transport & Taxis
  if (normalized.includes('taxi') || normalized.includes('tuk') || normalized.includes('pickme') || normalized.includes('uber') || normalized.includes('bus') || normalized.includes('driver')) {
    return `**Sri Lanka Transport & Taxi Guide:**

• **Ride-Hailing Apps:** Download **PickMe** (Sri Lanka's premier local app) and **Uber** before or upon arriving. They operate reliably for cars and metered tuk-tuks in Colombo, Kandy, Negombo, and Galle.
• **Tuk-Tuk Tips:** In Colombo, always insist on the "meter" (flag fall ~Rs. 100). Outside major cities, negotiate and agree on the fare firmly before stepping in.
• **Highway Express Buses:** Luxury AC express buses run along the Southern Expressway connecting Colombo (Makumbura/Pettah) to Galle and Matara in ~1.5 hours for approximately Rs. 600–900 (~$2–3 USD).
• **Private Chauffeurs:** For multi-day island touring, hiring a registered tourist driver with an AC vehicle costs approximately $50–$75 USD per day, including fuel and driver accommodation.`;
  }

  // Currency & Money
  if (normalized.includes('money') || normalized.includes('currency') || normalized.includes('atm') || normalized.includes('cash') || normalized.includes('rupee') || normalized.includes('lkr') || normalized.includes('card')) {
    return `**Sri Lanka Currency & Payment Advice:**

• **Local Currency:** The official currency is the **Sri Lankan Rupee (LKR)**. US Dollars, Euros, and Pounds can be exchanged at airport counters (BIA) or commercial banks at competitive rates.
• **ATMs:** Widely available across all towns (Commercial Bank, Sampath Bank, and Hatton National Bank accept Visa & Mastercard). Notify your bank before traveling.
• **Cash vs. Cards:** Visa and Mastercard are accepted in hotels, supermarkets, and upscale restaurants. Always keep small cash notes (Rs. 100, 500, 1,000) for tuk-tuks, roadside coconut stalls, tea shops, and tips.
• **Tipping Culture:** Tipping is customary and warmly appreciated. 10% is standard in restaurants if a service charge isn't already included; Rs. 200–500 for hotel bellboys, and Rs. 1,500–2,500 per day for safari guides and personal drivers.`;
  }

  // SIM Cards & Internet
  if (normalized.includes('sim') || normalized.includes('internet') || normalized.includes('data') || normalized.includes('phone') || normalized.includes('dialog') || normalized.includes('mobitel') || normalized.includes('wifi')) {
    return `**Tourist SIM Cards & Mobile Internet:**

• **Airport Kiosks:** In the arrivals hall of Bandaranaike International Airport (BIA), you will find dedicated 24/7 service counters for **Dialog** and **Mobitel**.
• **Tourist Packages:** Packages cost approximately $8–$15 USD (Rs. 2,500–5,000) and provide 20GB–50GB of 4G/5G data, local calling minutes, and international minutes.
• **Registration:** Simply bring your passport. Setup takes under 5 minutes, and the representative will activate the SIM and test your mobile connection on the spot.
• **eSIM:** Available on Dialog and Mobitel websites if your phone supports digital eSIM profiles.`;
  }

  // Safety & Emergency
  if (normalized.includes('safe') || normalized.includes('scam') || normalized.includes('emergency') || normalized.includes('solo') || normalized.includes('hospital') || normalized.includes('police')) {
    return `**Safety, Health & Emergency Contacts:**

• **General Safety:** Sri Lanka is widely celebrated for its warmth, kindness, and hospitality. Violent crime against tourists is exceptionally rare. Solo travelers and families travel comfortably across the island.
• **Emergency Numbers:**
  - **1990:** Free Suwa Seriya National Ambulance service (fast, GPS-tracked, modern ambulances).
  - **1912:** Tourist Police helpline (dedicated assistance for foreign visitors).
  - **119:** Police Emergency.
• **Scam Prevention:** Beware of unsolicited "gem shop" or "spice garden" tours suggested by pushy street touts. Always verify prices beforehand, and use official ticketing counters at archaeological sites like Sigiriya and Polonnaruwa.
• **Drinking Water:** Drink bottled or filtered water, easily purchasable everywhere with the SLS (Sri Lanka Standards) seal.`;
  }

  // Beaches & Surfing
  if (normalized.includes('beach') || normalized.includes('surf') || normalized.includes('mirissa') || normalized.includes('arugam') || normalized.includes('weligama') || normalized.includes('unawatuna') || normalized.includes('ocean')) {
    return `**Sri Lanka Beaches & Surfing Guide:**

• **South Coast (November – April):**
  - **Mirissa:** Crescent bay famous for whale watching excursions, beachfront seafood dinners, and scenic Coconut Tree Hill.
  - **Weligama:** The premier bay in the Indian Ocean for beginner to intermediate surf lessons with gentle sandy breaks.
  - **Unawatuna:** Protected calm bay great for swimming, diving near coral reefs, and visiting Japanese Peace Pagoda.
• **East Coast (May – September):**
  - **Arugam Bay:** World-renowned right-hand point break attracting international surfers, relaxed cafes, and vibrant nightlife.
  - **Nilaveli & Uppuveli (Trincomalee):** Crystal-clear turquoise waters and snorkelling around Pigeon Island National Park.`;
  }

  return `**Ayubowan! 🙏 Welcome to LankaMate AI Travel Guide.**

Here is essential Sri Lanka travel advice:
• **Scenic Blue Train:** Book reserved 2nd class seats 30 days ahead at *seatreservation.railway.gov.lk* for open-window mountain photos between Kandy and Ella.
• **Temple Etiquette:** Always cover shoulders and knees, remove footwear and hats before entering, and never pose with your back to a Buddha statue.
• **Local Street Food:** Savor hot chicken/cheese kottu, egg hoppers with seeni sambol, and crispy isso wade along Galle Face Green.
• **Wildlife Safaris:** Head to Yala National Park for leopard tracking and Asian elephants on an open-top 4x4 morning or afternoon game drive.
• **Seasons:** The Southwest enjoys sunshine from December to April, while the East coast is sunny from May to September.
• **Emergency Assistance:** Dial 1990 for free Suwa Seriya national ambulance, 1912 for Tourist Police.

Please ask any specific question about places, food, transport, or travel tips!`;
}
