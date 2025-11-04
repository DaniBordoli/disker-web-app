// Pantalla para ver un script específico
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { getScript } from '../services/scripts';

export function ViewScriptScreen() {
  const navigate = useNavigate();
  const { id, postId, scriptId } = useParams();

  // Obtener el script
  const { data, isLoading, error } = useQuery({
    queryKey: ['script', postId, scriptId],
    queryFn: () => getScript(postId!, scriptId!),
    enabled: !!postId && !!scriptId,
  });

  const script = data?.data.script;

  // Función para limpiar el HTML del content (viene con tags de Trix editor)
  const getCleanContent = (htmlContent: string) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || '';
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
              <h1 className="text-lg font-semibold text-primary-950">Ver Guión</h1>
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
            <p className="text-red-700">Error al cargar el guión</p>
          </div>
        ) : script ? (
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Título
              </label>
              <h2 className="text-2xl font-bold text-primary-950">{script.title}</h2>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Estado
              </label>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                script.status === 'approved' ? 'bg-green-100 text-green-800' :
                script.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {script.status === 'approved' ? 'Aprobado' :
                 script.status === 'rejected' ? 'Rechazado' :
                 'En revisión'}
              </span>
            </div>

            {/* Feedback si está rechazado */}
            {script.status === 'rejected' && script.feedback && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Feedback
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800 mb-1">Motivo del rechazo:</p>
                  <p className="text-sm text-red-700">{script.feedback}</p>
                </div>
              </div>
            )}

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Contenido
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-primary-950 whitespace-pre-wrap">
                  {getCleanContent(script.content)}
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Creado
                </label>
                <p className="text-sm text-gray-700">
                  {new Date(script.created_at).toLocaleDateString('es-ES', {
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
                  {new Date(script.updated_at).toLocaleDateString('es-ES', {
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
        ) : null}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
