import {
  BusinessRegistrationRecord,
  RegistrationStatus,
  ServiceCategory,
  ApprovedBusinessListing,
} from '../types/businessRegistration';

export type { BusinessRegistrationRecord, RegistrationStatus, ServiceCategory, ApprovedBusinessListing };

const STORAGE_KEY = 'lankamate_business_registrations';
const APPROVED_LISTINGS_KEY = 'lankamate_approved_listings';

// Realistic Initial Seed Registrations
const INITIAL_REGISTRATIONS: BusinessRegistrationRecord[] = [
  {
    id: 'LM-BIZ-000001',
    createdAt: '2026-09-20T08:30:00.000Z',
    updatedAt: '2026-09-20T08:30:00.000Z',
    status: 'PENDING',
    statusNote: 'Initial application submitted. Awaiting document and location review.',
    account: {
      fullName: 'Nuwan Bandara',
      businessName: 'Bandara Airport & Islandwide Transport',
      mobileNumber: '+94 77 123 9876',
      whatsappNumber: '+94 77 123 9876',
      email: 'nuwan.transport@example.lk',
    },
    business: {
      businessName: 'Bandara Airport & Islandwide Transport',
      category: 'Van / Tourist Transport',
      description:
        'Reliable air-conditioned Toyota KDH super GL van service for tourists. English-speaking experienced driver for airport transfers, round-island cultural tours, and scenic hill country journeys.',
      address: 'No. 42 Negombo Road, Seeduwa',
      district: 'Gampaha',
      city: 'Katunayake / Negombo',
      serviceArea: 'Islandwide (Airport pickup, Kandy, Sigiriya, Ella, Galle)',
      coordinates: { lat: 7.1648, lng: 79.8821 },
      openingHours: '24 Hours Service',
      is24Hours: true,
      phone: '+94 77 123 9876',
      whatsapp: '+94 77 123 9876',
      website: 'https://lankamate.lk',
    },
    services: {
      transport: {
        vehicleType: 'Toyota HiAce Super GL Luxury Van',
        vehicleNumber: 'WP NC-7890',
        passengerCapacity: 8,
        airportTransferAvailable: true,
        longDistanceTrips: true,
        localTrips: true,
        driverAvailable: 'With Driver',
        startingPrice: 16000,
        priceDescription: 'Fixed Airport Transfer (Katunayake to Colombo) / LKR 120 per km round-trip',
      },
    },
    documents: [
      {
        id: 'doc-001',
        type: 'Driver Licence',
        name: 'Driving_Licence_Nuwan_Bandara.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-20',
        documentNumber: 'B1298456',
      },
      {
        id: 'doc-002',
        type: 'Vehicle Registration / Revenue Licence',
        name: 'Revenue_Licence_NC7890_2026.pdf',
        fileSize: '840 KB',
        uploadedAt: '2026-09-20',
      },
      {
        id: 'doc-003',
        type: 'Insurance Certificate',
        name: 'Passenger_Comprehensive_Insurance.pdf',
        fileSize: '1.5 MB',
        uploadedAt: '2026-09-20',
      },
    ],
    photos: {
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      additionalPhotos: [
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
      ],
    },
    package: 'free',
    profileCompleteness: 95,
    isActivatedListing: false,
  },
  {
    id: 'LM-BIZ-000002',
    createdAt: '2026-09-18T10:15:00.000Z',
    updatedAt: '2026-09-19T14:20:00.000Z',
    status: 'VERIFIED',
    statusNote: 'Documents and property verified by LankaMate Partner Team.',
    account: {
      fullName: 'Kamani Senanayake',
      businessName: 'Ella Mist Panoramic Homestay',
      mobileNumber: '+94 57 222 4567',
      whatsappNumber: '+94 71 888 2345',
      email: 'kamani.ellamist@example.lk',
    },
    business: {
      businessName: 'Ella Mist Panoramic Homestay',
      category: 'Hotel / Guest House / Homestay',
      description:
        'Peaceful family-run homestay situated amidst misty tea hills in Ella. Panoramic views of Ella Rock and Little Adam’s Peak. Authentic Ceylon home cooking and organic tea included.',
      address: 'Passara Road, Ella 90090',
      district: 'Badulla',
      city: 'Ella',
      serviceArea: 'Ella & Uva Province',
      coordinates: { lat: 6.8667, lng: 81.0466 },
      openingHours: '06:00 AM - 10:00 PM',
      is24Hours: false,
      phone: '+94 57 222 4567',
      whatsapp: '+94 71 888 2345',
      website: 'https://ellamisthomestay.example.lk',
    },
    services: {
      hotel: {
        roomCount: 4,
        roomTypes: ['Mountain View Deluxe', 'Family Attic Room', 'Balcony Double'],
        startingPrice: 12500,
        checkInTime: '02:00 PM',
        checkOutTime: '11:00 AM',
        amenities: ['Free High-Speed Wi-Fi', 'Hot Showers', 'Balcony View', 'Ceylon Breakfast Included', 'Trek Assistance'],
      },
    },
    documents: [
      {
        id: 'doc-004',
        type: 'Business Registration Certificate',
        name: 'BR_Cert_EllaMist_2024.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-09-18',
        documentNumber: 'WV/EL/2024/902',
      },
      {
        id: 'doc-005',
        type: 'SLTDA Registration / License',
        name: 'SLTDA_Homestay_Registration_Doc.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-09-18',
        documentNumber: 'SLTDA/HST/2025/112',
      },
    ],
    photos: {
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      additionalPhotos: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      ],
    },
    package: 'free',
    profileCompleteness: 100,
    reviewedBy: 'admin',
    reviewedAt: '2026-09-19T14:20:00.000Z',
    sltdaVerificationStatus: 'Verified by Admin',
    sltdaLicenseNumber: 'SLTDA/HST/2025/112',
    isActivatedListing: true,
  },
  {
    id: 'LM-BIZ-000003',
    createdAt: '2026-09-21T09:00:00.000Z',
    updatedAt: '2026-09-22T11:00:00.000Z',
    status: 'VERIFIED',
    statusNote: 'Approved. Active in Food & Restaurants directory.',
    account: {
      fullName: 'Mohamed Rizvi',
      businessName: 'Galle Fort Heritage Spice Kitchen',
      mobileNumber: '+94 91 223 7788',
      whatsappNumber: '+94 77 444 5566',
      email: 'spicekitchen.galle@example.lk',
    },
    business: {
      businessName: 'Galle Fort Heritage Spice Kitchen',
      category: 'Restaurant / Food',
      description:
        'Historic Dutch colonial villa serving authentic southern Sri Lankan clay pot curries, fresh ocean catches, vegetarian feasts, and handmade roti. Halal certified.',
      address: '28 Church Street, Galle Fort',
      district: 'Galle',
      city: 'Galle Fort',
      serviceArea: 'Galle & Southern Coast',
      coordinates: { lat: 6.0274, lng: 80.217 },
      openingHours: '11:30 AM - 10:30 PM (Daily)',
      is24Hours: false,
      phone: '+94 91 223 7788',
      whatsapp: '+94 77 444 5566',
      website: 'https://spicekitchengalle.example.lk',
    },
    services: {
      restaurant: {
        cuisineTypes: ['Traditional Sri Lankan', 'Fresh Seafood', 'Clay Pot Curries', 'Vegetarian / Vegan'],
        priceRange: '$$ (Moderate)',
        dineIn: true,
        takeaway: true,
        delivery: false,
        specialties: ['Galle Jaffna Crab Curry', 'Polos (Jackfruit) Curry', 'Seer Fish Ambul Thiyal', 'Coconut Roti Platter'],
      },
    },
    documents: [
      {
        id: 'doc-006',
        type: 'Business Registration Certificate',
        name: 'Galle_MC_Trade_License_2026.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-09-21',
      },
    ],
    photos: {
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      additionalPhotos: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      ],
    },
    package: 'free',
    profileCompleteness: 95,
    reviewedBy: 'admin',
    reviewedAt: '2026-09-22T11:00:00.000Z',
    isActivatedListing: true,
    statusHistory: [
      {
        status: 'PENDING',
        changedAt: '2026-09-21T09:00:00.000Z',
        changedBy: 'Owner / Initial Registration',
        note: 'Application submitted.',
      },
      {
        status: 'VERIFIED',
        changedAt: '2026-09-22T11:00:00.000Z',
        changedBy: 'Admin (LankaMate Partner Admin)',
        note: 'Approved and verified.',
      },
    ],
  },
  {
    id: 'LM-BIZ-000004',
    createdAt: '2026-09-21T14:00:00.000Z',
    updatedAt: '2026-09-21T14:00:00.000Z',
    status: 'PENDING',
    statusNote: 'Application submitted. Pending review by verification team.',
    account: {
      fullName: 'Sunil Shantha',
      businessName: 'Mirissa Blue Whale Safari & Boat Tours',
      mobileNumber: '+94 77 333 9988',
      whatsappNumber: '+94 77 333 9988',
      email: 'sunil.safari@example.lk',
    },
    business: {
      businessName: 'Mirissa Blue Whale Safari & Boat Tours',
      category: 'Tourist Attraction / Activity',
      description:
        'Ethical blue whale and dolphin watching excursions in Mirissa. Coast Guard registered passenger vessel with life jackets and certified wildlife spotters.',
      address: 'Harbour Road, Mirissa Fishery Harbour',
      district: 'Matara',
      city: 'Mirissa',
      serviceArea: 'Mirissa & Southern Coast',
      coordinates: { lat: 5.9482, lng: 80.4532 },
      openingHours: '05:30 AM - 02:00 PM',
      is24Hours: false,
      phone: '+94 77 333 9988',
      whatsapp: '+94 77 333 9988',
      website: 'https://mirissawhales.example.lk',
    },
    services: {
      attraction: {
        attractionType: 'Marine Wildlife Safari / Whale Watching',
        entryFeeLkr: 14000,
        bestTimeToVisit: 'November to April (Morning 6:00 AM departure)',
      },
    },
    documents: [
      {
        id: 'doc-007',
        type: 'Business Registration Certificate',
        name: 'BR_MirissaWhales_2025.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-21',
      },
      {
        id: 'doc-008',
        type: 'Insurance Certificate',
        name: 'Passenger_Marine_Insurance.pdf',
        fileSize: '1.6 MB',
        uploadedAt: '2026-09-21',
      },
    ],
    photos: {
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      additionalPhotos: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      ],
    },
    package: 'free',
    profileCompleteness: 90,
    isActivatedListing: false,
    statusHistory: [
      {
        status: 'PENDING',
        changedAt: '2026-09-21T14:00:00.000Z',
        changedBy: 'Owner / Initial Registration',
        note: 'Application submitted. Pending review by verification team.',
      },
    ],
  },
  {
    id: 'LM-BIZ-000005',
    createdAt: '2026-09-22T08:00:00.000Z',
    updatedAt: '2026-09-23T14:30:00.000Z',
    status: 'MORE_INFORMATION_REQUIRED',
    statusNote:
      'Additional Information Required: Please provide valid vehicle registration revenue license, updated driver photo, and correct your location coordinates to Vavuniya (currently set to Colombo coords 6.9271, 79.8612).',
    adminNotes:
      'Please provide valid vehicle registration revenue license, updated driver photo, and correct your location coordinates to Vavuniya (currently set to Colombo coords 6.9271, 79.8612).',
    previousAdminRequest:
      'Please provide valid vehicle registration revenue license, updated driver photo, and correct your location coordinates to Vavuniya (currently set to Colombo coords 6.9271, 79.8612).',
    reviewedBy: 'LankaMate Partner Admin',
    reviewedAt: '2026-09-23T14:30:00.000Z',
    account: {
      fullName: 'K. Mohanraj',
      businessName: 'Vavuniya Express Cab & Chauffeur',
      mobileNumber: '+94 77 980 4321',
      whatsappNumber: '+94 77 980 4321',
      email: 'mohanraj.vavuniya@example.lk',
    },
    business: {
      businessName: 'Vavuniya Express Cab & Chauffeur',
      category: 'Taxi / Car Hire',
      description:
        'Prompt and dependable taxi service based in Vavuniya. Serving Jaffna, Anuradhapura, Mannar, Trincomalee, and Colombo airport drops. Experienced polite local chauffeur with comfortable AC sedan car.',
      address: 'No. 18 Station Road, Vavuniya',
      district: 'Vavuniya',
      city: 'Vavuniya',
      serviceArea: 'Northern Province & Islandwide',
      // Note: intentionally set to Colombo coordinates as stated in requirement 8 to let owner fix it
      coordinates: { lat: 6.9271, lng: 79.8612 },
      openingHours: '24 Hours Service',
      is24Hours: true,
      phone: '+94 77 980 4321',
      whatsapp: '+94 77 980 4321',
      website: '',
    },
    services: {
      transport: {
        operatorType: 'Individual Independent Driver',
        vehicleType: 'Sedan Car (Toyota Prius / Axio)',
        vehicleNumber: 'NP CAH-3322',
        passengerCapacity: 4,
        airportTransferAvailable: true,
        longDistanceTrips: true,
        localTrips: true,
        driverAvailable: 'With Driver',
        startingPrice: 12000,
        priceDescription: 'Fixed Inter-city rates / LKR 110 per KM',
        driverName: 'K. Mohanraj',
        driverLicenseNumber: 'B8874123',
      },
    },
    documents: [
      {
        id: 'doc-vav-01',
        type: 'Driver Licence',
        name: 'Driving_Licence_Mohanraj.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-09-22',
        documentNumber: 'B8874123',
      },
    ],
    photos: {
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      additionalPhotos: [],
    },
    package: 'free',
    profileCompleteness: 65,
    isActivatedListing: false,
    statusHistory: [
      {
        status: 'PENDING',
        changedAt: '2026-09-22T08:00:00.000Z',
        changedBy: 'Owner / Initial Registration',
        note: 'Initial application submitted. Awaiting verification.',
      },
      {
        status: 'MORE_INFORMATION_REQUIRED',
        changedAt: '2026-09-23T14:30:00.000Z',
        changedBy: 'Admin (LankaMate Partner Admin)',
        note: 'Please provide valid vehicle registration revenue license, updated driver photo, and correct your location coordinates to Vavuniya (currently set to Colombo coords 6.9271, 79.8612).',
      },
    ],
  },
];

