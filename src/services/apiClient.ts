// Cliente API adaptado del proyecto mobile
// Usa fetch nativo del navegador en lugar de React Native

import { BASE_URL, DEFAULT_TIMEOUT_MS, IS_DEV } from '../config';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '../types/api';

// Logger para desarrollo
export function devLog(...args: any[]) {
  if (IS_DEV) {
    console.log('[API]', ...args);
  }
}

// Detectar si estamos offline
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function buildUrl(path: string) {
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function fetchWithTimeout(
  resource: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  // Verificar si estamos offline
  if (!isOnline()) {
    throw new ApiError('Sin conexión a internet', 0, { offline: true });
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    devLog('request', { url: resource, method: options.method || 'GET' });
    const resp = await fetch(resource, { ...options, signal: controller.signal });
    devLog('response status', resp.status, resource);
    return resp;
  } catch (error: any) {
    // Manejar errores de red
    if (error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado', 408, { timeout: true });
    }
    if (!isOnline()) {
      throw new ApiError('Sin conexión a internet', 0, { offline: true });
    }
    throw new ApiError('Error de red', 0, { networkError: true, originalError: error });
  } finally {
    clearTimeout(id);
  }
}

export async function parseJson<T>(resp: Response): Promise<T> {
  const text = await resp.text();
  try {
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (e) {
    throw new ApiError('Invalid JSON response', resp.status, text);
  }
}

// --- Proactive refresh scheduling ---
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function base64UrlDecode(input: string): string | null {
  try {
    const b64 = input
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(input.length + (4 - (input.length % 4 || 4)), '=');
    return atob(b64);
  } catch {
    return null;
  }
}

function getJwtExpSeconds(token: string | null | undefined): number | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payloadStr = base64UrlDecode(parts[1]);
  if (!payloadStr) return null;
  try {
    const payload = JSON.parse(payloadStr);
    const exp = typeof payload?.exp === 'number' ? payload.exp : null;
    return exp ?? null;
  } catch {
    return null;
  }
}

export function scheduleProactiveRefresh(aheadSeconds = 60) {
  try {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    const access = useAuthStore.getState().accessToken;
    const exp = getJwtExpSeconds(access);
    if (!exp) return;
    const nowSec = Math.floor(Date.now() / 1000);
    const delayMs = Math.max(0, (exp - aheadSeconds - nowSec) * 1000);
    if (delayMs === 0) return;
    refreshTimer = setTimeout(() => {
      refreshAccessToken().catch(() => {
        // swallow; refreshAccessToken handles clearSession
      });
    }, delayMs);
  } catch {}
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    useAuthStore.getState().clearSession();
    throw new ApiError('No refresh token available', 401);
  }

  const url = buildUrl('/api/v1/talents/sessions/refresh');
  const resp = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await parseJson<any>(resp);

  if (!resp.ok) {
    const message = data?.meta?.message || `Refresh failed with status ${resp.status}`;
    useAuthStore.getState().clearSession();
    throw new ApiError(message, resp.status, data);
  }

  const newAccess: string | undefined = data?.data?.access_token;
  const newRefresh: string | undefined = data?.data?.refresh_token;
  const newUser = data?.data?.user;

  useAuthStore.getState().setTokens({ 
    accessToken: newAccess || null, 
    refreshToken: newRefresh || null 
  });
  
  if (newUser && typeof newUser === 'object') {
    const fname = newUser.first_name ?? '';
    const lname = newUser.last_name ?? '';
    const computedName = `${String(fname || '').trim()} ${String(lname || '').trim()}`.trim();
    const name = (computedName || newUser.name || null) as string | null;
    useAuthStore.getState().setCurrentUser({
      id: newUser.id,
      email: newUser.email,
      name,
      first_name: newUser.first_name ?? null,
      last_name: newUser.last_name ?? null,
      role: newUser.role ?? null,
    });
  }
  
  scheduleProactiveRefresh();

  if (!newAccess) {
    useAuthStore.getState().clearSession();
    throw new ApiError('Refresh did not return access token', 500, data);
  }
  
  return newAccess;
}

// Función auxiliar para esperar con backoff exponencial
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry con backoff exponencial
export async function fetchWithRetry(
  resource: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeout = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(resource, options, timeout);
    } catch (error: any) {
      lastError = error;
      
      // No reintentar si estamos offline o si es un error de autenticación
      if (error.data?.offline || error.status === 401 || error.status === 403) {
        throw error;
      }
      
      // No reintentar en el último intento
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Backoff exponencial: 1s, 2s, 4s
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 4000);
      devLog(`Retry attempt ${attempt + 1}/${maxRetries} after ${backoffMs}ms`);
      await sleep(backoffMs);
    }
  }
  
  throw lastError || new ApiError('Max retries exceeded', 0);
}

export async function fetchWithAuthRetry(
  resource: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const withAuth = (opts: RequestInit): RequestInit => {
    const incomingHeaders = (opts.headers as Record<string, string>) || {};
    const { Authorization: _auth, ...rest } = incomingHeaders;
    return { ...opts, headers: { ...rest, ...authHeaders() } };
  };

  let resp = await fetchWithRetry(resource, withAuth(options), 2, timeout);
  
  if (resp.status === 401) {
    try {
      devLog('[fetchWithAuthRetry] Token expired, refreshing...');
      await refreshAccessToken();
      resp = await fetchWithRetry(resource, withAuth(options), 2, timeout);
    } catch (refreshError) {
      devLog('[fetchWithAuthRetry] Refresh failed, clearing session');
      useAuthStore.getState().clearSession();
      throw refreshError;
    }
  }
  
  return resp;
}
