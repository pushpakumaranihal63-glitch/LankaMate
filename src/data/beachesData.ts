export interface BeachItem {
  id: string;
  name: string;
  localName: string;
  location: string;
  region: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bestSeason: string;
  vibe: string;
  highlights: string[];
  destinationId?: string;
}

export const beachesData: BeachItem[] = [
  {
    id: 'beach-mirissa',
    name: 'Mirissa Beach',
    localName: 'මිරිස්ස වෙරළ (Mirissa Coast)',
    location: 'Mirissa, Southern Province',
    region: 'Southern Coast',
    description:
      'A postcard-perfect crescent bay celebrated for Coconut Tree Hill, playful spinner dolphins, blue whale ocean safaris, and candlelit seafood tables set right on golden sands at sunset.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/View_from_Coconut_Tree_Hill_to_Mirissa_in_March.jpg/1280px-View_from_Coconut_Tree_Hill_to_Mirissa_in_March.jpg',
    coordinates: {
      lat: 5.9482,
      lng: 80.4572,
    },
    bestSeason: 'November to April (Calm waters & peak whale watching)',
    vibe: 'Coconut Groves & Marine Safaris',
    highlights: [
      'Iconic Coconut Tree Hill promontory viewpoint',
      'Morning boat safaris for Blue Whales and spinner dolphins',
      'Parrot Rock tidal island with panoramic bay views',
      'Freshly caught grilled fish by the surf after twilight',
    ],
    destinationId: 'mirissa',
  },
  {
    id: 'beach-unawatuna',
    name: 'Unawatuna Beach',
    localName: 'උනවටුන වෙරළ (Unawatuna Bay)',
    location: 'Unawatuna, Galle, Southern Province',
    region: 'Southern Coast',
    description:
      'A sparkling horseshoe bay sheltered by coral reefs, offering calm turquoise swimming waters, beachfront cafes with coconut tree swings, and the cliffside Japanese Peace Pagoda.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Unawatuna_beach_sri_lanka.jpg/1280px-Unawatuna_beach_sri_lanka.jpg',
    coordinates: {
      lat: 6.0108,
      lng: 80.2486,
    },
    bestSeason: 'November to April (Crystal-clear swimming & calm seas)',
    vibe: 'Sheltered Swimming & Seaside Cafes',
    highlights: [
      'Gentle, safe coral-protected swimming waters',
      'Short trek to scenic Jungle Beach & Rumassala sanctuary',
      'Sunset views from the Japanese Peace Pagoda',
      'Only 10 minutes from historic UNESCO Galle Dutch Fort',
    ],
    destinationId: 'galle',
  },
  {
    id: 'beach-bentota',
    name: 'Bentota Beach',
    localName: 'බෙන්තොට වෙරළ (Bentota Sandspit)',
    location: 'Bentota, Southern Province',
    region: 'Southwest Coast',
    description:
      'A broad golden sand peninsula bordered by the Indian Ocean on one side and the tranquil Bentota River on the other, hailed as the island’s capital for water sports and luxury retreats.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 6.4255,
      lng: 79.9984,
    },
    bestSeason: 'November to April (Sunny days & mirror-flat lagoons)',
    vibe: 'Water Sports & River Mangroves',
    highlights: [
      'Jet skiing, wakeboarding, and windsurfing on calm river waters',
      'Madu Ganga boat safari through natural mangrove tunnels',
      'Architectural visits to Geoffrey Bawa’s Lunuganga country estate',
      'Kosgoda sea turtle conservation project',
    ],
    destinationId: 'bentota',
  },
  {
    id: 'beach-weligama',
    name: 'Weligama Beach',
    localName: 'වැලිගම වෙරළ (Sandy Bay Village)',
    location: 'Weligama, Matara, Southern Province',
    region: 'Southern Coast',
    description:
      'A broad, sweeping sandy bay with forgiving, rolling beach breaks that make it Sri Lanka’s premier surf-training destination, lined with colorful outrigger catamarans and stilt fishermen.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 5.9734,
      lng: 80.4287,
    },
    bestSeason: 'October to April (Clean beginner-friendly waves)',
    vibe: 'Surf Camps & Stilt Fishermen',
    highlights: [
      'Ideal gentle sand-bottom breaks for beginners and longboarders',
      'Traditional stilt fishermen casting lines at sunrise and dusk',
      'Offshore private islet of Taprobane Island',
      'Surfboard rentals and beachside smoothie shacks',
    ],
  },
  {
    id: 'beach-tangalle',
    name: 'Tangalle Beach',
    localName: 'තංගල්ල වෙරළ (Tangalle Coast)',
    location: 'Tangalle, Southern Province',
    region: 'Deep South Coast',
    description:
      'Vast stretches of untamed golden sands, secret rocky coves like Goyambokka, turquoise ocean swells, and Rekawa Beach where giant marine turtles arrive under the moonlight to nest.',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 6.0243,
      lng: 80.7941,
    },
    bestSeason: 'November to April (Dry tropical warmth & tranquil bays)',
    vibe: 'Secluded Hideaways & Wild Sands',
    highlights: [
      'Goyambokka and Silent Beach secluded rocky lagoons',
      'Night-time marine turtle nesting tours at Rekawa beach',
      'Hummanaya natural marine blowhole (second largest in the world)',
      'Scenic kayak tours along the mangrove-lined Mawella Lagoon',
    ],
  },
  {
    id: 'beach-arugambay',
    name: 'Arugam Bay',
    localName: 'ආරුගම් බේ වෙරළ (Surf Mecca)',
    location: 'Pottuvil, Eastern Province',
    region: 'Eastern Coast',
    description:
      'Ranked among the top 10 surf points on the globe, featuring peeling right-hand waves at Main Point, relaxed bohemian beach cafes, and surrounding lagoons where wild elephants roam.',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 6.8421,
      lng: 81.8341,
    },
    bestSeason: 'May to October (Peak world-class surfing swell & sunny days)',
    vibe: 'World Surf Haven & Bohemian Energy',
    highlights: [
      'World-famous right-hand pointbreak waves at Main Point & Whiskey Point',
      'Panoramic sunset climb atop scenic Elephant Rock',
      'Peaceful canoe safari through Pottuvil mangrove lagoon',
      'Untouched wilderness and birding at nearby Kumana National Park',
    ],
    destinationId: 'arugam-bay',
  },
  {
    id: 'beach-nilaveli',
    name: 'Nilaveli Beach',
    localName: 'නිලාවෙලි වෙරළ (Nilaveli White Sands)',
    location: 'Nilaveli, Trincomalee, Eastern Province',
    region: 'Eastern Coast',
    description:
      'Miles of unblemished, powdery white sands and crystal-clear azure waters, serving as the main jumping-off point to Pigeon Island Marine National Park for world-class reef snorkeling.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 8.6885,
      lng: 81.1895,
    },
    bestSeason: 'March to October (Glass-like seas & vivid underwater visibility)',
    vibe: 'White Coral Sands & Marine Sanctuary',
    highlights: [
      'Speedboat rides to Pigeon Island Marine National Park',
      'Swimming alongside harmless blacktip reef sharks and sea turtles',
      'Historical cliffside Koneswaram Hindu Kovil at Swami Rock',
      'Uncrowded tranquil shoreline for long morning beach walks',
    ],
    destinationId: 'trincomalee',
  },
  {
    id: 'beach-pasikuda',
    name: 'Pasikuda Beach',
    localName: 'පාසිකුඩා වෙරළ (Calm Turquoise Bay)',
    location: 'Pasikuda, Batticaloa, Eastern Province',
    region: 'Eastern Coast',
    description:
      'Renowned for its extraordinary shallow coral reef bay where visitors can safely wade hundreds of meters into warm, glass-like turquoise water with virtually zero current.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Pasikuda_beach.jpg/1280px-Pasikuda_beach.jpg',
    coordinates: {
      lat: 7.9248,
      lng: 81.5647,
    },
    bestSeason: 'March to October (Warm lagoon & mirror-flat water)',
    vibe: 'Shallow Waters & Luxury Family Escapes',
    highlights: [
      'Wade 300+ meters into the warm sea on soft golden sand',
      'Superb for families, children, and relaxed open-water swimming',
      'Stand-up paddleboarding, kayaking, and windsurfing',
      'Sprawling high-end seaside resort properties with lush gardens',
    ],
  },
  {
    id: 'beach-hikkaduwa',
    name: 'Hikkaduwa Beach',
    localName: 'හික්කඩුව වෙරළ (Coral & Turtle Coast)',
    location: 'Hikkaduwa, Southern Province',
    region: 'Southern Coast',
    description:
      'A legendary coastal town famed for its national marine coral park, friendly wild sea turtles swimming right to the shoreline, exciting reef breaks, and energetic beachfront dining.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Hikkaduwa_beach_beauty.jpg/1280px-Hikkaduwa_beach_beauty.jpg',
    coordinates: {
      lat: 6.1395,
      lng: 80.1063,
    },
    bestSeason: 'November to April (Great surf, lively vibe & clear reefs)',
    vibe: 'Wild Turtles & Coral Reef Hub',
    highlights: [
      'Hand-feeding seaweed to wild giant green turtles at the shore',
      'Glass-bottom boat tours over Hikkaduwa Coral Reef Sanctuary',
      'Famous A-frame reef break surfing at Main Reef and Benny’s',
      'Lively beach bars, seafood barbecues, and live acoustic music',
    ],
  },
  {
    id: 'beach-hiriketiya',
    name: 'Hiriketiya Beach',
    localName: 'හිරිකැටිය වෙරළ (Horseshoe Cove)',
    location: 'Dikwella, Southern Province',
    region: 'Southern Coast',
    description:
      'A secluded, emerald-green horseshoe cove surrounded by lush jungle palms, known for its bohemian cafe culture, year-round left-hand pointbreak, and tranquil tropical charm.',
    image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: 5.9622,
      lng: 80.6975,
    },
    bestSeason: 'Year-round (Peak waves November to April)',
    vibe: 'Jungle Cove & Hipster Surf Haven',
    highlights: [
      'Consistent horseshoe left-hand pointbreak wave',
      'Charming beach cafes nestled under towering coconut palms',
      'Morning beach yoga and artisanal espresso spots',
      'Short walk to the dramatic cliff blowhole at Dikwella',
    ],
  },
];
