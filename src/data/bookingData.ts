export interface BookingHotel {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  shortDescription: string;
  priceIndicator: string; // e.g. "$$$$ Luxury Resort (~$260–$480/nt)"
  priceRange: string;
  rating: number;
  reviewsCount: number;
  category: 'Luxury Resort' | 'Heritage' | 'Boutique' | 'Eco Lodge';
  amenities: string[];
  partnerName: string;
  partnerUrl?: string;
  status: 'partner_ready' | 'coming_soon';
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BookingHomestay {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  shortDescription: string;
  priceIndicator: string; // e.g. "$ Budget Friendly (~$22–$45/nt)"
  rating: number;
  hostName: string;
  amenities: string[];
  partnerName: string;
  partnerUrl?: string;
  status: 'partner_ready' | 'coming_soon';
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BookingTour {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  shortDescription: string;
  duration: string;
  groupSize: string;
  priceIndicator: string; // e.g. "$$ Moderate (~$40–$75 per person)"
  highlights: string[];
  includes: string[];
  whatToBring: string[];
  partnerName: string;
  partnerUrl?: string;
  status: 'partner_ready' | 'coming_soon';
  meetingPoint: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BookingTransportOption {
  id: string;
  type: 'airport' | 'chauffeur' | 'rental';
  title: string;
  subtitle: string;
  image: string;
  shortDescription: string;
  vehicleOptions: string[];
  pricingGuide: string;
  features: string[];
  partnerName: string;
  partnerUrl?: string;
  status: 'partner_ready' | 'coming_soon';
}

// 🏨 Category 1: Hotels & Resorts
export const bookingHotels: BookingHotel[] = [
  {
    id: 'b-hotel-kandalama',
    name: 'Heritance Kandalama',
    location: 'Dambulla / Sigiriya Foothills',
    region: 'Cultural Triangle',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Legendary Geoffrey Bawa masterpiece carved directly into the cliffside, overlooking Kandalama Lake and the 5th-century Sigiriya Rock Fortress with infinity rock pools.',
    priceIndicator: '$$$$ Luxury Heritage Resort (~$240 – $420 / night)',
    priceRange: '$240 – $420 / night',
    rating: 4.9,
    reviewsCount: 1240,
    category: 'Heritage',
    amenities: ['Geoffrey Bawa Architecture', '3 Infinity Pools', 'Ayurvedic Spa', 'Lake View Balcony', 'Fine Dining'],
    partnerName: 'Official Heritance / Agoda Partner',
    partnerUrl: 'https://www.heritancehotels.com/kandalama/',
    status: 'partner_ready',
    phone: '+94 66 555 5000',
    coordinates: { lat: 7.8767, lng: 80.7078 },
  },
  {
    id: 'b-hotel-tea-trails',
    name: 'Ceylon Tea Trails',
    location: 'Hatton / Castlereagh Lake',
    region: 'Hill Country',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Relais & Châteaux luxury tea planter bungalows perched 1,250 meters above sea level with private butler service, colonial fireplaces, and scenic Castlereagh lake trails.',
    priceIndicator: '$$$$$ Ultra Luxury Estate (~$650 – $1,100 / night)',
    priceRange: '$650 – $1,100 / night',
    rating: 5.0,
    reviewsCount: 480,
    category: 'Luxury Resort',
    amenities: ['Private Butler Service', 'All-Inclusive High Tea', 'Infinity Heated Pool', 'Scenic Lake Kayaking', 'Tennis Courts'],
    partnerName: 'Relais & Châteaux Official Partner',
    partnerUrl: 'https://www.resplendentceylon.com/teatrails/',
    status: 'partner_ready',
    phone: '+94 51 777 0000',
    coordinates: { lat: 6.8833, lng: 80.5667 },
  },
  {
    id: 'b-hotel-jetwing-lighthouse',
    name: 'Jetwing Lighthouse',
    location: 'Dadalla, Galle',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Oceanfront colonial-inspired elegance designed by Geoffrey Bawa. Features dramatic Portuguese-Sinhalese battle sculptures, roaring Indian Ocean waves, and proximity to Galle Fort.',
    priceIndicator: '$$$$ Oceanfront Luxury (~$190 – $360 / night)',
    priceRange: '$190 – $360 / night',
    rating: 4.8,
    reviewsCount: 960,
    category: 'Luxury Resort',
    amenities: ['Oceanfront Pools', 'Bawa Architecture', 'Ayurveda Pavilion', 'Cocktail Verandah', 'Tennis & Squash'],
    partnerName: 'Jetwing Hotels Official Partner',
    partnerUrl: 'https://www.jetwinghotels.com/jetwinglighthouse/',
    status: 'partner_ready',
    phone: '+94 91 222 3744',
    coordinates: { lat: 6.0469, lng: 80.1989 },
  },
  {
    id: 'b-hotel-98-acres',
    name: '98 Acres Resort & Spa',
    location: 'Little Adam’s Peak Pass, Ella',
    region: 'Hill Country',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Stunning eco-luxury chalets built with repurposed railroad timber and thatch, nestled amid a 98-acre working tea estate facing the Ella Rock gap.',
    priceIndicator: '$$$$ Scenic Eco-Luxury (~$210 – $390 / night)',
    priceRange: '$210 – $390 / night',
    rating: 4.9,
    reviewsCount: 1420,
    category: 'Eco Lodge',
    amenities: ['Panoramic Ella Gap Balconies', 'Stone Swimming Pool', 'Ravana Zip Line Access', 'Tea Factory Tours', 'Helipad'],
    partnerName: '98 Acres Official Booking',
    partnerUrl: 'https://www.resort98acres.com/',
    status: 'partner_ready',
    phone: '+94 57 205 0050',
    coordinates: { lat: 6.8656, lng: 81.0558 },
  },
  {
    id: 'b-hotel-cinnamon-wild',
    name: 'Cinnamon Wild Yala',
    location: 'Palatupana, Yala Sanctuary',
    region: 'Wildlife & Safari',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Wilderness lodge nestled directly between coastal sand dunes and Yala National Park, where wild boar, spotted deer, and gray langurs roam freely across the property.',
    priceIndicator: '$$$$ Wildlife Eco-Lodge (~$230 – $410 / night)',
    priceRange: '$230 – $410 / night',
    rating: 4.8,
    reviewsCount: 890,
    category: 'Eco Lodge',
    amenities: ['Safari Jeep Booking Hub', 'Observation Deck Pool', 'Resident Naturalist Guide', 'Outdoor Bush Dining', 'Free Wi-Fi'],
    partnerName: 'Cinnamon Hotels Official Portal',
    partnerUrl: 'https://www.cinnamonhotels.com/cinnamonwildyala',
    status: 'partner_ready',
    phone: '+94 47 223 9444',
    coordinates: { lat: 6.2694, lng: 81.4422 },
  },
  {
    id: 'b-hotel-cape-weligama',
    name: 'Cape Weligama',
    location: 'Abimanagama Road, Weligama',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Perched on a dramatic 40-meter palm-fringed cliff with a signature 60-meter crescent infinity pool hanging over the Indian Ocean. Prestigious Relais & Châteaux property.',
    priceIndicator: '$$$$$ Cliffside Luxury Resort (~$490 – $850 / night)',
    priceRange: '$490 – $850 / night',
    rating: 4.9,
    reviewsCount: 620,
    category: 'Luxury Resort',
    amenities: ['Crescent Cliffside Infinity Pool', 'Private Villa Pools', 'Ocean Breeze Dining', 'Surfing Concierge', 'Spa Sanctuary'],
    partnerName: 'Cape Weligama Partner Portal',
    partnerUrl: 'https://www.resplendentceylon.com/capeweligama/',
    status: 'partner_ready',
    phone: '+94 41 225 3000',
    coordinates: { lat: 5.9733, lng: 80.4136 },
  },
];

// 🏠 Category 2: Guest Houses & Homestays
export const bookingHomestays: BookingHomestay[] = [
  {
    id: 'b-home-ella-mount-view',
    name: 'Ella Mount View Guest House',
    location: 'Waterfall Road, Ella',
    region: 'Hill Country',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Charming family-run guest house situated on the hillside of Ella with private mountain-view balconies, homemade string hoppers, and friendly local travel advice.',
    priceIndicator: '$ Budget Friendly (~$28 – $48 / night)',
    rating: 4.8,
    hostName: 'Bandara & Family',
    amenities: ['Free Homemade Breakfast', 'Private Mountain Balcony', 'High-Speed Wi-Fi', 'Hot Showers', 'Hiking Advice'],
    partnerName: 'Direct Host Booking / Booking.com',
    status: 'partner_ready',
    phone: '+94 57 222 8111',
    coordinates: { lat: 6.868, lng: 81.048 },
  },
  {
    id: 'b-home-kandy-lake-homestay',
    name: 'Kandy Lake View Homestay',
    location: 'Rajapihilla Mawatha, Kandy',
    region: 'Cultural Triangle',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Authentic Sri Lankan home atop upper lake drive offering quiet bedrooms, birdsong in lush garden greenery, and walking proximity to the Sacred Temple of the Tooth.',
    priceIndicator: '$ Budget Homestay (~$25 – $42 / night)',
    rating: 4.7,
    hostName: 'Malini & Rohan',
    amenities: ['Lake View Terrace', 'Traditional Sri Lankan Curries', 'Tea & Coffee Bar', 'Airport Pickup Assistance'],
    partnerName: 'Direct Family Booking',
    status: 'partner_ready',
    phone: '+94 81 223 4455',
    coordinates: { lat: 7.2906, lng: 80.641 },
  },
  {
    id: 'b-home-sigiriya-village-rest',
    name: 'Sigiriya Village Rest & Cottages',
    location: 'Inamaluwa Road, Sigiriya',
    region: 'Cultural Triangle',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Eco-friendly mud-brick cottages set inside a peaceful mango orchard, offering bicycles for riding to Lion Rock and Pidurangala at dawn.',
    priceIndicator: '$ Budget Nature Stay (~$22 – $38 / night)',
    rating: 4.9,
    hostName: 'Sunil Weerasinghe',
    amenities: ['Free Village Bicycles', 'Direct View of Lion Rock', 'Organic Garden Meals', 'Campfire Evenings'],
    partnerName: 'Partner Booking (Direct & Airbnb)',
    status: 'partner_ready',
    phone: '+94 66 228 9200',
    coordinates: { lat: 7.954, lng: 80.758 },
  },
  {
    id: 'b-home-mirissa-eco-bay',
    name: 'Mirissa Eco-Bay Homestay',
    location: 'Beach Road, Mirissa',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Cozy coastal home just 3 minutes stroll from the warm waves of Mirissa Beach. Enjoy fresh king coconuts on arrival and surf board storage.',
    priceIndicator: '$ Coastal Homestay (~$30 – $55 / night)',
    rating: 4.8,
    hostName: 'Kasun & Anoma',
    amenities: ['3 Min Walk to Beach', 'Surf Board Wash & Rack', 'Fresh Seafood Dinners', 'Whale Tour Booking'],
    partnerName: 'Direct Partner Booking',
    status: 'partner_ready',
    phone: '+94 41 225 9901',
    coordinates: { lat: 5.947, lng: 80.455 },
  },
  {
    id: 'b-home-galle-fort-colonial',
    name: 'Galle Fort Heritage Homestay',
    location: 'Lighthouse Street, Galle Fort',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Restored Dutch-colonial town house inside the UNESCO World Heritage fort ramparts. High timber ceilings, antique brass lamps, and cobbled street ambiance.',
    priceIndicator: '$$ Boutique Heritage Stay (~$55 – $95 / night)',
    rating: 4.9,
    hostName: 'Fariha & Imran',
    amenities: ['Inside UNESCO Ramparts', 'Air-Conditioned Rooms', 'Colonial Verandah', 'Ceylon Cinnamon Tea'],
    partnerName: 'Galle Fort Heritage Partner',
    status: 'partner_ready',
    phone: '+94 91 224 8870',
    coordinates: { lat: 6.028, lng: 80.217 },
  },
  {
    id: 'b-home-nuwara-eliya-tea-breeze',
    name: 'Tea Breeze Highlands Guesthouse',
    location: 'Upper Lake Road, Nuwara Eliya',
    region: 'Hill Country',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Misty highland cottage featuring a cozy living room fireplace, hot water blankets, and fresh strawberry breakfast overlooking Gregory Lake.',
    priceIndicator: '$ Mountain Guesthouse (~$32 – $58 / night)',
    rating: 4.7,
    hostName: 'Suresh Kumar',
    amenities: ['Cozy Real Fireplace', 'Hot Showers & Heaters', 'Lake Gregory Views', 'Horton Plains Jeep Booking'],
    partnerName: 'Partner Booking',
    status: 'partner_ready',
    phone: '+94 52 222 6633',
    coordinates: { lat: 6.953, lng: 80.785 },
  },
];

// 🧭 Category 3: Tours & Activities
export const bookingTours: BookingTour[] = [
  {
    id: 'b-tour-yala-safari',
    name: 'Yala National Park 4x4 Leopard & Elephant Safari',
    location: 'Yala National Park (Block 1 & 5)',
    region: 'Wildlife & Safari',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Private dawn or dusk open-air 4WD safari with expert wildlife trackers to seek out the world’s highest density of Sri Lankan leopards, sloth bears, and wild tuskers.',
    duration: '4 – 5 Hours (Half Day) or 10 Hours (Full Day)',
    groupSize: '1 – 6 passengers per private safari jeep',
    priceIndicator: '$$ Safari Jeep Package (~$55 – $120 per vehicle + park ticket)',
    highlights: [
      'Sri Lankan Leopard tracking in coastal scrub forests',
      'Wild Asian elephant herds bathing in natural waterholes',
      'Sloth bear, spotted deer, marsh crocodiles, and hornbills',
      'Complimentary hotel pickup from Tissamaharama & Yala hotels',
    ],
    includes: ['Custom 4x4 Safari Jeep', 'Licensed Wildlife Tracker & Driver', 'Chilled Bottled Water & Binoculars', 'Hotel Transfers in Yala/Tissa'],
    whatToBring: ['Earth-toned clothing (khaki/green)', 'Sun protection & hat', 'Camera with zoom lens', 'Passport for park gate registration'],
    partnerName: 'Wild Sri Lanka Safaris Partner',
    partnerUrl: 'https://www.dwc.gov.lk/',
    status: 'partner_ready',
    meetingPoint: 'Palatupana Park Gate or Hotel Pickup in Tissamaharama',
    coordinates: { lat: 6.273, lng: 81.439 },
  },
  {
    id: 'b-tour-sigiriya-sunrise',
    name: 'Sigiriya Rock Fortress & Dambulla Cave Sunrise Tour',
    location: 'Sigiriya & Dambulla',
    region: 'Cultural Triangle',
    image: '/images/destinations/sigiriya.jpg',
    shortDescription:
      'Beat the mid-day heat with a professional archaeological guide. Ascend the 5th-century Lion Rock fortress, admire the celestial frescoes, and visit the golden Dambulla Cave Temple.',
    duration: '6 Hours (Morning 6:30 AM – 12:30 PM)',
    groupSize: 'Private or Small Group (max 8)',
    priceIndicator: '$$ Guided Heritage Excursion (~$35 – $65 per person)',
    highlights: [
      'Ascent of the 200m monolithic rock fortress of King Kashyapa',
      'Ancient mirror wall graffiti and 1,500-year-old maiden frescoes',
      'Exploration of 5 UNESCO painted cave shrines in Dambulla with 150+ Buddha statues',
    ],
    includes: ['Certified English/Sinhala Archaeological Guide', 'Air-Conditioned Vehicle Transit', 'Cold King Coconut Refresher'],
    whatToBring: ['Comfortable walking shoes', 'Modest attire covering knees & shoulders for Dambulla temple', 'Hat & drinking water'],
    partnerName: 'Cultural Triangle Heritage Guides',
    status: 'partner_ready',
    meetingPoint: 'Sigiriya Main Gate Archaeological Entrance',
    coordinates: { lat: 7.957, lng: 80.76 },
  },
  {
    id: 'b-tour-mirissa-whales',
    name: 'Mirissa Blue Whale & Dolphin Watching Eco-Cruise',
    location: 'Mirissa Fisheries Harbour',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Sail out to the deep Indian Ocean continental shelf on a licensed catamaran to observe majestic Blue Whales, Bryde’s Whales, and acrobatic spinner dolphins.',
    duration: '3 – 4.5 Hours (Starts 6:30 AM)',
    groupSize: 'Shared Catamaran or Private Charter',
    priceIndicator: '$$ Marine Safari (~$45 – $70 per person)',
    highlights: [
      'Encounters with the largest animal on planet Earth in their natural migratory route',
      'Pods of hundreds of playful spinner dolphins surfing bow waves',
      'Onboard marine naturalist commentary following ethical whale watching guidelines',
    ],
    includes: ['Coast Guard Approved Vessel', 'Life Jackets & First Aid', 'Light Breakfast, Fresh Fruits & Water', 'Motion sickness tablets available'],
    whatToBring: ['Sunscreen & polarized sunglasses', 'Light jacket / windbreaker', 'Seasickness precautions if sensitive to swell'],
    partnerName: 'Mirissa Eco Marine Cruises',
    status: 'partner_ready',
    meetingPoint: 'Mirissa Fisheries Harbour Pier 2',
    coordinates: { lat: 5.946, lng: 80.457 },
  },
  {
    id: 'b-tour-kandy-ella-train',
    name: 'Kandy to Ella Scenic Train Experience & Nine Arch Hike',
    location: 'Kandy / Nanu Oya / Ella',
    region: 'Hill Country',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Experience the world-famous blue train journey past cascading waterfalls and misty tea estates, combined with a guided hike to the monumental Nine Arch Demodara Bridge.',
    duration: 'Full Day (approx. 7–8 hours)',
    groupSize: 'Reserved seating experience',
    priceIndicator: '$$ Curated Transit & Trek (~$40 – $80 per person)',
    highlights: [
      'Reserved 1st / 2nd class carriage tickets on the iconic scenic hill-country rail line',
      'Crossing of the 1921 British stone Nine Arch Bridge surrounded by jungle canopy',
      'Tea plantation walk with a refreshing cup of single-estate Ceylon tea',
    ],
    includes: ['Reserved Sri Lanka Railways train ticket assistance', 'Station pickup and luggage transfer support', 'English-speaking local guide in Ella'],
    whatToBring: ['Camera for open-door window photos', 'Light jacket for cooler higher altitudes', 'Comfortable trail sneakers'],
    partnerName: 'LankaRail Curated Journeys',
    status: 'partner_ready',
    meetingPoint: 'Kandy Railway Station or Nanu Oya Station',
    coordinates: { lat: 7.292, lng: 80.63 },
  },
  {
    id: 'b-tour-madu-ganga-mangrove',
    name: 'Madu Ganga Mangrove River Boat Safari & Cinnamon Isle',
    location: 'Balapitiya / Bentota',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Glide through dense mangrove forest tunnels on a covered outboard motorboat across 64 river islands. Watch traditional cinnamon peeling and visit fish therapy lagoons.',
    duration: '2 – 2.5 Hours',
    groupSize: 'Private boat for 2–8 persons',
    priceIndicator: '$ River Adventure (~$25 – $40 per boat)',
    highlights: [
      'Navigating natural mangrove root tunnels teeming with water monitors and kingfishers',
      'Demonstration of peeling and curing pure Ceylon Cinnamon on Cinnamon Island',
      'Ancient Kothduwa temple situated entirely on a secluded river isle',
    ],
    includes: ['Private motorboat with life jackets', 'Local boat captain & guide', 'Cinnamon Island artisan demo entrance'],
    whatToBring: ['Insect repellent', 'Sun hat & camera', 'Small change for local cinnamon craft souvenirs'],
    partnerName: 'Balapitiya Boatmen’s Guild',
    status: 'partner_ready',
    meetingPoint: 'Balapitiya Riverfront Boat Harbor (Near Galle Road A2)',
    coordinates: { lat: 6.262, lng: 80.041 },
  },
  {
    id: 'b-tour-pigeon-island-snorkel',
    name: 'Pigeon Island Marine National Park Snorkeling Adventure',
    location: 'Nilaveli, Trincomalee',
    region: 'Eastern Coast',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Speedboat transfer across crystal turquoise waters to a protected coral reef island. Snorkel alongside harmless blacktip reef sharks, hawksbill turtles, and vibrant marine life.',
    duration: '3 – 4 Hours (Morning 8:00 AM – 12:00 PM)',
    groupSize: '1 – 6 per boat transfer',
    priceIndicator: '$$ Marine Park Adventure (~$45 – $75 per person)',
    highlights: [
      'Swimming with docile juvenile blacktip reef sharks in shallow clear coral lagoons',
      'Encountering green sea turtles feeding on sea grasses',
      'Vibrant live coral formations with clownfish, parrotfish, and giant clams',
    ],
    includes: ['Licensed return speedboat from Nilaveli Beach', 'Quality mask, snorkel, and fins', 'Marine park entry registration guidance'],
    whatToBring: ['Reef-safe sunscreen', 'Swimwear and rash guard', 'Underwater camera / waterproof pouch'],
    partnerName: 'Nilaveli Dive & Marine Center',
    status: 'partner_ready',
    meetingPoint: 'Nilaveli Beach Boat Departure Point',
    coordinates: { lat: 8.718, lng: 81.205 },
  },
];

// 🚐 Category 4: Transport & Transfers
export const bookingTransports: BookingTransportOption[] = [
  {
    id: 'b-trans-airport',
    type: 'airport',
    title: 'Airport Transfers (BIA Colombo)',
    subtitle: 'Bandaranaike International Airport (CMB) ⇄ Island-Wide',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Pre-arranged fixed-fare meet & greet transfers right at the arrival terminal. English-speaking drivers with name-boards, flight monitoring, and air-conditioned vehicles.',
    vehicleOptions: ['Toyota Prius/Axio Sedan (1–3 Pax)', 'Toyota KDH Luxury High-Roof Van (4–7 Pax)', 'Mini Coach (8–14 Pax)'],
    pricingGuide: 'Transparent fixed rates from $35 (Colombo) to $90 (Kandy/Galle) • Highway toll included',
    features: ['Flight delay tracking', '90 mins free waiting time', 'Air-conditioned modern fleet', 'Bottled water provided', 'Highway expressways used'],
    partnerName: 'Colombo Airport Transit Partners',
    status: 'partner_ready',
  },
  {
    id: 'b-trans-chauffeur',
    type: 'chauffeur',
    title: 'Private Chauffeur & Tourist Driver',
    subtitle: 'Dedicated vehicle & guide for 1 to 14 days',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'The gold standard for effortless Sri Lanka touring. Travel comfortably in a private vehicle with an SLTDA-licensed tourist driver who knows scenic viewpoints, safe local eateries, and hidden gems.',
    vehicleOptions: ['Comfort Sedan (up to 3 Pax)', 'Luxury KDH Van (up to 7 Pax)', '4WD Land Cruiser Prado (Luxury Safari/Hill)'],
    pricingGuide: 'Day hire guide: ~$60 – $85 / day (includes vehicle, fuel, driver accommodation & allowance)',
    features: ['Government-licensed tourist chauffeur', 'Flexible personalized route stops', 'Fuel, parking & highway tolls covered', 'Driver accommodation handled independently'],
    partnerName: 'SLTDA Certified Chauffeur Network',
    status: 'partner_ready',
  },
  {
    id: 'b-trans-rental',
    type: 'rental',
    title: 'Self-Drive Car & Tuk-Tuk Rental',
    subtitle: 'Island exploration with maximum freedom',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    shortDescription:
      'Rent a clean self-drive car or experience the ultimate Sri Lankan road trip behind the handlebar of your own Bajaj 4-stroke Tuk-Tuk, complete with driving lessons and legal permits.',
    vehicleOptions: ['Compact City Car (Suzuki Alto / WagonR)', 'SUV / Crossover (Toyota Raize / Rush)', 'Self-Drive Tuk-Tuk with Roof Rack'],
    pricingGuide: 'Tuk-Tuk: from $14 – $22 / day • Compact Car: from $28 – $45 / day • Comprehensive insurance included',
    features: ['Sri Lankan driving permit endorsement assistance', 'Free driving lesson & route briefing', '24/7 Island-wide roadside assistance', 'Unlimited or generous mileage allowance'],
    partnerName: 'Verified Car & Tuk-Tuk Rental Guild',
    status: 'partner_ready',
  },
];
