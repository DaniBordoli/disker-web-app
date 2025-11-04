// Servicio para manejar scripts de campaign posts
import type {
  CreateScriptRequest,
  CreateScriptResponse,
  ScriptDetailResponse,
} from '../types/api';
import { ApiError } from '../types/api';
import {
  buildUrl,
  fetchWithAuthRetry,
  parseJson,
  devLog,
} from './apiClient';

/**
 * Crear un script para un campaign post
 * @param campaignPostId - ID del campaign post
 * @param payload - Datos del script (title y content)
 */
export async function createScript(
  campaignPostId: string | number,
  payload: CreateScriptRequest
): Promise<CreateScriptResponse> {
  const url = buildUrl(`/api/v1/talents/campaign_posts/${campaignPostId}/scripts`);
  devLog('[createScript] request', { url, campaignPostId, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<CreateScriptResponse>(resp);
  devLog('[createScript] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}

/**
 * Obtener un script específico
 * @param campaignPostId - ID del campaign post
 * @param scriptId - ID del script
 */
export async function getScript(
  campaignPostId: string | number,
  scriptId: string | number
): Promise<ScriptDetailResponse> {
  const url = buildUrl(`/api/v1/talents/campaign_posts/${campaignPostId}/scripts/${scriptId}`);
  devLog('[getScript] request', { url, campaignPostId, scriptId });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await parseJson<ScriptDetailResponse>(resp);
  devLog('[getScript] response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}
