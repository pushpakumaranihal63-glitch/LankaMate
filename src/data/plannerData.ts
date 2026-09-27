import { ItineraryDay, SavedItinerary } from '../types';

export interface PrebuiltTemplate {
  id: string;
  name: string;
  durationDays: number;
  badge: string;
  travelStyle: 'budget' | 'balanced' | 'luxury';
  pace: 'relaxed' | 'active';
  description: string;
  coverImage: string;
  destinations: string[];
  estimatedCostUsd: number;
  days: ItineraryDay[];
}

export const prebuiltItineraries: PrebuiltTemplate[] = [
  {
    id: 'classic-7-days',
    name: '7-Day Classic Sri Lanka Highlights',
    durationDays: 7,
    badge: 'Most Popular for 1st-Time Visitors',
    travelStyle: 'balanced',
    pace: 'active',
    description:
      'The quintessential first-timer circuit: Ancient Sigiriya Rock Fortress, the Royal Temple of the Tooth in Kandy, the world-famous blue train ride to Ella, leopard safari in Yala, and sunset ramparts of UNESCO Galle Fort.',
    coverImage: '/images/destinations/sigiriya.jpg',
    destinations: ['Colombo', 'Sigiriya & Dambulla', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle & Southern Coast'],
    estimatedCostUsd: 780,
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Colonial Coastal City Discovery',
        destination: 'Colombo',
        image: '/images/destinations/colombo.jpg',
        morning: 'Touchdown at Colombo Bandaranaike Airport (BIA). Meet your driver and check in to your Colombo oceanfront hotel.',
        afternoon: 'Explore historic Colombo Fort, Old Dutch Hospital precinct, and Gangaramaya Temple on Beira Lake.',
        evening: 'Sunset street food stroll on Galle Face Green tasting hot prawn isso vadai and authentic kottu roti.',
        transportInfo: 'Airport Express Highway (~45 minutes, 33 km).',
        stayRecommendation: 'Galle Face Hotel or Cinnamon Grand Colombo',
        mealHighlights: ['Fresh Thambili (King Coconut) on the roadside', 'Authentic Galle Face Green prawn isso vadai'],
      },
      {
        dayNumber: 2,
        title: 'Ancient Cave Temples & The 5th Century Lion Rock Fortress',
        destination: 'Sigiriya & Dambulla',
        image: '/images/destinations/sigiriya.jpg',
        morning: 'Ascend stone steps into the five painted cave sanctuaries of Dambulla Rock Cave Temple filled with 150+ Buddha statues.',
        afternoon: 'Check into your nature lodge near Sigiriya. Enjoy a traditional rice and curry lunch served on fresh banana leaves.',
        evening: 'Climb the iconic 200-meter monolith of Sigiriya Lion Rock Fortress at golden hour to explore King Kashyapa’s sky palace.',
        transportInfo: 'Private AC transfer from Colombo to Sigiriya (~3.5 hours, 150 km).',
        stayRecommendation: 'Heritance Kandalama or Aliya Resort Sigiriya',
        mealHighlights: ['Traditional village red rice and 5 curries buffet', 'Clay-pot baked fish curry with coconut sambol'],
      },
      {
        dayNumber: 3,
        title: 'Spices & The Royal Kingdom of Kandy',
        destination: 'Kandy',
        image: '/images/destinations/kandy.jpg',
        morning: 'Scenic drive south into the central hills with a stop at an organic Matale spice garden to learn about Ceylon cinnamon and cardamom.',
        afternoon: 'Stroll through the grand Peradeniya Royal Botanical Gardens featuring Avenue of Royal Palms and the Orchid House.',
        evening: 'Attend the sacred Thevava evening drumming ceremony at Sri Dalada Maligawa (Temple of the Tooth) on Kandy Lake.',
        transportInfo: 'Drive from Sigiriya to Kandy via Matale (approx 2.5 hours, 90 km).',
        stayRecommendation: 'Cinnamon Citadel Kandy or The Grand Kandyan',
        mealHighlights: ['Authentic Kandyan Chicken Curry with hot roast paan bread', 'Sweet coconut Treacle pancakes'],
      },
      {
        dayNumber: 4,
        title: 'Emerald Tea Country & Nuwara Eliya Highlands',
        destination: 'Nuwara Eliya',
        image: '/images/destinations/nuwara-eliya.jpg',
        morning: 'Wind upward into misty tea mountains, stopping at dramatic Ramboda Falls for photography.',
        afternoon: 'Guided Ceylon tea factory tour at Pedro Estate, followed by tea tasting and a stroll past the Victorian Post Office and Gregory Lake.',
        evening: 'Classic colonial High Tea on the manicured lawns of The Grand Hotel as cool mountain mist descends.',
        transportInfo: 'Scenic mountain highway from Kandy to Nuwara Eliya (~2.5 hours, 75 km).',
        stayRecommendation: 'The Grand Hotel Nuwara Eliya or Jetwing St. Andrew’s',
        mealHighlights: ['Fresh highland strawberry desserts', 'Grand Hotel Victorian High Tea'],
      },
      {
        dayNumber: 5,
        title: 'The Iconic Blue Train & Nine Arches Bridge',
        destination: 'Ella',
        image: '/images/destinations/ella.jpg',
        morning: 'Board the world-famous blue mountain train from Nanu Oya station to Ella, winding past deep cloud valleys and waterfalls.',
        afternoon: 'Walk through pine groves to Demodara Nine Arches Bridge to watch the afternoon train cross the colonial stone viaduct.',
        evening: 'Sunset hike on Little Adam’s Peak followed by dinner and live acoustic music at Cafe Chill in vibrant Ella town.',
        transportInfo: 'Scenic Mainline blue train journey (~2.5 hours of mountain panoramas).',
        stayRecommendation: '98 Acres Resort & Spa or Zion View Ella Green Retreat',
        mealHighlights: ['Hot roti rolls and fresh tea served from train baskets', 'Cafe Chill Banana Leaf Lamprais'],
      },
      {
        dayNumber: 6,
        title: 'Big Game Safari: Leopards & Elephants of Yala',
        destination: 'Yala',
        image: '/images/destinations/yala.jpg',
        morning: 'Descend the mountain pass past cascading Ravana Falls towards the southern dry zone.',
        afternoon: 'Check into your safari tented lodge and board an open-top 4x4 safari jeep with a certified wildlife ranger at 2:30 PM.',
        evening: 'Thrilling late afternoon game drive through Yala Block 1: track wild Sri Lankan leopards, Asian elephants, and sloth bears.',
        transportInfo: 'Scenic descent from Ella to Yala / Tissamaharama (~2.5 hours, 95 km).',
        stayRecommendation: 'Wild Coast Tented Lodge or Jetwing Yala',
        mealHighlights: ['Outdoor campfire BBQ under southern constellations', 'Spicy devilled chicken with fresh paratha'],
      },
      {
        dayNumber: 7,
        title: 'UNESCO Galle Fort & Farewell Sri Lanka',
        destination: 'Galle & Southern Coast',
        image: '/images/destinations/galle.jpg',
        morning: 'Drive westward along the palm-fringed southern coastline past Weligama Bay and traditional stilt fishermen.',
        afternoon: 'Stroll along the 400-year-old ocean ramparts of Galle Dutch Fort, visiting Galle Lighthouse and Pedlar Street boutiques.',
        evening: 'Sunset views from Flag Rock Bastion before cruising up the modern Southern Expressway (E01) directly to BIA Airport.',
        transportInfo: 'Southern Expressway E01 from Galle to Colombo BIA Airport (1.5 - 2 hours, 140 km).',
        stayRecommendation: 'Departure Flight or Cinnamon Grand Colombo',
        mealHighlights: ['Gelato at Pedlar’s Inn Galle Fort', 'Farewell seafood feast at Ministry of Crab Colombo'],
      },
    ],
  },
  {
    id: 'deep-nature-10-days',
    name: '10-Day Island Loop: Culture, Mist & Coast',
    durationDays: 10,
    badge: 'Comprehensive Island Adventure',
    travelStyle: 'balanced',
    pace: 'relaxed',
    description:
      'The ultimate 10-day comprehensive circuit covering Colombo, Anuradhapura ancient sacred city, Sigiriya, Kandy, Nuwara Eliya tea hills, Ella, Yala safari, Mirissa beach, and Galle Fort.',
    coverImage: '/images/destinations/ella.jpg',
    destinations: ['Colombo', 'Anuradhapura', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle'],
    estimatedCostUsd: 1150,
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Colombo Oceanfront Sunset',
        destination: 'Colombo',
        image: '/images/destinations/colombo.jpg',
        morning: 'Arrival at BIA Airport. Fast-track highway transfer into Colombo city center.',
        afternoon: 'Visit Gangaramaya Temple on Beira Lake and the candy-striped Red Mosque (Jami Ul-Alfar) in Pettah.',
        evening: 'Sunset promenade on Galle Face Green, tasting crispy prawn patties (Isso Vadai).',
        transportInfo: 'Airport expressway taxi (35 mins).',
        stayRecommendation: 'Galle Face Hotel Colombo',
        mealHighlights: ['Isso Vadai prawn patties', 'Upali’s traditional village curry feast'],
      },
      {
        dayNumber: 2,
        title: 'Sacred Ancient Capital of Anuradhapura',
        destination: 'Anuradhapura',
        image: '/images/destinations/anuradhapura.jpg',
        morning: 'Morning train or drive north to Anuradhapura. Check in and rent bicycles.',
        afternoon: 'Venerate the sacred 2,300-year-old Jaya Sri Maha Bodhi tree and explore the soaring white dome of Ruwanwelisaya.',
        evening: 'Sunset climb at Mihintale, the cliffside monastic cradle of Sri Lankan Buddhism.',
        transportInfo: 'Drive or train Colombo to Anuradhapura (3.5 - 4 hours).',
        stayRecommendation: 'Heritage Hotel Anuradhapura',
        mealHighlights: ['Thambili coconut', 'Herbal kola kenda morning porridge'],
      },
      {
        dayNumber: 3,
        title: 'The Fortress of Sigiriya & Water Gardens',
        destination: 'Sigiriya',
        image: '/images/destinations/sigiriya.jpg',
        morning: 'Scenic road drive south into the lush central plains of Sigiriya.',
        afternoon: 'Ascend the 1,200 steps to the summit palace of Sigiriya Rock Fortress.',
        evening: 'Village catamaran lake boat ride with views of Sigiriya reflected in the water.',
        transportInfo: 'Drive from Anuradhapura to Sigiriya (1.5 hours).',
        stayRecommendation: 'Heritance Kandalama',
        mealHighlights: ['Traditional village curries in clay pots', 'Polos (young jackfruit curry)'],
      },
      {
        dayNumber: 4,
        title: 'Dambulla Golden Caves to Royal Kandy',
        destination: 'Kandy',
        image: '/images/destinations/kandy.jpg',
        morning: 'Explore Dambulla Rock Cave Temples dating back to the 1st century BC.',
        afternoon: 'Drive into Kandy via Matale spice gardens. Check in with views of Kandy Lake.',
        evening: 'Witness the sacred drumming rituals at the Temple of the Sacred Tooth Relic.',
        transportInfo: 'Drive Sigiriya to Kandy (2.5 hours).',
        stayRecommendation: 'The Grand Kandyan Hotel',
        mealHighlights: ['Kandyan spiced mutton roast', 'Warm curd with kithul treacle'],
      },
      {
        dayNumber: 5,
        title: 'Misty Highlands of Nuwara Eliya',
        destination: 'Nuwara Eliya',
        image: '/images/destinations/nuwara-eliya.jpg',
        morning: 'Scenic hill climb past roaring Ramboda Falls and terraced tea hills.',
        afternoon: 'Pedro Tea Estate processing tour and tasting. Send a postcard from the Victorian Post Office.',
        evening: 'Traditional colonial High Tea on the manicured lawns of The Grand Hotel.',
        transportInfo: 'Drive Kandy to Nuwara Eliya (2.5 hours).',
        stayRecommendation: 'The Grand Hotel Nuwara Eliya',
        mealHighlights: ['Victorian High Tea with warm scones', 'Fresh highland strawberries with clotted cream'],
      },
      {
        dayNumber: 6,
        title: 'Horton Plains World’s End & Blue Train to Ella',
        destination: 'Ella',
        image: '/images/destinations/ella.jpg',
        morning: '5:30 AM departure for Horton Plains 9km nature trek to Baker’s Falls & the 880m World’s End cliff drop.',
        afternoon: 'Board the scenic blue train at Nanu Oya station for the 2.5-hour mountain descent to Ella.',
        evening: 'Walk down to Nine Arches Bridge as the evening train rattles across.',
        transportInfo: 'Train Nanu Oya to Ella (2.5 hours).',
        stayRecommendation: '98 Acres Resort & Spa',
        mealHighlights: ['Fresh Ceylon black tea', 'Cheese Kottu at Cafe Chill'],
      },
      {
        dayNumber: 7,
        title: 'Little Adam’s Peak & Yala Leopard Safari',
        destination: 'Yala',
        image: '/images/destinations/yala.jpg',
        morning: 'Sunrise hike on Little Adam’s Peak. Drive down the mountain pass via Ravana Falls.',
        afternoon: 'Arrive in the southern coastal scrub of Yala. Board private 4x4 open-top safari jeep at 2:30 PM.',
        evening: 'Track leopards, wild Asian elephants, sloth bears, and crocodiles in Yala National Park.',
        transportInfo: 'Drive Ella to Yala (2.5 hours).',
        stayRecommendation: 'Jetwing Yala',
        mealHighlights: ['Bush dinner under the stars', 'Devilled seafood with naan'],
      },
      {
        dayNumber: 8,
        title: 'Mirissa Palm Bays & Ocean Whales',
        destination: 'Mirissa',
        image: '/images/destinations/mirissa.jpg',
        morning: 'Morning ocean safari from Mirissa Harbour to encounter Blue Whales and spinner dolphins.',
        afternoon: 'Relax on Mirissa’s golden crescent beach or swim with green sea turtles at Polhena.',
        evening: 'Sunset drinks at Coconut Tree Hill headland, followed by beachside grilled fish.',
        transportInfo: 'Drive Yala to Mirissa (2 hours).',
        stayRecommendation: 'Triple O Six Mirissa',
        mealHighlights: ['Grilled red snapper with lime butter', 'Fresh passionfruit mojito'],
      },
      {
        dayNumber: 9,
        title: 'Galle Dutch Fort UNESCO Living Heritage',
        destination: 'Galle',
        image: '/images/destinations/galle.jpg',
        morning: 'Short drive up the coast to historic Galle Fort. Check into a Dutch colonial mansion villa.',
        afternoon: 'Wander cobblestone lanes, artisan jewelry boutiques, and the Maritime Museum.',
        evening: 'Sunset walk along Flag Rock ramparts watching daredevil cliff divers plunge into the sea.',
        transportInfo: 'Coastal drive Mirissa to Galle (40 mins).',
        stayRecommendation: 'Jetwing Lighthouse or Fort Bazaar Galle',
        mealHighlights: ['A Minute by Tuk Tuk seafood pasta', 'Artisan Ceylon cinnamon ice cream'],
      },
      {
        dayNumber: 10,
        title: 'Coastal Farewell & Airport Expressway',
        destination: 'Colombo / Airport',
        image: '/images/destinations/colombo.jpg',
        morning: 'Morning coffee on the fort ramparts overlooking the Indian Ocean.',
        afternoon: 'Last minute souvenir shopping for Ceylon cinnamon, tea, and handmade sarongs.',
        evening: 'Smooth 1.5-hour highway drive up Southern Expressway (E01) directly to BIA Airport for departure.',
        transportInfo: 'Southern Expressway directly to Airport (1.5 - 2 hours).',
        stayRecommendation: 'Departure Flight',
        mealHighlights: ['Farewell Egg Hoppers with Seeni Sambol', 'Pure Ceylon Silver Tips Tea'],
      },
    ],
  },
];

