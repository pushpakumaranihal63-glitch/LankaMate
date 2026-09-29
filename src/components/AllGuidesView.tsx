import React, { useState } from 'react';
import {
  Train,
  Landmark,
  UtensilsCrossed,
  Compass,
  Sun,
  Calendar,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Camera,
  Coins,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { PageId } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface AllGuidesViewProps {
  onNavigatePage: (page: PageId) => void;
}

type GuideId =
  | 'train-ticket'
  | 'temple-dress-code'
  | 'street-food'
  | 'yala-safari'
  | 'weather'
  | '7-day-itinerary';

interface TravelGuideItem {
  id: GuideId;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  heroImage?: string;
  readingTime: string;
  summary: string;
  targetPage: PageId;
  actionButtonLabel: string;
  highlights: string[];
  keyAdvice: string;
  detailedSections: {
    heading: string;
    points: string[];
  }[];
}

export const AllGuidesView: React.FC<AllGuidesViewProps> = ({ onNavigatePage }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedGuideId, setExpandedGuideId] = useState<GuideId | null>(null);

  const guides: TravelGuideItem[] = [
    {
      id: 'train-ticket',
      title: 'Train Ticket & Scenic Railway Guide',
      category: 'Trains & Transit',
      badge: 'Official Booking Guide',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
      icon: <Train className="w-5 h-5 text-sky-700" />,
      readingTime: '4 min read',
      summary:
        'Complete guide to booking reserved train tickets on Sri Lanka Railways, official portal rules, class comparisons, unreserved walk-in strategies, and the legendary Kandy to Ella scenic mountain route.',
      targetPage: 'transport',
      actionButtonLabel: 'Open Trains & Transit Guide',
      highlights: [
        'Official Portal: seatreservation.railway.gov.lk is the only government booking platform',
        '30-Day Window: Tickets release at 10:00 AM Sri Lankan time exactly 30 days prior',
        '2nd Class vs 1st Class: 2nd class has openable windows & doors (best for photography); 1st class has AC with sealed glass',
        'Unreserved Option: If sold out online, buy 2nd/3rd class unreserved tickets at the counter 1 hour before departure',
        'Right-Side Seating: Request the right side leaving Kandy towards Ella for prime valley and waterfall views',
      ],
      keyAdvice:
        'Set an alarm for 10:00 AM Sri Lanka time 30 days before your journey. If online tickets sell out, do not panic: unreserved tickets never sell out and can be bought at the station on travel morning!',
      detailedSections: [
        {
          heading: 'Official Booking Process & Timelines',
          points: [
            'Visit the official portal at seatreservation.railway.gov.lk or purchase through registered agents (Mobitel / Dialog booking counters).',
            'Tickets go live strictly at 10:00 AM (UTC+5:30) exactly 30 calendar days before departure. During peak months (December–February and July–August), reserved seats for the Kandy-Ella blue train sell out in minutes.',
            'Keep passenger passport numbers and full names ready before 10:00 AM to complete checkout swiftly.',
          ],
        },
        {
          heading: 'Ticket Classes Explained',
          points: [
            '1st Class AC: Fully air-conditioned with plush assigned seats. However, windows and doors are sealed shut, making photography prone to glare.',
            '2nd Class Reserved (Recommended): Ceiling fans, cushioned reserved seats, and open windows allowing unobstructed views and fresh mountain breezes.',
            '3rd Class Reserved: Basic cushioned seating, budget-friendly, highly popular with backpackers and local families.',
            'Unreserved (2nd & 3rd Class): Can ONLY be bought on the day of departure at station ticket windows. Extremely cheap (~400 LKR), guaranteed boarding, but seats are first-come, first-served.',
          ],
        },
        {
          heading: 'Iconic Sri Lankan Train Routes',
          points: [
            'Main Line (Kandy → Nuwara Eliya/Nanu Oya → Ella): 6.5 to 7 hours of misty tea gardens, colonial viaducts, pine forests, and St. Clair & Devon waterfalls.',
            'Coastal Line (Colombo Fort → Galle → Matara): 2.5 hours gliding right along the crashing waves of the Indian Ocean.',
            'Yal Devi Northern Express (Colombo → Anuradhapura → Jaffna): Modern express traversing the cultural plains to the palmyra-clad northern peninsula.',
          ],
        },
      ],
    },
    {
      id: 'temple-dress-code',
      title: 'Sacred Temple Dress Code & Cultural Etiquette',
      category: 'Culture & Etiquette',
      badge: 'Strict Sacred Customs',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: <Landmark className="w-5 h-5 text-amber-700" />,
      readingTime: '3 min read',
      summary:
        'Mandatory clothing rules, footwear etiquette, photography regulations, and reverent behavior for visiting ancient Buddhist temples, sacred stupas, and Hindu Kovils across Sri Lanka.',
      targetPage: 'handbook',
      actionButtonLabel: 'View Sacred Etiquette in Handbook',
      highlights: [
        'Cover Shoulders & Knees: Sleeveless tops, tank tops, shorts, and mini-skirts are strictly prohibited',
        'White or Light Clothing: Wearing white is a traditional sign of spiritual purity, humility, and respect',
        'Remove Shoes & Hats: Leave footwear at dedicated shoe stands before crossing sacred boundaries (50-100 LKR tip)',
        'Never Pose with Back to Buddha: Turning your back to a Buddha statue or taking selfies is strictly illegal and disrespectful',
        'Respectful Greet: Press palms together at chest level and bow slightly with "Ayubowan" or "Vanakkam"',
      ],
      keyAdvice:
        'Always keep a light white cotton sarong or wrap folded in your daypack. It can be wrapped around shorts or bare shoulders in seconds at temple entrances!',
      detailedSections: [
        {
          heading: 'What to Wear & Prohibited Clothing',
          points: [
            'Both men and women must ensure shoulders, upper arms, and knees are completely covered.',
            'Tight leggings, sheer fabrics, gym shorts, and swimwear cover-ups are not allowed.',
            'While white is the traditional preferred color of devotees, cream, beige, or soft pale pastels are also warmly accepted.',
            'In Jaffna and northern Hindu Kovils, male visitors are customarily required to remove their shirts to bare their chests as a sign of humility before deities.',
          ],
        },
        {
          heading: 'Footwear & Hat Rules',
          points: [
            'All shoes, sandals, flip-flops, and hats/caps must be removed before entering the sacred courtyard (Sandakada Pahana or boundary stone).',
            'Shoe counters with attendants are available at every major site (Sigiriya temple area, Temple of the Tooth in Kandy, Dambulla Caves). Customary token tip is 50 to 100 LKR.',
            'Pro-Tip for Sunny Days: Temple stone courtyards can become blisteringly hot by mid-day. Wearing thick clean white socks is permitted and will protect your soles from heat!',
          ],
        },
        {
          heading: 'Photography & Sacred Conduct',
          points: [
            'Never position yourself with your back facing a Buddha statue to pose for a photograph.',
            'Do not take selfies with Buddha statues; photograph the statue respectfully from the side or front without human poses.',
            'Never touch or climb on ancient stone carvings, moonstones, or ruined stupa walls.',
            'Women should never make physical contact with Buddhist monks. If offering a gift or item, place it on a clean cloth or table.',
          ],
        },
      ],
    },
    {
      id: 'street-food',
      title: 'Best Sri Lankan Street Food & Night Market Guide',
      category: 'Food & Dining',
      badge: 'Local Flavors & Kottu',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      icon: <UtensilsCrossed className="w-5 h-5 text-emerald-700" />,
      readingTime: '5 min read',
      summary:
        'The essential foodie handbook to discovering authentic Sri Lankan street food: sizzling kottu roti, crispy egg hoppers, spicy isso vadai on Galle Face Green, and fresh king coconut water.',
      targetPage: 'food',
      actionButtonLabel: 'Explore Sri Lankan Food Guide',
      highlights: [
        'Kottu Roti: The undisputed king of street food, chopped fresh on hot griddles with rhythmic musical beats',
        'Egg Hoppers (Appa): Crisp bowl-shaped coconut-rice pancakes with a steaming sunny-side egg center',
        'Isso Vadai: Crunchy lentil cakes topped with whole spiced prawns, best eaten at sunset on Galle Face Green',
        'Pol Roti: Rustic grilled coconut flatbread served with fiery Lunu Miris (chili-onion relish) or Katta Sambol',
        'Thambili: Fresh golden king coconut sliced open with a machete for 100% natural, sterile electrolytes',
      ],
      keyAdvice:
        'Choose street food stalls packed with local families where food is sizzling hot and cooked to order before your eyes. In Colombo, request "Cheese Kottu" for a modern, creamy indulgence!',
      detailedSections: [
        {
          heading: 'Top Street Food Specialties You Must Taste',
          points: [
            'Chicken or Cheese Kottu Roti: Chopped flaky godamba roti mixed vigorously with leeks, shredded carrots, eggs, spicy curry gravy, and melted cheese.',
            'Egg Hoppers with Seeni Sambol: Delicate fermented rice-flour bowl pancakes with a runny egg center, accompanied by caramelized sweet-spicy onions and crushed chili lunu miris.',
            'Isso Vadai & Wade: Spiced dal fritters embedded with crisp whole tiger prawns, fried until golden and garnished with raw onions and lime.',
            'Ulundu Vadai: Savory doughnut-shaped fried lentil fritters, fluffy inside and crispy outside, served with coconut chutney.',
            'Parippu Vada & Samosas: Bite-sized deep-fried crunchy lentil snacks sold warm by vendors on scenic train rides.',
          ],
        },
        {
          heading: 'Best Street Food Locations in Sri Lanka',
          points: [
            'Galle Face Green (Colombo): The island’s ultimate sunset food strip lined with isso vadai stalls, kottu carts, and iced milo bars.',
            'Pettah Market Bazaars (Colombo): Bustling fruit stalls, spiced samosas, falooda milk drinks, and roasted peanuts.',
            'Hikkaduwa & Mirissa Beach Stalls: Nightly fresh seafood displays where you choose your freshly caught red snapper, jumbo prawns, or calamari grilled over open coals.',
            'Kandy Night Stalls: Hearty chicken kottu, egg roti, and ginger-infused Ceylon tea near the lake and clock tower.',
          ],
        },
        {
          heading: 'Health & Street Food Hygiene Rules',
          points: [
            'Only eat food that is cooked piping hot right in front of you.',
            'Avoid raw pre-sliced fruits that have been sitting open without ice.',
            'Wash hands thoroughly or carry alcohol hand sanitizer; locals eat with the fingers of their right hand.',
            'Drink bottled water with intact seal caps, or fresh coconut water straight from a newly opened Thambili.',
          ],
        },
      ],
    },
    {
      id: 'yala-safari',
      title: 'Yala Safari & Leopard Tracking Guide',
      category: 'Wildlife & Safaris',
      badge: 'Highest Leopard Density',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: <Compass className="w-5 h-5 text-amber-700" />,
      heroImage: '/images/destinations/yala.jpg',
      readingTime: '5 min read',
      summary:
        'Expert advice for experiencing a thrilling wildlife safari in Yala National Park: leopard hotspots, morning vs evening game drives, safari jeep hiring, entrance fees, and wildlife photography tips.',
      targetPage: 'destinations',
      actionButtonLabel: 'View Yala in Places & Map',
      highlights: [
        'World’s Leopard Capital: Yala boasts the highest concentration of wild leopards (Panthera pardus kotiya) on Earth',
        'Best Visiting Window: February to July during the dry season when wildlife gathers around watering holes',
        'Game Drive Schedule: Dawn (5:45 AM - 10:00 AM) and Late Afternoon (2:30 PM - 6:00 PM) offer prime predator activity',
        'Big 4 Sightings: Leopards, wild Asian elephants, elusive sloth bears, and mugger crocodiles',
        'Block 1 Focus: The premier zone for leopard sightings around rocky outcrops and coastal lagoons',
      ],
      keyAdvice:
        'Opt for a dedicated private 4x4 safari jeep with an experienced tracker rather than a shared crowded vehicle. Book a morning safari (doors open 6:00 AM) to enter the park first when big cats patrol the tracks!',
      detailedSections: [
        {
          heading: 'Park Overview & Wildlife Profile',
          points: [
            'Yala National Park covers 979 square kilometers in Sri Lanka’s southeastern dry zone, encompassing monsoon forests, rocky inselbergs, and coastal wetlands.',
            'Home to over 44 mammal species and 215 bird species. The star attraction is the Sri Lankan Leopard, an apex predator that has no natural competition on the island, making them more diurnal and bold than African leopards.',
            'Other major wildlife regularly spotted: Asian elephants, sloth bears foraging under palu trees, spotted deer, wild boars, sambar deer, jackals, and mugger crocodiles.',
          ],
        },
        {
          heading: 'Game Drive Timings & Gate Strategy',
          points: [
            'Morning Safari (6:00 AM – 10:00 AM): Cool temperatures, highest leopard movement, and birds actively feeding. Be at Palatupana or Katagamuwa gate by 5:30 AM to queue for tickets.',
            'Afternoon Safari (2:30 PM – 6:00 PM): Golden hour lighting, elephants emerging to drink and bathe in lakes, leopards sunning on granite rocks.',
            'Full Day Safari (6:00 AM – 6:00 PM): Maximizes tracking opportunities, with a designated midday rest period at the designated Patanangala beach area.',
            'Annual Park Closure: Block 1 traditionally closes for routine drought maintenance for 4 to 6 weeks between September and October. Block 5 or adjacent Lunugamvehera remain open.',
          ],
        },
        {
          heading: 'What to Bring on a Safari',
          points: [
            'Clothing: Lightweight, breathable clothing in neutral earth tones (khaki, olive, brown). Avoid bright neon colors or white.',
            'Photography Gear: Telephoto lens (at least 70-300mm or 100-400mm) and a dust cover/scarf to protect camera sensors from dry dirt tracks.',
            'Comfort: High-SPF sunscreen, sunglasses, wide-brim hat, lip balm, and insect repellent.',
            'Binoculars: Essential for spotting leopards resting on high tree boughs or sloth bears in dense thickets.',
          ],
        },
      ],
    },
    {
      id: 'weather',
      title: 'Sri Lanka Weather & Dual Monsoons Explained',
      category: 'Weather & Seasons',
      badge: 'Year-Round Sunshine',
      badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      readingTime: '4 min read',
      summary:
        'How Sri Lanka’s unique dual monsoon system works: why sunny blue skies and calm beach seas can ALWAYS be found somewhere on the island during every single month of the year.',
      targetPage: 'handbook',
      actionButtonLabel: 'View Climate in Travel Handbook',
      highlights: [
        'Dual Monsoon Reality: When it rains on one coast, the opposite coast enjoys sunny beach weather and glass-calm seas',
        'Southwest Monsoon ("Yala") — May to September: Rain on south & west coasts; radiant sunshine on East Coast (Trinco, Pasikudah, Arugam Bay)',
        'Northeast Monsoon ("Maha") — November to February: Peak sunny season for Galle, Bentota, Mirissa, Weligama & Colombo',
        'Hill Country Climate: Nuwara Eliya and Ella enjoy mild days (18°C–23°C) but crisp cold nights (10°C–14°C)',
        'Inter-Monsoon Months: March-April and October feature warm sunny mornings with brief late-afternoon tropical showers',
      ],
      keyAdvice:
        'Plan your beaches by the calendar: Visit the South & West Coasts from December to April; switch to the East Coast (Trincomalee, Pasikudah, Arugam Bay) from May to September!',
      detailedSections: [
        {
          heading: 'The Dual Monsoon Cycle',
          points: [
            'Southwest Monsoon ("Yala"): May to September. Brings rains to the western plains, southwestern coastline (Galle, Colombo, Bentota), and western central slopes. During this exact period, the EAST COAST (Trincomalee, Nilaveli, Pasikudah, Arugam Bay) and NORTH (Jaffna) have dry, sunny, 30°C weather with calm waters ideal for diving, snorkeling, and surfing.',
            'Northeast Monsoon ("Maha"): November to February. Winds bring moisture from the Bay of Bengal into the north and eastern plains. The entire SOUTH AND WEST COASTLINE (Mirissa, Unawatuna, Hikkaduwa, Galle) enjoys its premier dry season with tranquil turquoise surf.',
          ],
        },
        {
          heading: 'Hill Country Microclimate',
          points: [
            'The central highlands (Nuwara Eliya, Ella, Horton Plains) sit at 1,000 to 1,900 meters elevation.',
            'Temperatures are spring-like during the day (18°C to 23°C), but evening and dawn temperatures frequently plunge to 10°C to 14°C.',
            'Always pack a light fleece or warm jacket, rain shell, and comfortable hiking shoes for tea plantation trails.',
          ],
        },
        {
          heading: 'Month-by-Month Destination Recommendation',
          points: [
            'December to April: Mirissa, Galle Fort, Bentota, Weligama, Kandy, Nuwara Eliya, Sigiriya, Yala.',
            'May to September: Trincomalee, Pasikudah, Arugam Bay (world-class surf season), Jaffna, Minneriya elephant gathering.',
            'October to November: Cultural Triangle (Sigiriya, Polonnaruwa), wildlife parks, culinary and spa retreats.',
          ],
        },
      ],
    },
    {
      id: '7-day-itinerary',
      title: '7-Day Sri Lanka Itinerary',
      category: 'Trip Itineraries',
      badge: 'Dedicated Day-by-Day Route',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      icon: <Calendar className="w-5 h-5 text-emerald-700" />,
      readingTime: '6 min read',
      summary:
        'The quintessential 7-day Sri Lanka circuit: Day 1 - Colombo, Day 2 - Sigiriya & Dambulla, Day 3 - Kandy, Day 4 - Nuwara Eliya, Day 5 - Ella, Day 6 - Yala, Day 7 - Galle & Southern Coast.',
      targetPage: 'itinerary-7day',
      actionButtonLabel: 'Open 7-Day Sri Lanka Itinerary Guide',
      highlights: [
        'Day 1 - Colombo: Arrival & colonial coastal city discovery',
        'Day 2 - Sigiriya & Dambulla: Cave temples & 5th-century Lion Rock fortress',
        'Day 3 - Kandy: Royal capital & Sacred Temple of the Tooth Relic',
        'Day 4 - Nuwara Eliya: Emerald tea country, Ramboda falls & colonial town',
        'Day 5 - Ella: Iconic scenic blue train, Nine Arches Bridge & Little Adam’s Peak',
        'Day 6 - Yala: Big-game wildlife safari tracking wild leopards & elephants',
        'Day 7 - Galle & Southern Coast: 400-year-old Dutch Fort & ocean ramparts',
      ],
      keyAdvice:
        'This dedicated 7-day circuit covers Sri Lanka’s greatest highlights with minimal backtrack. Use the blue mountain train between Nanu Oya and Ella, and the Southern Expressway (E01) for your return to Colombo Airport!',
      detailedSections: [
        {
          heading: 'Day 1 & Day 2: Colombo, Sigiriya & Dambulla',
          points: [
            'Day 1 - Colombo: Touchdown at BIA Airport, express highway to Colombo Fort, colonial walking tour, Gangaramaya Temple, and sunset street food on Galle Face Green.',
            'Day 2 - Sigiriya & Dambulla: UNESCO Dambulla Royal Rock Cave Temple with 153 gilded Buddha statues, then climb the 200m Sigiriya Lion Rock Sky Palace as golden hour lights up the jungle.',
          ],
        },
        {
          heading: 'Day 3 & Day 4: Kandy & Nuwara Eliya',
          points: [
            'Day 3 - Kandy: Scenic drive through Matale spice gardens, serene walk around Kandy Lake, and sacred evening Pooja ceremony at Sri Dalada Maligawa (Temple of the Tooth).',
            'Day 4 - Nuwara Eliya: Wind into the high tea country, stop at Ramboda Falls, tour a working colonial Ceylon tea estate, and explore British colonial Nuwara Eliya.',
          ],
        },
        {
          heading: 'Day 5, Day 6 & Day 7: Ella, Yala, Galle & Coast',
          points: [
            'Day 5 - Ella: World-famous scenic blue train ride across tea mountains, Demodara Nine Arches Bridge viaduct walk, and Little Adam’s Peak sunset hike.',
            'Day 6 - Yala: Stop at Ravana Falls, then 4x4 open-top safari inside Yala National Park tracking wild leopards, Asian elephants, and sloth bears.',
            'Day 7 - Galle & Southern Coast: Stroll the 400-year-old cobblestone ramparts and lighthouse of UNESCO Galle Dutch Fort, then Southern Expressway (E01) directly to Colombo Airport.',
          ],
        },
      ],
    },
  ];

  const categories = [
    'All',
    'Trains & Transit',
    'Culture & Etiquette',
    'Food & Dining',
    'Wildlife & Safaris',
    'Weather & Seasons',
    'Trip Itineraries',
  ];

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory =
      activeCategory === 'All' || guide.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      guide.title.toLowerCase().includes(query) ||
      guide.summary.toLowerCase().includes(query) ||
      guide.highlights.some((h) => h.toLowerCase().includes(query)) ||
      guide.detailedSections.some(
        (s) =>
          s.heading.toLowerCase().includes(query) ||
          s.points.some((p) => p.toLowerCase().includes(query))
      );

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: GuideId) => {
    setExpandedGuideId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('Official LankaMate Travel Guides')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              {t('All Sri Lanka Travel Guides')}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
              {t('Essential practical handbooks, official transit guides, cultural etiquette protocols, authentic street food highlights, wildlife safari strategies, and curated itineraries.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigatePage('home')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>{t('Back to Home')}</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search guides (e.g., train ticket, temple dress code, street food, yala, weather, 7-day)...')}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {t(cat)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Jump Bar for the 6 Core Guides */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {guides.map((g) => {
            const isSelected = expandedGuideId === g.id;
            return (
              <button
                key={g.id}
                id={`quick-jump-guide-${g.id}`}
                onClick={() => {
                  if (g.id === '7-day-itinerary') {
                    onNavigatePage('itinerary-7day');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  setExpandedGuideId(g.id);
                  const el = document.getElementById(`guide-card-${g.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-emerald-50 text-stone-800 border-stone-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-emerald-800'}`}>
                    {g.icon}
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-stone-100 text-stone-600'}`}>
                    {g.readingTime}
                  </span>
                </div>
                <div className={`text-xs font-black tracking-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {g.id === '7-day-itinerary' ? t('7-Day Itinerary') : g.title.split('&')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Guides List */}
        <div className="space-y-6">
          {filteredGuides.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
              <div className="font-bold text-stone-800 text-base">{t('No guides found matching your query')}</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {t('Try clearing your search or selecting "All" to browse all travel guides.')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                {t('Reset Filters')}
              </button>
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const isExpanded = expandedGuideId === guide.id;
              return (
                <article
                  key={guide.id}
                  id={`guide-card-${guide.id}`}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Card Top Section */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {guide.icon}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                            {t(guide.category)}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${guide.badgeColor}`}>
                            {guide.badge}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{guide.readingTime}</span>
                      </div>
                    </div>

                    <div>
                      {guide.id === '7-day-itinerary' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigatePage('itinerary-7day');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-left group cursor-pointer"
                        >
                          <h2 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-emerald-800 tracking-tight flex items-center gap-2 transition-colors">
                            <span>{guide.title}</span>
                            <ArrowRight className="w-5 h-5 text-emerald-700 opacity-80 group-hover:translate-x-1 transition-transform" />
                          </h2>
                        </button>
                      ) : (
                        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                          {guide.title}
                        </h2>
                      )}
                      <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>

                    {/* Optional Hero Image preview for guides with rich imagery (e.g. Yala Safari) */}
                    {guide.heroImage && (
                      <div className="relative rounded-xl overflow-hidden h-48 sm:h-64 border border-stone-100 shadow-inner">
                        <img
                          src={guide.heroImage}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                          <span className="text-white text-xs font-bold drop-shadow-md flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            {t('Authentic Sri Lankan Wildlife Sanctuary')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Key Highlights Quick Checklist */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 space-y-2">
                      <div className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t('Core Takeaways & Guidelines')}</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                        {guide.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 font-bold shrink-0">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Advice Callout */}
                    <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3.5 rounded-r-xl text-xs text-amber-950 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-amber-900 uppercase tracking-wide text-[10px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {t('LankaMate Local Insider Tip')}
                      </span>
                      <p className="leading-relaxed font-medium">{guide.keyAdvice}</p>
                    </div>

                    {/* Expandable In-Depth Sections */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-stone-100 space-y-5 animate-in fade-in duration-200">
                        {guide.detailedSections.map((sec, secIdx) => (
                          <div key={secIdx} className="space-y-2">
                            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center justify-center">
                                {secIdx + 1}
                              </span>
                              <span>{sec.heading}</span>
                            </h3>
                            <ul className="space-y-1.5 pl-7 text-xs text-stone-600 leading-relaxed list-disc">
                              {sec.points.map((p, pIdx) => (
                                <li key={pIdx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(guide.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer py-1.5"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 text-stone-500" />
                            <span>{t('Collapse Full Details')}</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 text-stone-500" />
                            <span>{t('Read Complete Detailed Guide')}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onNavigatePage(guide.targetPage);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer ml-auto"
                      >
                        <span>{guide.actionButtonLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Bottom Helper Banner */}
        <div className="bg-linear-to-r from-emerald-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
              {t('24/7 AI Travel Concierge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t('Have questions about Sri Lanka tickets, permits, or etiquette?')}
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              {t('Ask our intelligent assistant for customized train schedules, temple guidelines, kottu recommendations, or personalized itinerary modifications.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigatePage('assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <span>{t('Ask AI Travel Guide')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
