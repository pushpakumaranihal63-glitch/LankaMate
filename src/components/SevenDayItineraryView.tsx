import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Train,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Printer,
  Compass,
  Landmark,
  UtensilsCrossed,
  Sun,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { PageId } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface SevenDayItineraryViewProps {
  onNavigatePage: (page: PageId) => void;
}

interface ItineraryDayDetail {
  dayNumber: number;
  dayLabel: string;
  destination: string;
  title: string;
  image: string;
  routeHighlight: string;
  morning: string;
  afternoon: string;
  evening: string;
  transitTime: string;
  insiderTip: string;
  highlights: string[];
}

export const SevenDayItineraryView: React.FC<SevenDayItineraryViewProps> = ({
  onNavigatePage,
}) => {
  const { t } = useTranslation();
  const [selectedDayTab, setSelectedDayTab] = useState<number | 'all'>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const itineraryDays: ItineraryDayDetail[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      destination: 'Colombo',
      title: 'Arrival & Colonial Coastal City Discovery',
      image: '/images/destinations/colombo.jpg',
      routeHighlight: 'Bandaranaike Airport (BIA) → Colombo Fort & Galle Face Green',
      morning:
        'Touchdown at Bandaranaike International Airport (BIA). Clear immigration, withdraw local currency (LKR) from bank ATMs in the arrivals hall, get a tourist SIM card (Dialog or Mobitel), and take the modern Katunayake Expressway directly into Colombo central.',
      afternoon:
        'Check into your hotel and refresh. Take an afternoon walking tour through historic Colombo Fort, passing the Grand Oriental Hotel, Old Dutch Hospital heritage precinct, and the serene Gangaramaya Buddhist Temple on Beira Lake.',
      evening:
        'Head to Galle Face Green as the sunset casts golden reflections across the Indian Ocean. Stroll past vibrant street food stalls, taste freshly fried prawn isso vadai with lime, and enjoy an authentic dinner of steaming chicken or cheese kottu roti.',
      transitTime: 'Airport Express Highway: ~45 minutes (33 km)',
      insiderTip:
        'Use metered red-and-white tuk-tuks or ride-hailing apps like PickMe and Uber for transparent, fair fares in Colombo.',
      highlights: [
        'Bandaranaike Airport arrival and quick expressway transfer',
        'Historic Colombo Fort & Old Dutch Hospital precinct',
        'Gangaramaya Temple and Seema Malaka on Beira Lake',
        'Sunset on Galle Face Green with authentic street food & Isso Vadai',
      ],
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      destination: 'Sigiriya & Dambulla',
      title: 'Ancient Cave Temples & The 5th Century Lion Rock Fortress',
      image: '/images/destinations/sigiriya.jpg',
      routeHighlight: 'Colombo → Dambulla Cave Temple → Sigiriya Ancient Monolith',
      morning:
        'Depart Colombo early morning into the central plains of the Cultural Triangle. Arrive in Dambulla to explore the UNESCO World Heritage Royal Rock Cave Temple complex, ascending stone steps to five magnificent caverns housing 153 gilded Buddha statues and ancient frescoes.',
      afternoon:
        'Continue 30 minutes to Sigiriya and check into your nature eco-lodge. Enjoy a traditional Sri Lankan rice and curry lunch served on banana leaves with refreshing sweet king coconut water.',
      evening:
        'Late afternoon, climb the world-famous 200-meter monolith of Sigiriya Lion Rock as the sun softens. Walk through landscaped water gardens, marvel at the 1,500-year-old celestial frescoes and mirror wall, and pass between the colossal carved lion paws to reach King Kashyapa’s 5th-century palace summit.',
      transitTime: 'Colombo to Sigiriya: ~3.5 to 4 hours via Central Highway & A6',
      insiderTip:
        'Wear modest clothing with shoulders and knees covered for Dambulla. For Sigiriya, start climbing after 3:30 PM to beat the intense midday heat.',
      highlights: [
        'Dambulla Golden Rock Cave Temples with 153 ancient Buddha statues',
        'Sigiriya 5th-century Sky Palace fortress & ancient landscaped water gardens',
        'Ancient Sigiriya Frescoes of celestial maidens & ancient graffiti mirror wall',
        'Spectacular 360-degree sunset panorama over the central emerald jungle canopy',
      ],
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      destination: 'Kandy',
      title: 'Royal Hill Capital & Sacred Temple of the Tooth Relic',
      image: '/images/destinations/kandy.jpg',
      routeHighlight: 'Sigiriya → Matale Spice Groves → Sacred City of Kandy',
      morning:
        'Depart Sigiriya south towards Kandy. Stop en route in Matale for a guided stroll through an aromatic organic spice garden, learning how pure Ceylon cinnamon, cardamom, vanilla, and cloves are harvested and traditionally prepared.',
      afternoon:
        'Ascend into the misty green hills surrounding Kandy, the last royal capital of ancient Sri Lanka. Check into your hotel overlooking the valley, then stroll around peaceful Kandy Lake, taking in colonial landmarks including Queen’s Hotel.',
      evening:
        'At 6:30 PM, attend the deeply moving evening Pooja drumming ceremony at Sri Dalada Maligawa (Temple of the Sacred Tooth Relic). Witness white-clad pilgrims offering fragrant lotus blooms before the sacred golden casket.',
      transitTime: 'Sigiriya to Kandy: ~2.5 hours scenic mountain drive (90 km)',
      insiderTip:
        'Dress strictly in white or pale clothing covering shoulders and knees for the Temple of the Tooth. Remove shoes at the outer counter (token tip 50-100 LKR).',
      highlights: [
        'Scenic drive through Matale with fragrant Ceylon spice gardens',
        'Kandy Lake scenic promenade & royal colonial architecture',
        'Evening spiritual Pooja ceremony at Sri Dalada Maligawa (Temple of the Tooth)',
        'Optional traditional Kandyan cultural dance & fire-walking performance',
      ],
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      destination: 'Nuwara Eliya',
      title: "Emerald Tea Country, Waterfalls & 'Little England'",
      image: '/images/destinations/nuwara-eliya.jpg',
      routeHighlight: 'Kandy → Ramboda Falls → Ceylon Tea Plantations → Nuwara Eliya',
      morning:
        'Wind upward into the high-altitude Central Highlands along scenic mountain roads. Pause at dramatic Ramboda Falls for photography, then visit an operating colonial Ceylon tea factory (such as Damro Labookellie or Pedro Estate) for a guided factory tour and fresh tea tasting.',
      afternoon:
        'Arrive in Nuwara Eliya, situated at 1,868 meters elevation. Admire Tudor-style colonial bungalows, visit the iconic red-brick 1894 Post Office, and stroll through manicured Victoria Park and around Gregory Lake.',
      evening:
        'Experience classic high tea at The Grand Hotel or warm up with hot spicy roti and ginger tea at local hillside cafés as the cool mountain mist settles over the town.',
      transitTime: 'Kandy to Nuwara Eliya: ~2.5 hours winding mountain highway (75 km)',
      insiderTip:
        'Highland temperatures regularly drop to 12°C to 14°C at night. Keep a warm fleece or jacket and closed shoes ready in your daypack.',
      highlights: [
        'Spectacular twin cascades of Ramboda Waterfalls',
        'Working Ceylon tea factory tour & pure Ceylon single-estate tea tasting',
        'Iconic red-brick 1894 British colonial Nuwara Eliya Post Office',
        'Lake Gregory promenade and crisp cool highland mountain air',
      ],
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      destination: 'Ella',
      title: 'The Iconic Blue Scenic Train, Nine Arches Bridge & Mountain Vistas',
      image: '/images/destinations/ella.jpg',
      routeHighlight: 'Nanu Oya Station → Blue Mountain Train → Ella & Demodara',
      morning:
        'Transfer to Nanu Oya railway station and board the legendary blue train to Ella. Relax by open windows and open train doorways as the train winds through pine ridges, deep valleys, cascading streams, and misty tea estates.',
      afternoon:
        'Disembark in the vibrant hill town of Ella. Walk through eucalyptus groves to the iconic Nine Arches Bridge in Demodara, watching the colonial train rumble across the 91-meter stone viaduct surrounded by lush green tea bushes.',
      evening:
        'Take an easy 45-minute hike up Little Adam’s Peak for panoramic sunset vistas across Ella Gap and Ravana Rock. Afterwards, unwind at Cafe Chill or a local hangout with fresh hoppers, curries, and live acoustic music.',
      transitTime: 'Scenic Train Journey: ~2.5 to 3 hours of world-class mountain vistas',
      insiderTip:
        'Book 2nd class reserved seats 30 days ahead online. If sold out, purchase unreserved tickets at the counter on the morning of travel (seats are first-come, first-served).',
      highlights: [
        'World-famous Kandy-to-Ella scenic blue train ride through tea mountains',
        'Nine Arches Bridge colonial stone railway viaduct photography',
        'Little Adam’s Peak sunset hike with panoramic views across Ella Gap',
        'Relaxed mountain town cafe culture and live acoustic evening music',
      ],
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      destination: 'Yala',
      title: 'Big Game Safari: Leopards, Elephants & Wildlife Sanctuaries',
      image: '/images/destinations/yala.jpg',
      routeHighlight: 'Ella → Ravana Falls → Southern Dry Zone → Yala National Park',
      morning:
        'Descend from the central mountains towards the southern plains. Stop at cascading Ravana Falls for morning photographs, then continue south through well-paved roads towards Tissamaharama and Yala.',
      afternoon:
        'Check into your safari camp or lodge and have a light lunch. At 2:30 PM, board your custom open-top 4x4 safari jeep with a certified wildlife ranger and enter Yala National Park (Block 1).',
      evening:
        'Embark on an exhilarating game drive tracking wild Sri Lankan leopards sunning on massive granite boulders, watching herds of wild Asian elephants at watering holes, and spotting sloth bears, spotted deer, and crocodiles before exit at 6:00 PM sunset.',
      transitTime: 'Ella to Yala / Tissamaharama: ~2 to 2.5 hours descent (95 km)',
      insiderTip:
        'Wear breathable earth-tone clothing (khaki, olive, brown). Bring sunglasses, high-SPF sunscreen, dust protection for camera lenses, and binoculars.',
      highlights: [
        'Ravana Falls roadside waterfall photo stop',
        '4x4 open-top safari expedition inside Yala National Park Block 1',
        'Tracking wild Sri Lankan leopards (highest density in the world)',
        'Close encounters with wild Asian elephants, sloth bears & spotted deer',
      ],
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      destination: 'Galle & Southern Coast',
      title: 'UNESCO Galle Dutch Fort, Lighthouse Ramparts & Ocean Departure',
      image: '/images/destinations/galle.jpg',
      routeHighlight: 'Yala → Southern Coastal Highway → Galle Dutch Fort → Airport',
      morning:
        'Drive westward along the palm-fringed southern coastline. Pass through coastal fishing villages and famous surf bays (Mirissa and Weligama), catching glimpses of traditional stilt fishermen over the breaking surf.',
      afternoon:
        'Arrive at the UNESCO World Heritage Galle Dutch Fort. Stroll along 400-year-old cobblestone alleyways, admire Dutch and British colonial mansions, visit the iconic Galle Fort Lighthouse, and explore boutique gem stores and artisan cafes.',
      evening:
        'Catch your farewell sunset from Flag Rock Bastion as waves crash against ancient ramparts. Hop onto the modern Southern Expressway (E01) directly to Colombo Bandaranaike International Airport (BIA) for your flight home.',
      transitTime:
        'Yala to Galle: ~2 hours / Galle to Colombo Airport: ~2 hours via Southern Expressway (E01)',
      insiderTip:
        'Allow at least 2.5 to 3 hours before your flight departure. The Southern Expressway connects directly to the airport expressway with no Colombo city traffic delays.',
      highlights: [
        'Scenic Southern Coast drive with views of Weligama & Mirissa bays',
        'UNESCO Galle Dutch Fort walking tour and colonial cobblestone streets',
        'Iconic white Galle Fort Lighthouse & Flag Rock ocean ramparts',
        'Direct airport connection via the modern Southern Expressway (E01)',
      ],
    },
  ];

  const handleShare = async () => {
    const shareText = `${t('7-Day Sri Lanka Itinerary:')}\n${t('Day')} 1 - Colombo\n${t('Day')} 2 - Sigiriya & Dambulla\n${t('Day')} 3 - Kandy\n${t('Day')} 4 - Nuwara Eliya\n${t('Day')} 5 - Ella\n${t('Day')} 6 - Yala\n${t('Day')} 7 - Galle & Southern Coast\n\n${t('Planned with LankaMate!')}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('7-Day Sri Lanka Itinerary - LankaMate'),
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const displayedDays =
    selectedDayTab === 'all'
      ? itineraryDays
      : itineraryDays.filter((d) => d.dayNumber === selectedDayTab);

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigatePage('guides')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back to All Guides')}</span>
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-bold text-emerald-800">{t('7-Day Itinerary Guide')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>{copiedSuccess ? t('Copied Link!') : t('Share')}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('Print')}</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative bg-linear-to-br from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('Classic Island Circuit • 7 Days / 6 Nights')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('7-Day Sri Lanka Itinerary')}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {t("The premier first-time route connecting Sri Lanka’s ancient UNESCO rock fortresses, sacred Buddhist capitals, misty Ceylon tea hills, world-famous blue train, big-game leopard safari, and 400-year-old ocean ramparts.")}
            </p>

            {/* Circuit Route Summary Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-amber-200 font-bold">
              <span>Colombo</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Sigiriya & Dambulla</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Kandy</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Nuwara Eliya</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Ella</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Yala</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span>Galle & {t('Coast')}</span>
            </div>
          </div>
        </div>

        {/* Quick Route Summary Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
              {t('Total Duration')}
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-950">{t('7 Days / 6 Nights')}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
              {t('Travel Pace')}
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-950">{t('Balanced & Scenic')}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
              {t('Primary Transit')}
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-950">{t('Train + Car/Expressway')}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
              {t('Key Focus')}
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-950">{t('Heritage, Safari, Tea & Sea')}</span>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDayTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedDayTab === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {t('All 7 Days View')}
          </button>
          {itineraryDays.map((d) => {
            const active = selectedDayTab === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDayTab(d.dayNumber)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider">{t(d.dayLabel)}</span>
                <span className="text-xs font-medium">({d.destination})</span>
              </button>
            );
          })}
        </div>

        {/* Day-by-Day Cards */}
        <div className="space-y-8">
          {displayedDays.map((day) => (
            <article
              key={day.dayNumber}
              id={`day-${day.dayNumber}`}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Day Header Row */}
              <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-300">{t('DAY')}</span>
                    <span className="text-lg leading-none">{day.dayNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        {day.destination}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500 font-medium">{t('Day')} {day.dayNumber} {t('Plan')}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                      {t('Day')} {day.dayNumber} - {day.destination}: {t(day.title)}
                    </h2>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">
                  <Car className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t(day.transitTime)}</span>
                </div>
              </div>

              {/* Day Image and Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8">
                {/* Image Col */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-60 sm:h-72 border border-stone-100 shadow-inner">
                    <img
                      src={day.image}
                      alt={`${t('Day')} ${day.dayNumber} ${day.destination}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        {t('Route Corridor')}
                      </span>
                      <span className="text-xs font-bold leading-snug drop-shadow-md">
                        {t(day.routeHighlight)}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Pill List */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t('Key Day Highlights')}
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {day.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">•</span>
                          <span>{t(h)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Day Schedule Col */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Morning Block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
                        {t('Morning')}
                      </span>
                      <span className="text-xs font-bold text-stone-800">{t('Commence & Explore')}</span>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-1">
                      {t(day.morning)}
                    </p>
                  </div>

                  {/* Afternoon Block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">
                        {t('Afternoon')}
                      </span>
                      <span className="text-xs font-bold text-stone-800">{t('Sightseeing & Culture')}</span>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-1">
                      {t(day.afternoon)}
                    </p>
                  </div>

                  {/* Evening Block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 text-[10px] font-extrabold uppercase tracking-wider">
                        {t('Evening')}
                      </span>
                      <span className="text-xs font-bold text-stone-800">{t('Sunset, Dinner & Relaxation')}</span>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-1">
                      {t(day.evening)}
                    </p>
                  </div>

                  {/* Insider Tip Callout */}
                  <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1 text-xs">
                    <span className="font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1 text-[10px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      {t('LankaMate Local Insider Tip')}
                    </span>
                    <p className="text-amber-950 font-medium leading-relaxed">
                      {t(day.insiderTip)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Action Next Steps Footer Bar */}
        <div className="bg-linear-to-r from-emerald-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
              {t('Ready to Customize Your Journey?')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t('Customize or adapt this 7-day plan in our Planner')}
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              {t('Adjust your daily pace, calculate estimated budgets in USD/LKR, explore hand-picked heritage hotels, and generate a printable personal travel itinerary.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onNavigatePage('planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t('Open in Trip Planner')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigatePage('guides');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>{t('All Guides')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SevenDayItineraryView;
