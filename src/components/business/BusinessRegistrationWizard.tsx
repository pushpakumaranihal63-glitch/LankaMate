import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Clock,
  Car,
  Bed,
  UtensilsCrossed,
  Compass,
  Fuel,
  CreditCard,
  Wrench,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Plus,
  ShieldCheck,
  Shield,
  Check,
  Save,
  HelpCircle,
  Eye,
  Info,
  ExternalLink,
  AlertTriangle,
  Trash2,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import {
  ServiceCategory,
  SERVICE_CATEGORIES,
  SRI_LANKA_DISTRICTS,
  BusinessRegistrationRecord,
  UploadedDocument,
} from '../../types/businessRegistration';
import {
  businessRegistrationService,
  computeProfileCompleteness,
} from '../../services/businessRegistrationService';

export interface CategoryDocDef {
  key: string;
  type: string;
  label: string;
  description: string;
  recommendedForCategory?: boolean;
  sampleFileName: string;
  placeholderNumber: string;
}

export const getCategoryDocDefinitions = (cat: ServiceCategory): CategoryDocDef[] => {
  const isTransport =
    cat === 'Taxi / Car Hire' ||
    cat === 'Van / Tourist Transport' ||
    cat === 'Tuk-Tuk' ||
    cat === 'Airport Transfer';

  if (isTransport) {
    return [
      {
        key: 'driver_licence',
        type: 'Driver Licence',
        label: 'Driver Licence',
        description: 'Valid Sri Lankan driving licence (Class B / Dual Purpose / Light Vehicle / Tuk-Tuk).',
        sampleFileName: 'Driving_Licence_Mohanraj.pdf',
        placeholderNumber: 'e.g. B-8874123',
        recommendedForCategory: true,
      },
      {
        key: 'vehicle_registration',
        type: 'Vehicle Registration / Registration Certificate',
        label: 'Vehicle Registration / Registration Certificate',
        description: 'Vehicle Certificate of Registration (CR book / ownership registration certificate).',
        sampleFileName: 'Vehicle_Registration_CR.pdf',
        placeholderNumber: 'e.g. CR-NP-CAH-3322',
        recommendedForCategory: true,
      },
      {
        key: 'revenue_licence',
        type: 'Revenue Licence',
        label: 'Revenue Licence',
        description: 'Current valid provincial motor traffic vehicle revenue licence sticker/receipt.',
        sampleFileName: 'Revenue_Licence_2026.pdf',
        placeholderNumber: 'e.g. RL-NP-2026-9901',
        recommendedForCategory: true,
      },
      {
        key: 'vehicle_insurance',
        type: 'Vehicle Insurance',
        label: 'Vehicle Insurance',
        description: 'Valid comprehensive or passenger liability motor insurance policy/card.',
        sampleFileName: 'Vehicle_Insurance_Policy.pdf',
        placeholderNumber: 'e.g. POL-SLIC-889922',
        recommendedForCategory: true,
      },
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / BR Certificate',
        description: 'Divisional Secretariat / ROC company registration (optional for individual drivers).',
        sampleFileName: 'Business_Registration_BR.pdf',
        placeholderNumber: 'e.g. PV-123456 or DS/VAV/2026',
      },
      {
        key: 'sltda_licence',
        type: 'SLTDA Licence',
        label: 'SLTDA Licence (if applicable)',
        description: 'Sri Lanka Tourism Development Authority tourist chauffeur/transport permit (if available).',
        sampleFileName: 'SLTDA_Chauffeur_Permit.pdf',
        placeholderNumber: 'e.g. SLTDA/TRA/2026/088',
      },
      {
        key: 'other_transport_doc',
        type: 'Other Supporting Transport Document',
        label: 'Other Supporting Transport Document',
        description: 'Vehicle inspection report, fitness certificate, emission clearance, or lease contract.',
        sampleFileName: 'Vehicle_Fitness_Inspection.pdf',
        placeholderNumber: 'e.g. V-INSPECT-7731',
      },
    ];
  }

  if (cat === 'Hotel / Guest House / Homestay') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / BR Certificate',
        description: 'Official Business Registration certificate from Divisional Secretariat / ROC.',
        sampleFileName: 'Hotel_BR_Certificate.pdf',
        placeholderNumber: 'e.g. PV-88991',
        recommendedForCategory: true,
      },
      {
        key: 'sltda_licence',
        type: 'SLTDA Licence',
        label: 'SLTDA Licence',
        description: 'SLTDA Hotel / Guest House / Homestay registered establishment certificate.',
        sampleFileName: 'SLTDA_Hotel_License.pdf',
        placeholderNumber: 'e.g. SLTDA/HST/2025/112',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Other Relevant Licence / Supporting Document',
        description: 'Local authority trade permit, public health inspection report, or fire safety clearance.',
        sampleFileName: 'Local_Council_Trade_Permit.pdf',
        placeholderNumber: 'e.g. MC/TR/2026/12',
      },
    ];
  }

  if (cat === 'Restaurant / Food') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / BR Certificate',
        description: 'Municipal / Urban council trade licence or official Business Registration certificate.',
        sampleFileName: 'Restaurant_BR_License.pdf',
        placeholderNumber: 'e.g. MC-TR-7721',
        recommendedForCategory: true,
      },
      {
        key: 'food_hygiene',
        type: 'Food / Health Hygiene Certificate',
        label: 'Food / Health-related Supporting Document',
        description: 'Public Health Inspector (PHI) food hygiene certification or Halal / Good Food compliance.',
        sampleFileName: 'PHI_Food_Hygiene_Certificate.pdf',
        placeholderNumber: 'e.g. PHI-2026-88',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Other Supporting Document',
        description: 'Menu certification, beverage permit (if applicable), or tourism partner document.',
        sampleFileName: 'Restaurant_Partner_Clearance.pdf',
        placeholderNumber: 'e.g. REST-DOC-2026',
      },
    ];
  }

  if (cat === 'Tourist Guide') {
    return [
      {
        key: 'guide_licence',
        type: 'Guide Licence / ID',
        label: 'Guide Licence / ID',
        description: 'Official National Tourist Guide, Chauffeur Guide Lecturer, or Site Guide license/ID.',
        sampleFileName: 'Tourist_Guide_Licence_Card.pdf',
        placeholderNumber: 'e.g. TG-NTG-2026-90',
        recommendedForCategory: true,
      },
      {
        key: 'sltda_licence',
        type: 'SLTDA Licence',
        label: 'SLTDA Licence (if applicable)',
        description: 'SLTDA Guide Registration credentials and authorized badge card.',
        sampleFileName: 'SLTDA_Guide_Certificate.pdf',
        placeholderNumber: 'e.g. SLTDA/GDE/2026/88',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Other Supporting Document',
        description: 'First Aid certification, language proficiency certificate, or wild safari guide badge.',
        sampleFileName: 'Guide_FirstAid_Credentials.pdf',
        placeholderNumber: 'e.g. FA-2026-001',
      },
    ];
  }

  if (cat === 'Fuel Station') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / Dealer Certificate',
        description: 'Official CPC / LIOC dealership authorization or Business Registration.',
        sampleFileName: 'Fuel_Dealership_BR.pdf',
        placeholderNumber: 'e.g. CPC-DLR-9921',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Petroleum / Environmental Safety Licence',
        description: 'Petroleum storage permit, explosives control license, or central environmental certificate.',
        sampleFileName: 'Petroleum_Storage_Permit.pdf',
        placeholderNumber: 'e.g. CEA-PET-2026',
      },
    ];
  }

  if (cat === 'Bank / ATM') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Central Bank Authorization / Business Certificate',
        description: 'Central Bank of Sri Lanka licensed commercial bank or financial institution authorization.',
        sampleFileName: 'Banking_Authorization.pdf',
        placeholderNumber: 'e.g. CBSL-LIC-109',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Other Supporting Document',
        description: 'Branch verification document or ATM service permit.',
        sampleFileName: 'Branch_Authorization.pdf',
        placeholderNumber: 'e.g. ATM-BR-990',
      },
    ];
  }

  if (cat === 'Vehicle Service / Garage') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / BR Certificate',
        description: 'Official garage / automotive workshop business registration certificate.',
        sampleFileName: 'Garage_BR_Certificate.pdf',
        placeholderNumber: 'e.g. GAR-BR-2026',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Mechanical / Breakdown Recovery Certification',
        description: 'Automobile engineering certificate, insurance breakdown partnership, or towing permit.',
        sampleFileName: 'Breakdown_Recovery_Certification.pdf',
        placeholderNumber: 'e.g. CERT-MECH-441',
      },
    ];
  }

  if (cat === 'Tourist Attraction / Activity') {
    return [
      {
        key: 'business_registration',
        type: 'Business Registration / BR Certificate',
        label: 'Business Registration / BR Certificate',
        description: 'Attraction / activity operator business registration.',
        sampleFileName: 'Attraction_BR_Certificate.pdf',
        placeholderNumber: 'e.g. ATTR-BR-2026',
        recommendedForCategory: true,
      },
      {
        key: 'other_doc',
        type: 'Other Supporting Document',
        label: 'Wildlife / Marine / Safety Permit',
        description: 'Coast Guard passenger permit, wildlife department license, or adventure sports safety clearance.',
        sampleFileName: 'Safety_Marine_Permit.pdf',
        placeholderNumber: 'e.g. CG-PASS-2026',
      },
    ];
  }

  // Tour Operator / Other Tourism Service
  return [
    {
      key: 'business_registration',
      type: 'Business Registration / BR Certificate',
      label: 'Business Registration / BR Certificate',
      description: 'Travel agent / tour operator business registration.',
      sampleFileName: 'Tour_Operator_BR.pdf',
      placeholderNumber: 'e.g. PV-88771',
      recommendedForCategory: true,
    },
    {
      key: 'sltda_licence',
      type: 'SLTDA Licence',
      label: 'SLTDA Licence (if applicable)',
      description: 'SLTDA travel agent or tour operator registration license.',
      sampleFileName: 'SLTDA_Travel_Agent_License.pdf',
      placeholderNumber: 'e.g. SLTDA/TA/2026/18',
    },
    {
      key: 'other_doc',
      type: 'Other Supporting Document',
      label: 'Public Liability Insurance / Supporting Document',
      description: 'Tour liability insurance certificate or tourism partner agreement.',
      sampleFileName: 'Public_Liability_Insurance.pdf',
      placeholderNumber: 'e.g. INS-TOUR-552',
    },
  ];
};

