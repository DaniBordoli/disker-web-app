// Servicios de usuario - Copiado y adaptado del mobile
import { useAuthStore } from '../store/authStore';
import type {
  ApiResponse,
  RegisterUserStep1Request,
  RegisterUserStep1Response,
  SetNamesRequest,
  SetNamesResponse,
  ConfirmEmailResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  SetPersonalDataRequest,
  SetPersonalDataResponse,
  CurrentUserResponse,
} from '../types/api';
import { ApiError } from '../types/api';
import {
  buildUrl,
  defaultHeaders,
  authHeaders,
  fetchWithTimeout,
  fetchWithAuthRetry,
  parseJson,
  devLog,
} from './apiClient';

// Paso 1: Registro con email
export async function registerUserStep1(
  payload: RegisterUserStep1Request
): Promise<RegisterUserStep1Response> {
  const url = buildUrl('/api/v1/talents/users');
  devLog('[registerUserStep1] request', { url, payload });

  const resp = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { ...defaultHeaders, ...authHeaders() },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[registerUserStep1] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data as RegisterUserStep1Response;
}

// Paso 2: Confirmar email
export async function confirmEmailStep2(
  confirmationToken: string
): Promise<ConfirmEmailResponse> {
  const url = buildUrl(
    `/api/v1/talents/users/confirmation?confirmation_token=${encodeURIComponent(confirmationToken)}`
  );
  devLog('[confirmEmailStep2] request', { url });

  const resp = await fetchWithTimeout(url, {
    method: 'GET',
    headers: { ...defaultHeaders, ...authHeaders() },
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[confirmEmailStep2] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  // Si el backend devuelve tokens, guardarlos
  const access = data?.data?.access_token;
  const refresh = data?.data?.refresh_token;
  if (access || refresh) {
    useAuthStore.getState().setTokens({
      accessToken: access || null,
      refreshToken: refresh || null,
    });
  }

  return data as ConfirmEmailResponse;
}

// Paso 3: Establecer contraseña
export async function setUserPasswordStep3(
  userId: string | number,
  payload: SetPasswordRequest
): Promise<SetPasswordResponse> {
  const url = buildUrl(`/api/v1/talents/users/${userId}`);
  devLog('[setUserPasswordStep3] request', { url, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'PATCH',
    headers: { ...defaultHeaders },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[setUserPasswordStep3] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data as SetPasswordResponse;
}

// Paso 4: Establecer nombres
export async function setUserNamesStep4(
  userId: string | number,
  payload: SetNamesRequest
): Promise<SetNamesResponse> {
  const url = buildUrl(`/api/v1/talents/users/${userId}`);
  devLog('[setUserNamesStep4] request', { url, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'PATCH',
    headers: { ...defaultHeaders },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[setUserNamesStep4] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data as SetNamesResponse;
}

// Paso 5: Establecer datos personales
export async function setPersonalDataStep5(
  userId: string | number,
  payload: SetPersonalDataRequest
): Promise<SetPersonalDataResponse> {
  const url = buildUrl(`/api/v1/talents/users/${userId}`);
  devLog('[setPersonalDataStep5] request', { url, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'PATCH',
    headers: { ...defaultHeaders },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[setPersonalDataStep5] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data as SetPersonalDataResponse;
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const url = buildUrl('/api/v1/talents/users');
  devLog('[getCurrentUser] request', { url });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[getCurrentUser] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  // Actualizar store con datos del usuario
  try {
    const rawUser = data?.data?.user;
    if (rawUser && typeof rawUser === 'object') {
      const fname = rawUser.first_name ?? '';
      const lname = rawUser.last_name ?? '';
      const name =
        `${String(fname || '').trim()} ${String(lname || '').trim()}`.trim() || null;
      useAuthStore.getState().setCurrentUser({
        id: rawUser.id,
        email: rawUser.email,
        name,
        first_name: rawUser.first_name ?? null,
        last_name: rawUser.last_name ?? null,
        role: rawUser.role ?? null,
      });
      useAuthStore.getState().setLastFetchedUserAt(Date.now());
    }
  } catch (e) {
    devLog('[getCurrentUser] error updating store', e);
  }

  return data as CurrentUserResponse;
}

// Actualizar perfil (genérico)
export async function updateUserProfile(
  userId: string | number,
  payload: any
): Promise<ApiResponse<any>> {
  const url = buildUrl(`/api/v1/talents/users/${userId}`);
  devLog('[updateUserProfile] request', { url, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'PATCH',
    headers: { ...defaultHeaders },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[updateUserProfile] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  // Actualizar usuario en store si es necesario
  await getCurrentUser();

  return data;
}
