export type PageId =
  | 'home'
  | 'destinations'
  | 'map'
  | 'planner'
  | 'hotels'
  | 'food'
  | 'transport'
  | 'favourites'
  | 'assistant'
  | 'handbook'
  | 'about'
  | 'guides'
  | 'itinerary-7day'
  | 'fuel'
  | 'near-me'
  | 'business-portal'
  | 'booking'
  | 'translator';

export type LanguageCode =
  | 'en'
  | 'si'
  | 'ta'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'de'
  | 'fr'
  | 'es'
  | 'ru'
  | 'ar'
  | 'hi'
  | 'it'
  | 'tr';

export type SupportedCurrency =
  | 'LKR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CNY'
  | 'KRW'
  | 'AUD'
  | 'CAD'
  | 'INR'
  | 'AED'
  | 'RUB';

export type PaymentStatus =
  | 'Pending'
  | 'Processing'
  | 'Successful'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethodType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'gpay'
  | 'applepay'
  | 'bank_transfer'
  | 'lanka_qr';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: SupportedCurrency;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  mode: 'demo' | 'live';
  customerName: string;
  customerEmail: string;
  bookingTitle: string;
  gatewayRef?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TouristCountry {
  code: string;
  name: string;
  flag: string;
  primaryLang: LanguageCode;
  altLangs?: LanguageCode[];
}

export type Region =
  | 'Cultural Triangle'
  | 'Hill Country'
  | 'Southern Coast'
  | 'Wildlife & Safari'
  | 'Northern Peninsula'
  | 'Western & Urban'
  | 'Eastern Coast'
  | 'North Western'
  | 'Sabaragamuwa';

export interface Destination {
  id: string;
  name: string;
  localName: string;
  region: Region;
  district?: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  description: string;
  category: 'Heritage' | 'Nature' | 'Beach' | 'Wildlife' | 'City' | 'Mountain';
  photoStatus?: 'VERIFIED_REAL' | 'PHOTO_REVIEW_REQUIRED';
  bestTimeToVisit: string;
  entryFee: string;
  coordinates: {
    lat: number;
    lng: number;
    svgX: number; // Percentage on custom map (0-100)
    svgY: number; // Percentage on custom map (0-100)
  };
  weather: {
    tempC: number;
    condition: string;
    icon: 'sun' | 'cloud' | 'rain' | 'wind';
  };
  highlights: string[];
  activities: string[];
  travelTips: string[];
  travelTimeFromColombo: string;
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  region: Region;
  image: string;
  rating: number;
  reviewsCount: number;
  starRating: number;
  pricePerNightLkr: number;
  pricePerNightUsd: number;
  badge?: string;
  hotelType?: string;
  description: string;
  facilities: string[];
  roomTypes: string[];
  bookingUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
}

export type HotelItem = Hotel;

export interface FoodItem {
  id: string;
  name: string;
  sinhalaName: string;
  tamilName?: string;
  type: 'dish' | 'restaurant';
  image: string;
  description: string;
  category: 'Main Dish' | 'Breakfast/Dinner' | 'Street Food' | 'Seafood' | 'Dessert & Drinks' | 'Restaurant' | string;
  location?: string;
  spiceLevel: 0 | 1 | 2 | 3 | 4 | 5;
  priceIndication: string;
  isVegetarian: boolean;
  isHalal: boolean;
  isVegan: boolean;
  ingredientsOrSpecialties: string[];
  culturalNote?: string;
  cuisineType?: string;
  specialties?: string[];
  touristTip?: string;
  priceCategory?: string;
  averageCostPerPerson?: string;
}

export type Restaurant = FoodItem;


export interface TransportGuide {
  id: string;
  title: string;
  type: 'train' | 'tuktuk' | 'bus' | 'taxi' | 'flight';
  tagline: string;
  image: string;
  description: string;
  pricingEstimate: string;
  bookingMethod: string;
  touristTips: string[];
  pros: string[];
  cons: string[];
  popularRoutes: {
    from: string;
    to: string;
    duration: string;
    approxCostLkr: string;
  }[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  destination: string;
  image: string;
  morning: string;
  afternoon: string;
  evening: string;
  transportInfo: string;
  stayRecommendation: string;
  mealHighlights: string[];
}

export interface SavedItinerary {
  id: string;
  name: string;
  daysCount: number;
  travelStyle: 'budget' | 'balanced' | 'luxury';
  pace: 'relaxed' | 'active';
  destinations: string[];
  days: ItineraryDay[];
  createdAt: string;
  estimatedTotalUsd: number;
}

export interface FavouriteItem {
  id: string;
  type: 'destination' | 'hotel' | 'food' | 'transport';
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
  linkPage: PageId;
  targetId: string;
}

export interface HotelBooking {
  id: string;
  referenceNumber: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  destinationName: string;
  region: Region;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomsCount: number;
  guestsCount: number;
  pricePerNightUsd: number;
  pricePerNightLkr: number;
  totalUsd: number;
  totalLkr: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  currency?: 'USD' | 'LKR' | 'EUR' | 'GBP';
  paymentMethod?: string;
  paidAmountFormatted?: string;
  status: 'Confirmed' | 'Pending Confirmation' | 'Cancelled';
  createdAt: string;
}

