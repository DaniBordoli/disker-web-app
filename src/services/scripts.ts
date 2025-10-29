// Servicios de scripts
import type {
  CreateScriptRequest,
  CreateScriptResponse,
} from '../types/api';
import { ApiError } from '../types/api';
import {
  buildUrl,
  defaultHeaders,
  fetchWithAuthRetry,
  parseJson,
  devLog,
} from './apiClient';

// Crear script para un campaign post
export async function createScript(
  campaignPostId: string | number,
  payload: CreateScriptRequest
): Promise<CreateScriptResponse> {
  const url = buildUrl(`/api/v1/talents/campaign_posts/${campaignPostId}/scripts`);
  devLog('[createScript] request', { url, campaignPostId, payload });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
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
