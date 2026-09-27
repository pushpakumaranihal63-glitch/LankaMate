import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  MapPin,
  ExternalLink,
  Eye,
  Filter,
  Search,
  Building2,
  User,
  Phone,
  Mail,
  Camera,
  Layers,
  ArrowRight,
  Check,
  Ban,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  BusinessRegistrationRecord,
  RegistrationStatus,
  UploadedDocument,
} from '../../types/businessRegistration';
import { businessRegistrationService } from '../../services/businessRegistrationService';

interface AdminRegistrationReviewDeskProps {
  registrations: BusinessRegistrationRecord[];
  onStatusChange: (updated: BusinessRegistrationRecord) => void;
  adminUsername?: string;
}

export const AdminRegistrationReviewDesk: React.FC<AdminRegistrationReviewDeskProps> = ({
  registrations,
  onStatusChange,
  adminUsername = 'admin',
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BusinessRegistrationRecord | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [sltdaVerifiedCheck, setSltdaVerifiedCheck] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  const filtered = registrations.filter((r) => {
    const matchesStatus =
      activeStatusFilter === 'ALL' || r.status === activeStatusFilter;
    const matchesSearch =
      r.business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.account.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    ALL: registrations.length,
    PENDING: registrations.filter((r) => r.status === 'PENDING').length,
    UNDER_REVIEW: registrations.filter((r) => r.status === 'UNDER_REVIEW').length,
    VERIFIED: registrations.filter((r) => r.status === 'VERIFIED').length,
    MORE_INFORMATION_REQUIRED: registrations.filter(
      (r) => r.status === 'MORE_INFORMATION_REQUIRED'
    ).length,
    REJECTED: registrations.filter((r) => r.status === 'REJECTED').length,
  };

  const handleUpdateStatus = (newStatus: RegistrationStatus) => {
    if (!selectedRecord) return;
    const updated = businessRegistrationService.updateVerificationStatus(
      selectedRecord.id,
      newStatus,
      adminUsername,
      adminNotesInput || undefined,
      sltdaVerifiedCheck
    );
    if (updated) {
      setSelectedRecord(updated);
      onStatusChange(updated);
      const actionName =
        newStatus === 'VERIFIED'
          ? 'Approved & Activated in LankaMate listings'
          : newStatus === 'REJECTED'
          ? 'Application Rejected'
          : newStatus === 'MORE_INFORMATION_REQUIRED'
          ? 'More Information Requested'
          : `Status changed to ${newStatus}`;
      setActionSuccessMessage(`Successfully updated ${updated.id}: ${actionName}`);
      setTimeout(() => setActionSuccessMessage(null), 3500);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Verified & Active
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Pending Verification
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Under Review
          </span>
        );
      case 'MORE_INFORMATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-300">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            More Info Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-stone-200 text-stone-800 border border-stone-300">
            <Ban className="w-3.5 h-3.5 text-stone-600" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-black uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Verification & Review Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Service Provider Registrations
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              Inspect submitted documents, transport fleet numbers, property photos, and authorize official LankaMate verified status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-800/80 border border-stone-700 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Pending Queue</span>
              <span className="text-lg font-black text-amber-400">
                {registrations.filter((r) => r.status === 'PENDING').length}
              </span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Verified Active</span>
              <span className="text-lg font-black text-emerald-400">
                {registrations.filter((r) => r.status === 'VERIFIED').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toast */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Registrations', count: counts.ALL },
            { id: 'PENDING', label: 'Pending Review', count: counts.PENDING },
            { id: 'UNDER_REVIEW', label: 'Under Review', count: counts.UNDER_REVIEW },
            { id: 'VERIFIED', label: 'Verified', count: counts.VERIFIED },
            { id: 'MORE_INFORMATION_REQUIRED', label: 'More Info', count: counts.MORE_INFORMATION_REQUIRED },
            { id: 'REJECTED', label: 'Rejected', count: counts.REJECTED },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStatusFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeStatusFilter === tab.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search provider, ID, town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registrations List */}
        <div className={`${selectedRecord ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
              No registration applications found matching the selected filter.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedRecord?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRecord(item);
                    setAdminNotesInput(item.adminNotes || '');
                    setSltdaVerifiedCheck(item.sltdaVerificationStatus === 'Verified by Admin');
                  }}
                  className={`p-4 rounded-2xl border bg-white transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-emerald-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-emerald-950">
                        {item.id}
                      </span>
                      {item.resubmittedAt && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          ⚡ Resubmitted
                        </span>
                      )}
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div>
                    <h3 className="font-black text-stone-900 text-sm">{item.business.businessName}</h3>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {item.business.category} • {item.business.city}, {item.business.district}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1 border-t border-stone-100">
                    <span className="truncate max-w-[150px]">Owner: {item.account.fullName}</span>
                    <span className="font-bold text-emerald-700">
                      {item.profileCompleteness}% Complete
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Record Detail Panel */}
        {selectedRecord && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-emerald-900">
                    {selectedRecord.id}
                  </span>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <h2 className="text-xl font-black text-stone-900 mt-1">
                  {selectedRecord.business.businessName}
                </h2>
                <p className="text-xs text-stone-500">
                  Registered on {new Date(selectedRecord.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            {/* Resubmission & Previous Admin Request Banner */}
            {(selectedRecord.resubmittedAt || selectedRecord.previousAdminRequest) && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-black text-purple-900">
                    <span className="p-1 rounded-md bg-purple-200">⚡</span>
                    <span>Resubmitted Application Awaiting Review</span>
                  </div>
                  {selectedRecord.resubmittedAt && (
                    <span className="text-[11px] font-semibold text-purple-700">
                      Resubmitted on: {new Date(selectedRecord.resubmittedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                {selectedRecord.previousAdminRequest && (
                  <div className="p-3 bg-white rounded-xl border border-purple-200 text-purple-950 space-y-1">
                    <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                      Previous Admin Information Request:
                    </span>
                    <p className="leading-relaxed font-medium">
                      "{selectedRecord.previousAdminRequest}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block">Owner / Contact</span>
                <div>Name: {selectedRecord.account.fullName}</div>
                <div>Mobile: {selectedRecord.account.mobileNumber}</div>
                <div>WhatsApp: {selectedRecord.account.whatsappNumber}</div>
                <div>Email: {selectedRecord.account.email}</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block">Location & Service</span>
                <div>District: {selectedRecord.business.district}</div>
                <div>City: {selectedRecord.business.city}</div>
                <div>Hours: {selectedRecord.business.openingHours}</div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    Lat: {selectedRecord.business.coordinates.lat.toFixed(4)}, Lng:{' '}
                    {selectedRecord.business.coordinates.lng.toFixed(4)}
                  </span>
                </div>
                {/* Location verification check */}
                {selectedRecord.business.district === 'Vavuniya' && (
                  <div className="pt-1">
                    {Math.abs(selectedRecord.business.coordinates.lat - 6.9271) < 0.05 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        Mismatch: Coordinates set to Colombo!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Check className="w-3 h-3" />
                        Coordinates match Vavuniya
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Transport Service Details if applicable */}
            {selectedRecord.services.transport && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="p-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">🚗</span>
                    Transport Fleet & Chauffeur Details
                  </span>
                  <span className="text-[11px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {selectedRecord.services.transport.operatorType || 'Individual Driver'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-700">
                  <div className="p-2 rounded-lg bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Vehicle Type</span>
                    <span className="font-bold text-stone-900">{selectedRecord.services.transport.vehicleType}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Plate Number</span>
                    <span className="font-mono font-bold text-stone-900">{selectedRecord.services.transport.vehicleNumber || 'Pending'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Capacity</span>
                    <span className="font-bold text-stone-900">{selectedRecord.services.transport.passengerCapacity} Passengers</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Driver Option</span>
                    <span className="font-bold text-stone-900">{selectedRecord.services.transport.driverAvailable}</span>
                  </div>
                </div>

                {(selectedRecord.services.transport.driverName || selectedRecord.services.transport.driverLicenseNumber) && (
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Chauffeur / Driver Details</span>
                      <span className="font-bold text-stone-900">
                        {selectedRecord.services.transport.driverName || selectedRecord.account.fullName}
                      </span>
                      {selectedRecord.services.transport.driverLicenseNumber && (
                        <span className="text-[11px] text-stone-600 font-mono ml-2">
                          (Licence: {selectedRecord.services.transport.driverLicenseNumber})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-stone-700">
                  {selectedRecord.services.transport.airportTransferAvailable && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">✓ Airport Transfer</span>
                  )}
                  {selectedRecord.services.transport.longDistanceTrips && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">✓ Long Distance Trips</span>
                  )}
                  {selectedRecord.services.transport.localTrips && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">✓ Local City Trips</span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                    Starting LKR {selectedRecord.services.transport.startingPrice.toLocaleString()} ({selectedRecord.services.transport.priceDescription})
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-stone-800 block">Service Description:</span>
              <p className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 leading-relaxed">
                {selectedRecord.business.description}
              </p>
            </div>

            {/* Photos Preview */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-stone-800 block">Photos (Real Authentic):</span>
              <div className="flex flex-wrap gap-2">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200">
                  <img
                    src={selectedRecord.photos.coverPhotoUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">
                    Cover
                  </span>
                </div>
                {selectedRecord.photos.additionalPhotos.map((p, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200">
                    <img src={p} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Documents (Secured section) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">
                  Uploaded Verification Documents ({selectedRecord.documents.length}):
                </span>
                <span className="text-[11px] text-stone-500">Visible only to Admin & Owner</span>
              </div>

              {selectedRecord.documents.length === 0 ? (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-xs">
                  No documents uploaded by provider.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRecord.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs hover:border-emerald-300 transition-colors gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-stone-900 block truncate">{doc.name}</span>
                          <span className="text-[11px] text-stone-600 block">
                            <span className="font-semibold text-emerald-900">{doc.type}</span>
                            {doc.documentNumber && ` • Reg/Licence No: ${doc.documentNumber}`}
                            {doc.fileSize && ` • ${doc.fileSize}`}
                            {doc.uploadedAt && ` • Date: ${doc.uploadedAt}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Preview</span>
                        </button>
                        <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px] font-bold">
                          Internal Safe Doc
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status History & Audit Trail (Requirement 6) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  Status History & Audit Trail:
                </span>
                <span className="text-[11px] text-stone-500">
                  {selectedRecord.statusHistory?.length || 1} Event(s)
                </span>
              </div>

              {/* Requirement 6: Simple Status History Timeline Flow */}
              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs flex flex-wrap items-center gap-2 font-bold text-purple-950">
                <span className="text-[11px] font-black uppercase text-purple-800 tracking-wider">
                  Timeline Flow:
                </span>
                {selectedRecord.statusHistory && selectedRecord.statusHistory.length > 0 ? (
                  selectedRecord.statusHistory.map((h, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-purple-400 font-bold">→</span>}
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shadow-2xs ${
                        h.status === 'MORE_INFORMATION_REQUIRED'
                          ? 'bg-purple-100 border-purple-300 text-purple-950'
                          : h.status === 'VERIFIED'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : h.status === 'REJECTED'
                          ? 'bg-rose-100 border-rose-300 text-rose-950'
                          : 'bg-amber-100 border-amber-300 text-amber-950'
                      }`}>
                        {h.status === 'MORE_INFORMATION_REQUIRED'
                          ? 'More Info Required'
                          : h.status === 'PENDING'
                          ? 'Pending Verification'
                          : h.status === 'VERIFIED'
                          ? 'Verified'
                          : h.status === 'UNDER_REVIEW'
                          ? 'Under Review'
                          : 'Rejected'}
                      </span>
                    </React.Fragment>
                  ))
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-100 border border-amber-300 text-amber-950">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                {selectedRecord.statusHistory && selectedRecord.statusHistory.length > 0 ? (
                  selectedRecord.statusHistory.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 pb-2.5 border-b border-stone-200 last:border-0 last:pb-0"
                    >
                      <div className="mt-0.5 shrink-0">{getStatusBadge(h.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-bold text-stone-800">{h.changedBy}</span>
                          <span className="text-stone-500">
                            {new Date(h.changedAt).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {h.note && (
                          <p className="text-[11px] text-stone-600 mt-1 italic bg-white p-2 rounded-lg border border-stone-200">
                            "{h.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-stone-500">
                    Initial Registration: {new Date(selectedRecord.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Verification Controls */}
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-4 text-xs">
              <span className="font-bold text-stone-900 block">Verification Decision & Remarks:</span>

              {/* SLTDA Separate Verification check as requested */}
              <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sltdaVerifiedCheck}
                  onChange={(e) => setSltdaVerifiedCheck(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>
                  Authorize SLTDA Official Verification (Separately checked with Tourist Board)
                </span>
              </label>

              <div className="space-y-1">
                <label className="block text-stone-700 font-bold">Admin Remarks / Notes to Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Approved. Van inspection and revenue license verified."
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('VERIFIED')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Activate Listing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Set Under Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('MORE_INFORMATION_REQUIRED')}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request More Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('REJECTED')}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADMIN DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewDoc(null)}
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
                    {previewDoc.type}
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Admin Verification Review Viewer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Document Type</span>
                  <span className="font-bold text-stone-800">{previewDoc.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">File Name</span>
                  <span className="font-mono text-stone-800 font-semibold truncate block">{previewDoc.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Registration / Doc Number</span>
                  <span className="font-bold text-emerald-800">
                    {previewDoc.documentNumber || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">File Size & Date</span>
                  <span className="text-stone-600">
                    {previewDoc.fileSize || '1.2 MB'} • {previewDoc.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="p-6 rounded-2xl bg-emerald-50/50 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
                {previewDoc.previewUrl ? (
                  <img
                    src={previewDoc.previewUrl}
                    alt={previewDoc.name}
                    className="max-h-56 max-w-full rounded-xl object-contain shadow-sm border border-stone-200"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                      <FileText className="w-8 h-8 text-emerald-700" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-black text-sm text-stone-900 block">
                        {previewDoc.type}
                      </span>
                      <p className="font-mono text-xs text-stone-600">
                        {previewDoc.name}
                      </p>
                      {previewDoc.documentNumber && (
                        <p className="text-xs font-bold text-emerald-800">
                          Registration / Licence No: {previewDoc.documentNumber}
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Internal Document Review Record
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Private Admin Document:</strong> This document is strictly confidential. Only authorized admins and the business owner have access. It is never rendered publicly in search results or listing directories.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
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