export function generateCustomItinerary(params: {
  daysCount: number;
  selectedDestinations: string[];
  travelStyle: 'budget' | 'balanced' | 'luxury';
  pace: 'relaxed' | 'active';
  activities: string[];
}): SavedItinerary {
  const { daysCount, selectedDestinations, travelStyle, pace, activities } = params;

  // Calculate realistic cost estimate per day
  const dailyCostPerPerson = travelStyle === 'budget' ? 45 : travelStyle === 'balanced' ? 110 : 280;
  const estimatedTotalUsd = dailyCostPerPerson * daysCount;

  // Build day plans dynamically based on selected destinations and days
  const days: ItineraryDay[] = [];
  const default7Days = [
    'Colombo',
    'Sigiriya & Dambulla',
    'Kandy',
    'Nuwara Eliya',
    'Ella',
    'Yala',
    'Galle & Southern Coast',
  ];
  const destPool =
    daysCount === 7 && (!selectedDestinations || selectedDestinations.length === 0 || selectedDestinations.length < 7)
      ? default7Days
      : selectedDestinations.length > 0
      ? selectedDestinations
      : default7Days;

  for (let d = 1; d <= daysCount; d++) {
    const currentDest = destPool[(d - 1) % destPool.length];
    const isFirst = d === 1;
    const isLast = d === daysCount;

    let title = `${currentDest} Exploration & Cultural Sights`;
    let morning = `Morning excursion in ${currentDest}: explore iconic viewpoints and historical heritage sites.`;
    let afternoon = `Afternoon leisure and scenic walk through local markets and handicraft shops.`;
    let evening = `Sunset relaxation, scenic vistas, and dinner savoring local culinary specialties.`;
    let transport = `Private local transfer or scenic train segment (~1.5 - 2.5 hours).`;
    let stay = `Recommended 4-star boutique lodge or heritage resort in ${currentDest}.`;
    let image = '/images/destinations/sigiriya.jpg';

    if (currentDest.toLowerCase().includes('sigiriya')) {
      image = '/images/destinations/sigiriya.jpg';
      title = 'Sigiriya Sky Palace & Ancient Rock Fortress';
      morning = 'Sunrise climb of Sigiriya Lion Rock Fortress to view the 5th-century frescoes and summit palace ruins.';
      afternoon = 'Catamaran lake safari through water lilies with views of Sigiriya rock from the water.';
      evening = 'Sunset climb on Pidurangala Rock for postcard panoramas of the central plains.';
      transport = 'Scenic drive across cultural plains (~3.5 hours from Colombo).';
      stay = 'Heritance Kandalama or Aliya Resort Sigiriya';
    } else if (currentDest.toLowerCase().includes('ella')) {
      image = '/images/destinations/ella.jpg';
      title = 'Misty Ella Hills & Nine Arches Railway Bridge';
      morning = 'Sunrise hike to Little Adam’s Peak for panoramic views through the Ella Gap mountain pass.';
      afternoon = 'Walk the railway line to Nine Arches Bridge to photograph the iconic blue train crossing the colonial viaduct.';
      evening = 'Unwind with organic Ceylon tea and dinner at Cafe Chill on Ella’s lively main street.';
      transport = 'Iconic Blue Train ride through tea estates (~6.5 hrs from Kandy or 2.5 hrs from Nanu Oya).';
      stay = '98 Acres Resort & Spa or Zion View Ella';
    } else if (currentDest.toLowerCase().includes('kandy')) {
      image = '/images/destinations/kandy.jpg';
      title = 'Sacred Royal Capital & Peradeniya Gardens';
      morning = 'Visit the sacred Temple of the Tooth Relic (Sri Dalada Maligawa) during morning prayer offerings.';
      afternoon = 'Walk under the giant bamboo groves and orchid pavilions at Peradeniya Royal Botanical Gardens.';
      evening = 'Peaceful lakeside walk around Kandy Lake and authentic Kandyan cultural dance performance.';
      transport = 'Scenic hill highway or Intercity AC train (~2.5 hours).';
      stay = 'The Grand Kandyan or Cinnamon Citadel Kandy';
    } else if (currentDest.toLowerCase().includes('galle')) {
      image = '/images/destinations/galle.jpg';
      title = 'UNESCO Galle Dutch Fort & Ocean Ramparts';
      morning = 'Explore the coral-stone bastions, Dutch Reformed Church, and Galle Lighthouse.';
      afternoon = 'Boutique shopping for Ceylon spices, tea, and artisan crafts in Pedlar Street.';
      evening = 'Sunset walk along Flag Rock ramparts watching cliff divers leap into the turquoise surf.';
      transport = 'Southern Expressway E01 fast highway (~1.5 hours from Colombo).';
      stay = 'Jetwing Lighthouse or Fort Bazaar Galle';
    } else if (currentDest.toLowerCase().includes('mirissa')) {
      image = '/images/destinations/mirissa.jpg';
      title = 'Mirissa Blue Whales & Coconut Tree Hill';
      morning = 'Early morning ocean safari to spot magnificent wild Blue Whales and playful spinner dolphins.';
      afternoon = 'Beachside coconut water and beginner surf lesson on Weligama beach.';
      evening = 'Sunset photo session atop Coconut Tree Hill headland followed by candlelight grilled seafood on the sand.';
      transport = 'Coastal highway transfer (~45 mins from Galle).';
      stay = 'Triple O Six Mirissa or Cape Weligama';
    } else if (currentDest.toLowerCase().includes('yala')) {
      image = '/images/destinations/yala.jpg';
      title = 'Yala Leopard & Elephant Wildlife Safari';
      morning = 'Scenic drive through dry-zone scrub forests to Yala safari gateway.';
      afternoon = '2:30 PM open-top 4x4 safari jeep drive tracking leopards, sloth bears, and Asian elephants.';
      evening = 'Bush dinner around a crackling campfire under clear starlit wilderness skies.';
      transport = 'Private 4x4 safari jeep with experienced wildlife tracker.';
      stay = 'Wild Coast Tented Lodge or Jetwing Yala';
    } else if (currentDest.toLowerCase().includes('nuwara')) {
      image = '/images/destinations/nuwara-eliya.jpg';
      title = 'Nuwara Eliya Tea Hills & Little England';
      morning = 'Guided tour of Pedro Tea Estate: observe tea leaf withering, rolling, and single-estate tea tasting.';
      afternoon = 'Postcard sending from the 1894 Victorian Post Office and stroll around Gregory Lake.';
      evening = 'Afternoon Victorian High Tea and roaring fireplace dinner at The Grand Hotel.';
      transport = 'Highland mountain road (~2.5 hours from Kandy).';
      stay = 'The Grand Hotel Nuwara Eliya';
    } else if (currentDest.toLowerCase().includes('jaffna')) {
      image = '/images/destinations/jaffna.jpg';
      title = 'Northern Heritage & Nallur Kandaswamy Kovil';
      morning = 'Experience the sacred Hindu puja rituals at the golden Nallur Kandaswamy Kovil.';
      afternoon = 'Explore seaside Jaffna Fort and take a public ferry to holy Nainativu Island.';
      evening = 'Feast on legendary spicy Jaffna Crab Curry followed by fruit ice cream at Rio Ice Cream.';
      transport = 'Yal Devi Express train from Colombo or domestic flight.';
      stay = 'Jetwing Jaffna';
    } else if (currentDest.toLowerCase().includes('colombo')) {
      image = '/images/destinations/colombo.jpg';
      title = 'Colombo Cityscape & Oceanfront Heritage';
      morning = 'Explore Colombo Fort heritage buildings and Gangaramaya Temple on Beira Lake.';
      afternoon = 'Shopping at Pettah Floating Market and Old Dutch Hospital precinct.';
      evening = 'Sunset street food feast on Galle Face Green tasting hot isso vadai and kottu.';
      transport = 'Expressway transfer or airport highway (~45 mins).';
      stay = 'Galle Face Hotel Colombo or Cinnamon Grand';
    } else if (currentDest.toLowerCase().includes('anuradhapura')) {
      image = '/images/destinations/anuradhapura.jpg';
      title = 'Sacred Monastic Ruins of Anuradhapura';
      morning = 'Venerate the sacred Jaya Sri Maha Bodhi tree and visit Ruwanwelisaya stupa.';
      afternoon = 'Cycle through ancient monastic courtyards, Twin Ponds (Kuttam Pokuna), and Jetavanaramaya.';
      evening = 'Sunset reflection across the serene waters of Nuwara Wewa reservoir.';
      transport = 'Scenic northern railway or A9 highway.';
      stay = 'Heritage Hotel Anuradhapura';
    }

    if (isFirst) {
      title = `Arrival in Sri Lanka & Journey to ${currentDest}`;
      morning = `Touchdown at Bandaranaike International Airport (BIA). Meet your representative and exchange currency / get a Dialog tourist eSIM.`;
    } else if (isLast) {
      title = `Farewell Sri Lanka & Airport Departure`;
      evening = `Transfer along the modern expressway to Colombo BIA Airport for your scheduled departure flight.`;
    }

    days.push({
      dayNumber: d,
      title,
      destination: currentDest,
      image,
      morning,
      afternoon,
      evening,
      transportInfo: transport,
      stayRecommendation: stay,
      mealHighlights: ['Authentic local breakfast with fresh fruit & Ceylon tea', 'Regional culinary specialty dinner'],
    });
  }

  return {
    id: `custom-plan-${Date.now()}`,
    name: `${daysCount}-Day Personalized Sri Lanka ${pace === 'relaxed' ? 'Relaxed' : 'Action'} Tour`,
    daysCount,
    travelStyle,
    pace,
    destinations: destPool,
    days,
    createdAt: new Date().toLocaleDateString(),
    estimatedTotalUsd,
  };
}