export const matchDocToSlot = (
  doc: UploadedDocument,
  slot: CategoryDocDef
): boolean => {
  if (doc.type === slot.type) return true;
  const dt = (doc.type || '').toLowerCase();
  const name = (doc.name || '').toLowerCase();

  if (slot.key === 'driver_licence') {
    return (
      dt.includes('driver') ||
      dt.includes('driving') ||
      name.includes('driver') ||
      (name.includes('licence') && !name.includes('revenue'))
    );
  }
  if (slot.key === 'vehicle_registration') {
    return (
      dt.includes('vehicle registration') ||
      dt.includes('registration certificate') ||
      (name.includes('registration') && !name.includes('revenue')) ||
      name.includes('cr_') ||
      name.includes('vehicle_reg')
    );
  }
  if (slot.key === 'revenue_licence') {
    return dt.includes('revenue') || name.includes('revenue');
  }
  if (slot.key === 'vehicle_insurance') {
    return (
      dt.includes('insurance') ||
      name.includes('insurance') ||
      name.includes('policy')
    );
  }
  if (slot.key === 'business_registration') {
    return (
      dt.includes('business registration') ||
      dt.includes('br certificate') ||
      name.includes('br_') ||
      name.includes('business_reg')
    );
  }
  if (slot.key === 'sltda_licence') {
    return dt.includes('sltda') || name.includes('sltda');
  }
  if (slot.key === 'guide_licence') {
    return dt.includes('guide') || name.includes('guide');
  }
  if (slot.key === 'food_hygiene') {
    return (
      dt.includes('food') ||
      dt.includes('health') ||
      dt.includes('hygiene') ||
      name.includes('phi')
    );
  }
  if (slot.key === 'other_transport_doc') {
    return (
      dt.includes('transport') &&
      !dt.includes('driver') &&
      !dt.includes('registration') &&
      !dt.includes('revenue') &&
      !dt.includes('insurance')
    );
  }
  return false;
};

interface BusinessRegistrationWizardProps {
  onRegistrationComplete: (newRecord: BusinessRegistrationRecord) => void;
  onCancel: () => void;
  initialRecord?: BusinessRegistrationRecord | null;
  mode?: 'create' | 'edit';
}

const DRAFT_STORAGE_KEY = 'lankamate_biz_reg_draft';

