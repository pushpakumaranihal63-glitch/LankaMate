import { TransportGuide } from '../types';

export const transportData: TransportGuide[] = [
  {
    id: 'scenic-train',
    title: 'Sri Lanka Railways (Scenic Train Network)',
    type: 'train',
    tagline: 'World’s most iconic scenic railway journey through tea-clad mountains',
    image: '/images/transport/sri-lanka-scenic-train.jpg',
    description:
      'Sri Lanka’s railway system offers two unforgettable journeys: the legendary Main Line hill country route from Kandy to Ella (traversing viaducts, pine forests, and misty tea plantations on the famous blue train), and the scenic Coastal Line running right along the edge of the crashing Indian Ocean from Colombo Fort down to Galle and Matara.',
    pricingEstimate: '2nd Class Reserved: ~3,000 - 4,500 LKR ($10 - $15 USD); Unreserved 3rd Class: ~400 LKR ($1.30 USD)',
    bookingMethod:
      'Book online via the official Sri Lanka Railways portal (seatreservation.railway.gov.lk) exactly 30 days in advance at 10:00 AM Sri Lankan time, or purchase unreserved tickets at the station 1 hour prior to departure.',
    touristTips: [
      'For the Kandy to Ella route, sit on the RIGHT side of the train departing Kandy for the grandest valley vistas.',
      'Second Class Reserved is preferred by photographers over 1st class because windows and doors can be opened for unobstructed photography.',
      'Always hold on securely if leaning out of train doorways for photos!',
      'Pack snacks, fresh fruit, and water as onboard pantry cars have limited stock.',
    ],
    pros: [
      'Unmatched panoramic views of tea hills, waterfalls, and colonial viaducts',
      'Extremely affordable and environmentally sustainable',
      'Relaxed, cultural experience mingling with friendly locals and vendors',
    ],
    cons: [
      'Reserved seats sell out within minutes during peak season (Dec-Feb & July-Aug)',
      'Trains can occasionally experience 30-60 minute delays',
    ],
    popularRoutes: [
      { from: 'Kandy', to: 'Ella', duration: '6.5 - 7 Hours', approxCostLkr: '3,500 - 5,000 LKR (Reserved)' },
      { from: 'Colombo Fort', to: 'Galle', duration: '2 - 2.5 Hours', approxCostLkr: '1,500 - 2,500 LKR (Express)' },
      { from: 'Colombo Fort', to: 'Kandy', duration: '2.5 - 3 Hours', approxCostLkr: '2,000 - 3,500 LKR (Intercity)' },
      { from: 'Colombo Fort', to: 'Jaffna (Yal Devi)', duration: '6 - 6.5 Hours', approxCostLkr: '4,000 - 6,000 LKR (AC Intercity)' },
    ],
  },
  {
    id: 'tuktuk-three-wheeler',
    title: 'Tuk-Tuk (Three-Wheeler Auto Rickshaw)',
    type: 'tuktuk',
    tagline: 'The vibrant, nimble pulse of Sri Lankan town and village transit',
    image: '/images/transport/sri-lanka-tuktuk.jpg',
    description:
      'The ubiquitous three-wheeled motorized rickshaw is the lifeblood of short-distance island travel. Perfect for zipping through narrow coastal alleys, navigating busy street markets, or winding up steep tea hills in Ella. You can also rent a self-drive tuk-tuk with an international driving endorsement for the ultimate road adventure!',
    pricingEstimate: 'Metered rate: ~100 LKR base flag-fall + 90 - 120 LKR per kilometer. Full day hire: ~6,000 - 9,000 LKR ($20 - $30 USD)',
    bookingMethod:
      'In Colombo, Kandy, and Galle: use the local "PickMe" app (Sri Lanka’s Grab/Uber) or Uber for guaranteed metered rates. On rural beaches and hill towns: hail on the street and agree on a firm price BEFORE entering.',
    touristTips: [
      'Always look for the word "METER TAXI" on the roof rack. If there is no meter, agree on the exact price before getting in.',
      'Download the "PickMe" app as soon as you land at the airport — it works seamlessly with cash or card.',
      'Carry small denomination rupee notes (100, 500 LKR); drivers rarely have change for 5,000 LKR bills.',
      'You can hire a friendly driver for a full day of sightseeing around Galle Fort or Sigiriya for around $25 USD.',
    ],
    pros: [
      'Accessible everywhere, even on remote dirt tracks and jungle lanes',
      'Open-air breeze and 360-degree viewing angle of island life',
      'Drivers are often enthusiastic informal local tour guides',
    ],
    cons: [
      'Not suitable for high-speed highway travel or journeys over 40 km',
      'Unmetered beach tuk-tuks often attempt to overcharge foreign tourists',
    ],
    popularRoutes: [
      { from: 'Ella Town', to: 'Nine Arches Bridge', duration: '12 Mins', approxCostLkr: '800 - 1,200 LKR' },
      { from: 'Galle Fort', to: 'Unawatuna Beach', duration: '15 Mins', approxCostLkr: '900 - 1,500 LKR' },
      { from: 'Mirissa Beach', to: 'Coconut Tree Hill', duration: '8 Mins', approxCostLkr: '600 - 800 LKR' },
    ],
  },
  {
    id: 'highway-express-bus',
    title: 'Highway Express & Intercity AC Coaches',
    type: 'bus',
    tagline: 'Fast, air-conditioned point-to-point transit across modern expressways',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    description:
      'Sri Lanka has two very different bus systems: standard red/blue public buses (which drive at breakneck speeds with loud music and open doors) and modern luxury Highway Express Buses (EX-bus) that utilize the Southern Expressway (E01) and Central Expressway (E04) with air conditioning and reserved seating.',
    pricingEstimate: 'Expressway AC bus: 800 - 1,800 LKR ($2.50 - $6 USD) depending on distance',
    bookingMethod:
      'Board at major expressway bus terminals (Makumbura Multimodal Center in Kottawa, Kadawatha, Galle Central Bus Stand, Matara Central). Tickets purchased at terminal counters.',
    touristTips: [
      'Avoid standard non-AC public buses for long journeys if traveling with bulky luggage.',
      'The Makumbura Multimodal Center (Kottawa) in Colombo is the main hub connecting directly to Galle, Matara, and Hambantota via expressway in under 2 hours.',
      'Expressway buses are punctual, strictly speed-regulated, clean, and comfortable.',
    ],
    pros: [
      'The fastest road transport between Colombo, Galle, and the southern coast',
      'Very inexpensive compared to private taxis',
      'High departure frequency (every 20-30 minutes during peak hours)',
    ],
    cons: [
      'Luggage space in the undercarriage can fill up during holiday weekends',
      'Terminals are slightly outside the Colombo commercial center',
    ],
    popularRoutes: [
      { from: 'Colombo (Makumbura)', to: 'Galle Central', duration: '1 Hour 20 Mins', approxCostLkr: '950 LKR' },
      { from: 'Colombo (Kadawatha)', to: 'Kandy / Kurunegala', duration: '2 Hours', approxCostLkr: '1,100 LKR' },
      { from: 'Galle', to: 'Matara', duration: '40 Mins', approxCostLkr: '400 LKR' },
    ],
  },
  {
    id: 'private-chauffeur-car',
    title: 'Private Chauffeur Guide & Rental Cars',
    type: 'taxi',
    tagline: 'The most comfortable, flexible way to tour the whole island',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    description:
      'Hiring a private English-speaking chauffeur guide with a modern air-conditioned sedan or micro-van is the gold standard for stress-free Sri Lanka travel. Chauffeur guides certified by the Sri Lanka Tourism Development Authority (SLTDA) act as drivers, cultural interpreters, safari coordinators, and luggage handlers throughout your round-trip.',
    pricingEstimate: '$65 - $95 USD per day (~20,000 - 30,000 LKR), typically including driver meals, accommodation allowance, vehicle insurance, and fuel.',
    bookingMethod:
      'Pre-book through reputable registered travel operators or request verified SLTDA Chauffeur Guides through LankaMate.',
    touristTips: [
      'Most mid-range to luxury hotels in Sri Lanka provide free or heavily discounted quarters and meals for your driver.',
      'Confirm upfront whether road tolls (expressway tickets) and parking fees are included in the daily rate.',
      'Driving yourself in Sri Lanka is NOT recommended for first-timers due to chaotic traffic and sudden animal crossings.',
      'Tip your driver at the end of the trip: typical etiquette is 3,000 - 5,000 LKR ($10 - $16 USD) per day for excellent service.',
    ],
    pros: [
      'Maximum flexibility: stop anywhere for king coconut stalls, temple visits, or wildlife sightings',
      'Cold air conditioning, child seats, and ample luggage capacity',
      'Local knowledge of hidden gems, shortcut routes, and the cleanest rest stops',
    ],
    cons: [
      'Higher cost than trains or public buses',
      'Requires planning your general itinerary in advance',
    ],
    popularRoutes: [
      { from: 'Colombo BIA Airport', to: 'Sigiriya', duration: '3.5 Hours', approxCostLkr: '24,000 - 28,000 LKR ($75 - $90 USD)' },
      { from: 'Colombo BIA Airport', to: 'Galle Fort', duration: '2 Hours', approxCostLkr: '18,000 - 22,000 LKR ($60 - $70 USD)' },
      { from: 'Kandy', to: 'Nuwara Eliya', duration: '2.5 Hours', approxCostLkr: '15,000 - 18,000 LKR ($50 - $60 USD)' },
      { from: 'Ella', to: 'Yala Safari Gate', duration: '2.5 Hours', approxCostLkr: '16,000 - 20,000 LKR ($55 - $65 USD)' },
    ],
  },
];