export function computeProfileCompleteness(record: Partial<BusinessRegistrationRecord>): number {
  let score = 0;

  // 1. Account Details (+15)
  if (record.account?.fullName && record.account.fullName.trim().length >= 3) score += 5;
  if (record.account?.mobileNumber && record.account.mobileNumber.trim().length >= 9) score += 5;
  if (record.account?.email && record.account.email.includes('@')) score += 5;

  // 2. Business Details (+25)
  if (record.business?.businessName && record.business.businessName.trim().length >= 3) score += 5;
  if (record.business?.category) score += 5;
  if (record.business?.district && record.business?.city) score += 5;
  if (record.business?.address && record.business.address.trim().length >= 5) score += 5;
  if (record.business?.description && record.business.description.trim().length >= 20) score += 5;

  // 3. Category Service Details (+20)
  if (record.services) {
    const hasCategoryDetails =
      !!record.services.transport?.vehicleType ||
      !!record.services.hotel?.roomCount ||
      !!record.services.restaurant?.cuisineTypes?.length ||
      !!record.services.guide?.languages?.length ||
      !!record.services.fuel?.fuelTypes?.length ||
      !!record.services.bank?.bankName ||
      !!record.services.garage?.serviceTypes?.length ||
      !!record.services.attraction?.attractionType ||
      !!record.services.other?.serviceOffering;
    if (hasCategoryDetails) score += 20;
  }

  // 4. Documents Uploaded (+15)
  if (record.documents && record.documents.length >= 1) {
    score += Math.min(15, record.documents.length * 8);
  }

  // 5. Photos Uploaded (+15)
  if (record.photos?.coverPhotoUrl) score += 10;
  if (record.photos?.additionalPhotos && record.photos.additionalPhotos.length >= 1) score += 5;

  // 6. Contact & Coordinates (+10)
  if (record.business?.phone && record.business?.whatsapp) score += 5;
  if (record.business?.coordinates?.lat && record.business.coordinates?.lng) score += 5;

  return Math.min(100, Math.max(0, score));
}

