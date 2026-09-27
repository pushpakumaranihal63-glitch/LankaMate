export type AdminRole = 'super_admin' | 'editor' | 'moderator';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUsername: string;
  action: string;
  category: 'auth' | 'business' | 'content' | 'settings' | 'security' | 'booking';
  details: string;
  ip: string;
  status: 'success' | 'warning' | 'failure';
}

export interface AdminOverviewStats {
  totalAttractions: number;
  totalDistricts: number;
  totalBusinesses: number;
  pendingBusinessApprovals: number;
  totalBookings: number;
  pendingBookings: number;
  activeAnnouncements: number;
  activeAdminSessions: number;
  serverUptimeSeconds: number;
  systemHealth: {
    status: 'healthy' | 'degraded' | 'maintenance';
    memoryUsageMB: number;
    nodeVersion: string;
    geminiStatus: 'operational' | 'fallback_mode';
    osmProxyStatus: 'operational';
  };
}

export interface AdminBusinessItem {
  id: string;
  name: string;
  type: string;
  district: string;
  ownerName: string;
  phone: string;
  email: string;
  status: 'Pending' | 'Verified' | 'Suspended' | 'Rejected';
  submissionDate: string;
  rating?: number;
  featured?: boolean;
}

export interface AdminBookingItem {
  id: string;
  category: 'hotel' | 'tour' | 'homestay' | 'transport';
  itemTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  guestsCount: number;
  estimatedLKR: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency';
  isActive: boolean;
  publishedAt: string;
  author: string;
}

export interface AdminAppSettings {
  siteName: string;
  maintenanceMode: boolean;
  emergencyAmbulanceNumber: string;
  emergencyPoliceNumber: string;
  touristPoliceNumber: string;
  allowPublicRegistrations: boolean;
  bookingCommissionPct: number;
  sessionTimeoutMinutes: number;
  maxFailedLoginsBeforeLock: number;
}
