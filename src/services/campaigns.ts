// Servicios de campañas
// Copiado del proyecto mobile

import type { CampaignsResponse, CampaignDetailResponse } from '../types/api';
import { ApiError } from '../types/api';
import {
  devLog,
  defaultHeaders,
  buildUrl,
  parseJson,
  fetchWithAuthRetry,
} from './apiClient';

export type CampaignScope = 'active' | 'applied' | 'finished';

export async function getCampaigns(scope: CampaignScope = 'active'): Promise<CampaignsResponse> {
  const url = buildUrl(`/api/v1/talents/campaigns?scope=${scope}`);
  devLog('[getCampaigns] request', { url, scope });
  
  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<CampaignsResponse>(resp);
  devLog('[getCampaigns] raw response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}

export async function getCampaignDetail(campaignId: number): Promise<CampaignDetailResponse> {
  const url = buildUrl(`/api/v1/talents/campaigns/${campaignId}`);
  devLog('[getCampaignDetail] request', { url, campaignId });
  
  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<CampaignDetailResponse>(resp);
  devLog('[getCampaignDetail] raw response', data);

  if (!resp.ok) {
    const message = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(message, resp.status, data);
  }

  return data;
}
