// Types para API requests/responses
// Copiado del proyecto mobile para mantener consistencia

export interface ApiMeta {
  message?: string;
}

export interface ApiResponse<T> {
  meta?: ApiMeta;
  data?: T;
}

// Register Step 1
export interface RegisterUserStep1Request {
  user: {
    email: string;
  };
}

export interface SignupSteps {
  step_confirmation: boolean;
  step_password: boolean;
  step_set_names: boolean;
  step_personal_data: boolean;
}

export interface RegisterUserStep1User {
  id: number;
  email: string;
  name: string | null;
  role: 'talent' | 'brand' | string;
  confirmed_at: string | null;
  confirmation_sent_at: string | null;
  personal_data: unknown | null;
  created_at: string;
  updated_at: string;
  signup_steps: SignupSteps;
}

export interface RegisterUserStep1ResponseData {
  user: RegisterUserStep1User;
}

export type RegisterUserStep1Response = ApiResponse<RegisterUserStep1ResponseData>;

export class ApiError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Set Names (PATCH /api/v1/talents/users/:id)
export interface SetNamesRequest {
  set_names: {
    name: string;
    lastname: string;
  };
}

export type SetNamesResponse = ApiResponse<{
  user: RegisterUserStep1User;
}>;

// Set Password (PATCH /api/v1/talents/users/:id)
export interface SetPasswordRequest {
  set_password: {
    password: string;
  };
}

export type SetPasswordResponse = ApiResponse<{
  user: RegisterUserStep1User;
}>;

// Confirm Email (GET /api/v1/talents/users/confirmation?confirmation_token=...)
export type ConfirmEmailResponse = ApiResponse<{
  access_token?: string;
  refresh_token?: string;
  user: RegisterUserStep1User;
}>;

// Set Personal Data (PATCH /api/v1/talents/users/:id)
export interface SetPersonalDataRequest {
  set_personal_data: {
    country: string;
    city_uid: number;
    birthdate: string; // format DD-MM-YYYY
    gender: 'male' | 'female';
  };
}

export type SetPersonalDataResponse = ApiResponse<{
  user: RegisterUserStep1User;
}>;

// Login (POST /api/v1/talents/sessions)
export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
  user: RegisterUserStep1User;
}>;

// ---- Current User (GET /api/v1/talents/users) ----
export interface PersonalData {
  nationality?: string | null;
  birthday?: string | null; // YYYY-MM-DD
  gender?: 'male' | 'female' | string | null;
  location_id?: number | null;
  postal_code?: string | null;
}

export interface CurrentUser {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null; // optional convenience
  role: 'talent' | 'brand' | string;
  personal_data?: PersonalData | null;
  signup_steps: SignupSteps;
}

export type CurrentUserResponse = ApiResponse<{
  user: CurrentUser;
}>;

// Campaigns
export interface CampaignPlatform {
  name: string;
  short_name: string;
}

export interface Campaign {
  id: number;
  title: string;
  status: string;
  created_at: string;
  launch_date: string;
  image_url?: string;
  platforms: CampaignPlatform[];
}

export interface CampaignsPagination {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_count: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface CampaignsResponseData {
  campaigns: Campaign[];
}

export interface CampaignsApiMeta extends ApiMeta {
  pagination?: CampaignsPagination;
}

export interface CampaignsResponse {
  meta: CampaignsApiMeta;
  data: CampaignsResponseData;
}

// Campaign Detail
export interface CampaignOffer {
  price: number;
  currency: string;
  contents: {
    tiktok?: {
      tt_video?: string;
    };
    instagram?: {
      ig_post?: string;
      ig_story?: string;
      ig_reel?: string;
    };
    youtube?: {
      yt_video?: string;
      yt_short?: string;
    };
  };
}

export interface CampaignDetail {
  id: number;
  title: string;
  status: string;
  created_at: string;
  launch_date: string;
  image_url?: string;
  platforms: CampaignPlatform[];
  offer: CampaignOffer;
}

export interface CampaignDetailResponse {
  meta: ApiMeta;
  data: {
    campaign: CampaignDetail;
  };
}

// Script Types
export interface Script {
  id: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateScriptRequest {
  script: {
    title: string;
    content: string;
  };
}

export interface CreateScriptResponse {
  meta: ApiMeta;
  data: {
    script: Script;
  };
}

// Campaign Post Types
export type CampaignPostStatus = 
  | 'cancelled'                    // 0 - Cancelado
  | 'pending_publication'          // 1 - Pendiente de publicación
  | 'published'                    // 2 - Publicado
  | 'script_pending'               // 3 - Guión pendiente
  | 'rejected'                     // 4 - Rechazado
  | 'evaluating_script_client'     // 5 - Evaluando guión (cliente)
  | 'evaluating_draft_client'      // 6 - Evaluando borrador (cliente)
  | 'script_approved'              // 7 - Guión aprobado
  | 'evaluating_script_agency'     // 8 - Evaluando guión (agencia)
  | 'evaluating_draft_agency';     // 9 - Evaluando borrador (agencia)

export type CampaignPostType =
  | 'yt_video'        // 0 - YouTube Video
  | 'ig_photo'        // 1 - Instagram Photo
  | 'ig_video'        // 2 - Instagram Video
  | 'ig_carousel'     // 3 - Instagram Carousel
  | 'ig_story'        // 4 - Instagram Story
  | 'tt_video'        // 5 - TikTok Video
  | 'ig_igtv'         // 6 - Instagram IGTV
  | 'ig_reel'         // 7 - Instagram Reel
  | 'other'           // 8 - Otro
  | 'ig_other'        // 9 - Instagram Otro
  | 'tt_other';       // 10 - TikTok Otro

export interface CampaignPost {
  id: number;
  status: CampaignPostStatus;
  post_type: CampaignPostType;
  created_at: string;
  updated_at: string;
  account: {
    id: number;
    handle: string;
    platform: {
      id: number;
      name: string;
      short_name: string;
    };
  };
}

export interface CampaignPostsResponse {
  meta: ApiMeta & {
    pagination: {
      current_page: number;
      page_size: number;
      total_pages: number;
      total_count: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
  };
  data: {
    campaign_posts: CampaignPost[];
  };
}
