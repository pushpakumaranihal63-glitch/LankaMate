import { AdminSession, AdminUser } from '../types/admin';

const ADMIN_SESSION_KEY = 'lankamate_admin_session';

export function getStoredAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save admin session', err);
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear admin session', err);
  }
}

export function getAdminAuthHeader(): Record<string, string> {
  const session = getStoredAdminSession();
  if (!session?.token) return {};
  return {
    Authorization: `Bearer ${session.token}`,
  };
}

export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  const session = getStoredAdminSession();

  if (session?.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAdminSession();
    // Dispatch a custom event so the UI immediately switches to the login gate
    window.dispatchEvent(new CustomEvent('admin_session_expired'));
  }

  return res;
}
