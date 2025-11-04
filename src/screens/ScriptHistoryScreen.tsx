// Pantalla de Historial de Guiones
// Adaptada del mobile - Integrada con backend
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Loader } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { getCampaignPosts } from '../services/campaigns';
import type { Script } from '../types/api';

const getStatusConfig = (status: Script['status']) => {
  switch (status) {
    case 'approved':
      return {
        bgColor: 'bg-green-100',
        iconColor: 'text-green-800',
        textColor: 'text-green-700',
        label: 'Aprobado'
      };
    case 'rejected':
      return {
        bgColor: 'bg-red-100',
        iconColor: 'text-red-800',
        textColor: 'text-red-700',
        label: 'Rechazado'
      };
    default: // approval_client, approval_agency, etc.
      return {
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-800',
        textColor: 'text-orange-700',
        label: 'En revisión'
      };
  }
};

export function ScriptHistoryScreen() {
  const navigate = useNavigate();
  const { id, postId } = useParams();

  // Obtener campaign posts (incluye scripts)
  const { data: campaignPostsData, isLoading, error } = useQuery({
    queryKey: ['campaignPosts', id],
    queryFn: () => getCampaignPosts(id!, { page: 1, per_page: 100 }),
    enabled: !!id,
  });

  // Encontrar el campaign post actual y sus scripts
  const currentCampaignPost = campaignPostsData?.data.campaign_posts.find(
    (post) => post.id === Number(postId)
  );

  const scripts = currentCampaignPost?.scripts || [];

  const handleScriptClick = (script: Script) => {
    navigate(`/campaigns/${id}/posts/${postId}/scripts/${script.id}`);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-2xl font-bold text-primary-950 ml-2">
            Historial de guiones
          </h1>
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
            <p className="text-red-700">Error al cargar el historial de guiones</p>
          </div>
        ) : scripts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay guiones en el historial</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {scripts.map((script) => {
              const config = getStatusConfig(script.status);
              
              return (
                <div
                  key={script.id}
                  onClick={() => handleScriptClick(script)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Icono con fondo de color */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${config.bgColor}`}>
                    <FileText className={`w-6 h-6 ${config.iconColor}`} />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <p className={`font-semibold mb-1 ${config.textColor}`}>
                      {script.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${config.bgColor} ${config.textColor}`}>
                        {config.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(script.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Flecha para indicar que es clickeable */}
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
