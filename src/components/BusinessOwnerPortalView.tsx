import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  Briefcase,
  Layers,
  MessageSquare,
  UserCheck,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  ChevronRight,
  Edit3,
  Trash2,
  Send,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowLeft,
  X,
  UploadCloud,
  Check,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { PageId } from '../types';
import {
  BusinessType,
  ListingStatus,
  BusinessProfile,
  BusinessEnquiry,
  PortalTab,
} from '../types/businessPortal';
import {
  INITIAL_DEMO_BUSINESSES,
  INITIAL_DEMO_ENQUIRIES,
  COMMON_SRI_LANKAN_AMENITIES,
} from '../data/businessPortalData';
import { BusinessRegistrationWizard } from './business/BusinessRegistrationWizard';
import { AdminRegistrationReviewDesk } from './business/AdminRegistrationReviewDesk';
import {
  businessRegistrationService,
  BusinessRegistrationRecord,
} from '../services/businessRegistrationService';

interface BusinessOwnerPortalViewProps {
  onNavigatePage: (page: PageId) => void;
}

const BUSINESS_TYPES: BusinessType[] = [
  'Hotels & Guest Houses',
  'Restaurants & Food Shops',
  'Tour Operators',
  'Drivers / Chauffeur Services',
  'Travel Agencies',
  'Car Rental Services',
  'Local Attractions / Activities',
];

