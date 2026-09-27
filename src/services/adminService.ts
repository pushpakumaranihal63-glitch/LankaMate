import {
  AdminOverviewStats,
  AdminUser,
  AdminBusinessItem,
  AdminBookingItem,
  AdminAnnouncement,
  AdminAppSettings,
  AuditLogEntry,
  AdminSession,
} from '../types/admin';
import { adminFetch, saveAdminSession, clearAdminSession } from '../utils/adminAuth';

export interface LoginResult {
  success: boolean;
  message?: string;
  session?: AdminSession;
  lockedMinutes?: number;
}

export const adminService = {
  // Authentication
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.error || 'Authentication failed',
          lockedMinutes: data.lockedMinutes,
        };
      }

      const session: AdminSession = {
        token: data.token,
        user: data.user,
        expiresAt: data.expiresAt,
      };

      saveAdminSession(session);
      return { success: true, session };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error connecting to auth server' };
    }
  },

  async verify(): Promise<{ valid: boolean; user?: AdminUser }> {
    try {
      const res = await adminFetch('/api/admin/verify');
      if (!res.ok) return { valid: false };
      const data = await res.json();
      return { valid: true, user: data.user };
    } catch {
      return { valid: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await adminFetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAdminSession();
    }
  },

  // Overview Stats
  async getOverview(): Promise<AdminOverviewStats> {
    const res = await adminFetch('/api/admin/overview');
    if (!res.ok) throw new Error('Failed to fetch overview stats');
    return res.json();
  },

  // Users Management
  async getUsers(): Promise<AdminUser[]> {
    const res = await adminFetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to fetch admin users');
    const data = await res.json();
    return data.users;
  },

  async createUser(payload: { username: string; name: string; email: string; role: string; password: string }): Promise<AdminUser> {
    const res = await adminFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create user');
    }
    const data = await res.json();
    return data.user;
  },

  async deleteUser(userId: string): Promise<void> {
    const res = await adminFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete user');
    }
  },

  // Business Listings Management
  async getBusinesses(): Promise<AdminBusinessItem[]> {
    const res = await adminFetch('/api/admin/businesses');
    if (!res.ok) throw new Error('Failed to fetch businesses');
    const data = await res.json();
    return data.businesses;
  },

  async updateBusinessStatus(id: string, status: 'Pending' | 'Verified' | 'Suspended' | 'Rejected'): Promise<void> {
    const res = await adminFetch(`/api/admin/businesses/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update business status');
    }
  },

  // Attractions Management
  async getAttractions(): Promise<any[]> {
    const res = await adminFetch('/api/admin/attractions');
    if (!res.ok) throw new Error('Failed to fetch attractions');
    const data = await res.json();
    return data.attractions;
  },

  async toggleAttractionStatus(id: string, isActive: boolean): Promise<void> {
    const res = await adminFetch(`/api/admin/attractions/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
    if (!res.ok) throw new Error('Failed to toggle attraction status');
  },

  // Hotels & Restaurants
  async getHotelsAndRestaurants(): Promise<{ hotels: any[]; restaurants: any[] }> {
    const res = await adminFetch('/api/admin/hotels-restaurants');
    if (!res.ok) throw new Error('Failed to fetch hotels and restaurants');
    return res.json();
  },

  // Bookings Management
  async getBookings(): Promise<AdminBookingItem[]> {
    const res = await adminFetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const data = await res.json();
    return data.bookings;
  },

  async updateBookingStatus(id: string, status: 'Confirmed' | 'Pending' | 'Cancelled'): Promise<void> {
    const res = await adminFetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update booking status');
  },

  // Reports
  async getReports(): Promise<any> {
    const res = await adminFetch('/api/admin/reports');
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  // Content Announcements
  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const res = await adminFetch('/api/admin/content');
    if (!res.ok) throw new Error('Failed to fetch announcements');
    const data = await res.json();
    return data.announcements;
  },

  async createAnnouncement(payload: { title: string; message: string; type: string }): Promise<AdminAnnouncement> {
    const res = await adminFetch('/api/admin/content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create announcement');
    const data = await res.json();
    return data.announcement;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const res = await adminFetch(`/api/admin/content/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete announcement');
  },

  // App Settings
  async getSettings(): Promise<AdminAppSettings> {
    const res = await adminFetch('/api/admin/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<AdminAppSettings>): Promise<AdminAppSettings> {
    const res = await adminFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  // Security Audit Logs
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await adminFetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    const data = await res.json();
    return data.logs;
  },
};
