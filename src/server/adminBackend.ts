import crypto from 'crypto';
import type { Express, Request, Response, NextFunction } from 'express';
import { destinationsData } from '../data/destinationsData';
import { INITIAL_DEMO_BUSINESSES } from '../data/businessPortalData';
import { hotelsData } from '../data/hotelsData';
import { foodData } from '../data/foodData';

// Types for Admin Backend
interface ServerAdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'moderator';
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

interface ServerSession {
  token: string;
  userId: string;
  username: string;
  role: 'super_admin' | 'editor' | 'moderator';
  createdAt: number;
  expiresAt: number;
  lastActivityAt: number;
  ip: string;
  userAgent: string;
}

interface ServerAuditLog {
  id: string;
  timestamp: string;
  adminUsername: string;
  action: string;
  category: 'auth' | 'business' | 'content' | 'settings' | 'security' | 'booking';
  details: string;
  ip: string;
  status: 'success' | 'warning' | 'failure';
}

interface RateLimitRecord {
  count: number;
  lockedUntil: number | null;
  firstAttemptAt: number;
}

// Password Hashing via Node.js Scrypt (Strong, constant-time verification)
// Falls back to pbkdf2Sync if scryptSync is unavailable (Node v22.22.x bug).
const SCRYPT_PREFIX = 'scrypt:';
const PBKDF2_PREFIX = 'pbkdf2:';
const PBKDF2_ITERATIONS = 100000;

function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash: SCRYPT_PREFIX + hash, salt };
  } catch {
    const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
    return { hash: PBKDF2_PREFIX + hash, salt };
  }
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    if (storedHash.startsWith(SCRYPT_PREFIX)) {
      const expected = storedHash.slice(SCRYPT_PREFIX.length);
      const derived = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(expected, 'hex'));
    }
    if (storedHash.startsWith(PBKDF2_PREFIX)) {
      const expected = storedHash.slice(PBKDF2_PREFIX.length);
      const derived = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(expected, 'hex'));
    }
    return false;
  } catch {
    return false;
  }
}

// In-Memory Storage for Admin Data (Safe development server state)
const startTime = Date.now();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours validity

// Seed Initial Admin User (Root Super Admin)
const initialAdminPassword = process.env.ADMIN_PASSWORD || 'LankaMateAdmin2026!';
const initialAdminUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const { hash: rootHash, salt: rootSalt } = hashPassword(initialAdminPassword);

const adminUsers: Map<string, ServerAdminUser> = new Map([
  [
    'admin-root-01',
    {
      id: 'admin-root-01',
      username: initialAdminUsername,
      name: 'LankaMate Platform Owner',
      email: 'owner@lankamate.lk',
      role: 'super_admin',
      passwordHash: rootHash,
      passwordSalt: rootSalt,
      createdAt: new Date().toISOString(),
      isActive: true,
    },
  ],
]);

const activeSessions: Map<string, ServerSession> = new Map();
const loginRateLimiter: Map<string, RateLimitRecord> = new Map();
const auditLogs: ServerAuditLog[] = [];

// Seed Business Listings Review Store
const businessListings = INITIAL_DEMO_BUSINESSES.map((b) => ({
  id: b.id,
  name: b.businessName,
  type: b.businessType,
  district: b.location,
  ownerName: b.businessName,
  phone: b.phone,
  email: b.email,
  status: (b.status === 'Approved' ? 'Verified' : 'Pending') as 'Pending' | 'Verified' | 'Suspended' | 'Rejected',
  submissionDate: b.submittedAt,
  rating: 4.8,
  featured: b.status === 'Approved',
}));

// In-Memory Store for Complete Business & Service Provider Registrations
const serverBusinessRegistrations: any[] = [
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
  },
];

