// Pantalla para ver un draft específico con su video
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader, Video as VideoIcon, ExternalLink } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { getCampaignPosts } from '../services/campaigns';
import type { DraftStatus } from '../types/api';

export function ViewDraftScreen() {
  const navigate = useNavigate();
  const { id, postId, draftId } = useParams();

  // Obtener campaign posts (incluye drafts)
  const { data: campaignPostsData, isLoading, error } = useQuery({
    queryKey: ['campaignPosts', id],
    queryFn: () => getCampaignPosts(id!, { page: 1, per_page: 100 }),
    enabled: !!id,
  });

  // Encontrar el campaign post y el draft específico
  const currentCampaignPost = campaignPostsData?.data.campaign_posts.find(
    (post) => post.id === Number(postId)
  );

  const draft = currentCampaignPost?.drafts.find(
    (d) => d.id === Number(draftId)
  );

  // Helper para obtener badge de estado
  const getStatusBadge = (status: DraftStatus) => {
    const config = {
      approval_client: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En revisión' },
      approval_agency: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En revisión (agencia)' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobado' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' },
    };
    
    const { bg, text, label } = config[status];
    
    return (
      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-primary-950">Ver Draft</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary-950" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error al cargar el draft</p>
          </div>
        ) : !draft ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Draft no encontrado</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Título
              </label>
              <h2 className="text-2xl font-bold text-primary-950">{draft.title}</h2>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Estado
              </label>
              {getStatusBadge(draft.status)}
            </div>

            {/* Feedback si está rechazado */}
            {draft.status === 'rejected' && draft.feedback && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Feedback
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800 mb-1">Motivo del rechazo:</p>
                  <p className="text-sm text-red-700">{draft.feedback}</p>
                </div>
              </div>
            )}

            {/* Video (si tiene file_url) */}
            {draft.file_url && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Video
                </label>
                <div className="bg-black rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full max-h-[600px]"
                    src={draft.file_url}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
                <div className="mt-2">
                  <a
                    href={draft.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir video en nueva pestaña
                  </a>
                </div>
              </div>
            )}

            {/* URL de publicación (si tiene) */}
            {draft.url && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Link de publicación
                </label>
                <a
                  href={draft.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver publicación
                </a>
              </div>
            )}

            {/* Tipo de contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Tipo de contenido
              </label>
              <div className="flex items-center gap-2">
                {draft.file_url ? (
                  <>
                    <VideoIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Video subido</span>
                  </>
                ) : draft.url ? (
                  <>
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Link de publicación</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Sin contenido</span>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Creado
                </label>
                <p className="text-sm text-gray-700">
                  {new Date(draft.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Actualizado
                </label>
                <p className="text-sm text-gray-700">
                  {new Date(draft.updated_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Botón para volver */}
            <div className="pt-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