export const businessRegistrationService = {
  // Retrieve all registrations
  getRegistrations(): BusinessRegistrationRecord[] {
    if (typeof window === 'undefined') return INITIAL_REGISTRATIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Safety: ensure LM-BIZ-000001 to LM-BIZ-000005 exist
          let hasMerged = false;
          INITIAL_REGISTRATIONS.forEach((seedRec) => {
            if (!parsed.some((r: BusinessRegistrationRecord) => r.id === seedRec.id)) {
              parsed.push(seedRec);
              hasMerged = true;
            }
          });
          if (hasMerged) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading registrations from localStorage:', e);
    }
    // Seed initial data
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
    } catch {
      // ignore
    }
    return INITIAL_REGISTRATIONS;
  },

  // Save all registrations
  saveRegistrations(records: BusinessRegistrationRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      // Sync approved listings cache
      const approved = records.filter((r) => r.status === 'VERIFIED' && r.isActivatedListing);
      localStorage.setItem(APPROVED_LISTINGS_KEY, JSON.stringify(approved));
    } catch (e) {
      console.warn('Error writing registrations to localStorage:', e);
    }
  },

  // Generate unique registration ID like LM-BIZ-000004
  generateNextRegistrationId(): string {
    const records = this.getRegistrations();
    let maxNum = 0;
    records.forEach((r) => {
      const match = r.id.match(/LM-BIZ-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    const nextNum = maxNum + 1;
    return `LM-BIZ-${String(nextNum).padStart(6, '0')}`;
  },

  // Create new registration
  createRegistration(
    payload: Omit<BusinessRegistrationRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'profileCompleteness' | 'isActivatedListing'>
  ): BusinessRegistrationRecord {
    const id = this.generateNextRegistrationId();
    const now = new Date().toISOString();
    const newRecord: BusinessRegistrationRecord = {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'PENDING',
      statusNote: 'Registration submitted successfully. Currently pending administrator verification.',
      profileCompleteness: 0,
      isActivatedListing: false,
    };

    newRecord.profileCompleteness = computeProfileCompleteness(newRecord);

    const existing = this.getRegistrations();
    const updated = [newRecord, ...existing];
    this.saveRegistrations(updated);

    return newRecord;
  },

  // Get single registration by ID
  getRegistrationById(id: string): BusinessRegistrationRecord | undefined {
    const records = this.getRegistrations();
    return records.find((r) => r.id === id);
  },

  // Update business details by Owner
  updateRegistrationByOwner(
    id: string,
    updates: Partial<BusinessRegistrationRecord>
  ): BusinessRegistrationRecord | null {
    const records = this.getRegistrations();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const current = records[idx];
    const updated: BusinessRegistrationRecord = {
      ...current,
      ...updates,
      id: current.id, // Strictly preserve existing ID
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    updated.profileCompleteness = computeProfileCompleteness(updated);

    records[idx] = updated;
    this.saveRegistrations(records);
    return updated;
  },

  // Resubmit registration by Owner after updating missing information
  resubmitRegistration(
    id: string,
    updates: Partial<BusinessRegistrationRecord>
  ): BusinessRegistrationRecord | null {
    const records = this.getRegistrations();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const current = records[idx];
    const now = new Date().toISOString();

    const history = current.statusHistory ? [...current.statusHistory] : [
      {
        status: current.status,
        changedAt: current.createdAt,
        changedBy: 'Owner / Initial Registration',
        note: current.statusNote,
      },
    ];

    history.push({
      status: 'PENDING',
      changedAt: now,
      changedBy: 'Owner (Resubmission)',
      note: 'Updated requested information and resubmitted for admin verification.',
    });

    const updated: BusinessRegistrationRecord = {
      ...current,
      ...updates,
      id: current.id, // Guarantee same ID: LM-BIZ-000005 remains LM-BIZ-000005
      createdAt: current.createdAt,
      updatedAt: now,
      resubmittedAt: now,
      status: 'PENDING',
      statusNote: 'Updated registration resubmitted. Awaiting administrator review.',
      previousAdminRequest: current.adminNotes || current.previousAdminRequest,
      adminNotes: current.adminNotes, // Preserve admin remarks
      isActivatedListing: false, // Ensure provider is not publicly listed in Transport until admin approves
      statusHistory: history,
    };

    updated.profileCompleteness = computeProfileCompleteness(updated);

    records[idx] = updated;
    this.saveRegistrations(records);
    return updated;
  },

  // Admin Actions: Approve, Reject, Request More Info, Set Status
  updateVerificationStatus(
    id: string,
    newStatus: RegistrationStatus,
    adminUsername: string,
    adminNotes?: string,
    sltdaVerified?: boolean
  ): BusinessRegistrationRecord | null {
    const records = this.getRegistrations();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const current = records[idx];
    const now = new Date().toISOString();

    const isActivated = newStatus === 'VERIFIED';
    let sltdaStatus = current.sltdaVerificationStatus || 'Not Submitted';
    if (sltdaVerified !== undefined) {
      sltdaStatus = sltdaVerified ? 'Verified by Admin' : 'Rejected';
    }

    const history = current.statusHistory ? [...current.statusHistory] : [
      {
        status: current.status,
        changedAt: current.createdAt,
        changedBy: 'Owner / Initial Registration',
        note: current.statusNote,
      },
    ];

    history.push({
      status: newStatus,
      changedAt: now,
      changedBy: `Admin (${adminUsername})`,
      note:
        adminNotes ||
        (newStatus === 'MORE_INFORMATION_REQUIRED'
          ? 'Additional details or documents required'
          : newStatus === 'VERIFIED'
          ? 'Approved & Verified'
          : newStatus === 'REJECTED'
          ? 'Rejected'
          : undefined),
    });

    const updated: BusinessRegistrationRecord = {
      ...current,
      status: newStatus,
      updatedAt: now,
      reviewedBy: adminUsername,
      reviewedAt: now,
      adminNotes: adminNotes ?? current.adminNotes,
      previousAdminRequest:
        newStatus === 'MORE_INFORMATION_REQUIRED'
          ? adminNotes || current.adminNotes
          : current.previousAdminRequest,
      statusNote:
        newStatus === 'VERIFIED'
          ? 'Approved! Your business is officially verified and listed across LankaMate.'
          : newStatus === 'REJECTED'
          ? 'Verification declined. Please review the admin remarks and update your details.'
          : newStatus === 'MORE_INFORMATION_REQUIRED'
          ? 'Additional details or documents required. Please update your registration profile.'
          : newStatus === 'UNDER_REVIEW'
          ? 'Your registration is currently being audited by our verification team.'
          : 'Pending administrator verification.',
      isActivatedListing: isActivated,
      sltdaVerificationStatus: sltdaStatus,
      statusHistory: history,
    };

    records[idx] = updated;
    this.saveRegistrations(records);
    return updated;
  },

  // Get verified listings for category view (e.g. Transport, Hotel, Food)
  getApprovedListingsByCategory(category: ServiceCategory): BusinessRegistrationRecord[] {
    const records = this.getRegistrations();
    return records.filter(
      (r) => r.status === 'VERIFIED' && r.isActivatedListing && r.business.category === category
    );
  },

  // Get all approved listings
  getAllApprovedListings(): BusinessRegistrationRecord[] {
    const records = this.getRegistrations();
    return records.filter((r) => r.status === 'VERIFIED' && r.isActivatedListing);
  },
};