// Seed Initial Bookings
const sampleBookings = [
  {
    id: 'BK-2026-901',
    category: 'tour' as const,
    itemTitle: 'Sigiriya & Dambulla Day Tour with Cultural Lunch',
    guestName: 'Julian Schneider',
    guestEmail: 'julian.s@example.com',
    guestPhone: '+49 170 555 4321',
    date: '2026-10-04',
    guestsCount: 2,
    estimatedLKR: 45000,
    status: 'Confirmed' as const,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'BK-2026-902',
    category: 'hotel' as const,
    itemTitle: 'The Grand Hotel, Nuwara Eliya (Governor Suite)',
    guestName: 'Sunil Weerasinghe',
    guestEmail: 'sunil.w@example.com',
    guestPhone: '+94 77 123 4567',
    date: '2026-10-12',
    guestsCount: 3,
    estimatedLKR: 125000,
    status: 'Pending' as const,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'BK-2026-903',
    category: 'transport' as const,
    itemTitle: 'Kandy to Ella Private Scenic Chauffeur Transfer',
    guestName: 'Elena Rostova',
    guestEmail: 'elena.r@example.com',
    guestPhone: '+33 6 12 34 56 78',
    date: '2026-10-08',
    guestsCount: 2,
    estimatedLKR: 38000,
    status: 'Confirmed' as const,
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
];

interface ServerAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'emergency';
  isActive: boolean;
  publishedAt: string;
  author: string;
}

// Seed Announcements
const announcements: ServerAnnouncement[] = [
  {
    id: 'anc-01',
    title: 'Nanu Oya to Ella Railway Track Maintenance',
    message: 'Scheduled weekend track maintenance. Blue Train delays possible; advise guests to verify departure schedules.',
    type: 'warning' as const,
    isActive: true,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    author: 'Admin Ops',
  },
  {
    id: 'anc-02',
    title: 'Southwest Coastal Surf Season Begins in Weligama & Mirissa',
    message: 'Peak water clarity and mild southern swell reported across Galle and Matara districts.',
    type: 'info' as const,
    isActive: true,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    author: 'Admin Ops',
  },
];

// Seed App Settings
const appSettings = {
  siteName: 'LankaMate Travel Guide & Platform',
  maintenanceMode: false,
  emergencyAmbulanceNumber: '1990',
  emergencyPoliceNumber: '119',
  touristPoliceNumber: '1912',
  allowPublicRegistrations: true,
  bookingCommissionPct: 8.5,
  sessionTimeoutMinutes: 120,
  maxFailedLoginsBeforeLock: 5,
};

// Attractions overrides (toggled statuses)
const attractionOverrides = new Map<string, { isActive: boolean; modifiedAt: string }>();

// Helper to record audit log
function recordAudit(
  adminUsername: string,
  category: ServerAuditLog['category'],
  action: string,
  details: string,
  ip: string,
  status: 'success' | 'warning' | 'failure' = 'success'
) {
  const entry: ServerAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    adminUsername,
    action,
    category,
    details,
    ip,
    status,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) {
    auditLogs.pop();
  }
}

// Initial audit log entry
recordAudit('system', 'security', 'System Boot', 'Admin backend initialized with cryptographically hashed credentials', '127.0.0.1');

// Express Middleware: Require Admin Authentication
function requireAdminAuth(allowedRoles?: ('super_admin' | 'editor' | 'moderator')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized: Missing or invalid Authorization Bearer header',
      });
    }

    const token = authHeader.slice(7).trim();
    const session = activeSessions.get(token);

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized: Session does not exist or has expired',
      });
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      activeSessions.delete(token);
      return res.status(401).json({
        error: 'Unauthorized: Session expired due to inactivity',
      });
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      recordAudit(session.username, 'security', 'Access Denied', `Role "${session.role}" attempted unauthorized access to ${req.originalUrl}`, req.ip || 'unknown', 'warning');
      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges for this action',
      });
    }

    // Slide session expiration window (rolling inactivity timeout)
    session.lastActivityAt = now;
    session.expiresAt = now + SESSION_TTL_MS;

    (req as any).adminSession = session;
    (req as any).adminUsername = session.username;
    next();
  };
}

