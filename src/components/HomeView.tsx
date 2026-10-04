import React, { useState } from 'react';
import {
  Compass,
  Search,
  Calendar,
  Map,
  MapPin,
  ArrowRight,
  Sun,
  Sparkles,
  Train,
  Heart,
  ShieldAlert,
  Bot,
  UtensilsCrossed,
  Clock,
  Hotel,
  PhoneCall,
  BookOpen,
  X,
  ChevronRight,
  Fuel,
  Building2,
  Palmtree,
  Waves,
  Navigation,
} from 'lucide-react';
import { Destination, PageId, LanguageCode } from '../types';
import { destinationsData } from '../data/destinationsData';
import { beachesData, BeachItem } from '../data/beachesData';
import { getLocalizedBeaches } from '../data/translatedBeaches';
import { hotelsData } from '../data/hotelsData';
import { foodData } from '../data/foodData';
import { transportData } from '../data/transportData';
import { travelGuidesData } from '../data/guidesData';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedDestinations, getLocalizedDestination } from '../data/translatedDestinations';

interface HomeViewProps {
  onNavigatePage: (page: PageId) => void;
  onSelectDestination: (dest: Destination) => void;
  language: LanguageCode;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigatePage,
  onSelectDestination,
  language,
  onToggleFavourite,
  isFavourite,
}) => {
  const { t: translate } = useTranslation();
  const t = React.useCallback(
    (key: string, fallback?: string): string => {
      return translate(key, fallback);
    },
    [translate]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [selectedBeachModal, setSelectedBeachModal] = useState<BeachItem | null>(null);
  const [beachFilter, setBeachFilter] = useState<string>('all');

  const filteredBeaches = React.useMemo(() => {
    let raw = beachesData;
    if (beachFilter === 'southern') {
      raw = beachesData.filter((b) => b.region.includes('South'));
    } else if (beachFilter === 'eastern') {
      raw = beachesData.filter((b) => b.region === 'Eastern Coast');
    } else if (beachFilter === 'southwest') {
      raw = beachesData.filter((b) => b.region === 'Southwest Coast');
    }
    return getLocalizedBeaches(raw, language);
  }, [beachFilter, language]);

  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const searchResultsRef = React.useRef<HTMLDivElement>(null);
  const prevSearchRef = React.useRef(searchQuery);

  // Auto-scroll directly to the FIRST actual matching result card near the top of the screen
  const scrollToFirstResult = React.useCallback(() => {
    const performScroll = () => {
      // Ensure dropdown inner scroll is at top so the first result is at the top of the dropdown container
      if (searchResultsRef.current) {
        searchResultsRef.current.scrollTop = 0;
      }

      const firstCard = document.getElementById('first-search-result-card');
      if (firstCard) {
        const cardRect = firstCard.getBoundingClientRect();
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        // Sticky navbar height is 72px (h-18). Position the first matching result card directly near the top of the screen (85px)
        const targetY = Math.max(0, Math.round(currentScroll + cardRect.top - 85));
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        return true;
      }
      return false;
    };

    if (!performScroll()) {
      // Retry once DOM updates
      setTimeout(performScroll, 50);
    }
  }, []);

  // Monitor search query changes to auto-scroll directly to first matching card when searching or return to top when cleared
  React.useEffect(() => {
    const prev = prevSearchRef.current.trim();
    const curr = searchQuery.trim();

    if (curr) {
      // User searched or updated search -> automatically scroll directly to the first matching result card
      const timer = setTimeout(() => {
        scrollToFirstResult();
      }, 50);
      return () => clearTimeout(timer);
    } else if (!curr && prev) {
      // User cleared the search -> return to normal Home page position
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevSearchRef.current = searchQuery;
  }, [searchQuery, scrollToFirstResult]);

  // The 5 requested popular destinations (localized for active language)
  const popularFiveIds = ['sigiriya', 'ella', 'galle', 'kandy', 'mirissa'];
  const popularDestinations = React.useMemo(() => {
    return popularFiveIds
      .map((id) => destinationsData.find((d) => d.id === id))
      .filter((d): d is Destination => Boolean(d))
      .map((d) => getLocalizedDestination(d, language));
  }, [language]);

  // Quick Action cards for the 8 essential services in Explore LankaMate
  const quickActions = React.useMemo(
    () => [
      {
        id: 'destinations',
        title: t('Explore Destinations'),
        subtitle: t('12+ Iconic Cities & Sights', '12+ Iconic Cities & Sights'),
        keywords: 'explore destinations places sights attractions cities heritage nature beach unesco wonders kandy ella sigiriya galle mirissa yala nuwara eliya colombo jaffna anuradhapura trincomalee',
        icon: <Compass className="w-5 h-5 text-emerald-600" />,
        iconBg: 'bg-emerald-100/90 text-emerald-700',
        borderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
        onClick: () => onNavigatePage('destinations'),
      },
        
       
        {
        id: 'hotels',
        title: t('Hotels & Resorts'),
        subtitle: t('Boutique & Hill Lodges'),
        keywords: 'hotels resorts stays luxury boutique lodges villas accommodation booking rooms stay heritance kandalama 98 acres ceylon tea trails jetwing cape weligama',
        icon: <Hotel className="w-5 h-5 text-purple-600" />,
        iconBg: 'bg-purple-100/90 text-purple-700',
        borderHover: 'hover:border-purple-300 hover:shadow-purple-500/10',
        onClick: () => onNavigatePage('hotels'),
      },
      {
        id: 'food',
        title: t('Sri Lankan Food'),
        subtitle: t('Kottu, Hoppers & Seafood'),
        keywords: 'sri lankan food cuisine dishes kottu roti hoppers egg hopper seafood dining street food eat spicy curry parippu pol sambol isso vadai ambul thiyal',
        icon: <UtensilsCrossed className="w-5 h-5 text-orange-600" />,
        iconBg: 'bg-orange-100/90 text-orange-700',
        borderHover: 'hover:border-orange-300 hover:shadow-orange-500/10',
        onClick: () => onNavigatePage('food'),
      },
      {
        id: 'transport',
        title: t('Trains & Transit'),
        subtitle: t('Scenic Rail & Bus Routes'),
        keywords: 'trains transit scenic rail bus routes tuktuk transportation travel carriage blue train ella train kandy to ella highway express',
        icon: <Train className="w-5 h-5 text-cyan-600" />,
        iconBg: 'bg-cyan-100/90 text-cyan-700',
        borderHover: 'hover:border-cyan-300 hover:shadow-cyan-500/10',
        onClick: () => onNavigatePage('transport'),
      },
      {
        id: 'assistant',
        title: t('AI Guide / Dossier'),
        subtitle: t('Smart Travel Advice'),
        keywords: 'ai guide assistant dossier smart travel advice chat concierge recommendations itinerary suggestions questions',
        icon: <Bot className="w-5 h-5 text-sky-600" />,
        iconBg: 'bg-sky-100/90 text-sky-700',
        borderHover: 'hover:border-sky-300 hover:shadow-sky-500/10',
        onClick: () => onNavigatePage('assistant'),
      },
      {
        id: 'emergency',
        title: t('Emergency Helplines'),
        subtitle: '1990 • 1912 • 119 • 110',
        keywords: 'emergency helplines ambulance 1990 tourist police 1912 police 119 fire 110 safety urgent medical assistance hospital suwa seriya',
        icon: <PhoneCall className="w-5 h-5 text-red-600" />,
        iconBg: 'bg-red-100/90 text-red-700',
        borderHover: 'hover:border-red-300 hover:shadow-red-500/10',
        onClick: () => setEmergencyModalOpen(true),
      },
      {
        id: 'planner',
        title: t('Plan My Trip'),
        subtitle: t('Custom Day-by-Day Route'),
        keywords: 'plan my trip custom day-by-day route travel itinerary planner holiday schedule vacation route builder days trip planning',
        icon: <Calendar className="w-5 h-5 text-blue-700" />,
        iconBg: 'bg-blue-100/90 text-blue-800',
        borderHover: 'hover:border-blue-300 hover:shadow-blue-500/10',
        onClick: () => onNavigatePage('planner'),
      },
      {
        id: 'handbook',
        title: t('Travel Handbook'),
        subtitle: t('Visas, Etiquette & Weather'),
        keywords: 'travel handbook travel guides visas eta etiquette weather currency money lkr sim mobile connectivity culture customs dress code rules',
        icon: <BookOpen className="w-5 h-5 text-pink-600" />,
        iconBg: 'bg-pink-100/90 text-pink-700',
        borderHover: 'hover:border-pink-300 hover:shadow-pink-500/10',
        onClick: () => onNavigatePage('handbook'),
      },
      {
       
        id: 'fuel',
        title: t('Fuel Finder'),
        subtitle: t('Petrol & Diesel Stations'),
        keywords: 'fuel finder petrol diesel stations ceypetco ioc sinopec gas filling station oil tank fuel pass route support automotive road trip',
        icon: <Fuel className="w-5 h-5 text-amber-600" />,
        iconBg: 'bg-amber-100/90 text-amber-700',
        borderHover: 'hover:border-amber-300 hover:shadow-amber-500/10',
        onClick: () => onNavigatePage('fuel'),
      },
    ],
    [onNavigatePage, t]
  );

  // Search tokens and query normalization
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchTokens = React.useMemo(() => {
    return trimmedSearch.split(/\s+/).filter(Boolean);
  }, [trimmedSearch]);

  const isPopularQuery = React.useMemo(() => {
    return [
      'popular',
      'popular destinations',
      'featured',
      'featured highlights',
      'highlights',
      'top destinations',
    ].includes(trimmedSearch);
  }, [trimmedSearch]);

  const isGeneralHotelQuery = React.useMemo(() => {
    return [
      'hotel',
      'hotels',
      'resort',
      'resorts',
      'stay',
      'stays',
      'accommodation',
      'accommodations',
      'lodge',
      'lodges',
      'villa',
      'villas',
    ].includes(trimmedSearch);
  }, [trimmedSearch]);

  const isGeneralFoodQuery = React.useMemo(() => {
    return [
      'food',
      'foods',
      'cuisine',
      'cuisines',
      'dish',
      'dishes',
      'eat',
      'eating',
      'meal',
      'meals',
      'street food',
      'curry',
      'roti',
      'kottu',
    ].includes(trimmedSearch);
  }, [trimmedSearch]);

  // Checks if the user's search query matches any known destination name or id
  const isExactDestinationMatch = React.useMemo(() => {
    if (!trimmedSearch) return false;
    return destinationsData.some(
      (d) =>
        d.name.toLowerCase() === trimmedSearch ||
        d.id.toLowerCase() === trimmedSearch ||
        d.id.toLowerCase().replace(/-/g, ' ') === trimmedSearch
    );
  }, [trimmedSearch]);

  // 1. Destinations Search Results (Case-insensitive, prioritizes exact/name matches, Ella, Kandy, Sigiriya, Galle, Mirissa, Yala, etc.)
  const searchResultsDestinations = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isGeneralHotelQuery || isGeneralFoodQuery) return [];

    return destinationsData
      .map((d) => {
        const nameLower = d.name.toLowerCase();
        const idLower = d.id.toLowerCase();
        const idNoHyphen = idLower.replace(/-/g, ' ');
        const localLower = d.localName.toLowerCase();
        const regionLower = d.region.toLowerCase();
        const categoryLower = d.category.toLowerCase();
        const taglineLower = (d.tagline || '').toLowerCase();
        const descLower = (d.description || '').toLowerCase();
        const highlightsLower = (d.highlights || []).join(' ').toLowerCase();
        const activitiesLower = (d.activities || []).join(' ').toLowerCase();
        const tipsLower = (d.travelTips || []).join(' ').toLowerCase();

        const combinedText = `${nameLower} ${localLower} ${regionLower} ${categoryLower} ${taglineLower} ${descLower} ${highlightsLower} ${activitiesLower} ${tipsLower}`;

        let score = 0;

        // If searching specifically for popular / featured highlights
        if (isPopularQuery && popularFiveIds.includes(d.id)) {
          score = 100000;
        }
        // Priority 1: Exact name or ID match (e.g. "sigiriya", "ella", "kandy", "galle", "mirissa", "yala", "jaffna", etc.)
        else if (nameLower === trimmedSearch || idLower === trimmedSearch || idNoHyphen === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Exact phrase match (e.g. "galle fort", "galle dutch fort", "sigiriya rock")
        else if (
          nameLower + ' fort' === trimmedSearch ||
          nameLower + ' dutch fort' === trimmedSearch ||
          (trimmedSearch === 'galle fort' && d.id === 'galle') ||
          (trimmedSearch === 'galle dutch fort' && d.id === 'galle') ||
          localLower.includes(trimmedSearch) ||
          taglineLower.includes(trimmedSearch) ||
          nameLower.startsWith(trimmedSearch)
        ) {
          score = 95000;
        }
        // Priority 3: Keyword match in name/title
        else if (searchTokens.every((tok) => nameLower.includes(tok))) {
          score = 70000;
        }
        // Priority 4: Category / Region match
        else if (searchTokens.length === 1 && (categoryLower === searchTokens[0] || categoryLower.includes(searchTokens[0]))) {
          score = 40000;
        } else if (searchTokens.length === 1 && regionLower.includes(searchTokens[0])) {
          score = 30000;
        }
        // Priority 5: Description / other keyword match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every((token) => combinedText.includes(token));
          if (allTokensMatch) {
            if (searchTokens.some((tok) => nameLower === tok || nameLower.includes(tok))) {
              score = 20000; // One token is destination name, e.g. "ella" in "ella train"
            } else {
              score = 15000;
            }
          }
        } else if (searchTokens.length === 1 && !isExactDestinationMatch) {
          const token = searchTokens[0];
          if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(combinedText)) {
            score = 5000;
          }
        }

        // If this query is an exact destination name (e.g. "Kandy", "Ella", "Galle", "Colombo"),
        // do not return other destinations that only mention this city as a transit reference.
        if (isExactDestinationMatch && score < 95000) {
          score = 0;
        }

        return { dest: d, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [trimmedSearch, searchTokens, isGeneralHotelQuery, isGeneralFoodQuery, isExactDestinationMatch, isPopularQuery]);

  // 2. Hotels Search Results (Matches destination city, hotel name, region, description, facilities, and general terms like "hotel" or "resort")
  const searchResultsHotels = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isGeneralFoodQuery) return [];

    return hotelsData
      .map((h) => {
        const nameLower = h.name.toLowerCase();
        const destLower = h.destinationName.toLowerCase();
        const destIdLower = (h.destinationId || '').toLowerCase();
        const regionLower = h.region.toLowerCase();
        const badgeLower = (h.badge || '').toLowerCase();
        const descLower = (h.description || '').toLowerCase();
        const facilitiesLower = (h.facilities || []).join(' ').toLowerCase();

        const combinedText = `${nameLower} ${destLower} ${regionLower} ${badgeLower} ${descLower} ${facilitiesLower} hotel resort stay accommodation lodge villa`;

        let score = 0;

        // Priority 2/4: General hotel query (e.g. "hotel", "hotels", "resort", "resorts", "stay", "villa", "lodge")
        if (isGeneralHotelQuery) {
          score = 90000 + Math.round(h.rating * 10);
        }
        // Priority 1: Exact hotel name match
        else if (nameLower === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Exact phrase match
        else if (nameLower.startsWith(trimmedSearch)) {
          score = 95000;
        } else if (nameLower.includes(trimmedSearch)) {
          score = 85000;
        }
        // Priority 3: Keyword match in hotel name
        else if (searchTokens.every((tok) => nameLower.includes(tok))) {
          score = 70000;
        }
        // Priority 4: Destination city match (e.g. "ella", "sigiriya", "galle", "mirissa", "yala", "nuwara eliya", "jaffna")
        else if (destLower === trimmedSearch || destIdLower === trimmedSearch || destLower.includes(trimmedSearch)) {
          score = 35000 + Math.round(h.rating * 10);
        }
        // Priority 5: Description / facilities match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every(
            (token) =>
              combinedText.includes(token) ||
              ['hotel', 'resort', 'stay', 'lodge', 'villa'].includes(token)
          );
          if (allTokensMatch) {
            score = 15000;
          }
        } else if (searchTokens.length === 1 && !isExactDestinationMatch) {
          const token = searchTokens[0];
          if (regionLower.includes(token) || badgeLower.includes(token)) {
            score = 10000;
          } else if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(combinedText)) {
            score = 5000;
          }
        }

        return { hotel: h, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [trimmedSearch, searchTokens, isGeneralHotelQuery, isGeneralFoodQuery, isExactDestinationMatch]);

  // 3. Food Search Results (Matches name e.g. "Kottu Roti", Sinhala name, category, description, and food keywords)
  const searchResultsFood = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isGeneralHotelQuery) return [];

    return foodData
      .map((f) => {
        const nameLower = f.name.toLowerCase();
        const sinhalaLower = (f.sinhalaName || '').toLowerCase();
        const tamilLower = (f.tamilName || '').toLowerCase();
        const categoryLower = f.category.toLowerCase();
        const descLower = (f.description || '').toLowerCase();
        const ingredientsLower = (f.ingredientsOrSpecialties || []).join(' ').toLowerCase();

        const combinedText = `${nameLower} ${sinhalaLower} ${tamilLower} ${categoryLower} ${descLower} ${ingredientsLower} food cuisine dish`;

        let score = 0;

        // Priority 1: Exact name match (e.g. "kottu roti", "egg hopper")
        if (nameLower === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Exact phrase match (e.g. "kottu", "hopper", "curry")
        else if (trimmedSearch === 'kottu' && nameLower.includes('kottu')) {
          score = 95000;
        } else if (nameLower.startsWith(trimmedSearch)) {
          score = 95000;
        } else if (nameLower.includes(trimmedSearch)) {
          score = 90000;
        } else if (sinhalaLower.includes(trimmedSearch) || tamilLower.includes(trimmedSearch)) {
          score = 85000;
        }
        // Priority 2/4: General food / cuisine query
        else if (['food', 'foods', 'cuisine', 'dish', 'dishes'].includes(trimmedSearch)) {
          score = 90000;
        } else if (categoryLower.includes(trimmedSearch)) {
          score = 40000;
        }
        // Priority 3: Keyword match in name
        else if (searchTokens.every((tok) => nameLower.includes(tok))) {
          score = 70000;
        }
        // Priority 5: Ingredients / description match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every((token) => combinedText.includes(token));
          if (allTokensMatch) score = 15000;
        } else if (searchTokens.length === 1 && !isExactDestinationMatch) {
          const token = searchTokens[0];
          if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(ingredientsLower)) score = 10000;
          else if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(descLower)) score = 5000;
        }

        return { food: f, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [trimmedSearch, searchTokens, isGeneralFoodQuery, isGeneralHotelQuery, isExactDestinationMatch]);

  // 4. Transport & Trains Search Results (Specifically handles "Ella Train", train routes, tuk-tuks, etc.)
  const searchResultsTransport = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isGeneralHotelQuery || isGeneralFoodQuery) return [];

    const isGeneralTransportQuery = [
      'train',
      'trains',
      'rail',
      'railway',
      'railways',
      'transit',
      'transport',
      'tuktuk',
      'tuk-tuk',
      'bus',
      'car',
    ].includes(trimmedSearch);

    return transportData
      .map((tItem) => {
        const titleLower = tItem.title.toLowerCase();
        const typeLower = tItem.type.toLowerCase();
        const taglineLower = (tItem.tagline || '').toLowerCase();
        const descLower = (tItem.description || '').toLowerCase();
        const routesLower = (tItem.popularRoutes || [])
          .map((r) => `${r.from} ${r.to}`)
          .join(' ')
          .toLowerCase();
        const tipsLower = (tItem.touristTips || []).join(' ').toLowerCase();

        const combinedText = `${titleLower} ${typeLower} ${taglineLower} ${descLower} ${routesLower} ${tipsLower} transport transit train`;

        let score = 0;

        // Specific high-relevance query: "Ella Train" -> Sri Lanka Railways
        const isEllaTrainQuery =
          trimmedSearch === 'ella train' ||
          trimmedSearch === 'ella scenic train' ||
          (trimmedSearch.includes('ella') && (trimmedSearch.includes('train') || trimmedSearch.includes('rail')));

        if (isEllaTrainQuery && tItem.id === 'trains') {
          score = 95000; // Priority 2: Exact phrase match for Ella Train
        }
        // Priority 1: Exact title match
        else if (titleLower === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Title starts with / includes query
        else if (titleLower.startsWith(trimmedSearch) || titleLower.includes(trimmedSearch)) {
          score = 90000;
        }
        // Priority 2/4: Exact type match (e.g. "train", "tuk-tuk", "bus")
        else if (
          typeLower === trimmedSearch ||
          (typeLower === 'train' && ['train', 'trains', 'rail', 'railway', 'railways'].includes(trimmedSearch)) ||
          (['tuktuk', 'tuk-tuk'].includes(trimmedSearch) && tItem.id === 'tuktuk') ||
          (['bus', 'expressway bus'].includes(trimmedSearch) && tItem.id === 'bus')
        ) {
          score = 90000;
        } else if (isGeneralTransportQuery) {
          score = 70000;
        }
        // Priority 3: Keyword match in title
        else if (searchTokens.every((tok) => titleLower.includes(tok) || typeLower.includes(tok))) {
          score = 70000;
        }
        // Priority 5: Description / route match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every((token) => combinedText.includes(token));
          if (allTokensMatch) {
            if (searchTokens.some((tok) => routesLower.includes(tok))) {
              score = 25000;
            } else {
              score = 15000;
            }
          }
        } else if (searchTokens.length === 1 && !isExactDestinationMatch) {
          const token = searchTokens[0];
          if (routesLower.includes(token)) {
            score = 15000;
          } else if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(combinedText)) {
            score = 5000;
          }
        }

        return { item: tItem, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [trimmedSearch, searchTokens, isGeneralHotelQuery, isGeneralFoodQuery, isExactDestinationMatch]);

  // 5. Travel Guides Search Results (Searches across all 6 travel guides in AllGuidesView)
  const searchResultsGuides = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isGeneralHotelQuery) return [];

    const isGeneralGuideQuery = [
      'guide',
      'guides',
      'travel guide',
      'travel guides',
      'handbook',
      'handbooks',
      'article',
      'articles',
    ].includes(trimmedSearch);

    return travelGuidesData
      .map((guide) => {
        const titleLower = guide.title.toLowerCase();
        const catLower = guide.category.toLowerCase();
        const summaryLower = guide.summary.toLowerCase();
        const highlightsLower = (guide.highlights || []).join(' ').toLowerCase();
        const combined = `${titleLower} ${catLower} ${summaryLower} ${highlightsLower} guide travel`;

        let score = 0;

        if (isGeneralGuideQuery) {
          score = 85000;
        }
        // Priority 1: Exact title match
        else if (titleLower === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Title starts with / includes query
        else if (titleLower.startsWith(trimmedSearch)) {
          score = 95000;
        } else if (titleLower.includes(trimmedSearch)) {
          score = 85000;
        }
        // "Ella Train" query -> train ticket guide (ranked after Sri Lanka Railways)
        else if ((trimmedSearch === 'ella train' || (trimmedSearch.includes('ella') && trimmedSearch.includes('train'))) && guide.id === 'train-ticket') {
          score = 60000;
        }
        // "Kottu" query -> street food guide (ranked after Kottu Roti)
        else if (trimmedSearch === 'kottu' && guide.id === 'street-food') {
          score = 25000;
        }
        // Priority 3: Keyword match in title
        else if (searchTokens.every((tok) => titleLower.includes(tok))) {
          score = 70000;
        } else if (searchTokens.some((tok) => titleLower.includes(tok))) {
          score = 50000;
        }
        // Priority 4: Category match
        else if (catLower.includes(trimmedSearch)) {
          score = 40000;
        }
        // Priority 5: Description / highlights match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every((token) => combined.includes(token));
          if (allTokensMatch) score = 15000;
        } else if (searchTokens.length === 1 && !isExactDestinationMatch) {
          const token = searchTokens[0];
          if (new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(combined)) score = 5000;
        }

        return { guide, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [trimmedSearch, searchTokens, isGeneralHotelQuery, isExactDestinationMatch]);

  // 6. Explore LankaMate Quick-Action Cards Search Results
  const searchResultsExplore = React.useMemo(() => {
    if (!trimmedSearch) return [];
    if (isExactDestinationMatch) return [];

    const isGeneralExploreQuery = [
      'explore',
      'lankamate',
      'explore lankamate',
      'services',
      'service',
      'essential',
      'essential services',
      'features',
    ].includes(trimmedSearch);

    return quickActions
      .map((action) => {
        const titleLower = action.title.toLowerCase();
        const subtitleLower = action.subtitle.toLowerCase();
        const keywordsLower = (action.keywords || '').toLowerCase();
        const combined = `${titleLower} ${subtitleLower} ${keywordsLower} explore lankamate service`;

        let score = 0;

        if (isGeneralExploreQuery) {
          score = 80000;
        }
        // Priority 1: Exact title match
        else if (titleLower === trimmedSearch) {
          score = 100000;
        }
        // Priority 2: Title starts with / includes query
        else if (titleLower.startsWith(trimmedSearch)) {
          score = 95000;
        } else if (titleLower.includes(trimmedSearch)) {
          score = 85000;
        }
        // Contextual quick actions (ranked below actual content items)
        else if (['hotel', 'hotels', 'resort', 'resorts'].includes(trimmedSearch) && action.id === 'hotels') {
          score = 85000; // Right below hotel listings
        } else if (['emergency', '1990', 'police', 'ambulance', 'hospital'].includes(trimmedSearch) && action.id === 'emergency') {
          score = 95000;
        } else if (['plan', 'planner', 'itinerary'].includes(trimmedSearch) && action.id === 'plan') {
          score = 90000;
        } else if (['ai', 'ai guide', 'assistant', 'chat'].includes(trimmedSearch) && action.id === 'guide') {
          score = 90000;
        } else if ((trimmedSearch === 'ella train' || trimmedSearch.includes('train')) && action.id === 'transport') {
          score = 35000;
        } else if (trimmedSearch === 'kottu' && action.id === 'food') {
          score = 30000;
        }
        // Priority 3: Keyword match in title
        else if (searchTokens.every((tok) => titleLower.includes(tok))) {
          score = 70000;
        }
        // Priority 5: Description / keywords match
        else if (searchTokens.length > 1) {
          const allTokensMatch = searchTokens.every((token) => combined.includes(token));
          if (allTokensMatch) score = 15000;
        } else if (searchTokens.length === 1) {
          const token = searchTokens[0];
          if (keywordsLower.includes(token) || subtitleLower.includes(token)) score = 10000;
        }

        return { action, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [trimmedSearch, searchTokens, isExactDestinationMatch, quickActions]);

  // Combined Active Search Result Sections, dynamically sorted so the highest-scoring section & result appears FIRST
  const activeSections = React.useMemo(() => {
    const sections = [];

    if (searchResultsDestinations.length > 0) {
      sections.push({
        id: 'destinations' as const,
        title: 'Places & Destinations',
        badgeColor: 'text-emerald-800',
        bgColor: 'bg-white',
        items: searchResultsDestinations,
        maxScore: searchResultsDestinations[0].score,
      });
    }

    if (searchResultsHotels.length > 0) {
      sections.push({
        id: 'hotels' as const,
        title: 'Hotels & Resorts',
        badgeColor: 'text-purple-800',
        bgColor: 'bg-purple-50/30',
        items: searchResultsHotels,
        maxScore: searchResultsHotels[0].score,
      });
    }

    if (searchResultsFood.length > 0) {
      sections.push({
        id: 'food' as const,
        title: 'Sri Lankan Cuisine',
        badgeColor: 'text-orange-800',
        bgColor: 'bg-orange-50/30',
        items: searchResultsFood,
        maxScore: searchResultsFood[0].score,
      });
    }

    if (searchResultsTransport.length > 0) {
      sections.push({
        id: 'transport' as const,
        title: 'Trains & Transit',
        badgeColor: 'text-cyan-800',
        bgColor: 'bg-cyan-50/30',
        items: searchResultsTransport,
        maxScore: searchResultsTransport[0].score,
      });
    }

    if (searchResultsGuides.length > 0) {
      sections.push({
        id: 'guides' as const,
        title: 'Travel Guides',
        badgeColor: 'text-amber-900',
        bgColor: 'bg-amber-50/40',
        items: searchResultsGuides,
        maxScore: searchResultsGuides[0].score,
      });
    }

    if (searchResultsExplore.length > 0) {
      sections.push({
        id: 'explore' as const,
        title: 'Explore LankaMate',
        badgeColor: 'text-blue-900',
        bgColor: 'bg-blue-50/40',
        items: searchResultsExplore,
        maxScore: searchResultsExplore[0].score,
      });
    }

    return sections.sort((a, b) => b.maxScore - a.maxScore);
  }, [
    searchResultsDestinations,
    searchResultsHotels,
    searchResultsFood,
    searchResultsTransport,
    searchResultsGuides,
    searchResultsExplore,
  ]);

  const hasSearchResults = activeSections.length > 0;

  // Handle Search Submission (via Enter key or Search button)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trimmedSearch) return;

    // Automatically scroll directly to the FIRST actual matching result card
    scrollToFirstResult();
  };

  const weatherHighlights = React.useMemo(
    () => [
      { city: t('Colombo'), temp: '31°C', condition: t('Sunny & Tropical') },
      { city: t('Kandy'), temp: '27°C', condition: t('Mild & Breezy') },
      { city: t('Nuwara Eliya'), temp: '17°C', condition: t('Crisp Highlands') },
      { city: t('Galle'), temp: '29°C', condition: t('Coastal Sunshine') },
      { city: t('Sigiriya'), temp: '31°C', condition: t('Warm & Clear') },
      { city: t('Mirissa'), temp: '30°C', condition: t('Beach & Surf') },
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-stone-50/70 space-y-8 sm:space-y-12 pb-24 text-stone-900">
      {/* Top App Header & Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c2340] via-[#0f2b5c] to-[#163664] text-white pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Brand Identity Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-black/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0c2340] rounded-[14px] flex items-center justify-center">
                  <span className="text-xl select-none" role="img" aria-label={t('Sri Lanka')}>
                    🇱🇰
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white flex items-center">
                    Lanka<span className="text-sky-400">Mate</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 text-[10px] font-bold tracking-wider uppercase border border-sky-400/30">
                    {t('Official Guide')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-sky-200/90 tracking-wide">
                  {t('Your Local Friend in Sri Lanka')}
                </p>
              </div>
            </div>

            {/* Quick Emergency Action on Mobile/Desktop Header */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-header-emergency"
                onClick={() => setEmergencyModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer touch-manipulation border border-red-400/40"
                title={t('Tap for Emergency Helplines (1990, 1912, 119, 110)')}
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">{t('Emergency')}</span>
                <span className="text-[10px] font-black bg-white text-red-700 px-1 py-0.2 rounded">
                  1990
                </span>
              </button>
            </div>
          </div>

          {/* Large Scenic Sri Lankan Hero Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-stone-900 group min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex flex-col justify-end p-5 sm:p-8 md:p-10">
            {/* Authentic Sri Lankan Scenic Image */}
            <img
              src="/images/destinations/sigiriya.jpg"
              alt={t('Sigiriya Lion Rock Sri Lanka')}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Contrast Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340] via-[#0c2340]/60 to-transparent" />
            <div className="absolute inset-0 bg-black/25" />

            {/* Content Over Hero */}
            <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Ayubowan! Welcome to the Wonder of Asia')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {t('Discover Ancient Wonder, Tea Highlands & Coasts')}
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-100/90 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                {t('UNESCO World Heritage sites, tea mountains, golden beaches, and wild reserves across all 25 districts.')}
              </p>

              {/* Badges & Quick Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="btn-hero-plan-trip"
                  onClick={() => onNavigatePage('planner')}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-black text-xs sm:text-sm tracking-wide shadow-lg transition-all cursor-pointer touch-manipulation"
                >
                  <Calendar className="w-4 h-4 text-stone-950" />
                  <span>{t('Plan My Trip')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  id="btn-hero-map"
                  onClick={() => onNavigatePage('map')}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white border border-white/25 font-bold text-xs sm:text-sm transition-all cursor-pointer touch-manipulation"
                >
                  <Map className="w-4 h-4 text-sky-300" />
                  <span>{t('Sri Lanka Map')}</span>
                </button>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md text-[11px] text-white/90 border border-white/10 ml-auto">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{t('Sigiriya Lion Rock Fortress')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Interactive Search Bar */}
          <div
            id="home-search-container"
            ref={searchContainerRef}
            className="relative max-w-3xl mx-auto pt-2"
          >
            <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-2xl border border-slate-200/90 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-400/20 transition-all">
              <div className="p-2 sm:p-2.5 rounded-xl bg-sky-50 text-blue-900 ml-1 shrink-0">
                <Search className="w-5 h-5 text-blue-900" />
              </div>
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                placeholder={t('Search places, hotels, food…', 'Search places, hotels, food…')}
                className="w-full px-3 py-2 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="btn-clear-search"
                  onClick={() => {
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors mr-1 cursor-pointer"
                  title={t('Clear search')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                id="btn-search-explore"
                onClick={() => handleSearchSubmit()}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer shadow-sm touch-manipulation"
              >
                {t('Search')}
              </button>
            </div>

            {/* Instant Search Results Dropdown Panel */}
            {searchQuery.trim() && (
              <div
                id="search-results-section"
                ref={searchResultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 max-h-[28rem] overflow-y-auto divide-y divide-slate-100 text-stone-900 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Search Results Section Header */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xs">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-blue-900" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {t('Search Results')}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t('Matches for')} "{searchQuery}"
                  </span>
                </div>
                {hasSearchResults ? (
                  <>
                    {activeSections.map((section, sIdx) => {
                      if (section.id === 'destinations') {
                        return (
                          <div key={section.id} className="p-3">
                            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2 px-1">
                              {t('Places & Destinations')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ dest }, itemIdx) => {
                                const locDest = getLocalizedDestination(dest, language);
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={dest.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      onSelectDestination(dest);
                                      onNavigatePage('destinations');
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 text-left transition-colors cursor-pointer group"
                                  >
                                    <img
                                      src={dest.heroImage}
                                      alt={locDest.name}
                                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          '/images/destinations/placeholder-destination.svg';
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-emerald-900 truncate flex items-center gap-1.5">
                                        <span>{locDest.name}</span>
                                        {popularFiveIds.includes(dest.id) && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                            {t('★ Popular')}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {locDest.region} • {locDest.category}
                                      </div>
                                      {dest.photoCredit && (
                                        <a
                                          href={dest.photoCredit.licenseUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={(event) => event.stopPropagation()}
                                          className="block truncate text-[9px] text-stone-500 hover:underline"
                                        >
                                          Photo: {dest.photoCredit.author} · {dest.photoCredit.source} · {dest.photoCredit.license}
                                        </a>
                                      )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.id === 'hotels') {
                        return (
                          <div key={section.id} className="p-3 bg-purple-50/30">
                            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-2 px-1">
                              {t('Hotels & Resorts')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ hotel }, itemIdx) => {
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={hotel.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      onNavigatePage('hotels');
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer group"
                                  >
                                    <img
                                      src={hotel.image}
                                      alt={hotel.name}
                                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-purple-900 truncate">
                                        {hotel.name}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {t(hotel.destinationName)} • ${hotel.pricePerNightUsd} {t('/night')}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-purple-700 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.id === 'food') {
                        return (
                          <div key={section.id} className="p-3 bg-orange-50/30">
                            <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block mb-2 px-1">
                              {t('Sri Lankan Cuisine')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ food }, itemIdx) => {
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={food.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      onNavigatePage('food');
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 text-left transition-colors cursor-pointer group"
                                  >
                                    <img
                                      src={food.image}
                                      alt={food.name}
                                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-orange-900 truncate">
                                        {t(food.name)}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {food.sinhalaName} • {t(food.category)}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-orange-700 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.id === 'transport') {
                        return (
                          <div key={section.id} className="p-3 bg-cyan-50/30">
                            <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block mb-2 px-1">
                              {t('Trains & Transit')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ item }, itemIdx) => {
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={item.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      onNavigatePage('transport');
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-cyan-50 text-left transition-colors cursor-pointer group"
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-cyan-900 truncate">
                                        {t(item.title)}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {t(item.tagline)}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-cyan-700 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.id === 'guides') {
                        return (
                          <div key={section.id} className="p-3 bg-amber-50/40">
                            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-2 px-1">
                              {t('Travel Guides')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ guide }, itemIdx) => {
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={guide.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      onNavigatePage(guide.targetPage);
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-amber-100/60 text-left transition-colors cursor-pointer group"
                                  >
                                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                                      <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-amber-950 truncate">
                                        {t(guide.title)}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {t(guide.category)} • {t(guide.readingTime)}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-amber-800 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.id === 'explore') {
                        return (
                          <div key={section.id} className="p-3 bg-blue-50/40">
                            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-2 px-1">
                              {t('Explore LankaMate')} ({section.items.length})
                            </span>
                            <div className="space-y-1">
                              {section.items.map(({ action }, itemIdx) => {
                                const isFirstResult = sIdx === 0 && itemIdx === 0;
                                return (
                                  <button
                                    key={action.id}
                                    id={isFirstResult ? 'first-search-result-card' : undefined}
                                    type="button"
                                    onClick={() => {
                                      action.onClick();
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-100/60 text-left transition-colors cursor-pointer group"
                                  >
                                    <div
                                      className={`w-12 h-12 rounded-lg ${action.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
                                    >
                                      {action.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-stone-900 text-sm group-hover:text-blue-950 truncate">
                                        {action.title}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {action.subtitle}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-blue-900 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </>
                ) : (
                  <div className="p-6 text-center text-sm text-stone-500">
                    {t('No results found for')} "{searchQuery}". {t('Try "Sigiriya", "Ella", "Kottu", or "Hotel".')}
                  </div>
                )}
              </div>
            )}

            {/* Quick Filter Tags / Suggestions */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-sky-200/80 font-bold shrink-0">{t('Popular:')}</span>
              {[
                { label: t('Sigiriya'), query: 'Sigiriya' },
                { label: t('Ella Train', 'Ella Train'), query: 'Ella Train' },
                { label: t('Galle Fort', 'Galle Fort'), query: 'Galle Fort' },
                { label: t('Kottu Roti', 'Kottu Roti'), query: 'Kottu Roti' },
                { label: t('Kandy'), query: 'Kandy' },
                { label: t('Mirissa'), query: 'Mirissa' },
              ].map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.query);
                    setTimeout(scrollToFirstResult, 50);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-medium shrink-0 transition-colors cursor-pointer backdrop-blur-xs border border-white/10"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main App Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Section 4: Colorful Rounded Quick-Action Cards (ONLY EXISTING FEATURES) */}
        <section id="home-quick-actions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 mb-0.5">
                <Compass className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('Essential Services')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('Explore LankaMate')}
              </h3>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline-block">
              {t('Tap any category to launch')}
            </span>
          </div>

          {/* 8 Colorful Rounded Feature Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                id={`btn-home-${action.id}`}
                onClick={action.onClick}
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md ${action.borderHover} transition-all duration-200 text-left cursor-pointer group touch-manipulation active:scale-[0.98] w-full`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-2xs`}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-blue-950 transition-colors truncate">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5 font-medium">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 5: Beautiful "Plan Your Perfect Trip" Promotional Section */}
        <section id="home-plan-promo" className="relative rounded-3xl overflow-hidden shadow-xl border border-blue-950/20 bg-gradient-to-r from-[#0c2340] via-[#12305a] to-[#0f2b5c] text-white p-6 sm:p-8 md:p-10">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-bold tracking-wide border border-sky-400/30">
                <Calendar className="w-3.5 h-3.5 text-sky-300" />
                <span>{t('Custom Sri Lanka Travel Planner')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
                {t('Plan Your Perfect Trip across Sri Lanka')}
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
                {t(
                  'Generate a personalized day-by-day itinerary tailored to your duration, travel pace, and preferred regions. Includes reserved scenic train tips, curated heritage stays, and authentic regional dining recommendations.'
                )}
              </p>

              {/* Key Planner Highlights Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-semibold text-sky-100 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> {t('3–14 Day Itineraries')}
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-semibold text-sky-100 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> {t('Scenic Train Timings')}
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-semibold text-sky-100 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> {t('Curated Stays')}
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-semibold text-sky-100 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> {t('Food Highlights')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                type="button"
                id="btn-promo-open-planner"
                onClick={() => {
                  onNavigatePage('planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-black text-sm tracking-wide rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation group"
              >
                <span>{t('Start Planning My Trip')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                id="btn-promo-view-7day"
                onClick={() => {
                  onNavigatePage('itinerary-7day');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 px-5 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <span>{t('Browse 7-Day Classic Route')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 6: Popular Destinations (Sigiriya, Ella, Galle, Kandy, Mirissa) */}
        <section id="home-popular-destinations" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('Featured Highlights')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {t('Popular Destinations')}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                {t('Handpicked iconic wonderlands representing the best of Sri Lanka')}
              </p>
            </div>

            <button
              type="button"
              id="btn-view-all-destinations"
              onClick={() => {
                onNavigatePage('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-950 transition-colors cursor-pointer group"
            >
              <span>{t('View All 12+ Destinations')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 5 Popular Destinations Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {popularDestinations.map((dest) => (
              <div
                key={dest.id}
                id={`popular-dest-${dest.id}`}
                className="group bg-white rounded-2xl shadow-xs hover:shadow-lg border border-stone-200/90 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                {/* Destination Image & Floating Controls */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/destinations/placeholder-destination.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {dest.photoCredit && (
                    <a
                      href={dest.photoCredit.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2 right-2 z-20 rounded bg-black/70 px-2 py-1 text-[9px] text-white hover:bg-black/90"
                    >
                      Photo: {dest.photoCredit.author} · {dest.photoCredit.source} · {dest.photoCredit.license}
                    </a>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-bold shadow-xs">
                      {dest.category}
                    </span>
                  </div>

                  {/* Favourite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavourite({
                        id: dest.id,
                        type: 'destination',
                        title: dest.name,
                        subtitle: dest.region,
                        image: dest.heroImage,
                        linkPage: 'destinations',
                        targetId: dest.id,
                      });
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs touch-manipulation"
                    title={isFavourite(dest.id) ? t('Remove from Favourites') : t('Save to Favourites')}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavourite(dest.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {/* Destination Name & Local Subtitle on image bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="text-lg font-black tracking-tight leading-tight drop-shadow-xs">
                      {dest.name}
                    </h4>
                    <p className="text-[11px] text-amber-300 font-medium truncate drop-shadow-xs">
                      {dest.localName}
                    </p>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed font-normal">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-2 font-medium">
                    <span className="flex items-center gap-1 truncate max-w-[130px]" title={dest.travelTimeFromColombo}>
                      <Clock className="w-3 h-3 text-blue-800 shrink-0" />
                      <span className="truncate">
                        {language === 'en'
                          ? `${dest.travelTimeFromColombo.split(' ')[0]}h ${t('from CMB')}`
                          : dest.travelTimeFromColombo.split('(')[0].trim()}
                      </span>
                    </span>
                    <span className="font-bold text-emerald-800">{dest.weather.tempC}°C</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDestination(dest);
                      onNavigatePage('destinations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-900 text-blue-900 hover:text-white font-bold text-xs transition-colors cursor-pointer touch-manipulation shadow-2xs"
                  >
                    <span>{t('Explore Place')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Beautiful Beaches of Sri Lanka 🏝️ */}
        <section id="home-beautiful-beaches" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('Tropical Shorelines & Coastal Gems')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <span>{t('Beautiful Beaches of Sri Lanka')}</span>
                <span className="text-2xl sm:text-3xl" aria-hidden="true">🏝️</span>
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                {t('Golden sands, calm turquoise bays, coral reef sanctuaries, and world-renowned surf pointbreaks')}
              </p>
            </div>

            {/* Quick Coastline Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: t('All 10 Beaches') },
                { id: 'southern', label: t('Southern Coast') },
                { id: 'eastern', label: t('Eastern Coast') },
                { id: 'southwest', label: t('Southwest Coast') },
              ].map((filter) => {
                const isActive = beachFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setBeachFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer touch-manipulation ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 10 Sri Lankan Beach Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {filteredBeaches.map((beach) => (
              <div
                key={beach.id}
                id={beach.id}
                className="group bg-white rounded-2xl shadow-xs hover:shadow-lg border border-stone-200/90 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                {/* Authentic Sri Lankan Beach Photo */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Region Pill */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-stone-900 text-[10px] font-bold shadow-xs">
                      {beach.region}
                    </span>
                  </div>

                  {/* Favourite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavourite({
                        id: beach.id,
                        type: 'beach',
                        title: beach.name,
                        subtitle: beach.location,
                        image: beach.image,
                        linkPage: 'home',
                        targetId: beach.id,
                      });
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs touch-manipulation"
                    title={isFavourite(beach.id) ? t('Remove from Favourites') : t('Save to Favourites')}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavourite(beach.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {/* Beach Name & Local Name on Image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="text-base sm:text-lg font-black tracking-tight leading-tight drop-shadow-xs">
                      {beach.name}
                    </h4>
                    <p className="text-[11px] text-amber-300 font-medium truncate drop-shadow-xs">
                      {beach.localName}
                    </p>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Location with Pin */}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{beach.location}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed font-normal">
                      {beach.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-stone-100">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                      <span className="flex items-center gap-1 truncate max-w-[170px]" title={beach.bestSeason}>
                        <Sun className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{beach.bestSeason.split('(')[0].trim()}</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                        {beach.vibe.split('&')[0].trim()}
                      </span>
                    </div>

                    {/* “Explore” Button */}
                    <button
                      type="button"
                      id={`btn-explore-${beach.id}`}
                      onClick={() => setSelectedBeachModal(beach)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs transition-colors cursor-pointer touch-manipulation shadow-2xs group"
                      title={`${t('Explore')} ${beach.name}`}
                    >
                      <span>{t('Explore')}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Interactive Sri Lanka Map Showcase Section */}
        <section className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">
                <Map className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('Interactive Visual Navigation')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('Explore Sri Lanka on the Interactive Island Map')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t(
                  'Filter by cultural regions (Cultural Triangle, Hill Country, Southern Coast, Wildlife & Safari), tap map pins to view real-time travel times, weather, and instant destinations dossier.'
                )}
              </p>
            </div>

            <button
              type="button"
              id="btn-open-interactive-map"
              onClick={() => {
                onNavigatePage('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-3.5 px-6 rounded-2xl bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 touch-manipulation"
            >
              <Map className="w-4 h-4 text-sky-300" />
              <span>{t('Open Interactive Island Map')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Island Weather Ticker */}
        <section className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">{t('Current Island Climate Overview')}</h4>
                <p className="text-xs text-stone-500">
                  {t("Year-round tropical sunshine across Sri Lanka's coasts and hills")}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit">
              {t('Dual Monsoon Guidance')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {weatherHighlights.map((w) => (
              <div
                key={w.city}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-blue-200 transition-colors"
              >
                <div className="text-xs font-bold text-stone-700">{w.city}</div>
                <div className="text-lg font-black text-blue-950 mt-0.5">{w.temp}</div>
                <div className="text-[11px] text-stone-500 truncate">{w.condition}</div>
              </div>
            ))}
          </div>
        </section>

        {/* On-the-Road Travel Support: Fuel Finder Quick Card */}
        <section id="home-fuel-finder-card" className="bg-gradient-to-r from-[#0c2340] via-[#12305a] to-[#0c2340] rounded-3xl p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 border border-blue-950/40 shadow-md">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-xs">
              <Fuel className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                  {t('On-the-Road Travel Support')}
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  {t('Fuel Station Directory')}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                {t('Fuel Finder — Stations across Sri Lanka')}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {t(
                  'Locate Ceypetco, Lanka IOC, and Sinopec filling stations across major transit corridors, expressways, Colombo, Kandy, Galle, and hill country mountain passes with GPS navigation.'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-home-open-fuel-finder"
            onClick={() => {
              onNavigatePage('fuel');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3 px-5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 rounded-2xl text-xs sm:text-sm font-black shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer touch-manipulation group"
          >
            <Fuel className="w-4 h-4" />
            <span>{t('Open Fuel Finder')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* Emergency Tap-to-Call Dedicated Card (VERY IMPORTANT FEATURE) */}
        <section id="home-emergency-section" className="bg-red-50/70 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-red-950">
                  {t('Sri Lanka Nationwide Emergency Helplines')}
                </h4>
                <p className="text-xs text-red-900/80">
                  {t('Free 24/7 toll-free emergency call lines active across all nine provinces')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-white text-red-700 px-3 py-1 rounded-full border border-red-200 w-fit">
              {t('Tap to Call Instantly')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1990 Free Ambulance */}
            <a
              href="tel:1990"
              id="btn-home-call-1990"
              className="w-full text-left p-3.5 bg-white hover:bg-red-50 active:bg-red-100 border border-red-200 rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-between touch-manipulation group"
              title={t('Call Free Ambulance 1990')}
            >
              <div>
                <span className="text-[11px] font-bold text-red-600 block">{t('🚑 Free Ambulance')}</span>
                <span className="text-base font-black text-stone-900 block mt-0.5">1990</span>
                <span className="text-[10px] text-stone-500">{t('Suwa Seriya Nationwide')}</span>
              </div>
              <span className="px-3 py-1.5 bg-red-600 group-hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-2xs">
                {t('Call')}
              </span>
            </a>

            {/* 1912 Tourist Police */}
            <a
              href="tel:1912"
              id="btn-home-call-1912"
              className="w-full text-left p-3.5 bg-white hover:bg-sky-50 active:bg-sky-100 border border-sky-200 rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-between touch-manipulation group"
              title={t('Call Tourist Police 1912')}
            >
              <div>
                <span className="text-[11px] font-bold text-sky-700 block">{t('👮 Tourist Police')}</span>
                <span className="text-base font-black text-stone-900 block mt-0.5">1912</span>
                <span className="text-[10px] text-stone-500">{t('Visitor Assistance 24/7')}</span>
              </div>
              <span className="px-3 py-1.5 bg-sky-700 group-hover:bg-sky-800 text-white rounded-xl text-xs font-black shadow-2xs">
                {t('Call')}
              </span>
            </a>

            {/* 119 Police Dispatch */}
            <a
              href="tel:119"
              id="btn-home-call-119"
              className="w-full text-left p-3.5 bg-white hover:bg-amber-50 active:bg-amber-100 border border-amber-200 rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-between touch-manipulation group"
              title={t('Call Police Dispatch 119')}
            >
              <div>
                <span className="text-[11px] font-bold text-amber-700 block">{t('🚨 Police Dispatch')}</span>
                <span className="text-base font-black text-stone-900 block mt-0.5">119</span>
                <span className="text-[10px] text-stone-500">{t('National Police Emergency')}</span>
              </div>
              <span className="px-3 py-1.5 bg-amber-600 group-hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-2xs">
                {t('Call')}
              </span>
            </a>

            {/* 110 Fire & Rescue */}
            <a
              href="tel:110"
              id="btn-home-call-110"
              className="w-full text-left p-3.5 bg-white hover:bg-orange-50 active:bg-orange-100 border border-orange-200 rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-between touch-manipulation group"
              title={t('Call Fire & Rescue 110')}
            >
              <div>
                <span className="text-[11px] font-bold text-orange-700 block">{t('🚒 Fire & Rescue')}</span>
                <span className="text-base font-black text-stone-900 block mt-0.5">110</span>
                <span className="text-[10px] text-stone-500">{t('Municipal Fire Brigade')}</span>
              </div>
              <span className="px-3 py-1.5 bg-orange-600 group-hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-2xs">
                {t('Call')}
              </span>
            </a>
          </div>
        </section>
      </div>

      {/* Emergency Modal Dialog */}
      {emergencyModalOpen && (
        <div
          id="emergency-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation"
          onClick={() => setEmergencyModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                    {t('Immediate Assistance')}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 leading-snug">
                    {t('Emergency Helplines')}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(false)}
                className="p-2 -mr-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer touch-manipulation"
                aria-label={t('Close modal')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t('Tap any of the verified toll-free numbers below to connect instantly on mobile:')}
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:1990"
                id="btn-modal-call-1990"
                className="w-full text-left flex items-center justify-between p-3.5 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl border border-red-200 text-stone-900 transition-colors cursor-pointer touch-manipulation"
                title={t('Call Free Ambulance 1990')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚑</span>
                  <div>
                    <h4 className="font-bold text-sm text-red-950">{t('1990 — Free Ambulance')}</h4>
                    <p className="text-xs text-stone-500">{t('Suwa Seriya Pre-Hospital Care')}</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black">
                  {t('Call Now')}
                </span>
              </a>

              <a
                href="tel:1912"
                id="btn-modal-call-1912"
                className="w-full text-left flex items-center justify-between p-3.5 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-xl border border-sky-200 text-stone-900 transition-colors cursor-pointer touch-manipulation"
                title={t('Call Tourist Police 1912')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👮</span>
                  <div>
                    <h4 className="font-bold text-sm text-sky-950">{t('1912 — Tourist Police')}</h4>
                    <p className="text-xs text-stone-500">{t('Dedicated Foreign Traveler Assistance')}</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-sky-700 text-white rounded-xl text-xs font-black">
                  {t('Call Now')}
                </span>
              </a>

              <a
                href="tel:119"
                id="btn-modal-call-119"
                className="w-full text-left flex items-center justify-between p-3.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 rounded-xl border border-amber-200 text-stone-900 transition-colors cursor-pointer touch-manipulation"
                title={t('Call Police Dispatch 119')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-bold text-sm text-amber-950">{t('119 — Police Dispatch')}</h4>
                    <p className="text-xs text-stone-500">{t('National Police Emergency Service')}</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-black">
                  {t('Call Now')}
                </span>
              </a>

              <a
                href="tel:110"
                id="btn-modal-call-110"
                className="w-full text-left flex items-center justify-between p-3.5 bg-orange-50 hover:bg-orange-100 active:bg-orange-200 rounded-xl border border-orange-200 text-stone-900 transition-colors cursor-pointer touch-manipulation"
                title={t('Call Fire & Rescue 110')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚒</span>
                  <div>
                    <h4 className="font-bold text-sm text-orange-950">{t('110 — Fire & Rescue')}</h4>
                    <p className="text-xs text-stone-500">{t('Emergency Fire Service')}</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-black">
                  {t('Call Now')}
                </span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(false)}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Beach Exploration Modal */}
      {selectedBeachModal && (() => {
        const localizedModalBeach = getLocalizedBeaches([selectedBeachModal], language)[0] || selectedBeachModal;
        return (
        <div
          id="beach-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation animate-in fade-in duration-200"
          onClick={() => setSelectedBeachModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image with Gradient & Badges */}
            <div className="relative h-56 sm:h-64 w-full bg-stone-900 shrink-0">
              <img
                src={localizedModalBeach.image}
                alt={localizedModalBeach.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedBeachModal(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer touch-manipulation shadow-md"
                aria-label={t('Close')}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Region Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-stone-950 text-xs font-black shadow-sm flex items-center gap-1.5">
                  <Palmtree className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{localizedModalBeach.region}</span>
                </span>
              </div>

              {/* Title & Local Name */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="text-xs text-amber-300 font-bold mb-0.5">
                  {localizedModalBeach.localName}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-xs">
                  {localizedModalBeach.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{localizedModalBeach.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Quick Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
                  <Sun className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">{t('Best Time to Visit')}</span>
                    <span className="text-xs text-emerald-950 font-medium">{localizedModalBeach.bestSeason}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                  <Waves className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-blue-900 block">{t('Beach Atmosphere')}</span>
                    <span className="text-xs text-blue-950 font-medium">{localizedModalBeach.vibe}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                  {t('About this Beach')}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {localizedModalBeach.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('Key Highlights & Things to Do')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {localizedModalBeach.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2 text-xs text-stone-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${localizedModalBeach.coordinates.lat},${localizedModalBeach.coordinates.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 active:bg-blue-900 text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>{t('Navigate with Google Maps')}</span>
                </a>

                {localizedModalBeach.destinationId && (
                  <button
                    type="button"
                    onClick={() => {
                      const dest = destinationsData.find((d) => d.id === localizedModalBeach.destinationId);
                      if (dest) {
                        onSelectDestination(dest);
                      }
                      onNavigatePage('destinations');
                      setSelectedBeachModal(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t('View Destination Guide')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onToggleFavourite({
                      id: localizedModalBeach.id,
                      type: 'beach',
                      title: localizedModalBeach.name,
                      subtitle: localizedModalBeach.location,
                      image: localizedModalBeach.image,
                      linkPage: 'home',
                      targetId: localizedModalBeach.id,
                    });
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                    isFavourite(localizedModalBeach.id)
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-stone-300 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavourite(localizedModalBeach.id) ? 'fill-red-500 text-red-500' : 'text-stone-600'
                    }`}
                  />
                  <span>{isFavourite(localizedModalBeach.id) ? t('Saved') : t('Save')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};
