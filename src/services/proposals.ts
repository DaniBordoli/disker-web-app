// Servicios de propuestas y aplicaciones a campañas
import type { ApiResponse } from '../types/api';
import { ApiError } from '../types/api';
import {
  devLog,
  defaultHeaders,
  buildUrl,
  parseJson,
  fetchWithAuthRetry,
} from './apiClient';

export interface ApplyCampaignRequest {
  campaign_id: number;
  message?: string;
}

export interface ApplyCampaignResponse {
  proposal: {
    id: number;
    campaign_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  };
}

// Aplicar a una campaña
// TODO: Implementar cuando el endpoint esté disponible en el backend
export async function applyCampaign(
  _campaignId: number,
  _message?: string
): Promise<ApiResponse<ApplyCampaignResponse>> {
  // Endpoint no disponible aún en el backend
  throw new Error('Funcionalidad pendiente de implementación en el backend');
  
  /* CÓDIGO COMENTADO - Descomentar cuando el endpoint esté listo
  const url = buildUrl('/api/v1/talents/proposals');
  devLog('[applyCampaign] request', { campaignId, message });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify({
      campaign_id: campaignId,
      message: message || '',
    }),
  });

  const data = await parseJson<ApiResponse<ApplyCampaignResponse>>(resp);
  devLog('[applyCampaign] response', data);

  if (!resp.ok) {
    const errorMessage = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(errorMessage, resp.status, data);
  }

  return data;
  */
}

// Tipos para propuestas
export interface Proposal {
  id: number;
  campaign_id: number;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  campaign?: {
    id: number;
    title: string;
    image_url?: string;
    status: string;
    platforms: Array<{ name: string }>;
  };
}

export interface ProposalsResponse {
  proposals: Proposal[];
}

// Obtener mis propuestas
export async function getMyProposals(
  status?: 'pending' | 'approved' | 'rejected'
): Promise<ApiResponse<ProposalsResponse>> {
  const params = status ? `?status=${status}` : '';
  const url = buildUrl(`/api/v1/talents/proposals${params}`);
  devLog('[getMyProposals] request', { status });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<ApiResponse<ProposalsResponse>>(resp);
  devLog('[getMyProposals] response', data);

  if (!resp.ok) {
    const errorMessage = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(errorMessage, resp.status, data);
  }

  return data;
}

// Obtener detalle de propuesta
export async function getProposalDetail(
  proposalId: number
): Promise<ApiResponse<{ proposal: Proposal }>> {
  const url = buildUrl(`/api/v1/talents/proposals/${proposalId}`);
  devLog('[getProposalDetail] request', { proposalId });

  const resp = await fetchWithAuthRetry(url, {
    method: 'GET',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<ApiResponse<{ proposal: Proposal }>>(resp);
  devLog('[getProposalDetail] response', data);

  if (!resp.ok) {
    const errorMessage = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(errorMessage, resp.status, data);
  }

  return data;
}

// Cancelar propuesta
export async function cancelProposal(proposalId: number): Promise<ApiResponse<any>> {
  const url = buildUrl(`/api/v1/talents/proposals/${proposalId}`);
  devLog('[cancelProposal] request', { proposalId });

  const resp = await fetchWithAuthRetry(url, {
    method: 'DELETE',
    headers: { ...defaultHeaders },
  });

  const data = await parseJson<ApiResponse<any>>(resp);
  devLog('[cancelProposal] response', data);

  if (!resp.ok) {
    const errorMessage = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(errorMessage, resp.status, data);
  }

  return data;
}