// Register all Admin Routes on Express app
export function setupAdminBackend(app: Express) {
  // 1. Admin Login (With Rate-Limiting & Lockout)
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Check rate limiter
    const rateLimit = loginRateLimiter.get(clientIp);
    if (rateLimit && rateLimit.lockedUntil && now < rateLimit.lockedUntil) {
      const remainingSeconds = Math.ceil((rateLimit.lockedUntil - now) / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      recordAudit('anonymous', 'auth', 'Locked Login Attempt', `IP is locked out for ${remainingMinutes} more minutes`, clientIp, 'warning');
      return res.status(429).json({
        error: `Too many failed login attempts. IP temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
        lockedMinutes: remainingMinutes,
      });
    }

    const { username, password } = req.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    let targetUser: ServerAdminUser | undefined;
    for (const u of adminUsers.values()) {
      if (u.username.toLowerCase() === normalizedUsername && u.isActive) {
        targetUser = u;
        break;
      }
    }

    if (!targetUser || !verifyPassword(password, targetUser.passwordHash, targetUser.passwordSalt)) {
      // Record failed attempt
      const existing = loginRateLimiter.get(clientIp) || { count: 0, lockedUntil: null, firstAttemptAt: now };
      existing.count += 1;

      if (existing.count >= MAX_FAILED_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_DURATION_MS;
        loginRateLimiter.set(clientIp, existing);
        recordAudit(normalizedUsername, 'auth', 'Account Locked Out', `5 failed attempts from ${clientIp}. Locked for 15 minutes.`, clientIp, 'failure');
        return res.status(429).json({
          error: 'Too many consecutive failed login attempts. Account temporarily locked for 15 minutes.',
          lockedMinutes: 15,
        });
      }

      loginRateLimiter.set(clientIp, existing);
      recordAudit(normalizedUsername, 'auth', 'Failed Login', `Invalid password or username attempt (${existing.count}/${MAX_FAILED_ATTEMPTS})`, clientIp, 'failure');
      return res.status(401).json({
        error: `Invalid credentials. (${MAX_FAILED_ATTEMPTS - existing.count} attempts remaining before lockout)`,
      });
    }

    // Clear rate limit on successful authentication
    loginRateLimiter.delete(clientIp);

    // Issue secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + SESSION_TTL_MS;

    const session: ServerSession = {
      token,
      userId: targetUser.id,
      username: targetUser.username,
      role: targetUser.role,
      createdAt: now,
      expiresAt,
      lastActivityAt: now,
      ip: clientIp,
      userAgent: req.headers['user-agent'] || 'unknown',
    };

    activeSessions.set(token, session);
    targetUser.lastLoginAt = new Date().toISOString();

    recordAudit(targetUser.username, 'auth', 'Admin Login', `Admin successfully logged in from ${clientIp}`, clientIp, 'success');

    return res.json({
      token,
      expiresAt,
      user: {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
        lastLoginAt: targetUser.lastLoginAt,
        isActive: targetUser.isActive,
      },
    });
  });

  // 2. Verify Session
  app.get('/api/admin/verify', requireAdminAuth(), (req: Request, res: Response) => {
    const session = (req as any).adminSession as ServerSession;
    const user = adminUsers.get(session.userId);
    if (!user || !user.isActive) {
      activeSessions.delete(session.token);
      return res.status(401).json({ error: 'User is disabled or does not exist' });
    }
    return res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: user.isActive,
      },
    });
  });

  // 3. Admin Logout
  app.post('/api/admin/logout', requireAdminAuth(), (req: Request, res: Response) => {
    const session = (req as any).adminSession as ServerSession;
    activeSessions.delete(session.token);
    recordAudit(session.username, 'auth', 'Admin Logout', 'Session destroyed', req.ip || 'unknown');
    return res.json({ success: true });
  });

  // 4. Overview Stats
  app.get('/api/admin/overview', requireAdminAuth(), (_req: Request, res: Response) => {
    const pendingBusinesses = businessListings.filter((b) => b.status === 'Pending').length;
    const pendingBookingsCount = sampleBookings.filter((b) => b.status === 'Pending').length;
    const activeAnnouncementsCount = announcements.filter((a) => a.isActive).length;
    const memory = process.memoryUsage();

    return res.json({
      totalAttractions: destinationsData.length,
      totalDistricts: 25,
      totalBusinesses: businessListings.length,
      pendingBusinessApprovals: pendingBusinesses,
      totalBookings: sampleBookings.length,
      pendingBookings: pendingBookingsCount,
      activeAnnouncements: activeAnnouncementsCount,
      activeAdminSessions: activeSessions.size,
      serverUptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      systemHealth: {
        status: 'healthy',
        memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
        nodeVersion: process.version,
        geminiStatus: process.env.GEMINI_API_KEY ? 'operational' : 'fallback_mode',
        osmProxyStatus: 'operational',
      },
    });
  });

  // 5. Admin Users Management (Super Admin only)
  app.get('/api/admin/users', requireAdminAuth(['super_admin', 'editor']), (_req: Request, res: Response) => {
    const safeUsers = Array.from(adminUsers.values()).map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      isActive: u.isActive,
    }));
    return res.json({ users: safeUsers });
  });

  app.post('/api/admin/users', requireAdminAuth(['super_admin']), (req: Request, res: Response) => {
    const { username, name, email, role, password } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, name, and password are required' });
    }

    const normalized = username.trim().toLowerCase();
    for (const u of adminUsers.values()) {
      if (u.username.toLowerCase() === normalized) {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    const { hash, salt } = hashPassword(password);
    const newId = `admin-${Date.now()}`;
    const newUser: ServerAdminUser = {
      id: newId,
      username: normalized,
      name,
      email: email || `${normalized}@lankamate.lk`,
      role: role || 'moderator',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    adminUsers.set(newId, newUser);
    recordAudit((req as any).adminUsername, 'security', 'Create Admin User', `Created user ${normalized} with role ${newUser.role}`, req.ip || 'unknown');

    return res.json({
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        isActive: newUser.isActive,
      },
    });
  });

  app.delete('/api/admin/users/:id', requireAdminAuth(['super_admin']), (req: Request, res: Response) => {
    const targetId = req.params.id;
    if (targetId === 'admin-root-01') {
      return res.status(400).json({ error: 'Cannot delete primary root administrator' });
    }
    const user = adminUsers.get(targetId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    adminUsers.delete(targetId);
    recordAudit((req as any).adminUsername, 'security', 'Delete Admin User', `Deleted user ${user.username}`, req.ip || 'unknown');
    return res.json({ success: true });
  });

  // 6. Business Listings Management
  app.get('/api/admin/businesses', requireAdminAuth(), (_req: Request, res: Response) => {
    return res.json({ businesses: businessListings });
  });

  app.patch('/api/admin/businesses/:id/status', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Verified', 'Suspended', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid business status value' });
    }

    const item = businessListings.find((b) => b.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Business listing not found' });
    }

    const previousStatus = item.status;
    item.status = status;
    item.featured = status === 'Verified';

    recordAudit((req as any).adminUsername, 'business', 'Update Business Status', `Listing "${item.name}" changed from ${previousStatus} to ${status}`, req.ip || 'unknown');
    return res.json({ success: true, business: item });
  });

  // 6b. Complete Business / Service Provider Registration System Endpoints
  app.get('/api/business-registrations', (_req: Request, res: Response) => {
    // Return sanitized list without exposing passwords or sensitive auth secrets
    const sanitized = serverBusinessRegistrations.map((r) => {
      const { password, confirmPassword, ...safeAccount } = r.account || ({} as any);
      return {
        ...r,
        account: safeAccount,
      };
    });
    return res.json({ registrations: sanitized });
  });

  app.post('/api/business-registrations', (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload || !payload.account || !payload.business) {
      return res.status(400).json({ error: 'Missing account or business details in registration' });
    }

    const nextNumber = serverBusinessRegistrations.length + 1;
    const id = `LM-BIZ-${String(nextNumber).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const { password, confirmPassword, ...safeAccount } = payload.account;

    const newRecord = {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'PENDING',
      statusNote: 'Registration submitted successfully. Currently pending administrator verification.',
      isActivatedListing: false,
      account: safeAccount,
      profileCompleteness: payload.profileCompleteness || 85,
    };

    serverBusinessRegistrations.unshift(newRecord);
    return res.status(201).json({ success: true, registration: newRecord });
  });

  app.patch('/api/business-registrations/:id/status', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes, sltdaVerified } = req.body;

    const validStatuses = [
      'PENDING',
      'UNDER_REVIEW',
      'VERIFIED',
      'REJECTED',
      'MORE_INFORMATION_REQUIRED',
      'SUSPENDED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const record = serverBusinessRegistrations.find((r) => r.id === id);
    if (!record) {
      return res.status(404).json({ error: 'Registration record not found' });
    }

    record.status = status;
    record.updatedAt = new Date().toISOString();
    record.reviewedBy = (req as any).adminUsername || 'admin';
    record.reviewedAt = new Date().toISOString();
    if (adminNotes) record.adminNotes = adminNotes;
    if (sltdaVerified !== undefined) {
      record.sltdaVerificationStatus = sltdaVerified ? 'Verified by Admin' : 'Rejected';
    }

    record.isActivatedListing = status === 'VERIFIED';
    record.statusNote =
      status === 'VERIFIED'
        ? 'Approved! Your business is officially verified and listed across LankaMate.'
        : status === 'REJECTED'
        ? 'Verification declined. Please review admin notes.'
        : status === 'MORE_INFORMATION_REQUIRED'
        ? 'More information required to complete verification.'
        : status === 'UNDER_REVIEW'
        ? 'Application is currently under admin review.'
        : 'Pending administrator verification.';

    return res.json({ success: true, registration: record });
  });

  app.get('/api/business-registrations/approved', (_req: Request, res: Response) => {
    const approved = serverBusinessRegistrations.filter(
      (r) => r.status === 'VERIFIED' && r.isActivatedListing
    );
    return res.json({ listings: approved });
  });

  // 7. Attractions / Places Management
  app.get('/api/admin/attractions', requireAdminAuth(), (_req: Request, res: Response) => {
    const list = destinationsData.map((d) => ({
      id: d.id,
      name: d.name,
      localName: d.localName,
      region: d.region,
      district: d.district || 'Unassigned',
      category: d.category,
      entryFee: d.entryFee,
      lat: d.coordinates.lat,
      lng: d.coordinates.lng,
      isActive: attractionOverrides.get(d.id)?.isActive ?? true,
    }));
    return res.json({ attractions: list });
  });

  app.patch('/api/admin/attractions/:id/toggle', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    attractionOverrides.set(id, { isActive: Boolean(isActive), modifiedAt: new Date().toISOString() });
    recordAudit((req as any).adminUsername, 'content', 'Toggle Attraction Visibility', `Attraction ID ${id} set to isActive=${Boolean(isActive)}`, req.ip || 'unknown');
    return res.json({ success: true, id, isActive: Boolean(isActive) });
  });

  // 8. Hotels & Restaurants
  app.get('/api/admin/hotels-restaurants', requireAdminAuth(), (_req: Request, res: Response) => {
    return res.json({
      hotels: hotelsData.map((h) => ({
        id: h.id,
        name: h.name,
        location: h.destinationName,
        priceRange: `LKR ${h.pricePerNightLkr.toLocaleString()} / night`,
        rating: h.rating,
        reviewsCount: h.reviewsCount,
        category: h.hotelType || 'Hotel & Resort',
      })),
      restaurants: foodData.map((f) => ({
        id: f.id,
        name: f.name,
        localName: f.sinhalaName,
        priceLKR: f.priceIndication,
        category: f.category,
        spiciness: f.spiceLevel,
      })),
    });
  });

  // 9. Bookings Management
  app.get('/api/admin/bookings', requireAdminAuth(), (_req: Request, res: Response) => {
    return res.json({ bookings: sampleBookings });
  });

  app.patch('/api/admin/bookings/:id/status', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }
    const b = sampleBookings.find((item) => item.id === id);
    if (!b) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    b.status = status;
    recordAudit((req as any).adminUsername, 'booking', 'Update Booking Status', `Booking ${id} status set to ${status}`, req.ip || 'unknown');
    return res.json({ success: true, booking: b });
  });

  // 10. Reports & Analytics
  app.get('/api/admin/reports', requireAdminAuth(), (_req: Request, res: Response) => {
    // Generate regional and category analytics based on actual destinations & bookings
    const categoryBreakdown: Record<string, number> = {};
    const districtBreakdown: Record<string, number> = {};

    destinationsData.forEach((d) => {
      categoryBreakdown[d.category] = (categoryBreakdown[d.category] || 0) + 1;
      const dist = d.district || 'Other';
      districtBreakdown[dist] = (districtBreakdown[dist] || 0) + 1;
    });

    return res.json({
      summary: {
        totalDestinations: destinationsData.length,
        totalDistrictsCovered: Object.keys(districtBreakdown).length,
        averageHotelRating: 4.8,
        totalBookingsLKR: sampleBookings.reduce((sum, b) => sum + b.estimatedLKR, 0),
      },
      categoryBreakdown,
      topDistricts: Object.entries(districtBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([district, count]) => ({ district, count })),
      monthlyTrend: [
        { month: 'May 2026', views: 18400, bookings: 42 },
        { month: 'Jun 2026', views: 24600, bookings: 68 },
        { month: 'Jul 2026', views: 32100, bookings: 94 },
        { month: 'Aug 2026', views: 38900, bookings: 120 },
        { month: 'Sep 2026', views: 29500, bookings: 88 },
      ],
    });
  });

  // 11. Content & Announcements
  app.get('/api/admin/content', requireAdminAuth(), (_req: Request, res: Response) => {
    return res.json({ announcements });
  });

  app.post('/api/admin/content', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    const newAnc = {
      id: `anc-${Date.now()}`,
      title,
      message,
      type: (type as 'info' | 'warning' | 'emergency') || 'info',
      isActive: true,
      publishedAt: new Date().toISOString(),
      author: (req as any).adminUsername || 'Admin',
    };
    announcements.unshift(newAnc);
    recordAudit((req as any).adminUsername, 'content', 'Publish Announcement', `Published "${title}"`, req.ip || 'unknown');
    return res.json({ announcement: newAnc });
  });

  app.delete('/api/admin/content/:id', requireAdminAuth(['super_admin', 'editor']), (req: Request, res: Response) => {
    const { id } = req.params;
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    const [deleted] = announcements.splice(index, 1);
    recordAudit((req as any).adminUsername, 'content', 'Delete Announcement', `Deleted "${deleted.title}"`, req.ip || 'unknown');
    return res.json({ success: true });
  });

  // 12. App Settings
  app.get('/api/admin/settings', requireAdminAuth(), (_req: Request, res: Response) => {
    return res.json({ settings: appSettings });
  });

  app.put('/api/admin/settings', requireAdminAuth(['super_admin']), (req: Request, res: Response) => {
    Object.assign(appSettings, req.body);
    recordAudit((req as any).adminUsername, 'settings', 'Update App Settings', 'Settings modified by super admin', req.ip || 'unknown');
    return res.json({ settings: appSettings });
  });

  // 13. Audit Logs
  app.get('/api/admin/audit-logs', requireAdminAuth(['super_admin']), (_req: Request, res: Response) => {
    return res.json({ logs: auditLogs });
  });
}