export const BusinessOwnerPortalView: React.FC<BusinessOwnerPortalViewProps> = ({
  onNavigatePage,
}) => {
  // Registrations from businessRegistrationService
  const [registrations, setRegistrations] = useState<BusinessRegistrationRecord[]>(() => {
    return businessRegistrationService.getRegistrations();
  });

  // State for Update & Resubmit wizard invocation
  const [editingRegistration, setEditingRegistration] = useState<BusinessRegistrationRecord | null>(null);
  const [showAdminRemarkModal, setShowAdminRemarkModal] = useState<BusinessRegistrationRecord | null>(null);

  // Persistence for businesses and enquiries, merged with registered businesses
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('lankamate_partner_businesses');
    let baseList: BusinessProfile[] = INITIAL_DEMO_BUSINESSES;
    if (saved) {
      try {
        baseList = JSON.parse(saved);
      } catch {
        // fallback
      }
    }

    // Merge registered businesses from businessRegistrationService
    const regs = businessRegistrationService.getRegistrations();
    const merged = [...baseList];
    regs.forEach((reg) => {
      const mapped: BusinessProfile = {
        id: reg.id,
        businessName: reg.business.businessName,
        businessType: (reg.business.category === 'Hotel / Guest House / Homestay'
          ? 'Hotels & Guest Houses'
          : reg.business.category === 'Restaurant / Food'
          ? 'Restaurants & Food Shops'
          : reg.business.category.includes('Transport') ||
            reg.business.category.includes('Taxi') ||
            reg.business.category.includes('Tuk')
          ? 'Drivers / Chauffeur Services'
          : 'Tour Operators') as BusinessType,
        location: `${reg.business.city}, ${reg.business.district}`,
        address: reg.business.address,
        phone: reg.business.phone,
        email: reg.account.email,
        description: reg.business.description,
        openingHours: reg.business.openingHours,
        services: reg.services.transport
          ? [
              reg.services.transport.vehicleType,
              `Plate: ${reg.services.transport.vehicleNumber}`,
              `Capacity: ${reg.services.transport.passengerCapacity} Pax`,
              reg.services.transport.driverAvailable,
            ]
          : reg.services.hotel
          ? [`${reg.services.hotel.roomCount} Rooms`, ...(reg.services.hotel.amenities || []).slice(0, 3)]
          : reg.services.restaurant
          ? [...(reg.services.restaurant.cuisineTypes || []), reg.services.restaurant.priceRange]
          : ['Tourism Hospitality'],
        photos: [
          reg.photos.coverPhotoUrl,
          ...(reg.photos.additionalPhotos || []),
        ].filter(Boolean),
        website: reg.business.website || 'https://lankamate.lk',
        status:
          reg.status === 'VERIFIED'
            ? 'Approved'
            : reg.status === 'MORE_INFORMATION_REQUIRED' || reg.status === 'REJECTED'
            ? 'Needs Update'
            : 'Pending Review',
        completeness: reg.profileCompleteness,
        submittedAt: reg.createdAt.split('T')[0],
        lastUpdated: reg.updatedAt.split('T')[0],
        sltdaRegistered: reg.sltdaVerificationStatus === 'Verified by Admin',
      };
      const exIdx = merged.findIndex((b) => b.id === reg.id);
      if (exIdx >= 0) {
        merged[exIdx] = { ...merged[exIdx], ...mapped };
      } else {
        merged.push(mapped);
      }
    });

    return merged;
  });

  const [activeBusinessId, setActiveBusinessId] = useState<string>(() => {
    const regs = businessRegistrationService.getRegistrations();
    const moreInfo = regs.find((r) => r.status === 'MORE_INFORMATION_REQUIRED');
    if (moreInfo) return moreInfo.id;
    return 'biz-demo-01';
  });

  const [enquiries, setEnquiries] = useState<BusinessEnquiry[]>(() => {
    const saved = localStorage.getItem('lankamate_partner_enquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_DEMO_ENQUIRIES;
  });

  const [currentTab, setCurrentTab] = useState<PortalTab>('home');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Active business object
  const activeBusiness =
    businesses.find((b) => b.id === activeBusinessId) || businesses[0] || INITIAL_DEMO_BUSINESSES[0];

  // Active business registration record (if any)
  const activeBusinessRegistration = registrations.find(
    (r) =>
      r.id === activeBusiness?.id ||
      r.business.businessName.toLowerCase() === activeBusiness?.businessName.toLowerCase()
  );

  // Handler to initiate Update & Resubmit workflow
  const handleStartUpdateAndResubmit = (record: BusinessRegistrationRecord) => {
    setEditingRegistration(record);
    setActiveBusinessId(record.id);
    setCurrentTab('register');
  };

  // Handle registration completed from Wizard
  const handleRegistrationCompleted = (record: BusinessRegistrationRecord) => {
    const freshList = businessRegistrationService.getRegistrations();
    setRegistrations(freshList);

    // Map to BusinessProfile
    const mappedBiz: BusinessProfile = {
      id: record.id,
      businessName: record.business.businessName,
      businessType: (record.business.category === 'Hotel / Guest House / Homestay'
        ? 'Hotels & Guest Houses'
        : record.business.category === 'Restaurant / Food'
        ? 'Restaurants & Food Shops'
        : record.business.category.includes('Transport') ||
          record.business.category.includes('Taxi') ||
          record.business.category.includes('Tuk')
        ? 'Drivers / Chauffeur Services'
        : 'Tour Operators') as BusinessType,
      location: `${record.business.city}, ${record.business.district}`,
      address: record.business.address,
      phone: record.business.phone,
      email: record.account.email,
      description: record.business.description,
      openingHours: record.business.openingHours,
      services: record.services.transport
        ? [
            record.services.transport.vehicleType,
            `Plate: ${record.services.transport.vehicleNumber}`,
            `Capacity: ${record.services.transport.passengerCapacity} Pax`,
            record.services.transport.driverAvailable,
          ]
        : record.services.hotel
        ? [
            `${record.services.hotel.roomCount} Rooms`,
            ...(record.services.hotel.amenities || []).slice(0, 3),
          ]
        : record.services.restaurant
        ? [
            ...(record.services.restaurant.cuisineTypes || []),
            record.services.restaurant.priceRange,
          ]
        : ['Tourism Hospitality'],
      photos: [
        record.photos.coverPhotoUrl,
        ...(record.photos.additionalPhotos || []),
      ].filter(Boolean),
      website: record.business.website || 'https://lankamate.lk',
      status:
        record.status === 'VERIFIED'
          ? 'Approved'
          : record.status === 'MORE_INFORMATION_REQUIRED' || record.status === 'REJECTED'
          ? 'Needs Update'
          : 'Pending Review',
      completeness: record.profileCompleteness,
      submittedAt: record.createdAt.split('T')[0],
      lastUpdated: record.updatedAt.split('T')[0],
      sltdaRegistered: record.sltdaVerificationStatus === 'Verified by Admin',
    };

    setBusinesses((prev) => [mappedBiz, ...prev.filter((b) => b.id !== record.id)]);
    setActiveBusinessId(record.id);
  };

  // Handle admin registration verification update
  const handleAdminRegistrationStatusChange = (updated: BusinessRegistrationRecord) => {
    const freshList = businessRegistrationService.getRegistrations();
    setRegistrations(freshList);

    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === updated.id || b.businessName.toLowerCase() === updated.business.businessName.toLowerCase()) {
          return {
            ...b,
            status:
              updated.status === 'VERIFIED'
                ? 'Approved'
                : updated.status === 'REJECTED'
                ? 'Needs Update'
                : 'Pending Review',
            sltdaRegistered: updated.sltdaVerificationStatus === 'Verified by Admin',
          };
        }
        return b;
      })
    );
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lankamate_partner_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('lankamate_partner_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Form State for "Register Your Business"
  const [regForm, setRegForm] = useState({
    businessName: '',
    businessType: 'Hotels & Guest Houses' as BusinessType,
    location: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: '08:00 AM - 08:00 PM (Daily)',
    selectedServices: [] as string[],
    newServiceInput: '',
    photos: [] as string[],
    photoUrlInput: '',
    website: '',
  });

  // Modals / Editors for "My Business"
  const [activeModal, setActiveModal] = useState<
    'edit-biz' | 'manage-photos' | 'edit-hours' | 'edit-services' | 'reply-enquiry' | null
  >(null);

  // Quick edit buffers
  const [editBizBuffer, setEditBizBuffer] = useState<Partial<BusinessProfile>>({});
  const [activeEnquiryToReply, setActiveEnquiryToReply] = useState<BusinessEnquiry | null>(null);
  const [replyTextInput, setReplyTextInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to calculate completeness
  const computeCompleteness = (b: Partial<BusinessProfile>): number => {
    let score = 20; // base score
    if (b.businessName) score += 10;
    if (b.location) score += 10;
    if (b.address) score += 10;
    if (b.phone) score += 10;
    if (b.email) score += 10;
    if (b.description && b.description.length > 20) score += 10;
    if (b.openingHours) score += 5;
    if (b.services && b.services.length >= 3) score += 10;
    if (b.photos && b.photos.length >= 1) score += 5;
    return Math.min(score, 100);
  };

  // Handle New Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.businessName.trim() || !regForm.location.trim()) {
      showToast('Please provide at least the business name and location.');
      return;
    }

    const newBiz: BusinessProfile = {
      id: `biz-${Date.now()}`,
      businessName: regForm.businessName.trim(),
      businessType: regForm.businessType,
      location: regForm.location.trim(),
      address: regForm.address.trim() || `${regForm.location}, Sri Lanka`,
      phone: regForm.phone.trim() || '+94 77 000 0000',
      email: regForm.email.trim() || 'owner@example.lk',
      description:
        regForm.description.trim() ||
        `Premier Sri Lankan ${regForm.businessType.toLowerCase()} welcoming international & domestic travelers.`,
      openingHours: regForm.openingHours.trim() || '08:00 AM - 08:00 PM',
      services:
        regForm.selectedServices.length > 0
          ? regForm.selectedServices
          : ['Traditional Hospitality', 'Customer Support'],
      photos:
        regForm.photos.length > 0
          ? regForm.photos
          : [
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
            ],
      website: regForm.website.trim() || 'https://lankamate.lk',
      status: 'Pending Review',
      completeness: computeCompleteness(regForm),
      submittedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      sltdaRegistered: false,
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    setActiveBusinessId(newBiz.id);
    setSubmissionSuccess(true);
  };

  // Reset Register Form
  const resetRegisterForm = () => {
    setRegForm({
      businessName: '',
      businessType: 'Hotels & Guest Houses',
      location: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      openingHours: '08:00 AM - 08:00 PM (Daily)',
      selectedServices: [],
      newServiceInput: '',
      photos: [],
      photoUrlInput: '',
      website: '',
    });
    setSubmissionSuccess(false);
  };

  // Handle quick update to active business
  const updateActiveBusiness = (updates: Partial<BusinessProfile>) => {
    setBusinesses((prev) =>
      prev.map((item) => {
        if (item.id === activeBusinessId) {
          const merged = {
            ...item,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
          merged.completeness = computeCompleteness(merged);
          return merged;
        }
        return item;
      })
    );
    showToast('Business details updated locally!');
    setActiveModal(null);
  };

  // Handle sending reply to an enquiry
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiryToReply || !replyTextInput.trim()) return;

    setEnquiries((prev) =>
      prev.map((enq) => {
        if (enq.id === activeEnquiryToReply.id) {
          return {
            ...enq,
            status: 'Replied',
            replyText: replyTextInput.trim(),
            repliedAt: new Date().toLocaleString(),
          };
        }
        return enq;
      })
    );

    showToast(`Reply sent to ${activeEnquiryToReply.customerName}!`);
    setActiveModal(null);
    setReplyTextInput('');
    setActiveEnquiryToReply(null);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Approved
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Pending Review
          </span>
        );
      case 'Needs Update':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
            Needs Update
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Disclaimer Banner */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              id="btn-portal-back-home"
              onClick={() => onNavigatePage('home')}
              className="text-emerald-200 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to LankaMate</span>
            </button>
            <span className="text-emerald-700">•</span>
            <span className="text-emerald-300 font-semibold">LankaMate Partner Network</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-800 text-[11px] text-amber-300">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Demo / Local Partner Workflow • Realistic Sri Lankan Business Simulation</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-bold uppercase tracking-wider border border-emerald-700">
                <Sparkles className="w-3 h-3" />
                <span>Sri Lanka Tourism Partner Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Business Owner Portal
              </h1>
              <p className="text-sm sm:text-base text-emerald-100 font-medium">
                “Grow your Sri Lankan business with LankaMate”
              </p>
            </div>

            {/* Prominent Register Button & Active Business Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-hero-register-service"
                onClick={() => {
                  setEditingRegistration(null);
                  setCurrentTab('register');
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <PlusCircle className="w-4 h-4 text-emerald-950 shrink-0" />
                <span>Register Your Business / Service</span>
              </button>

              {/* Active Business Switcher */}
              {activeBusiness && (
                <div className="bg-emerald-900/90 border border-emerald-700/80 p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 shadow-md max-w-md">
                  <div className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 font-black shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={activeBusinessId}
                        onChange={(e) => setActiveBusinessId(e.target.value)}
                        className="bg-emerald-950 text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-700 cursor-pointer max-w-full truncate"
                        title="Switch active business profile"
                      >
                        {businesses.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id.startsWith('LM-BIZ') ? `[${b.id}] ` : ''}{b.businessName} ({b.status})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-emerald-200 truncate">
                        {activeBusiness.location}
                      </span>
                      <span className="scale-85 origin-left">
                        {renderStatusBadge(activeBusiness.status)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-emerald-800/80">
            {[
              { id: 'home' as PortalTab, label: 'Portal Home', icon: <Building2 className="w-4 h-4" /> },
              {
                id: 'register' as PortalTab,
                label: 'Register Your Business / Service',
                icon: <PlusCircle className="w-4 h-4" />,
              },
              {
                id: 'my-business' as PortalTab,
                label: 'My Business',
                icon: <Briefcase className="w-4 h-4" />,
              },
              {
                id: 'listings' as PortalTab,
                label: 'Manage Listings',
                icon: <Layers className="w-4 h-4" />,
              },
              {
                id: 'enquiries' as PortalTab,
                label: `Business Enquiries (${enquiries.filter((e) => e.status === 'New').length})`,
                icon: <MessageSquare className="w-4 h-4" />,
              },
              {
                id: 'profile' as PortalTab,
                label: 'Business Profile',
                icon: <UserCheck className="w-4 h-4" />,
              },
              {
                id: 'support' as PortalTab,
                label: 'Help & Support',
                icon: <HelpCircle className="w-4 h-4" />,
              },
              {
                id: 'admin-review' as PortalTab,
                label: `Admin Review Desk (${registrations.filter((r) => r.status === 'PENDING').length})`,
                icon: <ShieldCheck className="w-4 h-4" />,
              },
            ].map((tab) => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-portal-${tab.id}`}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    if (tab.id === 'register') {
                      setSubmissionSuccess(false);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 hover:text-white border border-emerald-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Alert Banner for More Information Required */}
      {registrations.some((r) => r.status === 'MORE_INFORMATION_REQUIRED') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
          {registrations
            .filter((r) => r.status === 'MORE_INFORMATION_REQUIRED')
            .map((moreInfoReg) => (
              <div
                key={moreInfoReg.id}
                className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 border-2 border-purple-400 text-white p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl mb-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-200 text-purple-950 font-black shrink-0 mt-0.5 sm:mt-0 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-purple-900" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-white">
                        Action Required: Information Requested by LankaMate Admin
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-purple-950 font-mono text-xs font-black shadow-2xs">
                        Ref: {moreInfoReg.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-800 text-purple-200 text-[10px] font-bold uppercase tracking-wider">
                        More Info Required
                      </span>
                    </div>
                    <p className="text-xs text-purple-200 mt-1 line-clamp-1 font-medium">
                      <strong>{moreInfoReg.business.businessName}</strong> ({moreInfoReg.business.category}) — {moreInfoReg.adminNotes || moreInfoReg.previousAdminRequest || 'Admin has requested additional details or verification documents.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                  <button
                    type="button"
                    onClick={() => setShowAdminRemarkModal(moreInfoReg)}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs font-bold border border-purple-400/40 cursor-pointer shadow-xs"
                  >
                    View Admin Request
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartUpdateAndResubmit(moreInfoReg)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-950" />
                    <span>Update & Resubmit</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================================= */}
        {/* TAB 1: PORTAL HOME */}
        {/* ========================================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Status Bar for Local Demo */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">Demo & Local Workflow Mode</span>
                  <span className="text-amber-800 text-[11px]">
                    All submissions, edits, and enquiry responses are saved locally in your device storage for testing and evaluation.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-amber-200">
                <span>Active Listings: {businesses.length}</span>
                <span>•</span>
                <span>Enquiries: {enquiries.length}</span>
              </div>
            </div>

            {/* Portal Action Cards Grid (Six core requirements) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Register Your Business / Service */}
              <div
                id="portal-card-register"
                onClick={() => {
                  setCurrentTab('register');
                  resetRegisterForm();
                }}
                className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl p-5 border-2 border-emerald-500/80 shadow-sm hover:shadow-md hover:border-emerald-600 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-xs">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                      Official Partner Enrollment
                    </span>
                    <h3 className="font-black text-lg text-stone-900 group-hover:text-emerald-800 transition-colors">
                      Register Your Business / Service
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Dedicated registration for independent transport providers (car, van, tuk-tuk, airport transfer), hotels, homestays, restaurants, tour guides, and local tourism services across Sri Lanka.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 mt-4 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-black group-hover:bg-emerald-900 transition-colors">
                    Register Your Business / Service
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-800" />
                </div>
              </div>

              {/* Card 2: My Business */}
              <div
                id="portal-card-my-business"
                onClick={() => setCurrentTab('my-business')}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-stone-900 group-hover:text-sky-700 transition-colors">
                      My Business
                    </h3>
                    {renderStatusBadge(activeBusiness.status)}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    View your operational dashboard: profile completeness ({activeBusiness.completeness}%), update opening hours, edit services, and manage photos.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-bold text-sky-700">
                  <span>Open Business Dashboard</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Manage Listings */}
              <div
                id="portal-card-manage-listings"
                onClick={() => setCurrentTab('listings')}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-stone-900 group-hover:text-amber-700 transition-colors">
                      Manage Listings
                    </h3>
                    <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold">
                      {businesses.length} Listed
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Review and toggle between all your registered properties, fleet vehicles, or food outlets across Sri Lanka.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>Manage All Listings</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Business Enquiries */}
              <div
                id="portal-card-enquiries"
                onClick={() => setCurrentTab('enquiries')}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-stone-900 group-hover:text-purple-700 transition-colors">
                      Business Enquiries
                    </h3>
                    {enquiries.filter((e) => e.status === 'New').length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">
                        {enquiries.filter((e) => e.status === 'New').length} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Read tourist queries regarding room availability, safari bookings, dietary needs, or chauffeur tariffs, and send direct responses.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>View Customer Enquiries</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 5: Business Profile */}
              <div
                id="portal-card-profile"
                onClick={() => setCurrentTab('profile')}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                    Business Profile
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Keep your contact phone, business email, physical address, and social links up to date for travellers calling from LankaMate.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Edit Business Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 6: Help & Support */}
              <div
                id="portal-card-support"
                onClick={() => setCurrentTab('support')}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900 group-hover:text-stone-700 transition-colors">
                    Help & Support
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Frequently asked questions, Tourist Board (SLTDA) guidelines, photo verification standards, and LankaMate Partner Help Desk.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Read Partner Guides</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Target Sri Lankan Business Sectors Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-4">
              <div className="max-w-2xl space-y-2">
                <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                  Partner Ecosystem
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  Built for Every Sri Lankan Tourism Sector
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  LankaMate connects verified local hospitality providers directly with travellers exploring Colombo, Kandy, Galle, Ella, Sigiriya, Jaffna, and beyond.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
                {[
                  '🏨 Hotels & Guest Houses',
                  '🍛 Restaurants & Food Shops',
                  '🧭 Tour Operators',
                  '🚐 Drivers / Chauffeur Services',
                  '✈️ Travel Agencies',
                  '🚗 Car & Scooter Rentals',
                  '🏄 Local Attractions & Activities',
                  '🌿 Spice Gardens & Cooking Hubs',
                ].map((sector, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-800/60 border border-emerald-700/60 text-xs font-bold text-emerald-50 flex items-center gap-2"
                  >
                    <span>{sector}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REGISTER YOUR BUSINESS / SERVICE (7-STEP COMPLETE WIZARD) */}
        {/* ========================================================================= */}
        {currentTab === 'register' && (
          <div className="space-y-6">
            <BusinessRegistrationWizard
              initialRecord={editingRegistration}
              mode={editingRegistration ? 'edit' : 'create'}
              onRegistrationComplete={(newRecord) => {
                handleRegistrationCompleted(newRecord);
                const wasEdit = !!editingRegistration;
                setEditingRegistration(null);
                setActiveBusinessId(newRecord.id);
                setCurrentTab('my-business');
                showToast(
                  wasEdit
                    ? `Registration ${newRecord.id} successfully updated and resubmitted for verification!`
                    : `Registration ${newRecord.id} recorded with status Pending Verification.`
                );
              }}
              onCancel={() => {
                setEditingRegistration(null);
                setCurrentTab('home');
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MY BUSINESS (DASHBOARD) */}
        {/* ========================================================================= */}
        {currentTab === 'my-business' && activeBusiness && (
          <div className="space-y-6">
            {/* Business Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                      {activeBusiness.businessName}
                    </h2>
                    {renderStatusBadge(activeBusiness.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                    <span className="font-bold text-emerald-800">{activeBusiness.businessType}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {activeBusiness.location}
                    </span>
                    <span>•</span>
                    <span>Last updated: {activeBusiness.lastUpdated}</span>
                  </div>
                </div>

                {/* Listing Status Controls & Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Demo Status Test:</span>
                  <select
                    value={activeBusiness.status}
                    onChange={(e) =>
                      updateActiveBusiness({ status: e.target.value as ListingStatus })
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Needs Update">Needs Update</option>
                  </select>
                </div>
              </div>

              {/* Profile Completeness Section */}
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs sm:text-sm text-emerald-950">
                      Profile Completeness
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Higher completeness gives your business greater visibility across tourists searching in LankaMate.
                    </p>
                  </div>
                  <span className="text-lg font-black text-emerald-900">
                    {activeBusiness.completeness}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-emerald-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${activeBusiness.completeness}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-900 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Contact Info
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Address & Location
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Opening Hours ({activeBusiness.openingHours})
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {activeBusiness.services.length} Services Added
                  </span>
                </div>
              </div>

              {/* ADDITIONAL INFORMATION REQUIRED CARD (Requirement 1 & 3) */}
              {activeBusinessRegistration?.status === 'MORE_INFORMATION_REQUIRED' && (
                <div className="bg-gradient-to-br from-purple-50 via-purple-50/80 to-indigo-50/60 border-2 border-purple-500 rounded-3xl p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                            Action Required
                          </span>
                          <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-white text-purple-950 border border-purple-300 shadow-2xs">
                            Registration: {activeBusinessRegistration.id}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-purple-950 mt-1">
                          Additional Information Required
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-purple-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Status: More Info Required</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin remarks box */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-300/80 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-purple-700" />
                        <span>Information requested by LankaMate Admin</span>
                      </span>
                      <span className="text-[11px] font-semibold text-purple-700">
                        Date requested: {activeBusinessRegistration.reviewedAt ? new Date(activeBusinessRegistration.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                      “{activeBusinessRegistration.adminNotes || activeBusinessRegistration.previousAdminRequest || 'Please review your transport vehicle registration number, upload your driver licence or vehicle revenue licence, and ensure your service coordinates accurately reflect your operational area.'}”
                    </div>
                  </div>

                  {/* Actions: View Admin Request & Update & Resubmit */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-purple-800 leading-relaxed">
                      Clicking <strong>Update & Resubmit</strong> will reopen your registration wizard with all existing details pre-filled. Your Registration ID (<strong>{activeBusinessRegistration.id}</strong>) will be preserved.
                    </p>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowAdminRemarkModal(activeBusinessRegistration)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-purple-400 bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-700" />
                        <span>View Admin Request</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartUpdateAndResubmit(activeBusinessRegistration)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-emerald-700 hover:from-purple-900 hover:to-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4 text-amber-300" />
                        <span>Update & Resubmit</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Status & Official Verification Box */}
              <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Registration Reference:
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-white text-stone-900 border border-stone-300 shadow-2xs">
                        {activeBusinessRegistration?.id || `LM-BIZ-${activeBusiness.id.replace(/\D/g, '').padStart(6, '0').slice(-6)}`}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-600">
                      Category:{' '}
                      <span className="text-stone-900 font-bold">
                        {activeBusinessRegistration?.business.category || activeBusiness.businessType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const st =
                        activeBusinessRegistration?.status ||
                        (activeBusiness.status === 'Approved' ? 'VERIFIED' : 'PENDING');
                      if (st === 'VERIFIED') {
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs shadow-2xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Status: Verified</span>
                          </div>
                        );
                      }
                      if (st === 'REJECTED') {
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 font-black text-xs shadow-2xs">
                            <ShieldAlert className="w-4 h-4 text-rose-700" />
                            <span>Status: Verification Required</span>
                          </div>
                        );
                      }
                      if (st === 'UNDER_REVIEW') {
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs shadow-2xs">
                            <Clock className="w-4 h-4 text-sky-700" />
                            <span>Status: Under Review</span>
                          </div>
                        );
                      }
                      if (st === 'MORE_INFORMATION_REQUIRED') {
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs shadow-2xs">
                            <AlertTriangle className="w-4 h-4 text-purple-700" />
                            <span>Status: More Information Required</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs shadow-2xs">
                          <Clock className="w-4 h-4 text-amber-700" />
                          <span>Status: Pending Verification</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Status Notice & Legal Disclaimer Note */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                  <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 leading-relaxed">
                    <p className="font-bold">
                      LankaMate verification does not replace any government licence or legal requirement.
                    </p>
                    <p className="text-[11px] text-amber-900">
                      All tourist transport chauffeurs, hotels, and food establishments must comply with national and local Sri Lankan authorities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons (Required: Edit Business, Manage Photos, Update Opening Hours, Update Services) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <button
                  id="btn-dash-edit-business"
                  onClick={() => {
                    setEditBizBuffer({
                      businessName: activeBusiness.businessName,
                      description: activeBusiness.description,
                      phone: activeBusiness.phone,
                      email: activeBusiness.email,
                      address: activeBusiness.address,
                      website: activeBusiness.website,
                    });
                    setActiveModal('edit-biz');
                  }}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-800 hover:text-emerald-950 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-5 h-5 text-emerald-700" />
                  <span>Edit Business</span>
                </button>

                <button
                  id="btn-dash-manage-photos"
                  onClick={() => setActiveModal('manage-photos')}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-sky-50 border border-stone-200 hover:border-sky-300 text-stone-800 hover:text-sky-950 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Camera className="w-5 h-5 text-sky-700" />
                  <span>Manage Photos ({activeBusiness.photos.length})</span>
                </button>

                <button
                  id="btn-dash-update-hours"
                  onClick={() => {
                    setEditBizBuffer({ openingHours: activeBusiness.openingHours });
                    setActiveModal('edit-hours');
                  }}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-800 hover:text-amber-950 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>Update Opening Hours</span>
                </button>

                <button
                  id="btn-dash-update-services"
                  onClick={() => {
                    setEditBizBuffer({ services: [...activeBusiness.services] });
                    setActiveModal('edit-services');
                  }}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-purple-50 border border-stone-200 hover:border-purple-300 text-stone-800 hover:text-purple-950 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Layers className="w-5 h-5 text-purple-700" />
                  <span>Update Services ({activeBusiness.services.length})</span>
                </button>
              </div>
            </div>

            {/* Overview Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Services */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                  <h3 className="font-black text-base text-stone-900 border-b border-stone-100 pb-3">
                    Business Profile & Description
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {activeBusiness.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <span className="text-stone-400 font-bold block text-[10px] uppercase">
                        Physical Address
                      </span>
                      <span className="font-semibold text-stone-800">{activeBusiness.address}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <span className="text-stone-400 font-bold block text-[10px] uppercase">
                        Operating Hours
                      </span>
                      <span className="font-semibold text-stone-800">
                        {activeBusiness.openingHours}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <span className="text-stone-400 font-bold block text-[10px] uppercase">
                        Phone Helpline
                      </span>
                      <span className="font-semibold text-stone-800">{activeBusiness.phone}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <span className="text-stone-400 font-bold block text-[10px] uppercase">
                        Direct Email
                      </span>
                      <span className="font-semibold text-stone-800">{activeBusiness.email}</span>
                    </div>
                  </div>
                </div>

                {/* Services & Amenities */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-black text-base text-stone-900">
                      Provided Services & Amenities ({activeBusiness.services.length})
                    </h3>
                    <button
                      onClick={() => {
                        setEditBizBuffer({ services: [...activeBusiness.services] });
                        setActiveModal('edit-services');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      + Manage
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeBusiness.services.map((svc, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold"
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Documents / Verification Files Section */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-800" />
                        <span>Business & Driver Documents</span>
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Private verification files. Only accessible to you and authorized LankaMate administrators.
                      </p>
                    </div>

                    <button
                      onClick={() => showToast('Additional document attachment simulated.')}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                    >
                      + Add Document
                    </button>
                  </div>

                  {activeBusinessRegistration?.documents && activeBusinessRegistration.documents.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeBusinessRegistration.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                              📄
                            </div>
                            <div>
                              <div className="font-bold text-stone-900">{doc.fileName}</div>
                              <div className="text-[10px] text-stone-500">
                                {doc.docType} • Uploaded {doc.uploadedAt}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              doc.verified
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {doc.verified ? 'Verified Document' : 'Pending Verification'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                      <p className="text-xs text-stone-600">
                        No official registration or license files uploaded yet for this business profile.
                      </p>
                      <button
                        onClick={() =>
                          showToast(
                            'Please upload required license/insurance documents during registration.'
                          )
                        }
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Upload Business Registration / Driver Licence / SLTDA Document
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col: Gallery & Inquiries teaser */}
              <div className="space-y-6">
                {/* Photo Gallery Box */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-black text-base text-stone-900">
                      Photos ({activeBusiness.photos.length})
                    </h3>
                    <button
                      onClick={() => setActiveModal('manage-photos')}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {activeBusiness.photos.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-xl overflow-hidden border border-stone-200 shadow-2xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Business photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enquiries Widget */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-black text-base text-stone-900">Recent Enquiries</h3>
                    <button
                      onClick={() => setCurrentTab('enquiries')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {enquiries.slice(0, 2).map((enq) => (
                      <div
                        key={enq.id}
                        className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{enq.customerName}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              enq.status === 'New'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-stone-600 line-clamp-2 text-[11px]">{enq.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MANAGE LISTINGS */}
        {/* ========================================================================= */}
        {currentTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900">Your Business Listings</h2>
                <p className="text-xs text-stone-500">
                  Manage all registered properties, fleet vehicles, and branches in Sri Lanka.
                </p>
              </div>
              <button
                id="btn-listings-add-new"
                onClick={() => {
                  setCurrentTab('register');
                  resetRegisterForm();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Listing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map((biz) => {
                const isActive = biz.id === activeBusinessId;
                return (
                  <div
                    key={biz.id}
                    className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                      isActive
                        ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-stone-200 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 relative">
                        <img
                          src={
                            biz.photos[0] ||
                            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
                          }
                          alt={biz.businessName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {renderStatusBadge(biz.status)}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                          <span>{biz.businessType}</span>
                        </div>
                        <h3 className="font-black text-base text-stone-900 line-clamp-1">
                          {biz.businessName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{biz.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {biz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setActiveBusinessId(biz.id);
                          setCurrentTab('my-business');
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {isActive ? 'Active in Dashboard' : 'Select & Manage'}
                      </button>

                      {/* Demo Status Change Pill */}
                      <select
                        value={biz.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as ListingStatus;
                          setBusinesses((prev) =>
                            prev.map((b) => (b.id === biz.id ? { ...b, status: newStatus } : b))
                          );
                        }}
                        className="text-[11px] font-bold py-1.5 px-2 rounded-xl border border-stone-200 bg-white"
                        title="Change demo status"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Pending Review">Pending</option>
                        <option value="Needs Update">Needs Update</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BUSINESS ENQUIRIES */}
        {/* ========================================================================= */}
        {currentTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-stone-900">Customer Enquiries</h2>
                <p className="text-xs text-stone-500">
                  Direct questions sent by travellers via LankaMate accommodation, transport, and guide pages.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                Note: Simulated demo enquiries for local evaluation. Connects to email/SMS in production.
              </div>
            </div>

            <div className="space-y-4">
              {enquiries.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center text-stone-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="font-bold">No enquiries received yet.</p>
                </div>
              ) : (
                enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-stone-900">
                            {enq.customerName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              enq.status === 'New'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">
                          {enq.customerEmail} {enq.customerPhone && `• ${enq.customerPhone}`}
                        </div>
                      </div>

                      <div className="text-right text-xs text-stone-500">
                        <span className="font-semibold block">{enq.date}</span>
                        <span className="text-[11px] text-stone-400">Topic: {enq.topic}</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {enq.message}
                    </div>

                    {/* Show existing reply if any */}
                    {enq.replyText && (
                      <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                          <span>Your Response:</span>
                          <span>{enq.repliedAt}</span>
                        </div>
                        <p>{enq.replyText}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        id={`btn-reply-enquiry-${enq.id}`}
                        onClick={() => {
                          setActiveEnquiryToReply(enq);
                          setReplyTextInput(enq.replyText || '');
                          setActiveModal('reply-enquiry');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{enq.status === 'Replied' ? 'Edit Reply' : 'Reply to Customer'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BUSINESS PROFILE */}
        {/* ========================================================================= */}
        {currentTab === 'profile' && activeBusiness && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-stone-900">Business Profile & Settings</h2>
                  <p className="text-xs text-stone-500">
                    Official contact and verification credentials displayed to travelers.
                  </p>
                </div>
                {renderStatusBadge(activeBusiness.status)}
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">Registered Name</label>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900">
                      {activeBusiness.businessName}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">Sector Category</label>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900">
                      {activeBusiness.businessType}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">Contact Phone Number</label>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <span>{activeBusiness.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">Business Email</label>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-stone-400" />
                      <span>{activeBusiness.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Location & Address</label>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>
                      {activeBusiness.address}, {activeBusiness.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Website / Social Link</label>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-semibold text-stone-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                    <a
                      href={activeBusiness.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline truncate"
                    >
                      {activeBusiness.website}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">
                      Sri Lanka Tourism Development Authority (SLTDA) Accreditation
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black ${
                        activeBusiness.sltdaRegistered
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {activeBusiness.sltdaRegistered ? 'Verified SLTDA' : 'Self-Certified'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Accreditation with SLTDA gives your listing priority placement on the LankaMate Near Me and Explore views.
                  </p>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setEditBizBuffer({
                        businessName: activeBusiness.businessName,
                        description: activeBusiness.description,
                        phone: activeBusiness.phone,
                        email: activeBusiness.email,
                        address: activeBusiness.address,
                        website: activeBusiness.website,
                      });
                      setActiveModal('edit-biz');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: HELP & SUPPORT */}
        {/* ========================================================================= */}
        {currentTab === 'support' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-xl font-black text-stone-900">Partner Help & Guidelines</h2>
                </div>
                <p className="text-xs text-stone-500">
                  Frequently asked questions and best practices for Sri Lankan tourism partners.
                </p>
              </div>

              {/* FAQ Accordions / Cards */}
              <div className="space-y-3 text-xs sm:text-sm">
                {[
                  {
                    q: 'How does LankaMate verify Sri Lankan business listings?',
                    a: 'Our partner verification team verifies the registered address, phone number, and tourist board (SLTDA) license or local municipal trade certificate. Until verified, new submissions stay in "Pending Review".',
                  },
                  {
                    q: 'How much does it cost to list on LankaMate?',
                    a: 'Listing your hotel, homestay, restaurant, or chauffeur service is 100% free during our community launch phase. Direct inquiries go straight to your email or WhatsApp with 0% platform commission.',
                  },
                  {
                    q: 'Can drivers and tuk-tuk chauffeurs register?',
                    a: 'Yes! Certified English/German/Tamil-speaking chauffeurs, safari jeep operators in Yala/Wilpattu, and Ella tuk-tuk drivers can register under "Drivers / Chauffeur Services".',
                  },
                  {
                    q: 'How do customer enquiries work in the live app?',
                    a: 'Travellers searching hotels, restaurants, or transport can tap "Contact Host / Enquire" which notifies your business. You can view all incoming enquiries in the Business Enquiries tab and reply immediately.',
                  },
                  {
                    q: 'What photos work best for attracting tourists?',
                    a: 'High-resolution landscape photos (16:9) showcasing natural lighting, clean bed linen, scenic balcony views (especially in Ella/Kandy/Galle), fresh seafood or rice & curry spreads, and well-maintained vehicle interiors.',
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <h4 className="font-black text-stone-900 flex items-center gap-2">
                      <span className="text-emerald-700">Q:</span> {faq.q}
                    </h4>
                    <p className="text-stone-600 leading-relaxed pl-5 text-xs">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Contact Partner Desk */}
              <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-base text-white">Need Direct Partner Assistance?</h4>
                  <p className="text-xs text-emerald-200">
                    Contact the LankaMate Partner Desk in Colombo (Monday - Saturday, 8:30 AM - 6:00 PM).
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <a
                    href="mailto:partners@lankamate.lk"
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>partners@lankamate.lk</span>
                  </a>
                  <a
                    href="tel:+94112345678"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+94 11 234 5678</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: ADMIN VERIFICATION & REVIEW DESK */}
        {/* ========================================================================= */}
        {currentTab === 'admin-review' && (
          <div className="space-y-6">
            <AdminRegistrationReviewDesk
              registrations={registrations}
              onStatusChange={handleAdminRegistrationStatusChange}
              adminUsername="LankaMate Partner Admin"
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT BUSINESS DETAILS */}
      {/* ========================================================================= */}
      {activeModal === 'edit-biz' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-lg text-stone-900">Edit Business Details</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-stone-800">Business Name</label>
                <input
                  type="text"
                  value={editBizBuffer.businessName || ''}
                  onChange={(e) =>
                    setEditBizBuffer({ ...editBizBuffer, businessName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Phone</label>
                <input
                  type="text"
                  value={editBizBuffer.phone || ''}
                  onChange={(e) => setEditBizBuffer({ ...editBizBuffer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Email</label>
                <input
                  type="email"
                  value={editBizBuffer.email || ''}
                  onChange={(e) => setEditBizBuffer({ ...editBizBuffer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Address</label>
                <input
                  type="text"
                  value={editBizBuffer.address || ''}
                  onChange={(e) => setEditBizBuffer({ ...editBizBuffer, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Description</label>
                <textarea
                  rows={3}
                  value={editBizBuffer.description || ''}
                  onChange={(e) =>
                    setEditBizBuffer({ ...editBizBuffer, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => updateActiveBusiness(editBizBuffer)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANAGE PHOTOS */}
      {/* ========================================================================= */}
      {activeModal === 'manage-photos' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-lg text-stone-900">Manage Business Photos</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {activeBusiness.photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl overflow-hidden border border-stone-200 aspect-video"
                  >
                    <img
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        const nextPhotos = activeBusiness.photos.filter((_, i) => i !== idx);
                        updateActiveBusiness({ photos: nextPhotos });
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new photo URL */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">Add Photo by URL:</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="input-manage-photo-url"
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inp = document.getElementById(
                        'input-manage-photo-url'
                      ) as HTMLInputElement;
                      if (inp && inp.value.trim()) {
                        updateActiveBusiness({
                          photos: [...activeBusiness.photos, inp.value.trim()],
                        });
                        inp.value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPDATE OPENING HOURS */}
      {/* ========================================================================= */}
      {activeModal === 'edit-hours' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-lg text-stone-900">Update Opening Hours</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <label className="font-bold text-stone-800 block">Schedule Description</label>
              <input
                type="text"
                value={editBizBuffer.openingHours || ''}
                onChange={(e) =>
                  setEditBizBuffer({ ...editBizBuffer, openingHours: e.target.value })
                }
                placeholder="e.g. 07:00 AM - 10:30 PM (Daily)"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  '24 Hours / 7 Days',
                  '06:00 AM - 10:00 PM (Daily)',
                  '07:00 AM - 11:00 PM (Daily)',
                  '08:00 AM - 08:00 PM',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditBizBuffer({ openingHours: preset })}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-[11px] font-semibold text-stone-700 cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateActiveBusiness({ openingHours: editBizBuffer.openingHours })
                }
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Save Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: UPDATE SERVICES */}
      {/* ========================================================================= */}
      {activeModal === 'edit-services' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-lg text-stone-900">Update Services & Amenities</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-stone-600 block">
                Select or unselect amenities offered at your business:
              </span>

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
                {COMMON_SRI_LANKAN_AMENITIES.map((service) => {
                  const currentList = editBizBuffer.services || [];
                  const isSelected = currentList.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setEditBizBuffer({
                            services: currentList.filter((s) => s !== service),
                          });
                        } else {
                          setEditBizBuffer({
                            services: [...currentList, service],
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{service}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => updateActiveBusiness({ services: editBizBuffer.services })}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Save Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REPLY TO CUSTOMER ENQUIRY */}
      {/* ========================================================================= */}
      {activeModal === 'reply-enquiry' && activeEnquiryToReply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-stone-900">Reply to Enquiry</h3>
                <span className="text-xs text-stone-500">
                  To: {activeEnquiryToReply.customerName} ({activeEnquiryToReply.customerEmail})
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-700 block">
                Topic: {activeEnquiryToReply.topic}
              </span>
              <p className="text-stone-600 italic">“{activeEnquiryToReply.message}”</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="block text-xs font-bold text-stone-800">Your Response Message</label>
              <textarea
                rows={4}
                required
                placeholder="Ayubowan! Thank you for inquiring. We would be delighted to host you..."
                value={replyTextInput}
                onChange={(e) => setReplyTextInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: VIEW ADMIN REQUEST REMARKS (Requirement 1, 3, 10) */}
      {/* ========================================================================= */}
      {showAdminRemarkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-900">
                  <AlertTriangle className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base sm:text-lg">
                    Admin Request Details
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">
                    Reference: {showAdminRemarkModal.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminRemarkModal(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-purple-700" />
                  <span>Information requested by LankaMate Admin:</span>
                </span>
                <p className="text-xs sm:text-sm text-purple-950 font-medium leading-relaxed whitespace-pre-wrap">
                  {showAdminRemarkModal.adminNotes || showAdminRemarkModal.previousAdminRequest || 'Please provide updated transport specifications, license document, and accurate operational coordinates.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-500">Business Name:</span>
                  <strong className="text-stone-900">{showAdminRemarkModal.business.businessName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-500">Service Category:</span>
                  <span className="font-bold text-emerald-800">{showAdminRemarkModal.business.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-500">Date Requested:</span>
                  <span className="text-stone-700 font-semibold">
                    {showAdminRemarkModal.reviewedAt
                      ? new Date(showAdminRemarkModal.reviewedAt).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-500">Reviewer:</span>
                  <span className="text-stone-700">{showAdminRemarkModal.reviewedBy || 'LankaMate Partner Desk'}</span>
                </div>
                {showAdminRemarkModal.statusHistory && showAdminRemarkModal.statusHistory.length > 0 && (
                  <div className="pt-2 border-t border-stone-200/60 mt-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Status History:
                    </span>
                    <div className="space-y-1">
                      {showAdminRemarkModal.statusHistory.map((h, i) => (
                        <div key={i} className="text-[11px] text-stone-600 flex items-center justify-between">
                          <span>{h.fromStatus.replace(/_/g, ' ')} → <strong className="text-purple-700">{h.toStatus.replace(/_/g, ' ')}</strong></span>
                          <span className="text-stone-400">{new Date(h.timestamp).toLocaleDateString('en-GB')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAdminRemarkModal(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const rec = showAdminRemarkModal;
                  setShowAdminRemarkModal(null);
                  handleStartUpdateAndResubmit(rec);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-emerald-700 hover:from-purple-900 hover:to-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Update & Resubmit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