export const BusinessRegistrationWizard: React.FC<BusinessRegistrationWizardProps> = ({
  onRegistrationComplete,
  onCancel,
  initialRecord,
  mode = 'create',
}) => {
  const isEditMode = Boolean(initialRecord || mode === 'edit');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<BusinessRegistrationRecord | null>(null);

  // Step 1: Account Details
  const [fullName, setFullName] = useState('');
  const [accountBizName, setAccountBizName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Business / Service Details
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Hotel / Guest House / Homestay');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [city, setCity] = useState('');
  const [serviceArea, setServiceArea] = useState('Islandwide');
  const [lat, setLat] = useState('6.9271');
  const [lng, setLng] = useState('79.8612');
  const [openingHours, setOpeningHours] = useState('08:00 AM - 08:00 PM');
  const [is24Hours, setIs24Hours] = useState(false);
  const [bizPhone, setBizPhone] = useState('');
  const [bizWhatsapp, setBizWhatsapp] = useState('');
  const [website, setWebsite] = useState('');

  // Step 3: Service Details (Dynamic)
  // Transport
  const [operatorType, setOperatorType] = useState<
    'Individual Independent Driver' | 'Transport Fleet / Company'
  >('Individual Independent Driver');
  const [vehicleType, setVehicleType] = useState('Sedan Car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [passengerCapacity, setPassengerCapacity] = useState('4');
  const [airportTransferAvailable, setAirportTransferAvailable] = useState(true);
  const [longDistanceTrips, setLongDistanceTrips] = useState(true);
  const [localTrips, setLocalTrips] = useState(true);
  const [driverAvailable, setDriverAvailable] = useState<'With Driver' | 'Self-Drive' | 'Both Available'>('With Driver');
  const [transportStartingPrice, setTransportStartingPrice] = useState('12000');
  const [transportPriceDesc, setTransportPriceDesc] = useState('Per Day / Airport Drop');
  const [driverName, setDriverName] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [driverPhotoUrl, setDriverPhotoUrl] = useState('');

  // Hotel
  const [roomCount, setRoomCount] = useState('4');
  const [roomTypes, setRoomTypes] = useState<string[]>(['Deluxe Double Room', 'Family Room']);
  const [hotelStartingPrice, setHotelStartingPrice] = useState('9500');
  const [checkInTime, setCheckInTime] = useState('02:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [hotelAmenities, setHotelAmenities] = useState<string[]>([
    'Free Wi-Fi',
    'Air Conditioning',
    'Hot Water Shower',
    'Breakfast Included',
  ]);

  // Restaurant
  const [cuisineTypes, setCuisineTypes] = useState<string[]>(['Traditional Sri Lankan', 'Fresh Seafood']);
  const [priceRange, setPriceRange] = useState<'$ (Budget)' | '$$ (Moderate)' | '$$$ (Fine Dining)'>('$$ (Moderate)');
  const [dineIn, setDineIn] = useState(true);
  const [takeaway, setTakeaway] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [specialties, setSpecialties] = useState('Clay pot rice & curry, Polos curry, Fresh seafood platter');

  // Guide
  const [guideLanguages, setGuideLanguages] = useState<string[]>(['English', 'Sinhala']);
  const [guideLicenseType, setGuideLicenseType] = useState<'National Tourist Guide' | 'Chauffeur Guide Lecturer' | 'Site Guide' | 'Local Village Guide'>('Chauffeur Guide Lecturer');
  const [experienceYears, setExperienceYears] = useState('5');
  const [guideDailyRate, setGuideDailyRate] = useState('15000');
  const [guideRegions, setGuideRegions] = useState<string[]>(['Cultural Triangle', 'Kandy', 'Southern Coast']);

  // Fuel Station
  const [fuelTypes, setFuelTypes] = useState<string[]>(['Petrol 92', 'Auto Diesel', 'Petrol 95']);
  const [fuelFacilities, setFuelFacilities] = useState<string[]>(['Air & Nitrogen', 'Restroom', 'Convenience Store']);

  // Bank
  const [bankName, setBankName] = useState('Bank of Ceylon (BOC)');
  const [bankingServices, setBankingServices] = useState<string[]>(['24/7 ATM', 'Cash Withdrawal', 'Visa / Mastercard Accepted']);

  // Garage
  const [garageServices, setGarageServices] = useState<string[]>(['Tyre Repair', 'Mechanical Breakdown', 'Electrical']);
  const [emergencyTowing, setEmergencyTowing] = useState(true);

  // Attraction
  const [attractionType, setAttractionType] = useState('Scenic Viewpoint & Cultural Heritage');
  const [entryFeeLkr, setEntryFeeLkr] = useState('1500');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('Morning (06:00 AM - 10:00 AM)');

  // Generic / Other
  const [otherOffering, setOtherOffering] = useState('');
  const [otherRates, setOtherRates] = useState('');

  // Step 4: Documents & Category-Specific Verification Slots
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [docUploadType, setDocUploadType] = useState<string>('Business Registration Certificate');
  const [docNumberInput, setDocNumberInput] = useState('');
  const [docFileNameInput, setDocFileNameInput] = useState('');
  const [slotDocNumbers, setSlotDocNumbers] = useState<Record<string, string>>({});
  const [slotFileNames, setSlotFileNames] = useState<Record<string, string>>({});
  const [previewDocModal, setPreviewDocModal] = useState<UploadedDocument | null>(null);
  const [customDocType, setCustomDocType] = useState<string>('Other Supporting Document');
  const [customDocNumber, setCustomDocNumber] = useState<string>('');
  const [customDocFileName, setCustomDocFileName] = useState<string>('');

  // Step 5: Photos
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  );
  const [logoUrl, setLogoUrl] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Step 6: Package (Free by default)
  const [selectedPackage] = useState<'free' | 'featured' | 'premium'>('free');

  // Load initial record (if editing) or draft on mount
  useEffect(() => {
    if (initialRecord) {
      // Step 1: Account
      if (initialRecord.account.fullName) setFullName(initialRecord.account.fullName);
      if (initialRecord.account.businessName) setAccountBizName(initialRecord.account.businessName);
      if (initialRecord.account.mobileNumber) setMobileNumber(initialRecord.account.mobileNumber);
      if (initialRecord.account.whatsappNumber) {
        setWhatsappNumber(initialRecord.account.whatsappNumber);
        setSameAsMobile(initialRecord.account.whatsappNumber === initialRecord.account.mobileNumber);
      }
      if (initialRecord.account.email) setEmail(initialRecord.account.email);

      // Step 2: Business
      if (initialRecord.business.businessName) setBusinessName(initialRecord.business.businessName);
      if (initialRecord.business.category) setCategory(initialRecord.business.category);
      if (initialRecord.business.description) setDescription(initialRecord.business.description);
      if (initialRecord.business.address) setAddress(initialRecord.business.address);
      if (initialRecord.business.district) setDistrict(initialRecord.business.district);
      if (initialRecord.business.city) setCity(initialRecord.business.city);
      if (initialRecord.business.serviceArea) setServiceArea(initialRecord.business.serviceArea);
      if (initialRecord.business.coordinates) {
        setLat(String(initialRecord.business.coordinates.lat));
        setLng(String(initialRecord.business.coordinates.lng));
      }
      if (initialRecord.business.openingHours) setOpeningHours(initialRecord.business.openingHours);
      if (typeof initialRecord.business.is24Hours === 'boolean') {
        setIs24Hours(initialRecord.business.is24Hours);
      }
      if (initialRecord.business.phone) setBizPhone(initialRecord.business.phone);
      if (initialRecord.business.whatsapp) setBizWhatsapp(initialRecord.business.whatsapp);
      if (initialRecord.business.website) setWebsite(initialRecord.business.website);

      // Step 3: Services
      if (initialRecord.services.transport) {
        const t = initialRecord.services.transport;
        if (t.operatorType) setOperatorType(t.operatorType);
        if (t.vehicleType) setVehicleType(t.vehicleType);
        if (t.vehicleNumber) setVehicleNumber(t.vehicleNumber);
        if (t.passengerCapacity) setPassengerCapacity(String(t.passengerCapacity));
        if (typeof t.airportTransferAvailable === 'boolean') {
          setAirportTransferAvailable(t.airportTransferAvailable);
        }
        if (typeof t.longDistanceTrips === 'boolean') {
          setLongDistanceTrips(t.longDistanceTrips);
        }
        if (typeof t.localTrips === 'boolean') {
          setLocalTrips(t.localTrips);
        }
        if (t.driverAvailable) setDriverAvailable(t.driverAvailable);
        if (t.startingPrice) setTransportStartingPrice(String(t.startingPrice));
        if (t.priceDescription) setTransportPriceDesc(t.priceDescription);
        if (t.driverName) setDriverName(t.driverName);
        if (t.driverLicenseNumber) setDriverLicenseNumber(t.driverLicenseNumber);
        if (t.driverPhotoUrl) setDriverPhotoUrl(t.driverPhotoUrl);
      }

      if (initialRecord.services.hotel) {
        const h = initialRecord.services.hotel;
        if (h.roomCount) setRoomCount(String(h.roomCount));
        if (h.roomTypes) setRoomTypes(h.roomTypes);
        if (h.startingPrice) setHotelStartingPrice(String(h.startingPrice));
        if (h.checkInTime) setCheckInTime(h.checkInTime);
        if (h.checkOutTime) setCheckOutTime(h.checkOutTime);
        if (h.amenities) setHotelAmenities(h.amenities);
      }

      if (initialRecord.services.restaurant) {
        const r = initialRecord.services.restaurant;
        if (r.cuisineTypes) setCuisineTypes(r.cuisineTypes);
        if (r.priceRange) setPriceRange(r.priceRange);
        if (typeof r.dineIn === 'boolean') setDineIn(r.dineIn);
        if (typeof r.takeaway === 'boolean') setTakeaway(r.takeaway);
        if (typeof r.delivery === 'boolean') setDelivery(r.delivery);
        if (r.specialties) setSpecialties(r.specialties.join(', '));
      }

      // Step 4: Documents
      if (initialRecord.documents && initialRecord.documents.length > 0) {
        setDocuments(initialRecord.documents);
        const docNumMap: Record<string, string> = {};
        initialRecord.documents.forEach((d) => {
          if (d.documentNumber) docNumMap[d.type] = d.documentNumber;
        });
        setSlotDocNumbers((prev) => ({ ...prev, ...docNumMap }));
      }
      if (initialRecord.services.transport) {
        const t = initialRecord.services.transport;
        setSlotDocNumbers((prev) => ({
          ...prev,
          ...(t.driverLicenseNumber && !prev['Driver Licence']
            ? { 'Driver Licence': t.driverLicenseNumber }
            : {}),
          ...(t.vehicleNumber && !prev['Vehicle Registration / Registration Certificate']
            ? { 'Vehicle Registration / Registration Certificate': t.vehicleNumber }
            : {}),
          ...(t.vehicleNumber && !prev['Revenue Licence']
            ? { 'Revenue Licence': t.vehicleNumber }
            : {}),
        }));
      }

      // Step 5: Photos
      if (initialRecord.photos) {
        if (initialRecord.photos.coverPhotoUrl) setCoverPhotoUrl(initialRecord.photos.coverPhotoUrl);
        if (initialRecord.photos.logoUrl) setLogoUrl(initialRecord.photos.logoUrl);
        if (initialRecord.photos.additionalPhotos) {
          setAdditionalPhotos(initialRecord.photos.additionalPhotos);
        }
      }

      // If more information is required, jump straight to Step 4 Documents & Verification
      if (initialRecord.status === 'MORE_INFORMATION_REQUIRED') {
        setCurrentStep(4);
      }
    } else {
      try {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const draft = JSON.parse(saved);
          if (draft.fullName) setFullName(draft.fullName);
          if (draft.businessName) {
            setAccountBizName(draft.businessName);
            setBusinessName(draft.businessName);
          }
          if (draft.mobileNumber) setMobileNumber(draft.mobileNumber);
          if (draft.email) setEmail(draft.email);
          if (draft.category) setCategory(draft.category);
          if (draft.district) setDistrict(draft.district);
          if (draft.city) setCity(draft.city);
          if (draft.address) setAddress(draft.address);
          if (draft.description) setDescription(draft.description);
        }
      } catch {
        // ignore
      }
    }
  }, [initialRecord]);

  // Sync WhatsApp when "same as mobile" is checked
  useEffect(() => {
    if (sameAsMobile) {
      setWhatsappNumber(mobileNumber);
      setBizWhatsapp(mobileNumber);
    }
  }, [sameAsMobile, mobileNumber]);

  // Sync business name between account and business details
  useEffect(() => {
    if (accountBizName && !businessName) {
      setBusinessName(accountBizName);
    }
  }, [accountBizName]);

  // Sync phone
  useEffect(() => {
    if (mobileNumber && !bizPhone) {
      setBizPhone(mobileNumber);
    }
  }, [mobileNumber]);

  // Save draft helper
  const handleSaveDraft = () => {
    const draft = {
      fullName,
      businessName: businessName || accountBizName,
      mobileNumber,
      whatsappNumber,
      email,
      category,
      district,
      city,
      address,
      description,
      step: currentStep,
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch {
      // ignore
    }
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    setErrorMessage(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please enter your full legal name (minimum 3 characters).');
      return false;
    }
    if (!accountBizName.trim()) {
      setErrorMessage('Please enter your business or service name.');
      return false;
    }
    // Mobile validation: Sri Lankan or international format
    const cleanMobile = mobileNumber.replace(/[\s\-()]/g, '');
    if (!cleanMobile || cleanMobile.length < 9 || !/^\+?[0-9]{9,15}$/.test(cleanMobile)) {
      setErrorMessage('Please enter a valid mobile number (e.g., 077 123 4567 or +94 77 123 4567).');
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    // In edit mode, password already set, do not block resubmission
    if (!isEditMode) {
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    setErrorMessage(null);
    if (!businessName.trim()) {
      setErrorMessage('Please provide your business or service name.');
      return false;
    }
    if (!description.trim() || description.trim().length < 15) {
      setErrorMessage('Please write a brief description of your service (minimum 15 characters).');
      return false;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your street address or landmark.');
      return false;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city or town.');
      return false;
    }
    if (!bizPhone.trim()) {
      setErrorMessage('Please enter a contact phone number for tourists.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    setErrorMessage(null);
    // Transport
    if (
      category === 'Taxi / Car Hire' ||
      category === 'Van / Tourist Transport' ||
      category === 'Tuk-Tuk' ||
      category === 'Airport Transfer'
    ) {
      if (!vehicleNumber.trim()) {
        setErrorMessage('Please enter your vehicle registration number (e.g., WP CAA-1234).');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setErrorMessage(null);
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Quick preset coordinates for major Sri Lanka destinations
  const setPresetLocation = (cityLabel: string, latitude: string, longitude: string) => {
    setCity(cityLabel);
    setLat(latitude);
    setLng(longitude);
  };

  // Step 4 Document Handlers
  const handleAttachSlotDocument = (
    docType: string,
    defaultFileName: string,
    fileObj?: File
  ) => {
    const docNumber = (slotDocNumbers[docType] || '').trim();
    const customName = (slotFileNames[docType] || '').trim();
    const fileName = fileObj ? fileObj.name : (customName || defaultFileName);
    const fileSize = fileObj ? `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';

    const commit = (previewUrl?: string) => {
      setDocuments((prev) => {
        // If doc matching this exact type exists, replace it
        const existsIndex = prev.findIndex((d) => d.type === docType);
        const newDoc: UploadedDocument = {
          id: existsIndex >= 0 ? prev[existsIndex].id : `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: docType,
          name: fileName,
          fileSize,
          uploadedAt: new Date().toISOString().split('T')[0],
          documentNumber: docNumber || undefined,
          previewUrl: previewUrl || (existsIndex >= 0 ? prev[existsIndex].previewUrl : undefined),
        };
        if (existsIndex >= 0) {
          const updated = [...prev];
          updated[existsIndex] = newDoc;
          return updated;
        }
        return [...prev, newDoc];
      });
      // Clear filename buffer for slot
      setSlotFileNames((prev) => ({ ...prev, [docType]: '' }));
    };

    if (fileObj && (fileObj.type.startsWith('image/') || fileObj.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        commit(e.target?.result as string);
      };
      reader.readAsDataURL(fileObj);
    } else {
      commit();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string,
    defaultFileName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleAttachSlotDocument(docType, defaultFileName, file);
      e.target.value = '';
    }
  };

  const handleAddCustomDocument = (customFile?: File) => {
    const docName =
      (customFile ? customFile.name : customDocFileName.trim()) ||
      `${customDocType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now().toString().slice(-4)}.pdf`;
    const fileSize = customFile ? `${(customFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB';

    const commit = (previewUrl?: string) => {
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: customDocType,
        name: docName,
        fileSize,
        uploadedAt: new Date().toISOString().split('T')[0],
        documentNumber: customDocNumber.trim() || undefined,
        previewUrl,
      };
      setDocuments((prev) => [...prev, newDoc]);
      setCustomDocFileName('');
      setCustomDocNumber('');
    };

    if (customFile && (customFile.type.startsWith('image/') || customFile.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        commit(e.target?.result as string);
      };
      reader.readAsDataURL(customFile);
    } else {
      commit();
    }
  };

  const handleCustomFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAddCustomDocument(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateDocNumber = (id: string, num: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, documentNumber: num.trim() || undefined } : d))
    );
  };

  // Add document simulation (legacy fallback)
  const handleAddDocument = () => {
    const docName =
      docFileNameInput.trim() ||
      `${docUploadType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now().toString().slice(-4)}.pdf`;

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      type: docUploadType,
      name: docName,
      fileSize: '1.2 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      documentNumber: docNumberInput.trim() || undefined,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setDocFileNameInput('');
    setDocNumberInput('');
  };

  // Final Registration Submission
  const handleSubmitRegistration = () => {
    setErrorMessage(null);

    // Build the complete RegistrationRecord
    const recordPayload: Omit<
      BusinessRegistrationRecord,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'profileCompleteness' | 'isActivatedListing'
    > = {
      account: {
        fullName: fullName.trim(),
        businessName: (businessName || accountBizName).trim(),
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || mobileNumber.trim(),
        email: email.trim().toLowerCase(),
        password, // safe handling, will be masked on export
      },
      business: {
        businessName: (businessName || accountBizName).trim(),
        category,
        description: description.trim(),
        address: address.trim(),
        district,
        city: city.trim(),
        serviceArea: serviceArea.trim() || `${district} & surrounding regions`,
        googleMapsLocation: `https://www.google.com/maps?q=${lat},${lng}`,
        coordinates: {
          lat: parseFloat(lat) || 6.9271,
          lng: parseFloat(lng) || 79.8612,
        },
        openingHours: is24Hours ? '24 Hours Service' : openingHours.trim(),
        is24Hours,
        phone: bizPhone.trim() || mobileNumber.trim(),
        whatsapp: bizWhatsapp.trim() || whatsappNumber.trim() || mobileNumber.trim(),
        website: website.trim() || undefined,
      },
      services: {
        transport:
          category === 'Taxi / Car Hire' ||
          category === 'Van / Tourist Transport' ||
          category === 'Tuk-Tuk' ||
          category === 'Airport Transfer'
            ? {
                operatorType,
                vehicleType,
                vehicleNumber: vehicleNumber.trim() || 'Unspecified',
                passengerCapacity: parseInt(passengerCapacity, 10) || 4,
                airportTransferAvailable,
                longDistanceTrips,
                localTrips,
                driverAvailable,
                startingPrice: parseFloat(transportStartingPrice) || 5000,
                priceDescription: transportPriceDesc.trim(),
                driverName: driverName.trim() || fullName.trim(),
                driverLicenseNumber: driverLicenseNumber.trim() || undefined,
                driverPhotoUrl: driverPhotoUrl.trim() || undefined,
              }
            : undefined,
        hotel:
          category === 'Hotel / Guest House / Homestay'
            ? {
                roomCount: parseInt(roomCount, 10) || 1,
                roomTypes,
                startingPrice: parseFloat(hotelStartingPrice) || 8000,
                checkInTime,
                checkOutTime,
                amenities: hotelAmenities,
              }
            : undefined,
        restaurant:
          category === 'Restaurant / Food'
            ? {
                cuisineTypes,
                priceRange,
                dineIn,
                takeaway,
                delivery,
                specialties: specialties
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : undefined,
        guide:
          category === 'Tourist Guide'
            ? {
                languages: guideLanguages,
                guideLicenseType,
                experienceYears: parseInt(experienceYears, 10) || 1,
                dailyRate: parseFloat(guideDailyRate) || 10000,
                specialtyRegions: guideRegions,
              }
            : undefined,
        fuel:
          category === 'Fuel Station'
            ? {
                fuelTypes,
                facilities: fuelFacilities,
              }
            : undefined,
        bank:
          category === 'Bank / ATM'
            ? {
                bankName,
                services: bankingServices,
                bankingServices,
              }
            : undefined,
        garage:
          category === 'Vehicle Service / Garage'
            ? {
                serviceTypes: garageServices,
                emergencyTowing,
              }
            : undefined,
        attraction:
          category === 'Tourist Attraction / Activity'
            ? {
                attractionType,
                entryFeeLkr: parseFloat(entryFeeLkr) || 0,
                bestTimeToVisit,
              }
            : undefined,
        other:
          category === 'Tour Operator / Travel Service' || category === 'Other Tourism Service'
            ? {
                serviceOffering: otherOffering || description,
                ratesDescription: otherRates || 'Contact for custom rates',
              }
            : undefined,
      },
      documents,
      photos: {
        logoUrl: logoUrl.trim() || undefined,
        coverPhotoUrl:
          coverPhotoUrl.trim() ||
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        additionalPhotos,
      },
      package: selectedPackage,
    };

    let finalRecord: BusinessRegistrationRecord;
    if (isEditMode && initialRecord) {
      const resubmitted = businessRegistrationService.resubmitRegistration(
        initialRecord.id,
        recordPayload
      );
      finalRecord = resubmitted || businessRegistrationService.createRegistration(recordPayload);
    } else {
      finalRecord = businessRegistrationService.createRegistration(recordPayload);
    }

    // Clear draft
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }

    setSubmittedRecord(finalRecord);
    onRegistrationComplete(finalRecord);
  };

  // If already submitted successfully, render confirmation screen
  if (submittedRecord) {
    const wasResubmission = Boolean(isEditMode || initialRecord);
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-xl max-w-3xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            {wasResubmission ? 'Registration Resubmitted Successfully' : 'Registration Submitted Successfully'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {wasResubmission ? 'Information Resubmitted for Verification!' : 'Welcome to the LankaMate Partner Network!'}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
            {wasResubmission
              ? `Your updated business details and documents have been resubmitted under reference ID ${submittedRecord.id}. Our admin review desk will review your updates promptly.`
              : 'Your business details have been recorded and assigned a unique registration reference ID.'}
          </p>
        </div>

        {/* Reference ID and Status Box */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-xs">
            <span className="text-stone-500 font-bold">Reference Number:</span>
            <span className="font-mono font-black text-emerald-900 text-sm sm:text-base">
              {submittedRecord.id}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-xs">
            <span className="text-stone-500 font-bold">Verification Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Pending Verification
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-bold">Profile Completeness:</span>
            <span className="font-black text-emerald-800">{submittedRecord.profileCompleteness}%</span>
          </div>
        </div>

        {/* Clear Legal Disclaimer Note */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-950 space-y-1.5 max-w-lg mx-auto">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Important Verification Notice:</span>
          </div>
          <p className="leading-relaxed">
            “LankaMate verification does not replace any government licence or legal requirement.”
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Our admin team verifies your contact details, service accuracy, and uploaded documents before granting the official “Verified” badge on public tourist listings.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer transition-all"
          >
            Open Business Owner Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Draft Saved Toast */}
      {draftSavedToast && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2">
          <Save className="w-3.5 h-3.5 text-amber-300" />
          <span>Registration draft saved locally on this device!</span>
        </div>
      )}

      {/* Header & Step Tracker */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Service Provider Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Register Your Business / Service
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Welcome transport owners, homestays, hotels, tour guides, and local services across Sri Lanka.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center gap-1.5 border border-emerald-700 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Multi-Step Indicator Bar (Steps 1 to 6) */}
        <div className="pt-2">
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Business' },
              { num: 3, label: 'Services' },
              { num: 4, label: 'Documents' },
              { num: 5, label: 'Photos' },
              { num: 6, label: 'Review' },
            ].map((s) => {
              const active = currentStep === s.num;
              const completed = currentStep > s.num;
              return (
                <button
                  type="button"
                  key={s.num}
                  onClick={() => {
                    // Allow jumping back to earlier steps or any step in edit mode
                    if (isEditMode || s.num <= currentStep) setCurrentStep(s.num);
                  }}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                    active
                      ? 'bg-amber-400 text-emerald-950 font-black shadow-sm'
                      : completed || isEditMode
                      ? 'bg-emerald-800/80 text-white cursor-pointer hover:bg-emerald-700'
                      : 'bg-emerald-900/40 text-emerald-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px]">
                    {completed ? <Check className="w-3.5 h-3.5" /> : <span>{s.num}.</span>}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Request Callout Banner (Requirement 1, 2, 3) */}
      {(initialRecord?.previousAdminRequest || initialRecord?.adminNotes) && (
        <div className="mx-6 sm:mx-8 mt-6 p-4 sm:p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 space-y-2 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-purple-200 text-purple-800 font-bold">⚠️</span>
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                Information requested by LankaMate Admin
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-purple-200 text-purple-800 shadow-2xs">
              Ref: {initialRecord.id}
            </span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-purple-200 text-xs sm:text-sm font-medium text-purple-950 leading-relaxed">
            "{initialRecord.previousAdminRequest || initialRecord.adminNotes}"
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-purple-800 pt-0.5">
            <span>
              {initialRecord.reviewedAt
                ? `Requested on: ${new Date(initialRecord.reviewedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}`
                : 'Action required'}
            </span>
            <span className="font-semibold text-purple-950">
              Please review your details, update the fields below, and click "Resubmit for Verification".
            </span>
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP BODY */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: ACCOUNT DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-700" />
                <span>Step 1 – Account & Owner Details</span>
              </h2>
              <p className="text-xs text-stone-500">
                Create your partner account credentials. Passwords are safe and never exposed publicly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nuwan Bandara or Kamani Senanayake"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Business / Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandara Tourist Van or Ella Mist Homestay"
                  value={accountBizName}
                  onChange={(e) => setAccountBizName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 077 123 4567 or +94 77 123 4567"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 block">
                  Used for SMS verification and direct booking alerts.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-emerald-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => setSameAsMobile(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Same as Mobile</span>
                  </label>
                </div>
                <input
                  type="tel"
                  placeholder="e.g. +94 77 123 4567"
                  disabled={sameAsMobile}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm ${
                    sameAsMobile ? 'bg-stone-100 text-stone-500' : 'bg-white'
                  } focus:ring-2 focus:ring-emerald-700 focus:outline-none`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. provider@example.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            {isEditMode ? (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block">Account Security</span>
                  <span className="text-[11px] text-stone-500">
                    Existing partner credentials preserved for {email || 'this registration'}.
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-white rounded-md border border-stone-200 text-stone-600 font-bold">
                  Active & Secured
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: BUSINESS / SERVICE DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Step 2 – Business & Location Details</span>
              </h2>
              <p className="text-xs text-stone-500">
                Help tourists discover your precise location, contact numbers, and service hours.
              </p>
            </div>

            {/* Service Category Selection (13 Categories) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white font-bold text-stone-800 focus:ring-2 focus:ring-emerald-700 focus:outline-none cursor-pointer"
              >
                {SERVICE_CATEGORIES.map((cat, idx) => (
                  <option key={cat} value={cat}>
                    {idx + 1}. {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Description / About Your Service <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Highlight your hospitality, years of experience, vehicle comfort, or unique experiences..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            {/* Location & Districts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ella, Negombo, Kandy, Galle Fort"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Service Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islandwide, Southern Coast, Central Hills"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Physical Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. No. 42 Main Street, Passara Road, Ella"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            {/* Coordinates & Quick Pre-set Buttons */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Google Maps Coordinates
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-850 text-[11px] font-bold flex items-center gap-1 underline"
                  >
                    <span>Preview on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-stone-400 text-[11px]">|</span>
                  <span className="text-stone-500 text-[11px]">Enables "Navigate" on LankaMate</span>
                </div>
              </div>

              {/* Requirement 8: Location Mismatch Detection & One-Click Fix */}
              {(district === 'Vavuniya' || city.toLowerCase().includes('vavuniya')) &&
                Math.abs(parseFloat(lat) - 6.9271) < 0.05 && (
                  <div className="p-3.5 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs block">
                          Coordinate Mismatch Detected!
                        </span>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                          Your business is located in <strong>Vavuniya</strong>, but your GPS coordinates are set to <strong>Colombo (6.9271, 79.8612)</strong>. Tourists navigating to your listing would be directed to Colombo!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLat('8.7542');
                        setLng('80.4982');
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>Fix to Vavuniya Center (8.7542, 80.4982)</span>
                    </button>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* GPS and Presets */}
              <div className="pt-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500">Quick set by district or GPS:</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setLat(pos.coords.latitude.toFixed(4));
                            setLng(pos.coords.longitude.toFixed(4));
                          },
                          () => {
                            setErrorMessage('Could not obtain current GPS location. Please select a preset or type coordinates.');
                          }
                        );
                      }
                    }}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>Use My Current GPS Location</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Vavuniya', lat: '8.7542', lng: '80.4982' },
                    { label: 'Jaffna', lat: '9.6615', lng: '80.0255' },
                    { label: 'Anuradhapura', lat: '8.3114', lng: '80.4037' },
                    { label: 'Trincomalee', lat: '8.5874', lng: '81.2152' },
                    { label: 'Colombo', lat: '6.9271', lng: '79.8612' },
                    { label: 'Airport (BIA)', lat: '7.1808', lng: '79.8841' },
                    { label: 'Kandy', lat: '7.2906', lng: '80.6337' },
                    { label: 'Galle Fort', lat: '6.0274', lng: '80.217' },
                    { label: 'Ella', lat: '6.8667', lng: '81.0466' },
                    { label: 'Sigiriya', lat: '7.957', lng: '80.7603' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setPresetLocation(preset.label, preset.lat, preset.lng)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                        district === preset.label || city.toLowerCase().includes(preset.label.toLowerCase())
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-white border-stone-300 text-stone-700 hover:border-emerald-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Opening Hours & 24 Hours Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800">Opening Hours</label>
                  <label className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={is24Hours}
                      onChange={(e) => {
                        setIs24Hours(e.target.checked);
                        if (e.target.checked) setOpeningHours('24 Hours Service');
                      }}
                      className="rounded text-emerald-700"
                    />
                    <span>24 Hour Service</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={is24Hours}
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm ${
                    is24Hours ? 'bg-stone-100 text-stone-500' : 'bg-white'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Website or Social Media (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/myservice or https://mybusiness.lk"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SERVICE DETAILS (DYNAMIC PER CATEGORY) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase mb-1">
                Category: {category}
              </div>
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <span>Step 3 – Specific Service & Pricing Details</span>
              </h2>
              <p className="text-xs text-stone-500">
                Fields are customized to match your service type for accurate tourist discovery.
              </p>
            </div>

            {/* DYNAMIC CASE A: TRANSPORT (Car, Van, Tuk-Tuk, Airport Transfer) */}
            {(category === 'Taxi / Car Hire' ||
              category === 'Van / Tourist Transport' ||
              category === 'Tuk-Tuk' ||
              category === 'Airport Transfer') && (
              <div className="space-y-4">
                {/* Operator Type Selection (Individual driver or business) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    Transport Provider Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setOperatorType('Individual Independent Driver')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        operatorType === 'Individual Independent Driver'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">Individual Driver / Vehicle Owner</span>
                        {operatorType === 'Individual Independent Driver' && (
                          <Check className="w-4 h-4 text-emerald-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-normal mt-0.5">
                        Operating your own car, van, or tuk-tuk. No registered company required.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOperatorType('Transport Fleet / Company')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        operatorType === 'Transport Fleet / Company'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">Transport Company / Fleet Business</span>
                        {operatorType === 'Transport Fleet / Company' && (
                          <Check className="w-4 h-4 text-emerald-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-normal mt-0.5">
                        Registered transport agency, travel fleet, or multi-vehicle cab business.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Vehicle Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white font-semibold"
                    >
                      <option value="Sedan Car (Toyota Prius / Axio / Premio)">Sedan Car (Axio / Prius / Premio)</option>
                      <option value="Van / KDH (Toyota HiAce Super GL / Dolphin)">Van / KDH (Toyota HiAce / Dolphin)</option>
                      <option value="Tuk-Tuk (Bajaj / TVS / Piaggio)">Tuk-Tuk (Three-Wheeler)</option>
                      <option value="SUV / 4x4 (Prado / Montero / Safari Jeep)">SUV / Safari 4x4</option>
                      <option value="Mini-Coach / Tourist Bus">Mini-Coach / Tourist Bus</option>
                      <option value="Luxury Car (Mercedes / BMW / Audi)">Luxury Car</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Vehicle Registration Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WP CAB-1234 or NC-5678"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Passenger Capacity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={passengerCapacity}
                      onChange={(e) => setPassengerCapacity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Driver / Chauffeur Licence Details */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">
                    Driver / Chauffeur Licence Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-600">
                        Driver Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. M. N. Rasheed or S. Perera"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-600">
                        Driver Licence Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B-8876543"
                        value={driverLicenseNumber}
                        onChange={(e) => setDriverLicenseNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-600">
                        Driver Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={driverPhotoUrl}
                        onChange={(e) => setDriverPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={airportTransferAvailable}
                      onChange={(e) => setAirportTransferAvailable(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Airport Transfer Available</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={longDistanceTrips}
                      onChange={(e) => setLongDistanceTrips(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Long Distance Round-Trips</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localTrips}
                      onChange={(e) => setLocalTrips(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Local City Hops</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Driver Option</label>
                    <select
                      value={driverAvailable}
                      onChange={(e) => setDriverAvailable(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="With Driver">Chauffeur-Driven (With Driver)</option>
                      <option value="Self-Drive">Self-Drive Rental</option>
                      <option value="Both Available">Both Available</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Starting Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={transportStartingPrice}
                      onChange={(e) => setTransportStartingPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Price Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fixed Airport Drop / Per Day Tour"
                      value={transportPriceDesc}
                      onChange={(e) => setTransportPriceDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE B: HOTEL / GUEST HOUSE / HOMESTAY */}
            {category === 'Hotel / Guest House / Homestay' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Number of Rooms</label>
                    <input
                      type="number"
                      min="1"
                      value={roomCount}
                      onChange={(e) => setRoomCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Starting Price (LKR / night)
                    </label>
                    <input
                      type="number"
                      value={hotelStartingPrice}
                      onChange={(e) => setHotelStartingPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Check-in / Check-out</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-1/2 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                      <input
                        type="text"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="w-1/2 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Available Room Types</label>
                  <div className="flex flex-wrap gap-2">
                    {['Standard Double', 'Deluxe Balcony Room', 'Family Suite', 'Attic Homestay', 'Entire Villa'].map(
                      (r) => {
                        const sel = roomTypes.includes(r);
                        return (
                          <button
                            type="button"
                            key={r}
                            onClick={() => {
                              setRoomTypes(sel ? roomTypes.filter((x) => x !== r) : [...roomTypes, r]);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              sel ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {sel && '✓ '}
                            {r}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-stone-800">Key Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Free Wi-Fi',
                      'Air Conditioning',
                      'Hot Water Shower',
                      'Breakfast Included',
                      'Swimming Pool',
                      'Mountain View',
                      'Secure Parking',
                      'Tea / Coffee Maker',
                    ].map((amenity) => {
                      const sel = hotelAmenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={amenity}
                          onClick={() => {
                            setHotelAmenities(
                              sel ? hotelAmenities.filter((a) => a !== amenity) : [...hotelAmenities, amenity]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            sel ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {sel && '✓ '}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE C: RESTAURANT / FOOD */}
            {category === 'Restaurant / Food' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Cuisine Types</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Traditional Sri Lankan',
                      'Fresh Seafood',
                      'Clay Pot Curries',
                      'Vegetarian / Vegan',
                      'Halal Certified',
                      'Western & Cafe',
                      'Chinese / Asian',
                    ].map((c) => {
                      const sel = cuisineTypes.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() =>
                            setCuisineTypes(sel ? cuisineTypes.filter((x) => x !== c) : [...cuisineTypes, c])
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                            sel ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {sel && '✓ '}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="$ (Budget)">$ (Budget friendly - e.g. Roti, Kottu, Rice & Curry)</option>
                      <option value="$$ (Moderate)">$$ (Moderate - Casual Dining & Seafood)</option>
                      <option value="$$$ (Fine Dining)">$$$ (Fine Dining / Upscale Villa Dining)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Service Modes</label>
                    <div className="flex gap-2 pt-1">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dineIn}
                          onChange={(e) => setDineIn(e.target.checked)}
                          className="rounded text-emerald-700"
                        />
                        <span>Dine-In</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={takeaway}
                          onChange={(e) => setTakeaway(e.target.checked)}
                          className="rounded text-emerald-700"
                        />
                        <span>Takeaway</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={delivery}
                          onChange={(e) => setDelivery(e.target.checked)}
                          className="rounded text-emerald-700"
                        />
                        <span>Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Specialty Dishes</label>
                  <input
                    type="text"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC CASE D: TOURIST GUIDE */}
            {category === 'Tourist Guide' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Guide Badge / License</label>
                    <select
                      value={guideLicenseType}
                      onChange={(e) => setGuideLicenseType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="National Tourist Guide">National Tourist Guide Lecturer</option>
                      <option value="Chauffeur Guide Lecturer">Chauffeur Guide Lecturer</option>
                      <option value="Site Guide">Site / Local Archaeological Guide</option>
                      <option value="Local Village Guide">Local Village Experience Guide</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Experience (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">Daily Rate (LKR)</label>
                    <input
                      type="number"
                      value={guideDailyRate}
                      onChange={(e) => setGuideDailyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Languages Fluent In</label>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Sinhala', 'Tamil', 'German', 'French', 'Russian', 'Chinese', 'Italian', 'Japanese', 'Arabic'].map(
                      (l) => {
                        const sel = guideLanguages.includes(l);
                        return (
                          <button
                            type="button"
                            key={l}
                            onClick={() =>
                              setGuideLanguages(sel ? guideLanguages.filter((x) => x !== l) : [...guideLanguages, l])
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                              sel ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {sel && '✓ '}
                            {l}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE E: OTHER CATEGORIES (Fuel, Bank, Garage, Attraction, Generic) */}
            {category === 'Fuel Station' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Available Fuel Types</label>
                  <div className="flex flex-wrap gap-2">
                    {['Petrol 92', 'Petrol 95', 'Auto Diesel', 'Super Diesel', 'Kerosene', 'EV Fast Charging'].map(
                      (fuel) => {
                        const sel = fuelTypes.includes(fuel);
                        return (
                          <button
                            type="button"
                            key={fuel}
                            onClick={() =>
                              setFuelTypes(sel ? fuelTypes.filter((x) => x !== fuel) : [...fuelTypes, fuel])
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                              sel ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {sel && '✓ '}
                            {fuel}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}

            {(category === 'Tour Operator / Travel Service' || category === 'Other Tourism Service') && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">Service Offerings & Packages</label>
                  <textarea
                    rows={3}
                    placeholder="Describe custom tour packages, safari bookings, surf lessons, whale watching, or travel consultancy..."
                    value={otherOffering}
                    onChange={(e) => setOtherOffering(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DOCUMENTS / VERIFICATION */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>Step 4 – Documents & Verification</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Upload official credentials to fast-track your admin review and gain verified partner status.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Visible only to Admin & Owner</span>
              </div>
            </div>

            {/* Admin Request Callout (when MORE_INFO_REQUIRED or remarks exist) */}
            {(initialRecord?.status === 'MORE_INFORMATION_REQUIRED' ||
              initialRecord?.previousAdminRequest ||
              initialRecord?.adminNotes) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 border-2 border-purple-300 text-purple-950 space-y-2.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-purple-200 text-purple-900 font-bold">⚠️</span>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                      Information requested by LankaMate Admin
                    </span>
                  </div>
                  {initialRecord?.id && (
                    <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-purple-200 text-purple-800">
                      Ref: {initialRecord.id}
                    </span>
                  )}
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-purple-200 text-xs sm:text-sm font-semibold text-purple-950 leading-relaxed italic shadow-2xs">
                  "{initialRecord?.adminNotes || initialRecord?.previousAdminRequest || 'Please provide vehicle registration number, valid driving licence details, vehicle photos, and any applicable transport/service documents. Please also confirm the correct service location/pickup area.'}"
                </div>
                <div className="text-[11px] text-purple-900 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>
                    Upload the requested transport documents in the fields below. After attaching, proceed to Step 6 and click <strong>"Resubmit for Verification"</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Crucial Verification Notice as per user requirement */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Verification Policy Notice:</span>
              </div>
              <p className="leading-relaxed font-semibold">
                “LankaMate verification does not replace any government licence or legal requirement.”
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Submitting registration documents places your application in <span className="font-bold">“Pending Verification”</span> status. Only after an authorized admin review will your listing receive the official “Verified” badge.
              </p>
            </div>

            {/* Category-Specific Document Checklist Section */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
                    <span>Category Verification Documents:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {category}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Upload official proof corresponding to your service category. Documents are private and encrypted.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  Attached: {documents.length} / {getCategoryDocDefinitions(category).length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {getCategoryDocDefinitions(category).map((slot) => {
                  const attachedDoc = documents.find((d) => matchDocToSlot(d, slot));
                  const isAttached = Boolean(attachedDoc);

                  return (
                    <div
                      key={slot.key}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isAttached
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Slot Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isAttached
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {isAttached ? (
                                <FileCheck className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-xs text-stone-900 block">
                                  {slot.label}
                                </span>
                                {slot.recommendedForCategory && !isAttached && (
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500 line-clamp-1">
                                {slot.description}
                              </span>
                            </div>
                          </div>

                          {isAttached && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 shrink-0 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-800" />
                              <span>Attached</span>
                            </span>
                          )}
                        </div>

                        {/* If Attached: Document Details */}
                        {isAttached && attachedDoc && (
                          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-bold text-stone-900 text-[11px] truncate">
                                {attachedDoc.name}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono shrink-0">
                                {attachedDoc.fileSize || '1.2 MB'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-stone-500 pt-0.5 border-t border-stone-100">
                              <span>
                                {attachedDoc.documentNumber
                                  ? `Doc / Reg No: ${attachedDoc.documentNumber}`
                                  : 'No reg number specified'}
                              </span>
                              <span className="text-emerald-700 font-medium">
                                🔒 Visible only to Admin & Owner
                              </span>
                            </div>
                          </div>
                        )}

                        {/* If Not Attached: Input for Document Number */}
                        {!isAttached && (
                          <div className="space-y-1.5 pt-1">
                            <label className="block text-[11px] font-bold text-stone-700">
                              Document / Registration Number (Optional):
                            </label>
                            <input
                              type="text"
                              placeholder={slot.placeholderNumber}
                              value={slotDocNumbers[slot.type] || ''}
                              onChange={(e) =>
                                setSlotDocNumbers((prev) => ({
                                  ...prev,
                                  [slot.type]: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-emerald-700"
                            />
                          </div>
                        )}
                      </div>

                      {/* Slot Controls / Buttons */}
                      <div className="pt-3 mt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
                        {isAttached && attachedDoc ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewDocModal(attachedDoc)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Preview</span>
                              </button>

                              <label
                                htmlFor={`replace-file-${slot.key}`}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <RefreshCw className="w-3 h-3 text-stone-600" />
                                <span>Replace</span>
                                <input
                                  id={`replace-file-${slot.key}`}
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileInputChange(e, slot.type, slot.sampleFileName)
                                  }
                                />
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(attachedDoc.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <label
                                htmlFor={`upload-file-${slot.key}`}
                                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                                <input
                                  id={`upload-file-${slot.key}`}
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileInputChange(e, slot.type, slot.sampleFileName)
                                  }
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAttachSlotDocument(slot.type, slot.sampleFileName)
                                }
                                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold cursor-pointer"
                                title="One-click attach sample document"
                              >
                                <span>+ Quick Attach</span>
                              </button>
                            </div>

                            <span className="text-[10px] text-stone-400 font-medium">
                              🔒 Private & Safe
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom / Additional Document Upload Widget */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3.5">
              <div>
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">
                  Add Additional Supporting Document (Optional)
                </span>
                <p className="text-[11px] text-stone-500">
                  Upload any other valid tourism licence, vehicle clearance, route authorization, or health certification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700">Document Type</label>
                  <select
                    value={customDocType}
                    onChange={(e) => setCustomDocType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                  >
                    <option value="Business Registration / BR Certificate">Business Registration (BR)</option>
                    <option value="Driver Licence">Driver Licence</option>
                    <option value="Vehicle Registration / Registration Certificate">Vehicle Registration / CR</option>
                    <option value="Revenue Licence">Revenue Licence</option>
                    <option value="Vehicle Insurance">Vehicle Insurance</option>
                    <option value="SLTDA Licence">SLTDA Licence</option>
                    <option value="Other Supporting Transport Document">Other Supporting Transport Document</option>
                    <option value="Food / Health Hygiene Certificate">Food / Health Hygiene Certificate</option>
                    <option value="Guide Licence / ID">Guide Licence / ID</option>
                    <option value="Other Supporting Document">Other Supporting Document</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700">Document Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DOC-99881 or LIC-2026"
                    value={customDocNumber}
                    onChange={(e) => setCustomDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700">File Name / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Additional_Permit_2026.pdf"
                    value={customDocFileName}
                    onChange={(e) => setCustomDocFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium">
                  🔒 Visible only to Admin & Owner • Strictly confidential
                </span>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="custom-doc-file-input"
                    className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      id="custom-doc-file-input"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      onChange={handleCustomFileInputChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleAddCustomDocument()}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Document</span>
                  </button>
                </div>
              </div>
            </div>

            {/* All Attached Documents Consolidated List */}
            {documents.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-stone-800">
                      All Attached Verification Documents ({documents.length}):
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Visible only to Admin & Owner
                  </span>
                </div>

                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-stone-900 block truncate">{doc.name}</span>
                          <span className="text-[11px] text-stone-500">
                            {doc.type} {doc.documentNumber ? `• Reg/Licence No: ${doc.documentNumber}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDocModal(doc)}
                          className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove document"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: PHOTOS */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <span>Step 5 – Authentic Real Photos</span>
              </h2>
              <p className="text-xs text-stone-500">
                Upload real photos of your property, vehicle, restaurant dishes, or staff.
              </p>
            </div>

            {/* Note prohibiting AI-generated photos */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong className="font-bold">Real photos policy:</strong> Do not use AI-generated images as your real business photos. Authentic photos build high trust with international tourists.
              </span>
            </div>

            {/* Main Cover Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Main Cover Photo URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={coverPhotoUrl}
                onChange={(e) => setCoverPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
              />

              {/* Cover Preview */}
              {coverPhotoUrl && (
                <div className="relative h-44 rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-900">
                  <img
                    src={coverPhotoUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-3 bg-black/70 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold">
                    Primary Cover Photo
                  </div>
                </div>
              )}
            </div>

            {/* Preset Real Sri Lankan Photos */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">
                Quick-select authentic Sri Lankan sample photos:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: 'Scenic Van / KDH',
                    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    name: 'Sri Lankan Homestay',
                    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    name: 'Clay Pot Curry Kitchen',
                    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    name: 'Ella Mountain View',
                    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
                  },
                ].map((sample) => (
                  <button
                    type="button"
                    key={sample.name}
                    onClick={() => {
                      setCoverPhotoUrl(sample.url);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-medium hover:border-emerald-600 cursor-pointer"
                  >
                    + {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Photos */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">Additional Gallery Photos</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste additional image URL"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPhotoUrl.trim()) {
                      setAdditionalPhotos((prev) => [...prev, newPhotoUrl.trim()]);
                      setNewPhotoUrl('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                >
                  Add Photo
                </button>
              </div>

              {additionalPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {additionalPhotos.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300 group">
                      <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAdditionalPhotos((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: REVIEW BEFORE SUBMIT */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-700" />
                <span>Step 6 – Review Registration Summary</span>
              </h2>
              <p className="text-xs text-stone-500">
                Please verify all details before submitting. You can click “Edit” on any section.
              </p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account & Owner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="font-bold text-xs text-stone-800">1. Account & Owner</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1 text-stone-600">
                  <div><strong>Name:</strong> {fullName}</div>
                  <div><strong>Mobile:</strong> {mobileNumber}</div>
                  <div><strong>WhatsApp:</strong> {whatsappNumber}</div>
                  <div><strong>Email:</strong> {email}</div>
                </div>
              </div>

              {/* Business & Location */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="font-bold text-xs text-stone-800">2. Business Details</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1 text-stone-600">
                  <div><strong>Business Name:</strong> {businessName || accountBizName}</div>
                  <div><strong>Category:</strong> {category}</div>
                  <div><strong>District:</strong> {district} ({city})</div>
                  <div><strong>Address:</strong> {address}</div>
                  <div><strong>Hours:</strong> {is24Hours ? '24 Hours Service' : openingHours}</div>
                </div>
              </div>

              {/* Service & Pricing */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="font-bold text-xs text-stone-800">3. Services & Pricing</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1 text-stone-600">
                  {category.includes('Transport') || category.includes('Taxi') || category.includes('Tuk') ? (
                    <>
                      <div><strong>Vehicle:</strong> {vehicleType} ({vehicleNumber})</div>
                      <div><strong>Capacity:</strong> {passengerCapacity} passengers</div>
                      <div><strong>Option:</strong> {driverAvailable}</div>
                      <div><strong>Rate:</strong> LKR {transportStartingPrice} ({transportPriceDesc})</div>
                    </>
                  ) : category.includes('Hotel') ? (
                    <>
                      <div><strong>Rooms:</strong> {roomCount} ({roomTypes.join(', ')})</div>
                      <div><strong>Rate:</strong> LKR {hotelStartingPrice} / night</div>
                      <div><strong>Amenities:</strong> {hotelAmenities.slice(0, 3).join(', ')}...</div>
                    </>
                  ) : category.includes('Restaurant') ? (
                    <>
                      <div><strong>Cuisine:</strong> {cuisineTypes.join(', ')}</div>
                      <div><strong>Price:</strong> {priceRange}</div>
                    </>
                  ) : (
                    <div><strong>Details:</strong> Standard service offering</div>
                  )}
                </div>
              </div>

              {/* Documents & Photos */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-800">4. Documents & Verification</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      🔒 Visible only to Admin & Owner
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-2 text-stone-700">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>Attached Docs: {documents.length} document(s)</span>
                    {documents.length > 0 && (
                      <span className="text-[11px] font-medium text-emerald-700">Ready for review</span>
                    )}
                  </div>
                  {documents.length > 0 ? (
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-stone-200">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-b-0 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold text-stone-900">{doc.type}: </span>
                              <span className="text-stone-600 font-mono text-[11px]">{doc.name}</span>
                              {doc.documentNumber && (
                                <span className="text-stone-500 text-[10px] ml-1">({doc.documentNumber})</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewDocModal(doc)}
                              className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            <span className="text-[10px] font-medium text-stone-400">🔒 Private</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                      No verification documents attached yet. You can attach driver licence, registration, and insurance in Step 4.
                    </div>
                  )}
                  <div className="text-xs text-stone-600 pt-1 border-t border-stone-200/60 flex items-center justify-between">
                    <span><strong>Cover Photo:</strong> {coverPhotoUrl ? 'Provided (1)' : 'None'}</span>
                    <span><strong>Gallery:</strong> {additionalPhotos.length} photo(s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Package Selection (Demo / Future-ready, free by default) */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-950 block">Listing Package Plan</span>
              <div className="flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">Standard Free Partner Listing</span>
                </div>
                <span className="font-bold text-emerald-800">LKR 0 (Free Forever)</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                LankaMate does not charge any upfront commission or hidden fees. Future featured tiers will be available via Demo Pay.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS: Back, Save Draft, Next / Submit */}
      <div className="bg-stone-50 p-4 sm:p-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitRegistration}
              className={`px-7 py-3 rounded-xl text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg cursor-pointer transition-all ${
                isEditMode
                  ? 'bg-gradient-to-r from-purple-800 to-emerald-800 hover:from-purple-900 hover:to-emerald-900'
                  : 'bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditMode ? 'Resubmit for Verification' : 'Submit Registration'}</span>
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDocModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewDocModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-800 text-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {previewDocModal.type}
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    LankaMate Secure Verification Record
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Document Metadata Bar */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Document Type</span>
                  <span className="font-bold text-stone-800">{previewDocModal.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">File Name</span>
                  <span className="font-mono text-stone-800 font-semibold truncate block">{previewDocModal.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Registration / Doc Number</span>
                  <span className="font-bold text-emerald-800">
                    {previewDocModal.documentNumber || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">File Size & Date</span>
                  <span className="text-stone-600">
                    {previewDocModal.fileSize || '1.2 MB'} • {previewDocModal.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Document Visual Preview Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/50 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                {previewDocModal.previewUrl ? (
                  <img
                    src={previewDocModal.previewUrl}
                    alt={previewDocModal.name}
                    className="max-h-56 max-w-full rounded-xl object-contain shadow-sm border border-stone-200"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                      <FileCheck className="w-8 h-8 text-emerald-700" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-black text-sm text-stone-900 block">
                        {previewDocModal.type}
                      </span>
                      <p className="font-mono text-xs text-stone-600">
                        {previewDocModal.name}
                      </p>
                      {previewDocModal.documentNumber && (
                        <p className="text-xs font-bold text-emerald-800">
                          Ref / No: {previewDocModal.documentNumber}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Status: Attached for Admin Verification Desk
                  </span>
                </div>
              </div>

              {/* Confidentiality Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Strictly Confidential:</strong> This verification document is encrypted and only visible to authorized LankaMate Admin Reviewers and the business owner. It will never be displayed on public listings or tourist search screens.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