export const cityDistanceMatrix = [
  { from: 'Colombo', to: 'Sigiriya', distanceKm: 175, trainHours: 4.5, carHours: 3.5, bestWay: 'Private car or train to Habarana' },
  { from: 'Colombo', to: 'Kandy', distanceKm: 115, trainHours: 2.5, carHours: 2.5, bestWay: 'Scenic Intercity Train' },
  { from: 'Colombo', to: 'Galle', distanceKm: 125, trainHours: 2.0, carHours: 1.5, bestWay: 'Southern Expressway E01' },
  { from: 'Kandy', to: 'Ella', distanceKm: 140, trainHours: 6.5, carHours: 4.0, bestWay: 'Scenic Blue Train (Must-do!)' },
  { from: 'Ella', to: 'Yala', distanceKm: 95, trainHours: null, carHours: 2.2, bestWay: 'Private taxi / Chauffeur' },
  { from: 'Yala', to: 'Mirissa', distanceKm: 120, trainHours: null, carHours: 2.0, bestWay: 'Southern Expressway E01' },
  { from: 'Colombo', to: 'Jaffna', distanceKm: 395, trainHours: 6.0, carHours: 7.5, bestWay: 'Yal Devi Express Train' },
  { from: 'Sigiriya', to: 'Trincomalee', distanceKm: 98, trainHours: null, carHours: 2.0, bestWay: 'Road transfer' },
];
