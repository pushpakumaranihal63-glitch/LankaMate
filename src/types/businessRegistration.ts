export type ServiceCategory =
  | 'Hotel / Guest House / Homestay'
  | 'Restaurant / Food'
  | 'Taxi / Car Hire'
  | 'Van / Tourist Transport'
  | 'Tuk-Tuk'
  | 'Airport Transfer'
  | 'Tour Operator / Travel Service'
  | 'Tourist Guide'
  | 'Fuel Station'
  | 'Bank / ATM'
  | 'Vehicle Service / Garage'
  | 'Tourist Attraction / Activity'
  | 'Other Tourism Service';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Hotel / Guest House / Homestay',
  'Restaurant / Food',
  'Taxi / Car Hire',
  'Van / Tourist Transport',
  'Tuk-Tuk',
  'Airport Transfer',
  'Tour Operator / Travel Service',
  'Tourist Guide',
  'Fuel Station',
  'Bank / ATM',
  'Vehicle Service / Garage',
  'Tourist Attraction / Activity',
  'Other Tourism Service',
];

export type RegistrationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'MORE_INFORMATION_REQUIRED'
  | 'SUSPENDED';

export type PricingPackageType = 'free' | 'featured' | 'premium';

export interface StatusHistoryEntry {
  status: RegistrationStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface RegistrationAccountDetails {
  fullName: string;
  businessName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegistrationBusinessDetails {
  businessName: string;
  category: ServiceCategory;
  description: string;
  address: string;
  district: string;
  city: string;
  serviceArea: string;
  googleMapsLocation?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: string;
  is24Hours: boolean;
  phone: string;
  whatsapp: string;
  website?: string;
}

export interface TransportServiceDetails {
  operatorType?: 'Individual Independent Driver' | 'Transport Fleet / Company';
  vehicleType: string; // e.g. Sedan Car, Van / KDH, Tuk-Tuk, SUV, Luxury
  vehicleNumber: string; // e.g. WP CAA-4321
  passengerCapacity: number;
  airportTransferAvailable: boolean;
  longDistanceTrips: boolean;
  localTrips: boolean;
  driverAvailable: 'With Driver' | 'Self-Drive' | 'Both Available';
  startingPrice: number; // LKR
  priceDescription: string; // e.g. "Per Day", "Per KM", "Fixed Airport Rate"
  driverName?: string;
  driverLicenseNumber?: string;
  driverPhotoUrl?: string;
}

export interface HotelServiceDetails {
  roomCount: number;
  roomTypes: string[]; // e.g. Standard, Deluxe, Villa, Homestay Room
  startingPrice: number; // LKR per night
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
}

export interface RestaurantServiceDetails {
  cuisineTypes: string[];
  priceRange: '$ (Budget)' | '$$ (Moderate)' | '$$$ (Fine Dining)';
  dineIn: boolean;
  takeaway: boolean;
  delivery: boolean;
  specialties: string[];
}

export interface GuideServiceDetails {
  languages: string[];
  guideLicenseType: 'National Tourist Guide' | 'Chauffeur Guide Lecturer' | 'Site Guide' | 'Local Village Guide';
  experienceYears: number;
  dailyRate: number; // LKR
  specialtyRegions: string[];
}

export interface FuelStationServiceDetails {
  fuelTypes: string[]; // Petrol 92, Petrol 95, Auto Diesel, Super Diesel, Kerosene, EV Charge
  facilities: string[]; // Air, Restroom, Nitrogen, ATM, Store
}

export interface BankAtmServiceDetails {
  bankName: string;
  services?: string[]; // ATM, Cash Deposit, Foreign Exchange, International Cards
  bankingServices?: string[];
}

export interface ApprovedBusinessListing {
  id: string;
  registrationId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  district: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  website?: string;
  photos: string[];
  coverPhoto: string;
  services: string[];
  openingHours: string;
  is24Hours: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  verificationStatus: 'Verified' | 'Pending Verification' | 'Verification Required';
  isVerified: boolean;
  sltdaLicenseNumber?: string;
  transportDetails?: TransportServiceDetails;
  hotelDetails?: HotelServiceDetails;
  restaurantDetails?: RestaurantServiceDetails;
}

export interface GarageServiceDetails {
  serviceTypes: string[]; // Mechanical, Tyre repair, Electrical, AC repair, 24/7 Breakdown Recovery
  emergencyTowing: boolean;
}

export interface AttractionServiceDetails {
  attractionType: string; // Heritage, Safari, Adventure, Cultural, Ayurveda
  entryFeeLkr: number;
  bestTimeToVisit: string;
}

export interface GenericServiceDetails {
  serviceOffering: string;
  ratesDescription: string;
  customDetails?: Record<string, any>;
}

export interface RegistrationServiceDetails {
  transport?: TransportServiceDetails;
  hotel?: HotelServiceDetails;
  restaurant?: RestaurantServiceDetails;
  guide?: GuideServiceDetails;
  fuel?: FuelStationServiceDetails;
  bank?: BankAtmServiceDetails;
  garage?: GarageServiceDetails;
  attraction?: AttractionServiceDetails;
  other?: GenericServiceDetails;
}

export interface UploadedDocument {
  id: string;
  type:
    | 'Business Registration Certificate'
    | 'Business Registration / BR Certificate'
    | 'SLTDA Registration / License'
    | 'SLTDA Licence'
    | 'Driver Licence'
    | 'Revenue Licence'
    | 'Vehicle Insurance'
    | 'Vehicle Registration Certificate'
    | 'Vehicle Registration / Registration Certificate'
    | 'Vehicle Registration / Revenue Licence'
    | 'Insurance Certificate'
    | 'Guide Licence / ID'
    | 'Food / Health Hygiene Certificate'
    | 'Other Supporting Transport Document'
    | 'Other Supporting Document'
    | 'Other Document'
    | string;
  name: string;
  fileSize?: string;
  uploadedAt: string;
  documentNumber?: string;
  previewUrl?: string;
}

export interface RegistrationPhotos {
  logoUrl?: string;
  coverPhotoUrl: string;
  additionalPhotos: string[];
}

export interface BusinessRegistrationRecord {
  id: string; // e.g. LM-BIZ-000001
  createdAt: string;
  updatedAt: string;
  resubmittedAt?: string;
  status: RegistrationStatus;
  statusNote?: string;
  account: RegistrationAccountDetails;
  business: RegistrationBusinessDetails;
  services: RegistrationServiceDetails;
  documents: UploadedDocument[];
  photos: RegistrationPhotos;
  package: PricingPackageType;
  profileCompleteness: number; // 0 - 100%
  adminNotes?: string;
  previousAdminRequest?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sltdaVerificationStatus?: 'Not Submitted' | 'Pending Verification' | 'Verified by Admin' | 'Rejected';
  sltdaLicenseNumber?: string;
  isActivatedListing: boolean;
  statusHistory?: StatusHistoryEntry[];
}

export const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];
