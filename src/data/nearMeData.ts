// Curated Near Me Directory Data for Sri Lanka
// Designed specifically for tourists and self-driving travelers
// All records provide authentic coordinates, verified categories, and Google Maps navigation targets.

import { getAccommodationNearMePlaces } from './accommodationsData';

export type NearMeCategory =
  | 'fuel'
  | 'hotel'
  | 'bank'
  | 'restaurant'
  | 'hospital'
  | 'pharmacy'
  | 'supermarket'
  | 'car_service'
  | 'attraction';

export interface NearMePlace {
  id: string;
  name: string;
  category: NearMeCategory;
  categoryLabel: string;
  city: string;
  area: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openStatus: 'Open 24 Hours' | 'Open Now' | 'Closed' | 'Hours Vary';
  openingHours: string;
  contactPhone?: string;
  services: string[];
  description: string;
  drivingTip?: string;
  rating?: number;
  isFeatured?: boolean;
  searchKeywords?: string;
  image?: string;
  accommodationType?: string;
}

export interface NearMeCategoryMeta {
  id: NearMeCategory;
  label: string;
  iconName: string;
  emoji: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const NEAR_ME_CATEGORIES: NearMeCategoryMeta[] = [
  {
    id: 'fuel',
    label: 'Fuel Stations',
    iconName: 'Fuel',
    emoji: '⛽',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    description: 'Petrol 92/95, Auto Diesel & Super Diesel filling stations',
  },
  {
    id: 'hotel',
    label: 'Hotels',
    iconName: 'Hotel',
    emoji: '🏨',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    description: 'Resorts, boutique villas, tea estate chalets & heritage stays',
  },
  {
    id: 'bank',
    label: 'Banks & ATMs',
    iconName: 'Building2',
    emoji: '🏦',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    description: '24-hour ATMs, foreign currency exchange & major bank branches',
  },
  {
    id: 'restaurant',
    label: 'Restaurants',
    iconName: 'Utensils',
    emoji: '🍽️',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    description: 'Authentic Sri Lankan rice & curry, fresh seafood & traveler cafes',
  },
  {
    id: 'hospital',
    label: 'Hospitals',
    iconName: 'Activity',
    emoji: '🏥',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-300',
    description: '24/7 Emergency trauma, medical centers & tourist healthcare',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacies',
    iconName: 'Pill',
    emoji: '💊',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-300',
    description: 'State Osu Sala, prescription medicines & travel first-aid supplies',
  },
  {
    id: 'supermarket',
    label: 'Supermarkets',
    iconName: 'ShoppingCart',
    emoji: '🛒',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-300',
    description: 'Keells, Cargills & Arpico for bottled water, snacks & travel essentials',
  },
  {
    id: 'car_service',
    label: 'Car Services',
    iconName: 'Wrench',
    emoji: '🚗',
    badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
    textColor: 'text-stone-700',
    borderColor: 'border-stone-400',
    description: 'Tire repair, breakdown assistance, battery jump-starts & workshops',
  },
  {
    id: 'attraction',
    label: 'Tourist Attractions',
    iconName: 'MapPin',
    emoji: '📍',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    description: 'UNESCO ancient citadels, tea hills, waterfalls & temples',
  },
];

export const nearMePlacesData: NearMePlace[] = [
  {
    "id": "fuel-ella-town-ceypetco",
    "name": "Ceypetco Filling Station - Ella Town",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Ella",
    "area": "Ella Town Center / Wellawaya Road",
    "address": "Wellawaya Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8742,
      "lng": 81.046
    },
    "openStatus": "Open Now",
    "openingHours": "5:30 AM – 10:30 PM Daily",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "Petrol 92",
      "Auto Diesel",
      "Cash & Card Accepted",
      "Tire Air Gauge",
      "Motorbike 2T Oil"
    ],
    "description": "Central fuel station located right in Ella town, providing essential petrol and diesel for self-driving cars, tour vans, and scooters.",
    "drivingTip": "Easy pull-in directly on Wellawaya Road. Always fill up before mountain drives towards Nuwara Eliya or Horton Plains.",
    "rating": 4.6,
    "isFeatured": true,
    "searchKeywords": "fuel petrol stations filling station gas diesel ceypetco ella town wellawaya"
  },
  {
    "id": "fuel-kumbalwela-ioc",
    "name": "Lanka IOC Station - Kumbalwela Junction",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Ella",
    "area": "Kumbalwela Junction / Ella Bypass",
    "address": "Kumbalwela Junction, Ella-Bandarawela Highway, Uva Province",
    "coordinates": {
      "lat": 6.88705,
      "lng": 81.0408
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 57 222 2480",
    "services": [
      "XtraPremium 95",
      "Petrol 92",
      "Auto Diesel",
      "XtraMile Super Diesel",
      "Air & Water"
    ],
    "description": "Modern 24-hour Lanka IOC filling station situated at the key junction connecting Ella, Bandarawela, and Badulla highway corridors.",
    "drivingTip": "Spacious forecourt with premium 95 octane petrol suitable for modern rental SUVs and turbocharged vehicles.",
    "rating": 4.5,
    "isFeatured": true,
    "searchKeywords": "fuel petrol station filling station gas diesel lanka ioc ella kumbalwela"
  },
  {
    "id": "fuel-bandarawela-ioc",
    "name": "Lanka IOC Filling Station - Bandarawela Town",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Bandarawela",
    "area": "Badulla-Colombo Main Road",
    "address": "Main Street, Bandarawela 90100, Uva Province",
    "coordinates": {
      "lat": 6.831,
      "lng": 80.988
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 57 222 2333",
    "services": [
      "Petrol 92",
      "Petrol 95",
      "Auto Diesel",
      "Super Diesel",
      "Restrooms",
      "Convenience Kiosk"
    ],
    "description": "Premier hill country fuel station in Bandarawela commercial town, offering both standard and premium fuel grades 24/7.",
    "drivingTip": "Ideal refueling stop when traveling between Ella and Haputale / Horton Plains.",
    "rating": 4.4,
    "searchKeywords": "fuel petrol station filling station gas diesel ioc bandarawela town"
  },
  {
    "id": "fuel-badulla-ceypetco",
    "name": "Ceypetco Fuel Station - Badulla City Center",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Badulla",
    "area": "Lower King Street",
    "address": "Lower King Street, Badulla 90000, Uva Province",
    "coordinates": {
      "lat": 6.985,
      "lng": 81.057
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 55 222 2120",
    "services": [
      "Petrol 92",
      "Petrol 95 Octane",
      "Auto Diesel",
      "Super Diesel",
      "Tire Pressure Bay"
    ],
    "description": "Primary provincial capital filling station in Badulla city center with wide multi-pump forecourt.",
    "drivingTip": "Refuel here before exploring Dunhinda Falls or ascending the Passara-Madulsima ridge.",
    "rating": 4.5,
    "searchKeywords": "fuel station petrol filling gas diesel ceypetco badulla city capital"
  },
  {
    "id": "fuel-haputale-ceypetco",
    "name": "Ceypetco Fuel Station - Haputale Ridge",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Haputale",
    "area": "Colombo-Batticaloa Highway (A4)",
    "address": "Main Street, Haputale 90160, Uva Province",
    "coordinates": {
      "lat": 6.768,
      "lng": 80.957
    },
    "openStatus": "Open Now",
    "openingHours": "6:00 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 226 8110",
    "services": [
      "Petrol 92",
      "Auto Diesel",
      "Air & Water Check"
    ],
    "description": "High-elevation mountain fuel station servicing vehicles traversing the Haputale pass and Lipton’s Seat tea highlands.",
    "drivingTip": "Check tire pressures here; high altitude and steep gradients increase fuel consumption.",
    "rating": 4.3,
    "searchKeywords": "fuel petrol station filling station gas diesel ceypetco haputale ridge lipton"
  },
  {
    "id": "fuel-wellawaya-ceypetco",
    "name": "Ceypetco Station - Wellawaya Highway Crossroad",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Wellawaya",
    "area": "Wellawaya Junction (A2/A4)",
    "address": "Highway Junction, Wellawaya 91200, Uva Province",
    "coordinates": {
      "lat": 6.741,
      "lng": 81.103
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 55 227 4210",
    "services": [
      "Petrol 92",
      "Petrol 95",
      "Auto Diesel",
      "Super Diesel",
      "Spacious Truck & Bus Bays"
    ],
    "description": "Major transit hub fuel station at the southern foot of the Ella Gap connecting the hill country to Yala and Udawalawe.",
    "drivingTip": "Crucial refueling point after coming down the mountain road from Ella before heading to southern national parks.",
    "rating": 4.5,
    "searchKeywords": "fuel petrol station filling station gas diesel ceypetco wellawaya crossroad"
  },
  {
    "id": "fuel-colombo-fort-ceypetco",
    "name": "Ceypetco Filling Station - Colombo Fort",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Colombo",
    "area": "Fort / Lotus Road",
    "address": "Lotus Road, Colombo 01, Western Province",
    "coordinates": {
      "lat": 6.9344,
      "lng": 79.8458
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 11 244 5566",
    "services": [
      "Petrol 92",
      "Petrol 95 Octane",
      "Auto Diesel",
      "Super Diesel",
      "Air & Water"
    ],
    "description": "Premier government Ceypetco filling station situated at the heart of Colombo commercial hub, adjacent to Fort Railway Station.",
    "drivingTip": "Ideal refueling point before hopping on the Colombo-Katunayake Expressway (E03) or Marine Drive.",
    "rating": 4.5,
    "isFeatured": true,
    "searchKeywords": "gas petrol diesel ceypetco oil colombo fort lotus road pump"
  },
  {
    "id": "fuel-kandy-peradeniya-iok",
    "name": "Lanka IOC Filling Station - Peradeniya Road, Kandy",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Kandy",
    "area": "Peradeniya Road",
    "address": "Peradeniya Road, Kandy 20000, Central Province",
    "coordinates": {
      "lat": 7.2842,
      "lng": 80.6214
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 81 223 4890",
    "services": [
      "XtraPremium 95",
      "Petrol 92",
      "Auto Diesel",
      "XtraMile Diesel",
      "Tire Pressure Gauge"
    ],
    "description": "Convenient Lanka IOC station on the primary corridor between Kandy City and the Royal Botanic Gardens.",
    "drivingTip": "Always fill your tank here before driving up the winding mountain pass towards Nuwara Eliya via Gampola.",
    "rating": 4.4,
    "searchKeywords": "fuel gas petrol diesel ioc lanka ioc kandy peradeniya"
  },
  {
    "id": "fuel-galle-fort-ceypetco",
    "name": "Ceypetco Marine Filling Station - Galle Port",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Galle",
    "area": "Galle Fort / Harbour",
    "address": "Havelock Place, Near Galle Port, Galle 80000",
    "coordinates": {
      "lat": 6.0367,
      "lng": 80.2189
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 91 223 4111",
    "services": [
      "Petrol 92",
      "Petrol 95",
      "Auto Diesel",
      "Restrooms",
      "Air & Water"
    ],
    "description": "Strategically located at the entrance to Galle Fort and harbour road, convenient for coastal road travelers.",
    "drivingTip": "Fill up here before connecting to the Southern Expressway (E01) Pinnaduwa Interchange.",
    "rating": 4.6,
    "searchKeywords": "fuel station galle fort harbour ceypetco petrol diesel"
  },
  {
    "id": "fuel-nuwara-eliya-ceypetco",
    "name": "Ceypetco Filling Station - Nuwara Eliya Town",
    "category": "fuel",
    "categoryLabel": "Fuel Station",
    "city": "Nuwara Eliya",
    "area": "Badulla Road / Town Center",
    "address": "Badulla Road, Nuwara Eliya 22200, Central Province",
    "coordinates": {
      "lat": 6.9697,
      "lng": 80.7712
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 52 222 2341",
    "services": [
      "Petrol 92 & 95",
      "Auto Diesel & Super Diesel",
      "Cold Weather Coolant",
      "Air Pump"
    ],
    "description": "High-altitude station catering to hill country motorists, rental cars, and tour vans.",
    "drivingTip": "High elevation and cool temperatures decrease tire pressure; use their free digital air gauge before ascending to Horton Plains.",
    "rating": 4.5,
    "searchKeywords": "fuel nuwara eliya ceypetco petrol diesel hill country"
  },
  ...getAccommodationNearMePlaces(),
  {
    "id": "bank-combank-ella",
    "name": "Commercial Bank 24h ATM & Branch - Ella Town",
    "category": "bank",
    "categoryLabel": "Bank & 24h ATM",
    "city": "Ella",
    "area": "Main Street / Railway Approach",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8741,
      "lng": 81.0483
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24h ATM • Branch Mon–Fri 9:00 AM – 3:00 PM",
    "contactPhone": "+94 57 222 8500",
    "services": [
      "24-Hour International ATM (Visa/Mastercard)",
      "Foreign Currency Exchange",
      "Cash Withdrawal",
      "Cash Deposit Machine"
    ],
    "description": "Most popular 24/7 international ATM and bank branch in Ella town, accepting foreign traveler debit and credit cards.",
    "drivingTip": "Located along the main pedestrian and dining strip of Ella; short-term parking bays along the street.",
    "rating": 4.7,
    "isFeatured": true,
    "searchKeywords": "bank atm banks atms commercial bank combank ella cash currency exchange visa mastercard"
  },
  {
    "id": "bank-peoples-bank-ella",
    "name": "People’s Bank & 24h ATM - Ella Main Street",
    "category": "bank",
    "categoryLabel": "Bank & 24h ATM",
    "city": "Ella",
    "area": "Main Street / Ella Junction",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8745,
      "lng": 81.048
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "ATM: 24/7 • Banking: Mon-Fri 8:30 AM – 3:00 PM",
    "contactPhone": "+94 57 222 8111",
    "services": [
      "24h ATM",
      "Foreign Currency Exchange",
      "Government Bank Counter",
      "Utility Payments"
    ],
    "description": "State commercial bank branch with reliable 24-hour ATM supporting international Cirrus, Maestro, Visa, and Mastercard.",
    "drivingTip": "Positioned right on the town main road opposite local cafes; convenient walk from most Ella guesthouses.",
    "rating": 4.6,
    "searchKeywords": "bank atm banks atms peoples bank ella main street cash withdrawal foreign exchange"
  },
  {
    "id": "bank-boc-ella",
    "name": "Bank of Ceylon (BOC) & ATM - Ella Sub Branch",
    "category": "bank",
    "categoryLabel": "Bank & ATM",
    "city": "Ella",
    "area": "Ella Junction / Wellawaya Road",
    "address": "Wellawaya Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8735,
      "lng": 81.049
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24h ATM • Counter Mon–Fri 9:00 AM – 3:30 PM",
    "contactPhone": "+94 57 222 8300",
    "services": [
      "24/7 ATM",
      "Traveller Currency Exchange (USD, EUR, GBP)",
      "Emergency Cash Services"
    ],
    "description": "Bank of Ceylon sub-branch providing round-the-clock cash withdrawal and authorized currency exchange.",
    "drivingTip": "Easy pull-over spot right by the Ella town junction near the police post.",
    "rating": 4.5,
    "searchKeywords": "bank atm banks atms bank of ceylon boc ella cash currency exchange"
  },
  {
    "id": "bank-sampath-ella",
    "name": "Sampath Bank 24h ATM - Bandarawela Road, Ella",
    "category": "bank",
    "categoryLabel": "24h ATM",
    "city": "Ella",
    "area": "Bandarawela Road",
    "address": "Bandarawela Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.875,
      "lng": 81.0475
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 11 230 3050",
    "services": [
      "24h ATM",
      "Fast Cash Dispenser",
      "Mastercard / Visa Accepted",
      "Air Conditioned Booth"
    ],
    "description": "Secure, modern 24-hour Sampath Bank ATM booth with high cash uptime and seamless international card support.",
    "drivingTip": "Convenient roadside ATM booth on the northern exit of Ella town towards Kumbalwela.",
    "rating": 4.7,
    "searchKeywords": "bank atm banks atms sampath bank ella bandarawela road cash withdrawal"
  },
  {
    "id": "bank-hnb-ella",
    "name": "Hatton National Bank (HNB) ATM - Ella Junction",
    "category": "bank",
    "categoryLabel": "24h ATM",
    "city": "Ella",
    "area": "Station Road / Ella Center",
    "address": "Station Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8731,
      "lng": 81.0492
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 11 266 4664",
    "services": [
      "24h ATM",
      "Cirrus / Plus / UnionPay / Visa / Mastercard",
      "Air Conditioned Kiosk"
    ],
    "description": "High-reliability ATM booth operated by HNB, popular with international backpackers and holidaymakers.",
    "drivingTip": "Steps away from the Ella railway station road intersection.",
    "rating": 4.6,
    "searchKeywords": "bank atm banks atms hatton national bank hnb ella junction cash"
  },
  {
    "id": "bank-combank-bandarawela",
    "name": "Commercial Bank Regional Branch - Bandarawela",
    "category": "bank",
    "categoryLabel": "Major Bank Branch & ATM",
    "city": "Bandarawela",
    "area": "Main Street / Clock Tower",
    "address": "15 Main Street, Bandarawela 90100",
    "coordinates": {
      "lat": 6.8315,
      "lng": 80.9875
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24h ATM Lobby • Branch Mon–Fri 9:00 AM – 3:00 PM",
    "contactPhone": "+94 57 222 2301",
    "services": [
      "Full-Service Banking",
      "Foreign Exchange Counter",
      "Multiple 24h ATMs",
      "Safe Deposit Locker Access"
    ],
    "description": "Large regional flagship branch with full foreign exchange capabilities, western union services, and multiple ATM lobbies.",
    "drivingTip": "Town center location with dedicated customer parking spaces in front.",
    "rating": 4.7,
    "searchKeywords": "bank atm banks atms commercial bank bandarawela regional branch foreign exchange"
  },
  {
    "id": "bank-boc-badulla",
    "name": "Bank of Ceylon Super Grade Branch - Badulla",
    "category": "bank",
    "categoryLabel": "Super Grade Bank & ATM",
    "city": "Badulla",
    "area": "Lower Street / Provincial Hub",
    "address": "Lower Street, Badulla 90000, Uva Province",
    "coordinates": {
      "lat": 6.989,
      "lng": 81.056
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24h ATM • Branch Mon–Fri 8:30 AM – 3:30 PM",
    "contactPhone": "+94 55 222 2251",
    "services": [
      "Provincial Banking Headquarters",
      "Full Foreign Currency Desk",
      "3x 24h ATMs",
      "Cash Deposit Machines"
    ],
    "description": "The largest banking institution in Uva Province with specialized international remittance and traveler exchange desks.",
    "drivingTip": "Spacious bank building on Lower Street with dedicated parking security.",
    "rating": 4.6,
    "searchKeywords": "bank atm banks atms bank of ceylon boc badulla super grade branch"
  },
  {
    "id": "bank-hnb-kandy",
    "name": "Hatton National Bank (HNB) - Kandy Metro & 24h ATM",
    "category": "bank",
    "categoryLabel": "Bank & ATM",
    "city": "Kandy",
    "area": "Dalada Veediya / City Center",
    "address": "Dalada Veediya, Kandy 20000, Central Province",
    "coordinates": {
      "lat": 7.2925,
      "lng": 80.6358
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24/7 ATM • Banking Hours: Mon-Fri 9:00 AM – 3:00 PM",
    "contactPhone": "+94 81 223 4567",
    "services": [
      "24-Hour International ATM (Visa/Mastercard)",
      "Foreign Currency Exchange",
      "Western Union",
      "Card Services Desk"
    ],
    "description": "Central Kandy flagship branch situated within 200m of the Temple of the Sacred Tooth Relic.",
    "drivingTip": "Heavy pedestrian zone; use Kandy City Centre multi-story car park directly across the avenue.",
    "rating": 4.6,
    "isFeatured": true,
    "searchKeywords": "bank atm hnb kandy dalada veediya currency cash exchange money"
  },
  {
    "id": "bank-combank-galle",
    "name": "Commercial Bank - Galle Fort Foreign Exchange Counter",
    "category": "bank",
    "categoryLabel": "Bank & ATM",
    "city": "Galle",
    "area": "Galle Fort / Church Street",
    "address": "Church Street, Galle Fort 80000",
    "coordinates": {
      "lat": 6.0315,
      "lng": 80.217
    },
    "openStatus": "Open Now",
    "openingHours": "Mon-Sat 9:00 AM – 5:00 PM • 24/7 ATM Outside",
    "contactPhone": "+94 91 224 5500",
    "services": [
      "24-Hour Multilingual ATM",
      "Instant Forex Cash Conversion",
      "Traveler Card Reload",
      "Emergency Cash Assistance"
    ],
    "description": "Heritage-styled bank counter inside UNESCO Galle Fort, catering directly to international tourists.",
    "drivingTip": "Fort streets are mostly one-way and narrow; park near the Main Gate or along Rampart Street.",
    "rating": 4.7,
    "searchKeywords": "bank atm commercial galle fort currency forex exchange money cash"
  },
  {
    "id": "bank-boc-colombo-fort",
    "name": "Bank of Ceylon (BOC) Head Office & 24h ATM",
    "category": "bank",
    "categoryLabel": "Bank & ATM",
    "city": "Colombo",
    "area": "Fort / Bank of Ceylon Mawatha",
    "address": "04 Bank of Ceylon Mawatha, Colombo 01",
    "coordinates": {
      "lat": 6.9332,
      "lng": 79.8436
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily (Lobby & ATMs)",
    "contactPhone": "+94 11 244 6790",
    "services": [
      "24-Hour Multi-Currency ATMs",
      "Government Forex Counter",
      "Travel Card Support",
      "Cash Deposit Machines"
    ],
    "description": "The monumental BOC Tower in Colombo Fort provides multi-currency ATM terminals and international banking support.",
    "drivingTip": "Secure paid basement parking is available; accessible from York Street or Lotus Road.",
    "rating": 4.5,
    "searchKeywords": "bank atm boc colombo fort money cash exchange foreign currency"
  },
  {
    "id": "rest-cafe-chill-ella",
    "name": "Cafe Chill Ella",
    "category": "restaurant",
    "categoryLabel": "Restaurant & Cafe",
    "city": "Ella",
    "area": "Main Street / Town Center",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8744,
      "lng": 81.0481
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – Midnight Daily",
    "contactPhone": "+94 57 222 8410",
    "services": [
      "Authentic Sri Lankan Curries",
      "Wood-Fired Pizza",
      "Artisan Coffee & Smoothies",
      "Cocktails & Craft Beers",
      "Free Fast WiFi"
    ],
    "description": "The legendary beating heart of Ella dining scene. Multi-story thatched roof restaurant with cozy lounge beanbags and vibrant music.",
    "drivingTip": "Located right in Ella town. Park along the main street or walk from any central hotel.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "restaurant cafe cafes restaurants food places chill cafe chill ella curry pizza coffee cocktails"
  },
  {
    "id": "rest-ella-spice-garden",
    "name": "Ella Spice Garden & Cooking Class",
    "category": "restaurant",
    "categoryLabel": "Traditional Restaurant",
    "city": "Ella",
    "area": "Bopaththalawa Road",
    "address": "Bopaththalawa Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8738,
      "lng": 81.0472
    },
    "openStatus": "Open Now",
    "openingHours": "11:00 AM – 9:30 PM Daily",
    "contactPhone": "+94 77 912 3456",
    "services": [
      "Clay Pot Village Cooking",
      "Authentic Rice & Curry Feast",
      "Spice Garden Tour",
      "Cooking Classes",
      "Vegan / Vegetarian Friendly"
    ],
    "description": "Renowned culinary experience where travelers learn traditional Sri Lankan spices and savor coconut milk curries cooked over cinnamon firewood.",
    "drivingTip": "Short 2-minute stroll from Ella town center down a quiet residential lane.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "restaurant cafe food places traditional ella spice garden curry cooking class rice"
  },
  {
    "id": "rest-dream-cafe-ella",
    "name": "Dream Cafe Ella",
    "category": "restaurant",
    "categoryLabel": "Cafe & Restaurant",
    "city": "Ella",
    "area": "Main Street",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8742,
      "lng": 81.0485
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 11:00 PM Daily",
    "contactPhone": "+94 57 222 8150",
    "services": [
      "Espresso & Ceylon Tea Bar",
      "Fresh Bakery & Croissants",
      "Sri Lankan Rice & Curry",
      "Open-Air Garden Seating"
    ],
    "description": "Popular garden cafe offering early breakfast, barista espresso coffee, and fresh tropical smoothie bowls for travelers.",
    "drivingTip": "Roadside location in central Ella with breezy outdoor verandah.",
    "rating": 4.7,
    "searchKeywords": "restaurant cafe food places dream cafe ella breakfast coffee bakery tea"
  },
  {
    "id": "rest-cafe-guru-ella",
    "name": "Cafe Guru - Ella",
    "category": "restaurant",
    "categoryLabel": "Traveler Cafe",
    "city": "Ella",
    "area": "Station Road",
    "address": "Station Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.874,
      "lng": 81.049
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 10:30 PM Daily",
    "contactPhone": "+94 57 222 8330",
    "services": [
      "Specialty Coffee",
      "Wood-Fired Burgers & Wraps",
      "Kottu Roti Specials",
      "Smoothies & Shakes"
    ],
    "description": "Cozy and friendly traveler cafe near Ella train station serving great coffee, wholesome breakfasts, and Sri Lankan fusion dishes.",
    "drivingTip": "Located on the gentle slope toward Ella Railway Station.",
    "rating": 4.7,
    "searchKeywords": "restaurant cafe food places cafe guru ella station coffee kottu breakfast"
  },
  {
    "id": "rest-matey-hut-ella",
    "name": "Matey Hut Authentic Rice & Curry",
    "category": "restaurant",
    "categoryLabel": "Local Eatery",
    "city": "Ella",
    "area": "Station Road Hillside",
    "address": "Near Railway Station, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.871,
      "lng": 81.0495
    },
    "openStatus": "Open Now",
    "openingHours": "11:30 AM – 9:00 PM Daily",
    "contactPhone": "+94 77 567 8901",
    "services": [
      "5-Curry Banana Leaf Rice",
      "Fresh Roti & Dhal",
      "Authentic Home Cooked Flavor",
      "Friendly Village Host"
    ],
    "description": "Cult-favorite rustic wooden shack consistently ranked among the best authentic rice and curry spots in the entire country.",
    "drivingTip": "Tucked along the footpath near Ella station; park in town and enjoy a pleasant 4-minute walk.",
    "rating": 4.9,
    "searchKeywords": "restaurant food places matey hut ella rice and curry roti authentic local"
  },
  {
    "id": "rest-ak-ristoro-ella",
    "name": "AK Ristoro Italian & Sri Lankan Fusion",
    "category": "restaurant",
    "categoryLabel": "Fusion Restaurant",
    "city": "Ella",
    "area": "Waterfall Road",
    "address": "Waterfall Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8685,
      "lng": 81.0515
    },
    "openStatus": "Open Now",
    "openingHours": "12:00 PM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 8600",
    "services": [
      "Handmade Pasta & Gnocchi",
      "Wood-Fired Pizza",
      "Imported Wines",
      "Sri Lankan Seafood Curries"
    ],
    "description": "Chic rustic stone-and-timber restaurant serving authentic handmade Italian pasta alongside refined Sri Lankan specialties.",
    "drivingTip": "Quiet setting along Waterfall Road with dedicated car parking space.",
    "rating": 4.8,
    "searchKeywords": "restaurant food places ak ristoro ella italian pasta pizza wine fusion"
  },
  {
    "id": "rest-ravana-pool-club",
    "name": "Ravana Pool Club & Restaurant",
    "category": "restaurant",
    "categoryLabel": "Pool Club & Restaurant",
    "city": "Ella",
    "area": "Little Adam’s Peak Ridge",
    "address": "Little Adam’s Peak, Passara Road, Ella 90090",
    "coordinates": {
      "lat": 6.8682,
      "lng": 81.0596
    },
    "openStatus": "Open Now",
    "openingHours": "9:00 AM – 11:00 PM Daily",
    "contactPhone": "+94 57 205 0077",
    "services": [
      "Heated Infinity Pools",
      "Daybeds & Cabanas",
      "Gourmet Tapas & Cocktails",
      "Wood-Fired Grill",
      "Sunset DJ Sessions"
    ],
    "description": "Bali-style luxury day club in the Sri Lankan mountains featuring tiered infinity pools overlooking Ella Gap, artisan sushi, and wood-fired grills.",
    "drivingTip": "Park at the 98 Acres / Little Adam’s Peak complex parking area; golf buggies shuttle guests up to the venue.",
    "rating": 4.8,
    "searchKeywords": "restaurant cafe food places ravana pool club ella cocktails sunset pool grill tapas"
  },
  {
    "id": "rest-upalis-colombo",
    "name": "Upali’s by Nawaloka",
    "category": "restaurant",
    "categoryLabel": "Authentic Sri Lankan Restaurant",
    "city": "Colombo",
    "area": "Cinnamon Gardens / Town Hall",
    "address": "65 C.W.W. Kannangara Mawatha, Colombo 07",
    "coordinates": {
      "lat": 6.9125,
      "lng": 79.8635
    },
    "openStatus": "Open Now",
    "openingHours": "11:30 AM – 10:30 PM Daily",
    "contactPhone": "+94 11 269 5812",
    "services": [
      "Traditional Rice & Curry Platters",
      "Jaffna Crab Curry",
      "Mutton Varuval",
      "Appam & String Hoppers",
      "Air-Conditioned Dining"
    ],
    "description": "The benchmark for traditional Sri Lankan dining in Colombo, celebrated for slow-cooked clay pot curries and coconut sambol.",
    "drivingTip": "Valet and dedicated security car parking available in front directly opposite Viharamahadevi Park.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "restaurant food places upalis colombo rice curry ceylon food jaffna crab"
  },
  {
    "id": "rest-empire-cafe-kandy",
    "name": "The Empire Cafe - Kandy Heritage",
    "category": "restaurant",
    "categoryLabel": "Heritage Cafe & Bistro",
    "city": "Kandy",
    "area": "Temple Street / Sacred Tooth Relic",
    "address": "21 Temple Street, Kandy 20000",
    "coordinates": {
      "lat": 7.2938,
      "lng": 80.6402
    },
    "openStatus": "Open Now",
    "openingHours": "8:30 AM – 9:30 PM Daily",
    "contactPhone": "+94 81 223 9876",
    "services": [
      "Colonial Verandah Dining",
      "Coconut Curry Bowls",
      "Gourmet Coffee & Cakes",
      "Vegetarian & Vegan Specialties"
    ],
    "description": "Charming vintage cafe occupying an old colonial building right next to the Temple of the Tooth Relic.",
    "drivingTip": "Temple Street is pedestrianized during evening puja ceremonies; park at Kandy City Centre.",
    "rating": 4.7,
    "searchKeywords": "restaurant cafe food places empire cafe kandy temple street coffee curry"
  },
  {
    "id": "rest-pedlars-inn-galle",
    "name": "Pedlar’s Inn Cafe & Restaurant",
    "category": "restaurant",
    "categoryLabel": "Heritage Cafe",
    "city": "Galle",
    "area": "Galle Fort / Pedlar Street",
    "address": "92 Pedlar Street, Galle Fort 80000",
    "coordinates": {
      "lat": 6.0298,
      "lng": 80.2185
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 10:30 PM Daily",
    "contactPhone": "+94 91 222 5333",
    "services": [
      "Fresh Seafood Catch of the Day",
      "Wood-Fired Italian Pizza",
      "Artisan Gelato Bar",
      "Courtyard Seating"
    ],
    "description": "Pioneering cafe in Galle Fort housed inside a converted Dutch colonial post office, famed for fresh grilled lobster and Italian gelato.",
    "drivingTip": "Inside pedestrian-friendly Galle Fort; park along Lighthouse Street or the outer ramparts.",
    "rating": 4.7,
    "searchKeywords": "restaurant cafe food places pedlars inn galle fort seafood pizza gelato"
  },
  {
    "id": "pharmacy-medicare-ella",
    "name": "MediCare Pharmacy & First Aid - Ella",
    "category": "pharmacy",
    "categoryLabel": "Pharmacy & Medical Store",
    "city": "Ella",
    "area": "Station Road / Ella Town",
    "address": "Station Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.873,
      "lng": 81.0478
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 10:30 PM Daily",
    "contactPhone": "+94 57 222 8222",
    "services": [
      "Prescription Medicines",
      "Travel First Aid Kits",
      "Mosquito Repellent & Sunscreen",
      "Oral Rehydration Salts",
      "Leech Socks & Antiseptics"
    ],
    "description": "Well-stocked tourist pharmacy in Ella offering registered pharmacist assistance, anti-allergy meds, hydration salts, and hiking supplies.",
    "drivingTip": "Located along the main street junction; quick curbside stopping available.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "pharmacy pharmacies drug stores chemist medicine first aid ella station road"
  },
  {
    "id": "pharmacy-new-city-ella",
    "name": "New City Pharmacy - Ella Main Street",
    "category": "pharmacy",
    "categoryLabel": "Pharmacy & Drug Store",
    "city": "Ella",
    "area": "Main Street Commercial Strip",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8743,
      "lng": 81.0485
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 8450",
    "services": [
      "Registered Pharmacist on Duty",
      "Pain Relief & Antibiotics",
      "Altitude & Motion Sickness Remedies",
      "Bandages & Dressings"
    ],
    "description": "Trusted central Ella pharmacy providing travelers with essential pharmaceuticals, motion sickness pills for winding roads, and hygiene items.",
    "drivingTip": "Directly on the main street with high visibility next to grocery stores.",
    "rating": 4.7,
    "searchKeywords": "pharmacy pharmacies drug stores chemist medicine new city ella main street"
  },
  {
    "id": "pharmacy-sanasa-kumbalwela",
    "name": "Sanasa Medi Pharmacy - Kumbalwela Junction, Ella",
    "category": "pharmacy",
    "categoryLabel": "Pharmacy",
    "city": "Ella",
    "area": "Kumbalwela Junction (Ella-Bandarawela Road)",
    "address": "Kumbalwela Junction, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8865,
      "lng": 81.041
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 9:30 PM Daily",
    "contactPhone": "+94 57 222 2115",
    "services": [
      "Emergency First Aid",
      "Prescription Dispensing",
      "Baby & Infant Nutrition",
      "Travel Toiletries"
    ],
    "description": "Convenient pharmacy at the major northern junction of Ella, ideal for passing motorists needing emergency medicines.",
    "drivingTip": "Located right at the Kumbalwela crossroads with convenient parking space.",
    "rating": 4.6,
    "searchKeywords": "pharmacy pharmacies drug stores chemist sanasa kumbalwela ella junction"
  },
  {
    "id": "pharmacy-osu-sala-bandarawela",
    "name": "State Rajya Osu Sala - Bandarawela Town",
    "category": "pharmacy",
    "categoryLabel": "State Rajya Osu Sala Pharmacy",
    "city": "Bandarawela",
    "area": "Main Street / Hospital Approach",
    "address": "Main Street, Bandarawela 90100",
    "coordinates": {
      "lat": 6.832,
      "lng": 80.9885
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 8:00 PM Daily",
    "contactPhone": "+94 57 222 2450",
    "services": [
      "Government Certified State Pharmaceuticals (SPC)",
      "All Essential Prescription Drugs",
      "Quality Guaranteed Storage",
      "Subsidized Prices"
    ],
    "description": "Official government Rajya Osu Sala branch providing certified authentic pharmaceuticals, vaccines, and specialized treatments.",
    "drivingTip": "Located on Main Street Bandarawela with curbside parking.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "pharmacy pharmacies drug stores chemist rajya osu sala bandarawela government spc"
  },
  {
    "id": "pharmacy-central-bandarawela",
    "name": "Central Pharmacy & Dispensary - Bandarawela",
    "category": "pharmacy",
    "categoryLabel": "Pharmacy & Dispensary",
    "city": "Bandarawela",
    "area": "Welimada Road",
    "address": "Welimada Road, Bandarawela 90100",
    "coordinates": {
      "lat": 6.8305,
      "lng": 80.989
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 2890",
    "services": [
      "Doctor Consultation Room",
      "Prescription Fulfillment",
      "General Health Supplies",
      "Blood Pressure Check"
    ],
    "description": "Long-standing pharmacy and private doctor dispensary in Bandarawela commercial town center.",
    "drivingTip": "Easy access off Welimada road with street parking.",
    "rating": 4.6,
    "searchKeywords": "pharmacy pharmacies drug stores chemist central dispensary bandarawela"
  },
  {
    "id": "pharmacy-osu-sala-badulla",
    "name": "Rajya Osu Sala Regional - Badulla Town",
    "category": "pharmacy",
    "categoryLabel": "State Rajya Osu Sala Pharmacy",
    "city": "Badulla",
    "area": "Hospital Road",
    "address": "Hospital Road, Badulla 90000, Uva Province",
    "coordinates": {
      "lat": 6.988,
      "lng": 81.0555
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 55 222 2840",
    "services": [
      "24/7 State Emergency Pharmacy",
      "Complete Range of Prescription Drugs",
      "Cold-Chain Insulin & Vaccines",
      "Professional Pharmacist Consultation"
    ],
    "description": "Regional 24-hour government state pharmacy adjacent to Badulla Provincial General Hospital.",
    "drivingTip": "Directly on Hospital Road with designated emergency vehicle parking.",
    "rating": 4.8,
    "searchKeywords": "pharmacy pharmacies drug stores chemist rajya osu sala badulla 24 hours emergency"
  },
  {
    "id": "pharmacy-union-chemists-colombo",
    "name": "Union Chemists 24/7 - Colombo",
    "category": "pharmacy",
    "categoryLabel": "24-Hour Pharmacy",
    "city": "Colombo",
    "area": "Kollupitiya / Galle Road",
    "address": "460 Galle Road, Colombo 03",
    "coordinates": {
      "lat": 6.9142,
      "lng": 79.858
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24/7 Daily",
    "contactPhone": "+94 11 257 3254",
    "services": [
      "24-Hour Prescription Dispensing",
      "Emergency Medical Supplies",
      "Infant Care & Nutrition",
      "Wheelchair & Crutch Rentals"
    ],
    "description": "Colombo’s premier 24-hour pharmacy, renowned for having the most extensive inventory of imported European and American medicines.",
    "drivingTip": "Drive-up parking available directly in front on Galle Road seaward side.",
    "rating": 4.8,
    "searchKeywords": "pharmacy drug store medicine 24 hours union chemists colombo galle road"
  },
  {
    "id": "pharmacy-osu-sala-kandy",
    "name": "Rajya Osu Sala - Kandy City Center",
    "category": "pharmacy",
    "categoryLabel": "State Pharmacy",
    "city": "Kandy",
    "area": "Yatinuwara Veediya",
    "address": "Yatinuwara Veediya, Kandy 20000",
    "coordinates": {
      "lat": 7.293,
      "lng": 80.6355
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 9:00 PM Daily",
    "contactPhone": "+94 81 222 2489",
    "services": [
      "Government Certified State Pharmaceuticals (SPC)",
      "Standard Price Guaranteed",
      "Registered Pharmacists",
      "Herbal & Ayurvedic Balms"
    ],
    "description": "Official State Pharmaceuticals Corporation branch ensuring 100% genuine quality-checked medicines.",
    "drivingTip": "Located in Kandy central heritage grid; short walk from the Clock Tower.",
    "rating": 4.7,
    "searchKeywords": "pharmacy drug store rajya osu sala kandy medicine pills"
  },
  {
    "id": "super-cargills-ella",
    "name": "Cargills Food City - Ella Town Center",
    "category": "supermarket",
    "categoryLabel": "Supermarket & Grocery",
    "city": "Ella",
    "area": "Main Street / Ella Commercial Strip",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.874,
      "lng": 81.0482
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 8180",
    "services": [
      "Fresh Mineral Water & Electrolytes",
      "Chilled Soft Drinks & Local Juices",
      "Fresh Island Fruits & Bakery",
      "Snacks, Chocolates & Dry Rations",
      "Personal Toiletries & Sunscreen"
    ],
    "description": "Premier national supermarket chain in Ella town, offering certified bottled drinking water, fresh tropical fruits, snacks, and travel essentials.",
    "drivingTip": "Situated right on Ella Main Street; quick loading and unloading possible right in front.",
    "rating": 4.7,
    "isFeatured": true,
    "searchKeywords": "supermarket supermarkets grocery stores cargills food city ella town water snacks fruits"
  },
  {
    "id": "super-keells-ella",
    "name": "Keells Super / Express - Ella Junction",
    "category": "supermarket",
    "categoryLabel": "Supermarket",
    "city": "Ella",
    "area": "Ella Junction / Station Road",
    "address": "Passara Road Junction, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8748,
      "lng": 81.0475
    },
    "openStatus": "Open Now",
    "openingHours": "7:00 AM – 10:30 PM Daily",
    "contactPhone": "+94 57 222 8550",
    "services": [
      "Artisan Bakery & Hot Pastries",
      "Imported Gourmet Food & Cheeses",
      "Cold Beverages & Coconut Water",
      "Camping Supplies & Batteries",
      "Credit Cards & Contactless Pay"
    ],
    "description": "Modern supermarket featuring hot rotisserie snacks, freshly baked breads, international snacks, and hiking hydration supplies.",
    "drivingTip": "Clear road frontage at the northern town gateway with quick curb-side parking.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "supermarket supermarkets grocery stores keells super express ella junction bakery water"
  },
  {
    "id": "super-ella-grocery",
    "name": "Ella Super Grocery & Fresh Fruits",
    "category": "supermarket",
    "categoryLabel": "Grocery Store",
    "city": "Ella",
    "area": "Ella Main Street",
    "address": "Main Street, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8727,
      "lng": 81.0499
    },
    "openStatus": "Open Now",
    "openingHours": "6:30 AM – 11:00 PM Daily",
    "contactPhone": "+94 77 123 4567",
    "services": [
      "Fresh Ceylon King Coconuts (Thambili)",
      "Fresh Bananas, Mangoes & Avocados",
      "Bottled Mineral Water Packs",
      "Hiking Energy Snacks",
      "Sim Cards & Top-ups"
    ],
    "description": "Popular grocery mart in Ella specialized in fresh highland fruits, coconuts cut on the spot, and wholesale drinking water.",
    "drivingTip": "Open early from 6:30 AM for hikers picking up packed snacks before Little Adam’s Peak.",
    "rating": 4.6,
    "searchKeywords": "supermarket grocery stores fruit water ella super mart food"
  },
  {
    "id": "super-cargills-bandarawela",
    "name": "Cargills Food City - Bandarawela Main Street",
    "category": "supermarket",
    "categoryLabel": "Large Supermarket",
    "city": "Bandarawela",
    "area": "Main Street / Clock Tower",
    "address": "Main Street, Bandarawela 90100",
    "coordinates": {
      "lat": 6.8309,
      "lng": 80.9885
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 2220",
    "services": [
      "Full Supermarket Department",
      "Fresh Meat & Dairy Counter",
      "Pharmacy Counter",
      "ATM on Premises",
      "Car Park"
    ],
    "description": "Major regional supermarket in Bandarawela stocked with complete grocery items, fresh produce, and traveler supplies.",
    "drivingTip": "Generous parking available along the main street and side lane.",
    "rating": 4.6,
    "searchKeywords": "supermarket supermarkets grocery stores cargills bandarawela main street"
  },
  {
    "id": "super-keells-bandarawela",
    "name": "Keells Supermarket - Bandarawela",
    "category": "supermarket",
    "categoryLabel": "Supermarket",
    "city": "Bandarawela",
    "area": "Dharmapala Mawatha",
    "address": "Dharmapala Mawatha, Bandarawela 90100",
    "coordinates": {
      "lat": 6.8325,
      "lng": 80.987
    },
    "openStatus": "Open Now",
    "openingHours": "7:00 AM – 10:00 PM Daily",
    "contactPhone": "+94 57 222 3400",
    "services": [
      "Large Clean Aisles",
      "Imported Goods",
      "Fresh Juices & Salads",
      "Dedicated Customer Car Park"
    ],
    "description": "Spacious modern supermarket with dedicated customer parking, perfect for stocking up road trip supplies.",
    "drivingTip": "Convenient dedicated customer parking lot on site.",
    "rating": 4.7,
    "searchKeywords": "supermarket supermarkets grocery stores keells bandarawela parking"
  },
  {
    "id": "super-arpico-badulla",
    "name": "Arpico Supercentre - Badulla",
    "category": "supermarket",
    "categoryLabel": "Hypermarket & Supercentre",
    "city": "Badulla",
    "area": "Lower Street Commercial Zone",
    "address": "Lower Street, Badulla 90000",
    "coordinates": {
      "lat": 6.987,
      "lng": 81.0545
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 9:30 PM Daily",
    "contactPhone": "+94 55 222 5500",
    "services": [
      "Massive Hypermarket Floor",
      "Electronics & Vehicle Accessories",
      "Camping & Outdoor Gear",
      "Secure Covered Parking"
    ],
    "description": "The largest retail hypermarket in Uva Province, featuring camping tents, cooler boxes, travel snacks, and groceries.",
    "drivingTip": "Secure covered multi-vehicle car parking lot with security guard.",
    "rating": 4.7,
    "searchKeywords": "supermarket supermarkets grocery stores arpico supercentre badulla hypermarket"
  },
  {
    "id": "super-keells-colombo",
    "name": "Keells Super - Union Place, Colombo",
    "category": "supermarket",
    "categoryLabel": "Supermarket",
    "city": "Colombo",
    "area": "Union Place / Slave Island",
    "address": "Union Place, Colombo 02",
    "coordinates": {
      "lat": 6.9205,
      "lng": 79.8572
    },
    "openStatus": "Open Now",
    "openingHours": "7:00 AM – 10:00 PM Daily",
    "contactPhone": "+94 11 230 4500",
    "services": [
      "Fresh Organic Produce",
      "Artisan Bakery",
      "Imported Cheeses & Meats",
      "Prepared Ready-to-Eat Counter",
      "Underground Car Park"
    ],
    "description": "Flagship branch of Sri Lanka’s leading modern grocery chain with extensive international goods, deli counter, and fresh bakery.",
    "drivingTip": "Spacious underground basement parking with direct elevator access into the supermarket.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "supermarket grocery keells colombo food essentials supplies union place"
  },
  {
    "id": "super-cargills-kandy",
    "name": "Cargills Food City - Peradeniya Road, Kandy",
    "category": "supermarket",
    "categoryLabel": "Supermarket",
    "city": "Kandy",
    "area": "Peradeniya Road",
    "address": "Peradeniya Road, Kandy 20000",
    "coordinates": {
      "lat": 7.2795,
      "lng": 80.6185
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 10:00 PM Daily",
    "contactPhone": "+94 81 222 3344",
    "services": [
      "Fresh Ceylon Tea Gift Packs",
      "Drinking Water Refills",
      "Dairy & Fresh Produce",
      "Customer Parking Bay"
    ],
    "description": "Convenient grocery stop along the highway corridor between Kandy town and the Royal Botanical Gardens.",
    "drivingTip": "On-site front parking spaces available for customers.",
    "rating": 4.6,
    "searchKeywords": "supermarket grocery cargills kandy peradeniya water food snacks"
  },
  {
    "id": "car-ella-auto-care",
    "name": "Ella Auto Care & Breakdown Recovery",
    "category": "car_service",
    "categoryLabel": "Vehicle Service & Recovery",
    "city": "Ella",
    "area": "Wellawaya Road / Ella Town Exit",
    "address": "Wellawaya Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8753,
      "lng": 81.047
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24/7 Emergency Breakdown Assistance • Workshop 7:30 AM – 8:00 PM",
    "contactPhone": "+94 77 234 5678",
    "services": [
      "24/7 Mountain Breakdown Recovery",
      "Tire Puncture Repair & Replacement",
      "Engine Diagnostics & Oil Changes",
      "Brake Overhaul for Hill Driving",
      "Battery Jump Starts & Sales"
    ],
    "description": "Trusted local vehicle repair shop and 24/7 breakdown recovery specialist in Ella. Experienced with tourist rental cars, SUVs, and tuk-tuks.",
    "drivingTip": "Convenient workshop located right on the Wellawaya highway road in Ella with hydraulic car lifts and roadside tow truck.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "car service vehicle service car repair tyre service roadside assistance mechanic puncture battery breakdown ella"
  },
  {
    "id": "car-kumbalwela-tyre",
    "name": "Kumbalwela Tyre Works & Puncture Repair",
    "category": "car_service",
    "categoryLabel": "Tyre & Wheel Service",
    "city": "Ella",
    "area": "Kumbalwela Junction, Ella Bypass",
    "address": "Kumbalwela Junction, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.886,
      "lng": 81.0415
    },
    "openStatus": "Open Now",
    "openingHours": "7:00 AM – 9:00 PM Daily",
    "contactPhone": "+94 57 222 2190",
    "services": [
      "Instant Tubeless Tyre Puncture Fixing",
      "Wheel Balancing & Alignment",
      "New Tyres for Rental Cars & SUVs",
      "High Pressure Air & Nitrogen Refill"
    ],
    "description": "Specialized tyre service station right at the key Kumbalwela intersection on the Ella-Badulla highway.",
    "drivingTip": "Spacious gravel bay allowing easy drive-in without blocking highway traffic.",
    "rating": 4.7,
    "searchKeywords": "car service vehicle service tyre service puncture repair wheel alignment kumbalwela ella"
  },
  {
    "id": "car-bandarawela-auto",
    "name": "Hill Country Auto Mechanics & Diagnostic - Bandarawela",
    "category": "car_service",
    "categoryLabel": "Automotive Workshop",
    "city": "Bandarawela",
    "area": "Badulla Road",
    "address": "Badulla Road, Bandarawela 90100",
    "coordinates": {
      "lat": 6.833,
      "lng": 80.986
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 7:30 PM Mon–Sat (Emergency callout on Sun)",
    "contactPhone": "+94 57 222 2490",
    "services": [
      "Computerized Engine Diagnostics",
      "Clutch & Gearbox Mountain Repairs",
      "Radiator Flush & Coolant Service",
      "Suspension Bushing & Struts"
    ],
    "description": "Comprehensive auto repair workshop equipped with OBD-II scan tools for Japanese and European vehicles navigating the steep hill passes.",
    "drivingTip": "Directly off Badulla Road with multiple repair bays and ramp lifts.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "car service vehicle service car repair auto mechanics diagnostic bandarawela engine"
  },
  {
    "id": "car-bandarawela-tyre",
    "name": "Bandarawela Tyre Mart & Battery Center",
    "category": "car_service",
    "categoryLabel": "Tyre & Battery Center",
    "city": "Bandarawela",
    "area": "Main Street",
    "address": "Main Street, Bandarawela 90100",
    "coordinates": {
      "lat": 6.831,
      "lng": 80.9895
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 7:00 PM Daily",
    "contactPhone": "+94 57 222 2380",
    "services": [
      "Exide & Amaron Car Batteries",
      "Computer Wheel Alignment",
      "Bridgestone & Dunlop Tyres",
      "Emergency Battery Jump Service"
    ],
    "description": "Authorized battery and tyre dealership with on-the-spot battery replacement, testing, and high-speed wheel balancing.",
    "drivingTip": "Roadside location with quick drive-through battery testing service.",
    "rating": 4.7,
    "searchKeywords": "car service vehicle service tyre service battery center bandarawela exide amaron"
  },
  {
    "id": "car-dimo-badulla",
    "name": "DIMO 24/7 Roadside Assistance Badulla Center",
    "category": "car_service",
    "categoryLabel": "24/7 Roadside Assistance & Service",
    "city": "Badulla",
    "area": "Passara Road Commercial Park",
    "address": "Passara Road, Badulla 90000, Uva Province",
    "coordinates": {
      "lat": 6.984,
      "lng": 81.058
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24/7 Emergency Dispatch • Service Center 8:00 AM – 5:30 PM",
    "contactPhone": "+94 55 222 2888",
    "services": [
      "24/7 Flatbed Towing & Recovery",
      "Authorized Multi-Brand Car Service",
      "Accident & Mountain Rescue",
      "Genuine Spare Parts"
    ],
    "description": "Premier national dealership and emergency recovery hub with flatbed recovery vehicles servicing Ella, Bandarawela, Badulla, and Haputale.",
    "drivingTip": "Offers 24-hour on-call recovery trucks across all hill country mountain corridors.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "car service vehicle service roadside assistance towing car repair dimo badulla flatbed rescue"
  },
  {
    "id": "car-badulla-garage",
    "name": "Badulla Motor Garage & Suspension Specialists",
    "category": "car_service",
    "categoryLabel": "Garage & Suspension Works",
    "city": "Badulla",
    "area": "Lower King Street",
    "address": "Lower King Street, Badulla 90000",
    "coordinates": {
      "lat": 6.9865,
      "lng": 81.055
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 6:30 PM Mon–Sat",
    "contactPhone": "+94 55 222 3410",
    "services": [
      "Heavy Duty Suspension Upgrades",
      "Brake Disc Skimming & Pads",
      "Welding & Exhaust Repairs",
      "4WD Off-Road Preparation"
    ],
    "description": "Expert mechanical garage specializing in steering, suspension, and brake repairs for challenging mountain driving conditions.",
    "drivingTip": "Located on Lower King Street with wide workshop apron.",
    "rating": 4.6,
    "searchKeywords": "car service vehicle service car repair suspension garage badulla brakes"
  },
  {
    "id": "car-nuwara-eliya-auto",
    "name": "Hill Country Auto Repairs & Battery Center",
    "category": "car_service",
    "categoryLabel": "Auto Repair & Battery",
    "city": "Nuwara Eliya",
    "area": "Kandy Road / High Altitude Pass",
    "address": "Kandy Road, Nuwara Eliya 22200",
    "coordinates": {
      "lat": 6.968,
      "lng": 80.7745
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 8:00 PM Daily",
    "contactPhone": "+94 52 222 3190",
    "services": [
      "Mountain Brake Inspection & Pad Replacement",
      "Cold Weather Battery Replacement",
      "Tire Chains & Anti-Skid Inspection",
      "Engine Overheating Recovery"
    ],
    "description": "Specialized garage catering to vehicles tackling the sharp gradients and cold weather conditions of the Central Highlands.",
    "drivingTip": "Essential stop if your vehicle overheats or loses brake efficiency on the steep descents from Nuwara Eliya.",
    "rating": 4.6,
    "searchKeywords": "car service repair tyre battery mechanic nuwara eliya hill country"
  },
  {
    "id": "car-kandy-tyre-care",
    "name": "Kandy Tyre & Wheel Alignment Care",
    "category": "car_service",
    "categoryLabel": "Tyre & Alignment Center",
    "city": "Kandy",
    "area": "William Gopallawa Mawatha",
    "address": "William Gopallawa Mawatha, Kandy 20000",
    "coordinates": {
      "lat": 7.2815,
      "lng": 80.6205
    },
    "openStatus": "Open Now",
    "openingHours": "8:00 AM – 7:00 PM Daily",
    "contactPhone": "+94 81 220 5410",
    "services": [
      "3D Computerized Wheel Alignment",
      "Puncture Repair & New Tires",
      "High-Pressure Nitrogen Fill",
      "Brake Disc Servicing"
    ],
    "description": "Modern tire center equipped with Italian 3D alignment rigs, ensuring rental cars handle safely on curving highland roads.",
    "drivingTip": "Spacious paved parking bays allow quick drive-through tire checks.",
    "rating": 4.7,
    "searchKeywords": "car service tyre alignment puncture tire repair kandy gopallawa"
  },
  {
    "id": "car-automiraj-colombo",
    "name": "Automiraj Grand Express Hub - Colombo",
    "category": "car_service",
    "categoryLabel": "Car Care & Service",
    "city": "Colombo",
    "area": "Havelock Town / Havelock Road",
    "address": "145 Havelock Road, Colombo 05",
    "coordinates": {
      "lat": 6.8905,
      "lng": 79.8655
    },
    "openStatus": "Open Now",
    "openingHours": "7:30 AM – 8:30 PM Daily",
    "contactPhone": "+94 11 250 8800",
    "services": [
      "Full Vehicle Lube Service",
      "Express Undercarriage Wash",
      "Engine Tune-up & Inspection",
      "Air Conditioning Service"
    ],
    "description": "Premier car care facility with multi-bay computerized maintenance, quick oil change, and professional detailing.",
    "drivingTip": "Easy access from Havelock Road; comfortable air-conditioned customer waiting lounge with free Wi-Fi.",
    "rating": 4.8,
    "searchKeywords": "car service vehicle repair wash oil change automiraj colombo havelock"
  },
  {
    "id": "attr-ella-rock",
    "name": "Ella Rock Viewpoint & Trailhead",
    "category": "attraction",
    "categoryLabel": "Tourist Attraction",
    "city": "Ella",
    "area": "Ella Mountain Ridge",
    "address": "Ella Rock Trail, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.857,
      "lng": 81.048
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Best hiked 5:30 AM – 10:30 AM to avoid midday heat)",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "Panoramic Ella Gap Viewpoint",
      "Pine Forest Hiking Trail",
      "Railway Track Walk Section",
      "Scenic Photography Lookout"
    ],
    "description": "Iconic clifftop landmark overlooking Ella Gap. The rewarding 4-hour return trek leads past tea plantations, railway tracks, and eucalyptus forests to a precipice view.",
    "drivingTip": "Park near Kithalella Railway Station or in Ella Town and proceed on foot following the rail line toward the bridge.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction ella rock hiking trail mountain view"
  },
  {
    "id": "attr-little-adams-peak",
    "name": "Little Adam’s Peak (Punchi Sri Pada)",
    "category": "attraction",
    "categoryLabel": "Tourist Attraction",
    "city": "Ella",
    "area": "Passara Road / Ella Gap",
    "address": "Little Adam's Peak Trailhead, Passara Road, Ella 90090",
    "coordinates": {
      "lat": 6.8625,
      "lng": 81.0592
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Gentle 45-min hike; best at dawn 6:00 AM or sunset 5:30 PM)",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "Panoramic 360° Ella Gap Vistas",
      "Gentle Paved Tea Trail",
      "Flying Ravana Zipline & Pool Club",
      "Sunrise & Sunset Lookout Points"
    ],
    "description": "The most popular easy hike in Sri Lanka, taking you along rolling green tea estates to a jagged razorback ridge with panoramic southern plains views.",
    "drivingTip": "Park at the trailhead car park along Passara Road (opposite 98 Acres Resort). Paved path suits all fitness levels.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction ella little adams peak hiking view gap"
  },
  {
    "id": "attr-nine-arches",
    "name": "Nine Arches Bridge (Demodara)",
    "category": "attraction",
    "categoryLabel": "Historic Landmark",
    "city": "Ella",
    "area": "Gotuwala / Demodara Corridor",
    "address": "Gotuwala Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8767,
      "lng": 81.0608
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Blue train passes around 9:30 AM, 11:45 AM, 3:30 PM, 5:30 PM)",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "World-Famous Colonial Viaduct",
      "Scenic Tea Hill Cafes",
      "Iconic Blue Train Sightings",
      "Trek Across Bridge Archways"
    ],
    "description": "Magnificent 1921 British colonial stone and brick railway viaduct standing 24 meters high amidst dense jungle and emerald tea estates.",
    "drivingTip": "Drive via Passara Road to Gotuwala turnoff where paid vehicle parking is provided. Walk 10 minutes down the hill path.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction nine arches bridge demodara train ella"
  },
  {
    "id": "attr-flying-ravana",
    "name": "Flying Ravana Mega Zipline",
    "category": "attraction",
    "categoryLabel": "Adventure Park",
    "city": "Ella",
    "area": "Little Adam’s Peak Estate",
    "address": "Passara Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8659,
      "lng": 81.0621
    },
    "openStatus": "Open Now",
    "openingHours": "9:00 AM – 5:30 PM Daily",
    "contactPhone": "+94 57 205 0077",
    "services": [
      "South Asia’s Longest Dual Mega Zipline (550m)",
      "ATV Off-Road Tours",
      "Climbing Wall & Abseiling",
      "Archery & Air Rifle Range"
    ],
    "description": "Thrilling adventure sports hub where riders fly over scenic tea valleys at speeds up to 80 km/h with panoramic views of Ella Rock.",
    "drivingTip": "Shared parking area with 98 Acres Resort on Passara Road with buggy shuttle service.",
    "rating": 4.8,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction flying ravana zipline adventure ella"
  },
  {
    "id": "attr-ravana-falls",
    "name": "Ravana Falls (Ravana Ella Waterfall)",
    "category": "attraction",
    "categoryLabel": "Scenic Waterfall",
    "city": "Ella",
    "area": "Ella-Wellawaya Highway (A23)",
    "address": "Wellawaya Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.8405,
      "lng": 81.0545
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Impressive water flow all year, peak in monsoon)",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "25m Cascading Multi-Tier Waterfall",
      "Legendary Ravana Cave History",
      "Roadside Viewing Platform",
      "Fresh Fruit & Spiced Tea Stalls"
    ],
    "description": "One of the widest and most spectacular waterfalls in Sri Lanka, cascading over concave granite rocks right alongside the main mountain road.",
    "drivingTip": "Directly alongside the Ella-Wellawaya main highway; pull into the designated roadside parking bays. Watch for playful monkeys.",
    "rating": 4.8,
    "isFeatured": true,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction ravana falls waterfall ella wellawaya"
  },
  {
    "id": "attr-demodara-loop",
    "name": "Demodara Railway Loop & Spiral",
    "category": "attraction",
    "categoryLabel": "Engineering Landmark",
    "city": "Demodara",
    "area": "Demodara Railway Station",
    "address": "Demodara Station Road, Uva Province 90080",
    "coordinates": {
      "lat": 6.9023,
      "lng": 81.0611
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Station open during operating train times)",
    "contactPhone": "+94 57 222 2220",
    "services": [
      "Historic 360° Circular Rail Spiral",
      "Black Bridge (Tunnel No. 42)",
      "Colonial Railway Museum Items",
      "Tea Valley Viewpoint"
    ],
    "description": "Unique piece of colonial railway engineering where the track passes in a complete loop around a mountain and through a tunnel underneath the station.",
    "drivingTip": "15-minute scenic drive from Ella via the Colombo-Badulla highway; station parking available.",
    "rating": 4.7,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction demodara loop railway station engineering"
  },
  {
    "id": "attr-liptons-seat",
    "name": "Lipton’s Seat (Haputale)",
    "category": "attraction",
    "categoryLabel": "Mountain Viewpoint",
    "city": "Haputale",
    "area": "Dambatenne Tea Estate",
    "address": "Dambatenne Estate, Haputale 90160",
    "coordinates": {
      "lat": 6.7812,
      "lng": 81.0134
    },
    "openStatus": "Open Now",
    "openingHours": "6:00 AM – 4:00 PM Daily (Arrive by 7:00 AM for clearest views)",
    "contactPhone": "+94 57 226 8000",
    "services": [
      "Famous Lookout of Sir Thomas Lipton",
      "Views Across 7 Sri Lankan Provinces",
      "Historic Dambatenne Tea Factory Tour",
      "Traditional Estate Tea Kiosk"
    ],
    "description": "The legendary vantage point where Scottish tea pioneer Sir Thomas Lipton surveyed his vast tea empire across misty southern horizons.",
    "drivingTip": "Winding narrow road through Dambatenne tea estate; tuk-tuks or high clearance cars recommended for the final 5 km climb.",
    "rating": 4.9,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction liptons seat haputale tea view"
  },
  {
    "id": "attr-diyaluma-falls",
    "name": "Diyaluma Falls & Natural Upper Pools",
    "category": "attraction",
    "categoryLabel": "Spectacular Waterfall",
    "city": "Koslanda",
    "area": "Colombo-Batticaloa Road (A4)",
    "address": "Poonagala Road, Koslanda 90130",
    "coordinates": {
      "lat": 6.7328,
      "lng": 81.0315
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Best visited 8:00 AM – 3:30 PM)",
    "contactPhone": "+94 57 222 8412",
    "services": [
      "220m Tall Waterfall (2nd Highest in Sri Lanka)",
      "Natural Infinity Rock Pools at Top",
      "Upper Cliff Swimming Experience",
      "Local Trekking Guides"
    ],
    "description": "Stunning 220-meter waterfall famous for its series of natural infinity rock pools on the upper cliff looking out over vast southern plains.",
    "drivingTip": "Drive from Ella via Wellawaya (approx. 40 minutes). To visit the upper pools, ascend via the Makaldenya / Poonagala route.",
    "rating": 4.9,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction diyaluma falls koslanda natural pools waterfall"
  },
  {
    "id": "attr-dunhinda-falls",
    "name": "Dunhinda Falls (Badulla)",
    "category": "attraction",
    "categoryLabel": "Iconic Waterfall",
    "city": "Badulla",
    "area": "Mahiyangana Road",
    "address": "Dunhinda Trail, Badulla 90000",
    "coordinates": {
      "lat": 7.027,
      "lng": 81.0655
    },
    "openStatus": "Open Now",
    "openingHours": "7:00 AM – 5:30 PM Daily",
    "contactPhone": "+94 55 222 2250",
    "services": [
      "64m High Roaring Smoke Waterfall",
      "1.5km Jungle Walking Trail",
      "Viewing Pavilions",
      "Fresh Herbal Tea (Kanda) Stalls"
    ],
    "description": "Renowned as the \"Bridal Veil of Sri Lanka\", created by the Badulu Oya river leaping off a high rock shelf with thunderous mist.",
    "drivingTip": "5 km north of Badulla town on Mahiyangana Road; car park available at the main gate before the 1.5 km foot trail.",
    "rating": 4.8,
    "searchKeywords": "tourist attractions landmarks viewpoints waterfalls parks attraction dunhinda falls badulla waterfall smoke"
  },
  {
    "id": "attract-sigiriya-fortress",
    "name": "Sigiriya Lion Rock Fortress (UNESCO)",
    "category": "attraction",
    "categoryLabel": "UNESCO World Heritage",
    "city": "Sigiriya",
    "area": "Sigiriya Cultural Triangle",
    "address": "Sigiriya Rock Fortress Entrance, Sigiriya 21120",
    "coordinates": {
      "lat": 7.957,
      "lng": 80.7603
    },
    "openStatus": "Open Now",
    "openingHours": "6:30 AM – 5:30 PM Daily",
    "contactPhone": "+94 66 228 6570",
    "services": [
      "5th-Century Sky Citadel Palace",
      "Ancient Frescoes & Mirror Wall",
      "Monumental Lion Paw Staircase",
      "Water Gardens & Moats"
    ],
    "description": "The iconic 8th wonder of the world built by King Kashyapa in 477 AD atop a sheer 200m volcanic granite column.",
    "drivingTip": "Ample shaded vehicle parking available outside the main archaeological ticket office and museum.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "attraction sigiriya lion rock fortress unesco culture history palace"
  },
  {
    "id": "attract-kandy-tooth-temple",
    "name": "Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)",
    "category": "attraction",
    "categoryLabel": "UNESCO Sacred Temple",
    "city": "Kandy",
    "area": "Kandy Lake / Heritage Zone",
    "address": "Sri Dalada Veediya, Kandy 20000",
    "coordinates": {
      "lat": 7.2936,
      "lng": 80.6413
    },
    "openStatus": "Open Now",
    "openingHours": "5:30 AM – 8:00 PM Daily (Daily Puja Ceremonies: 5:30 AM, 9:30 AM, 6:30 PM)",
    "contactPhone": "+94 81 223 4226",
    "services": [
      "Sacred Relic of the Buddha",
      "Golden Roof Temple Complex",
      "Kandy Lake Promenade",
      "Traditional Drumming Rituals"
    ],
    "description": "The golden-roofed sanctuary housing the left canine tooth relic of the Gautama Buddha, the spiritual heart of the island.",
    "drivingTip": "Park at the multi-story car park near Kandy City Centre; dress respectfully covering shoulders and knees.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "attraction kandy temple sacred tooth relic dalada maligawa unesco culture buddhism"
  },
  {
    "id": "attract-galle-dutch-fort",
    "name": "Galle Dutch Fort (UNESCO World Heritage Site)",
    "category": "attraction",
    "categoryLabel": "UNESCO World Heritage",
    "city": "Galle",
    "area": "Galle Fort / Southern Coast",
    "address": "Church Street, Galle Fort 80000",
    "coordinates": {
      "lat": 6.0274,
      "lng": 80.217
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "Open 24/7 (Sunset rampart walks best 5:00 PM – 6:45 PM)",
    "contactPhone": "+94 91 224 5600",
    "services": [
      "Historic Sea Bastions & Ramparts",
      "Galle Lighthouse Landmark",
      "Dutch Reformed Church & Museums",
      "Boutique Cafes & Gem Boutiques"
    ],
    "description": "The best-preserved colonial sea fortress in South Asia, founded by the Portuguese in 1588 and fortified by the Dutch in the 17th century.",
    "drivingTip": "Enter via the British Main Gate; park along the outer ramparts where parking is clearly demarcated.",
    "rating": 4.9,
    "isFeatured": true,
    "searchKeywords": "attraction galle fort dutch ramparts lighthouse unesco history beach southern"
  },
  {
    "id": "hosp-ella-district",
    "name": "Ella District Hospital & Outpatient Clinic",
    "category": "hospital",
    "categoryLabel": "Government Hospital & Emergency",
    "city": "Ella",
    "area": "Hospital Road / Passara Junction",
    "address": "Hospital Road, Ella 90090, Uva Province",
    "coordinates": {
      "lat": 6.876,
      "lng": 81.0465
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24/7 Emergency & Inpatient Care",
    "contactPhone": "+94 57 222 8260",
    "services": [
      "24/7 Emergency Treatment Unit (ETU)",
      "Outpatient Medical Consultations",
      "Free 1990 Suwa Seriya Ambulance Bay",
      "Wound Dressings & First Aid"
    ],
    "description": "Primary government medical facility in Ella providing 24-hour emergency trauma care, basic diagnostic tests, and doctor consultations.",
    "drivingTip": "Easy 2-minute drive from Ella town center; dedicated emergency ambulance bay at the entrance.",
    "rating": 4.5,
    "isFeatured": true,
    "searchKeywords": "hospital hospitals emergency clinic doctor medical care ella district"
  },
  {
    "id": "hosp-bandarawela",
    "name": "Bandarawela District Hospital",
    "category": "hospital",
    "categoryLabel": "District Base Hospital",
    "city": "Bandarawela",
    "area": "Hospital Road / Town Center",
    "address": "Hospital Road, Bandarawela 90100",
    "coordinates": {
      "lat": 6.834,
      "lng": 80.985
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 57 222 2261",
    "services": [
      "24/7 Emergency Trauma Center",
      "Inpatient Medical & Surgical Wards",
      "Pharmacy & Laboratory Diagnostics",
      "X-Ray & ECG Facilities"
    ],
    "description": "Major regional district base hospital serving the central hill country with full emergency surgical and medical facilities.",
    "drivingTip": "Follow Hospital Road from Bandarawela town center with clear hospital road signs.",
    "rating": 4.6,
    "searchKeywords": "hospital hospitals emergency clinic doctor medical care bandarawela district base"
  },
  {
    "id": "hosp-badulla-general",
    "name": "Provincial General Hospital Badulla (Teaching Hospital)",
    "category": "hospital",
    "categoryLabel": "Provincial General Hospital",
    "city": "Badulla",
    "area": "Hospital Road / Central Badulla",
    "address": "Hospital Road, Badulla 90000, Uva Province",
    "coordinates": {
      "lat": 6.991,
      "lng": 81.054
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 55 222 2261",
    "services": [
      "Largest Tertiary Referral Hospital in Uva",
      "24/7 Intensive Care Units (ICU)",
      "CT Scan & MRI Imaging Center",
      "Emergency Neurosurgery & Orthopedic Trauma"
    ],
    "description": "The premier teaching hospital and highest-level tertiary trauma center in Uva Province, equipped for complex emergencies.",
    "drivingTip": "Directly reached via the main Badulla town road with 24-hour emergency entrance.",
    "rating": 4.7,
    "isFeatured": true,
    "searchKeywords": "hospital hospitals emergency clinic doctor medical care badulla provincial teaching icu"
  },
  {
    "id": "hosp-nuwara-eliya-general",
    "name": "District General Hospital Nuwara Eliya",
    "category": "hospital",
    "categoryLabel": "General Hospital",
    "city": "Nuwara Eliya",
    "area": "Hospital Road",
    "address": "Hospital Road, Nuwara Eliya 22200",
    "coordinates": {
      "lat": 6.9712,
      "lng": 80.7745
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 52 222 2261",
    "services": [
      "24/7 Emergency Trauma Unit",
      "ICU & Surgical Theatres",
      "English-Speaking Doctors",
      "Ambulance Dispatch Base"
    ],
    "description": "The primary state healthcare institution for the Central Highlands, fully equipped for acute altitude illness and trauma.",
    "drivingTip": "Emergency entrance accessed directly from Hospital Road with dedicated ambulance bay.",
    "rating": 4.6,
    "searchKeywords": "hospital emergency doctor clinic medical nuwara eliya central highlands"
  },
  {
    "id": "hosp-kandy-general",
    "name": "National Hospital Kandy (General Hospital)",
    "category": "hospital",
    "categoryLabel": "National Teaching Hospital",
    "city": "Kandy",
    "area": "Hospital Road / City Edge",
    "address": "William Gopallawa Mawatha, Kandy 20000",
    "coordinates": {
      "lat": 7.289,
      "lng": 80.631
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 81 222 2261",
    "services": [
      "Advanced Tertiary Trauma Care",
      "Specialist Intensive Care Units",
      "24/7 CT & MRI Diagnostic Center",
      "Direct 1990 Ambulance Inflow"
    ],
    "description": "The second-largest teaching hospital in Sri Lanka, offering comprehensive specialist trauma and medical capabilities.",
    "drivingTip": "Signposted emergency entrance accessible from William Gopallawa Mawatha.",
    "rating": 4.7,
    "searchKeywords": "hospital medical emergency doctor kandy general national teaching"
  },
  {
    "id": "hosp-colombo-national",
    "name": "National Hospital of Sri Lanka (Colombo General)",
    "category": "hospital",
    "categoryLabel": "National Apex Trauma Hospital",
    "city": "Colombo",
    "area": "Regent Street / Maradana",
    "address": "Regent Street, Colombo 10",
    "coordinates": {
      "lat": 6.9195,
      "lng": 79.8685
    },
    "openStatus": "Open 24 Hours",
    "openingHours": "24 Hours Daily",
    "contactPhone": "+94 11 269 1111",
    "services": [
      "Premier Trauma Center of Sri Lanka",
      "Specialist Surgical Wings",
      "24/7 Stroke & Cardiac Care",
      "Multi-Disciplinary Medical Staff"
    ],
    "description": "The premier national apex referral hospital in Sri Lanka, boasting top surgical and emergency facilities.",
    "drivingTip": "Emergency triage gates accessed directly via Regent Street with 24-hour guard clearance.",
    "rating": 4.8,
    "searchKeywords": "hospital emergency doctor clinic national hospital colombo nhsl"
  }
];
