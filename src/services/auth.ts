// Servicios de autenticación
// Adaptado del proyecto mobile

import { useAuthStore } from '../store/authStore';
import type { ApiResponse, LoginRequest, LoginResponse } from '../types/api';
import { ApiError } from '../types/api';
import {
  devLog,
  defaultHeaders,
  buildUrl,
  parseJson,
  fetchWithTimeout,
  scheduleProactiveRefresh,
} from './apiClient';

// Login con email/password
export async function loginSession(payload: LoginRequest): Promise<LoginResponse> {
  const url = buildUrl('/api/v1/talents/sessions');
  const resp = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[loginSession] parsed', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    devLog('[loginSession] error', message);
    throw new ApiError(message, resp.status, data);
  }

  // Persist tokens and user
  const access = data?.data?.access_token as string | undefined;
  const refresh = data?.data?.refresh_token as string | undefined;
  const user = data?.data?.user as any | undefined;
  
  if (access || refresh) {
    useAuthStore.getState().setTokens({ 
      accessToken: access || null, 
      refreshToken: refresh || null 
    });
  }
  
  if (user && typeof user === 'object') {
    const fname = user.first_name ?? '';
    const lname = user.last_name ?? '';
    const computedName = `${String(fname || '').trim()} ${String(lname || '').trim()}`.trim();
    const name = (computedName || user.name || null) as string | null;
    useAuthStore.getState().setCurrentUser({
      id: user.id,
      email: user.email,
      name,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      role: user.role ?? null,
    });
  }
  
  scheduleProactiveRefresh();

  return data as LoginResponse;
}

// Login con Google id_token
export async function loginWithGoogleSession(idToken: string): Promise<LoginResponse> {
  const url = buildUrl('/api/v1/talents/sessions/google');
  const resp = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[loginWithGoogleSession] parsed', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    devLog('[loginWithGoogleSession] error', message);
    throw new ApiError(message, resp.status, data);
  }

  // Persist tokens and user (same as loginSession)
  const access = data?.data?.access_token as string | undefined;
  const refresh = data?.data?.refresh_token as string | undefined;
  const user = data?.data?.user as any | undefined;
  
  if (access || refresh) {
    useAuthStore.getState().setTokens({ 
      accessToken: access || null, 
      refreshToken: refresh || null 
    });
  }
  
  if (user && typeof user === 'object') {
    const fname = user.first_name ?? '';
    const lname = user.last_name ?? '';
    const computedName = `${String(fname || '').trim()} ${String(lname || '').trim()}`.trim();
    const name = (computedName || user.name || null) as string | null;
    useAuthStore.getState().setCurrentUser({
      id: user.id,
      email: user.email,
      name,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      role: user.role ?? null,
    });
  }
  
  scheduleProactiveRefresh();

  return data as LoginResponse;
}
