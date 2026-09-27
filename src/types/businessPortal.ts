export type BusinessType =
  | 'Hotels & Guest Houses'
  | 'Restaurants & Food Shops'
  | 'Tour Operators'
  | 'Drivers / Chauffeur Services'
  | 'Travel Agencies'
  | 'Car Rental Services'
  | 'Local Attractions / Activities';

export type ListingStatus = 'Pending Review' | 'Approved' | 'Needs Update';

export interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: BusinessType;
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  openingHours: string;
  services: string[];
  photos: string[];
  website: string;
  status: ListingStatus;
  completeness: number; // 0 - 100
  submittedAt: string;
  lastUpdated: string;
  sltdaRegistered?: boolean;
}

export interface BusinessEnquiry {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  topic: string;
  date: string;
  message: string;
  status: 'New' | 'Replied';
  replyText?: string;
  repliedAt?: string;
}

export type PortalTab =
  | 'home'
  | 'register'
  | 'my-business'
  | 'listings'
  | 'enquiries'
  | 'profile'
  | 'support'
  | 'admin-review';
