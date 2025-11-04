// Servicio para manejar drafts de campaign posts
import type {
  CreateDraftRequest,
  CreateDraftResponse,
  DraftsListResponse,
} from '../types/api';
import { ApiError } from '../types/api';
import {
  buildUrl,
  fetchWithAuthRetry,
  parseJson,
  devLog,
} from './apiClient';

/**
 * Crear un draft para un campaign post
 * @param campaignPostId - ID del campaign post
 * @param payload - Datos del draft (title, url o file)
 */
export async function createDraft(
  campaignPostId: string | number,
  payload: CreateDraftRequest
): Promise<CreateDraftResponse> {
  const url = buildUrl(`/api/v1/talents/campaign_posts/${campaignPostId}/drafts`);
  
  // Construir FormData para multipart/form-data
  const formData = new FormData();
  formData.append('draft[title]', payload.draft.title);
  
  if (payload.draft.url) {
    formData.append('draft[url]', payload.draft.url);
  }
  
  if (payload.draft.file) {
    formData.append('draft[file]', payload.draft.file);
  }
  
  devLog('[createDraft] request', { url, campaignPostId, title: payload.draft.title });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    // NO incluir Content-Type header, FormData lo maneja automáticamente
    body: formData,
  });

  const data = await parseJson<CreateDraftResponse>(resp);
  devLog('[createDraft] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}

/**
 * Obtener lista de drafts de un campaign post
 * @param campaignPostId - ID del campaign post
 */
export async function getDrafts(
  campaignPostId: string | number
): Promise<DraftsListResponse> {
  const url = buildUrl(`/api/v1/talents/campaign_posts/${campaignPostId}/drafts`);
  devLog('[getDrafts] request', { url, campaignPostId });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await parseJson<DraftsListResponse>(resp);
  devLog('[getDrafts] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}
