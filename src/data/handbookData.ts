export interface HandbookTopic {
  id: string;
  category: 'Weather' | 'Currency' | 'Emergency' | 'Etiquette' | 'Safety' | 'SIM & Connectivity' | 'Visa';
  title: string;
  icon: string;
  badge: string;
  summary: string;
  content: string[];
  keyAdvice: string;
}

export const handbookTopics: HandbookTopic[] = [
  {
    id: 'weather-monsoons',
    category: 'Weather',
    title: 'Sri Lanka Weather & Dual Monsoons Explained',
    icon: 'SunMedium',
    badge: 'Year-Round Destination',
    summary:
      'Sri Lanka has two distinct regional monsoon patterns. Because of this unique geography, favorable weather and calmer coastal waters can usually be found somewhere on the island during most months of the year, though conditions vary by region and season.',
    content: [
      'Southwest Monsoon ("Yala"): May to September. Brings rain to the south and west coasts (Galle, Bentota, Colombo) and the western hill country. During this time, the EAST COAST (Trincomalee, Pasikudah, Arugam Bay) and NORTH (Jaffna) are typically dry, warm, and radiant!',
      'Northeast Monsoon ("Maha"): November to February. Brings rain to the north, east, and ancient cultural cities. During this period, the SOUTH & WEST COASTS (Mirissa, Weligama, Galle, Unawatuna) and CENTRAL HILLS generally enjoy pleasant beach weather with calm surf.',
      'Hill Country Microclimates: Nuwara Eliya and Ella sit at 1,000 to 1,900 meters elevation. Days are pleasantly mild (18°C - 23°C), but night temperatures regularly drop to 10°C - 14°C. Pack warm layers!',
      'Inter-Monsoon Seasons: March to April and October are transition periods with warm sunny mornings and occasional tropical late-afternoon thundershowers.',
    ],
    keyAdvice:
      'Decide your coastal destinations based on the month: head South/West from December to April, and head East/North from May to September. Conditions vary by region and season.',
  },
  {
    id: 'currency-money',
    category: 'Currency',
    title: 'Sri Lankan Rupee (LKR), ATMs & Payment Customs',
    icon: 'Coins',
    badge: 'LKR & Card Tips',
    summary:
      'The currency of Sri Lanka is the Sri Lankan Rupee (LKR, symbol: Rs / රු). Credit and debit cards are widely accepted in cities and hotels, but cash remains essential for tuk-tuks, street stalls, and temple entrance fees.',
    content: [
      'Approximate Reference Rates (for estimation only): Exchange rates fluctuate daily according to foreign currency markets. Illustrative benchmark ranges are ~300 - 320 LKR per 1 USD, ~325 - 345 LKR per 1 EUR, and ~380 - 410 LKR per 1 GBP. Note: These are illustrative reference figures rather than live market quotes. Always check real-time exchange rates at authorized bank counters, airport desks, or official financial apps.',
      'ATMs Nationwide: Commercial Bank of Ceylon, Bank of Ceylon (BOC), Sampath Bank, and Hatton National Bank (HNB) ATMs accept foreign Visa and Mastercard. Withdrawal fees range from 400 - 800 LKR per transaction.',
      'Card Acceptance: Hotels, supermarkets (Keells, Cargills), major restaurants, and shops readily accept credit/debit cards with contactless tap.',
      'Always Carry Small Cash: Keep 100, 500, and 1,000 LKR notes handy. 5,000 LKR notes are tough for small tea stalls and tuk-tuk drivers to break.',
      'Tipping Culture: Tipping is warmly appreciated. Restaurants often include a 10% service charge on bills. For exceptional service, leaving an extra 5-10% is customary. Chauffeur guides: ~3,000 - 5,000 LKR/day. Hotel luggage porters: 200 - 500 LKR per bag.',
    ],
    keyAdvice:
      'Always decline ATM dynamic currency conversion ("Without Conversion" option) so your home bank provides the official interbank rate.',
  },
  {
    id: 'emergency-contacts',
    category: 'Emergency',
    title: 'Emergency Numbers & Tourist Healthcare Assistance',
    icon: 'PhoneCall',
    badge: 'Save to Phone',
    summary:
      'Sri Lanka provides dedicated nationwide emergency response services, including free ambulance response (1990) and 24/7 Tourist Police assistance (1912).',
    content: [
      '🚑 1990 — Suwa Seriya Free Emergency Ambulance: Nationwide medical emergency dispatch with trained paramedics. Toll-free from any local or roaming mobile.',
      '👮 1912 — Sri Lanka Tourist Police Hotline: Dedicated 24/7 multilingual support for tourist assistance, complaints, and safety issues.',
      '🚨 119 — National Police Emergency Response: Immediate national police intervention and crime reporting.',
      '🚒 110 — Fire & Rescue Service: Municipal and regional fire brigades.',
      '🏥 Leading Private Hospitals in Colombo (International Standard): Asiri Central Hospital (+94 11 466 5500), Nawaloka Hospital (+94 11 557 7111), Lanka Hospitals (+94 11 543 0000).',
      '🌴 Regional Hospitals: Teaching Hospital Kandy, Karapitiya Teaching Hospital in Galle, Base Hospital Nuwara Eliya.',
    ],
    keyAdvice:
      'Store 1990 (Ambulance), 1912 (Tourist Police), and 119 (Police) directly in your mobile phone speed dial before arrival.',
  },
  {
    id: 'temple-etiquette',
    category: 'Etiquette',
    title: 'Sacred Temple Etiquette & Cultural Respect',
    icon: 'HeartHandshake',
    badge: 'Cultural Rules',
    summary:
      'Sri Lanka is home to ancient Buddhist, Hindu, Muslim, and Christian heritage. Visiting sacred shrines requires mindful respect for local customs, attire, and spiritual sensitivities.',
    content: [
      'Dress Modestly: Shoulders and knees MUST be fully covered when entering any Buddhist temple or Hindu kovil. Wraparound sarongs or scarves can be used in emergencies.',
      'Wear White or Pale Colors: While not legally mandatory, wearing white clothing is a sign of purity and deep respect. Bright neon and dark black are best avoided inside temple inner courtyards.',
      'Footwear Off: Remove all footwear (shoes, flip-flops, socks) and hats before crossing the sacred boundary. Dedicated shoe-keeping stalls exist outside temples (customary tip: 50-100 LKR). On hot stone pathways, wearing thick white socks is permitted.',
      'NEVER Turn Your Back to a Buddha: Do not pose for photos with your back directly turned to a Buddha statue, as it is considered deeply disrespectful. Selfies with Buddha statues are strictly prohibited.',
      'Respecting Buddhist Monks: Greet monks with palms pressed together at chest level and a slight head bow ("Vandana" or "Ayubowan"). Women should never touch a Buddhist monk or hand items directly to them (place the item on a cloth or table instead).',
      'Hindu Kovil Customs: In Jaffna and northern kovils, male visitors are customary required to remove their shirts to bare their chests as a sign of humility before deities.',
    ],
    keyAdvice:
      'Always dress with shoulders and knees covered, take off your shoes, and never pose with your back to a Buddha statue.',
  },
  {
    id: 'health-safety-tips',
    category: 'Safety',
    title: 'Health, Drinking Water & Street Food Safety',
    icon: 'ShieldCheck',
    badge: 'Stay Healthy',
    summary:
      'Sri Lanka is generally a safe and hospitable travel destination with warm local culture. While serious crime against tourists is relatively uncommon, standard travel precautions should always be maintained, and conditions vary by region and season.',
    content: [
      'Drinking Water: Do NOT drink unfiltered tap water. Drink bottled mineral water with unbroken seal caps, filtered water from hotels, or boiled water. Fresh king coconuts (Thambili) are the ultimate sterile, electrolyte-rich natural hydration drink!',
      'Mosquito Protection: Sri Lanka is certified malaria-free. However, Dengue fever exists in urban areas. Apply mosquito repellent containing DEET (or local citronella oil) in the early mornings and late afternoons.',
      'Street Food Wisdom: Eat at busy stalls where food is freshly cooked and sizzling hot before your eyes (like hopping kottu and freshly made hoppers). Avoid pre-cut fruit that has been sitting open without refrigeration.',
      'Ocean Currents & Beach Safety: Red warning flags on beaches indicate dangerous rip currents — never enter the water when red flags are displayed! Calm bays exist in Mirissa and Unawatuna, but open ocean beaches can have strong surges.',
      'Animal Encounters: Do not feed wild elephants on roadsides (this encourages highway begging and risks dangerous traffic incidents). Keep food and bags zipped tightly around wild macaques at Sigiriya and Dambulla.',
    ],
    keyAdvice:
      'Drink fresh king coconut water for hydration, wear insect repellent at dusk, and heed beach warning flags. Practice standard travel vigilance.',
  },
  {
    id: 'sim-connectivity',
    category: 'SIM & Connectivity',
    title: 'Tourist eSIM, 4G/5G Coverage & Mobile Apps',
    icon: 'Wifi',
    badge: 'Stay Connected',
    summary:
      'Sri Lanka offers extensive 4G and expanding 5G mobile networks across cities, tourist corridors, and coastal areas. Network reception and data speeds vary by region, deep valleys, and remote wildlife reserves.',
    content: [
      'Airport SIM Stalls: Immediately upon exiting customs at Bandaranaike International Airport (BIA), you will see official 24/7 service counters for Dialog Axiata and Mobitel.',
      'Best Carriers: Dialog Axiata has the widest nationwide coverage across populated areas and main highways. Mobitel and Airtel are also reliable alternatives.',
      'Tourist Packages: Cost ~$8 - $15 USD (approx. 2,500 - 4,800 LKR) for 30 days, including high-speed data allowances and international call minutes.',
      'Essential Island Apps: 1) PickMe (Sri Lankan ride-hailing & food delivery), 2) Google Maps (offline map download recommended for mountain passes), 3) Sri Lanka Train Schedule app.',
    ],
    keyAdvice:
      'Buy a Dialog or Mobitel tourist SIM/eSIM at the airport arrival hall counter — it takes just 3 minutes with your passport.',
  },
];
