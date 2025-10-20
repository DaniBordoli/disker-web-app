// Servicios de redes sociales - Copiado y adaptado del mobile
import type { ApiResponse } from '../types/api';
import { ApiError } from '../types/api';
import { useAuthStore } from '../store/authStore';
import {
  devLog,
  defaultHeaders,
  buildUrl,
  parseJson,
  fetchWithAuthRetry,
} from './apiClient';

export type LinkedAccount = {
  id: string | number;
  platform: 'tiktok' | 'instagram' | 'youtube' | string;
  username?: string | null;
};

// Guardar tokens de TikTok enviando authCode al backend
export async function storeTikTokTokens(
  authCode: string,
  codeVerifier?: string,
  grantedPermissions?: string[]
): Promise<{ stored: boolean }> {
  const url = buildUrl('/api/v1/talents/store_tokens');

  // Backend espera: { tiktok: { code, state, scope } }
  const scope = Array.isArray(grantedPermissions)
    ? grantedPermissions.join(',')
    : 'user.info.basic,user.info.profile,video.list';

  const body = {
    tiktok: {
      code: authCode,
      state: codeVerifier || '', // Usando codeVerifier como state (PKCE)
      scope: scope,
    },
  };

  devLog('[storeTikTokTokens] request', { url, body });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify(body),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[storeTikTokTokens] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return { stored: true };
}

// Guardar tokens de Instagram
export async function storeInstagramTokens(
  authCode: string,
  redirectUri?: string
): Promise<{ stored: boolean }> {
  const url = buildUrl('/api/v1/talents/store_tokens');

  const body = {
    instagram: {
      code: authCode,
      redirect_uri: redirectUri || window.location.origin + '/auth/instagram/callback',
    },
  };

  devLog('[storeInstagramTokens] request', { url, body });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify(body),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[storeInstagramTokens] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return { stored: true };
}

// Obtener cuentas vinculadas del usuario actual
export async function getLinkedAccounts(): Promise<LinkedAccount[]> {
  const userId = useAuthStore.getState().currentUser?.id;
  if (!userId) {
    throw new ApiError('No current user available to fetch accounts', 401);
  }

  const url = buildUrl(`/api/v1/talents/users/${userId}/accounts`);
  devLog('[getLinkedAccounts] request', { url });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[getLinkedAccounts] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  // Normalizar respuesta
  const list: any[] = data?.data || (Array.isArray(data) ? data : []);
  const normalized = (Array.isArray(list) ? list : []).map((it) => ({
    id: it.id ?? it.account_id ?? String(Math.random()),
    platform: it.platform ?? it.provider ?? 'unknown',
    username: it.username ?? it.handle ?? null,
  })) as LinkedAccount[];

  devLog('[getLinkedAccounts] normalized', normalized);
  return normalized;
}

// Desvincular cuenta (probablemente existe en backend)
export async function unlinkAccount(accountId: string | number): Promise<void> {
  const userId = useAuthStore.getState().currentUser?.id;
  if (!userId) {
    throw new ApiError('No current user available', 401);
  }

  const url = buildUrl(`/api/v1/talents/users/${userId}/accounts/${accountId}`);
  devLog('[unlinkAccount] request', { url });

  const resp = await fetchWithAuthRetry(url, {
    method: 'DELETE',
    headers: { ...defaultHeaders },
  });

  if (!resp.ok) {
    const data = await parseJson<ApiResponse<any>>(resp);
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  devLog('[unlinkAccount] success');
}
