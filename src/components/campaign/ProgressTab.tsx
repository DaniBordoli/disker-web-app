// Muestra el progreso de los entregables de una campaña
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaignPosts } from '../../services/campaigns';
import { Loader, Image, Video, Film, Clock, Layers } from 'lucide-react';
import type { CampaignPost } from '../../types/api';

// Helper para obtener el icono del post type
const getPostTypeIcon = (postType: CampaignPost['post_type']) => {
  const iconClass = "w-4 h-4";
  
  switch (postType) {
    case 'ig_photo':
      return <Image className={iconClass} />;
    case 'ig_video':
    case 'yt_video':
    case 'tt_video':
      return <Video className={iconClass} />;
    case 'ig_carousel':
      return <Layers className={iconClass} />;
    case 'ig_story':
      return <Clock className={iconClass} />;
    case 'ig_igtv':
      return <Film className={iconClass} />;
    case 'ig_reel':
      return <Film className={iconClass} />;
    case 'other':
    case 'ig_other':
    case 'tt_other':
      return <Video className={iconClass} />;
    default:
      return <Video className={iconClass} />;
  }
};

// Helper para obtener el nombre legible del post type
const getPostTypeLabel = (postType: CampaignPost['post_type']): string => {
  const labels: Record<CampaignPost['post_type'], string> = {
    yt_video: 'Video',
    ig_photo: 'Foto',
    ig_video: 'Video',
    ig_carousel: 'Carrusel',
    ig_story: 'Historia',
    tt_video: 'Video',
    ig_igtv: 'IGTV',
    ig_reel: 'Reel',
    other: 'Contenido',
    ig_other: 'Contenido',
    tt_other: 'Contenido',
  };
  return labels[postType] || 'Contenido';
};

// Helper para obtener el badge de estado
const getStatusBadge = (status: CampaignPost['status']) => {
  const statusConfig: Record<CampaignPost['status'], { bg: string; text: string; label: string }> = {
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelado' },
    pending_publication: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pendiente publicación' },
    published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Publicado' },
    script_pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Guión pendiente' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' },
    evaluating_script_client: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Evaluando guión' },
    evaluating_draft_client: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Evaluando borrador' },
    script_approved: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Guión aprobado' },
    evaluating_script_agency: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Evaluando guión (agencia)' },
    evaluating_draft_agency: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Evaluando borrador (agencia)' },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Desconocido' };
  
  return (
    <span className={`${config.bg} px-3 py-1 rounded text-sm ${config.text} font-medium`}>
      {config.label}
    </span>
  );
};

// Helper para obtener la ruta de progreso según la plataforma
const getProgressRoute = (platformShortName: string, campaignId: string | undefined, postId: number) => {
  const platform = platformShortName.toLowerCase();
  if (platform === 'ig' || platform === 'instagram') {
    return `/campaigns/${campaignId}/posts/${postId}/instagram-progress`;
  }
  if (platform === 'tiktok') {
    return `/campaigns/${campaignId}/posts/${postId}/tiktok-progress`;
  }
  // Default
  return `/campaigns/${campaignId}/posts/${postId}/instagram-progress`;
};

export function ProgressTab() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener los campaign posts
  const { data, isLoading, error } = useQuery({
    queryKey: ['campaignPosts', id],
    queryFn: () => getCampaignPosts(id!, { page: 1, per_page: 10 }),
    enabled: !!id,
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error al cargar los entregables. Intenta de nuevo.</p>
      </div>
    );
  }

  const campaignPosts = data?.data.campaign_posts || [];

  return (
    <div>
      {/* Estado de postulación */}
      <div className="mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-primary-950 font-medium">Postulación</p>
            <span className="bg-green-100 px-3 py-1 rounded-lg text-sm text-green-800 font-medium">
              Aceptado
            </span>
          </div>
          <button className="text-primary-950 underline hover:text-primary-700">
            Ver postulación
          </button>
        </div>
      </div>

      {/* Entregables con progreso */}
      <div className="mb-6 space-y-4">
        {campaignPosts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-500 text-center">No hay entregables para esta campaña</p>
          </div>
        ) : (
          campaignPosts.map((post, index) => (
            <div key={post.id} className="border-2 border-primary-950 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600">
                    {getPostTypeIcon(post.post_type)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-primary-950 font-medium">
                    {post.account.platform.name} {getPostTypeLabel(post.post_type)} {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">{post.account.handle}</p>
                </div>
                {getStatusBadge(post.status)}
              </div>
              
              {/* Barras de progreso basadas en el estado real */}
              <div className="mb-4 flex gap-1">
                {/* Barra 1: Guión enviado */}
                <div className={`h-1 rounded-full w-[62px] ${
                  ['evaluating_script_client', 'evaluating_script_agency', 'script_approved', 'evaluating_draft_client', 'evaluating_draft_agency', 'pending_publication', 'published'].includes(post.status)
                    ? 'bg-violet-400' : 'bg-violet-100'
                }`} />
                {/* Barra 2: Guión aprobado */}
                <div className={`h-1 rounded-full w-[62px] ${
                  ['script_approved', 'evaluating_draft_client', 'evaluating_draft_agency', 'pending_publication', 'published'].includes(post.status)
                    ? 'bg-violet-400' : 'bg-violet-100'
                }`} />
                {/* Barra 3: Borrador enviado */}
                <div className={`h-1 rounded-full w-[62px] ${
                  ['evaluating_draft_client', 'evaluating_draft_agency', 'pending_publication', 'published'].includes(post.status)
                    ? 'bg-violet-400' : 'bg-violet-100'
                }`} />
                {/* Barra 4: Pendiente publicación */}
                <div className={`h-1 rounded-full w-[62px] ${
                  ['pending_publication', 'published'].includes(post.status)
                    ? 'bg-violet-400' : 'bg-violet-100'
                }`} />
                {/* Barra 5: Publicado */}
                <div className={`h-1 rounded-full w-[62px] ${
                  post.status === 'published' ? 'bg-violet-400' : 'bg-violet-100'
                }`} />
              </div>
              
              <button
                onClick={() => navigate(getProgressRoute(post.account.platform.short_name, id, post.id))}
                className="text-primary-950 underline hover:text-primary-700"
              >
                Completar contenido
              </button>
            </div>
          ))
        )}

        {/* Finalizado */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 font-medium">Finalizado</p>
        </div>
      </div>
    </div>
  );
}
