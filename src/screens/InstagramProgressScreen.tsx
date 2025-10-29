// Pantalla de Progreso de Instagram
// Adaptada del mobile - Mock sin backend
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Link as LinkIcon, Video, BarChart3 } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

type ProgressStatus = 'pending' | 'approved' | 'rejected';

export function InstagramProgressScreen() {
  const navigate = useNavigate();
  const { id, postId } = useParams();
  
  // Estados para cada sección
  const [scriptStatus, setScriptStatus] = useState<ProgressStatus>('pending');
  const [hasScript, setHasScript] = useState(false);
  
  // Verificar si el guión fue enviado
  useEffect(() => {
    const scriptSubmitted = localStorage.getItem('scriptSubmitted');
    if (scriptSubmitted === 'true') {
      setHasScript(true);
      setScriptStatus('approved');
    } else {
      // Asegurar estado inicial limpio
      setHasScript(false);
      setScriptStatus('pending');
    }
  }, []);

  // Función para resetear el estado del script (útil para desarrollo)
  const resetScriptState = () => {
    localStorage.removeItem('scriptSubmitted');
    setHasScript(false);
    setScriptStatus('pending');
  };
  
  const [videoStatus] = useState<ProgressStatus>('approved');
  
  const [videoHDStatus, setVideoHDStatus] = useState<ProgressStatus>('pending');
  const [videoHDUploaded, setVideoHDUploaded] = useState(false);
  
  const [linkStatus, setLinkStatus] = useState<ProgressStatus>('pending');
  const [linkUploaded, setLinkUploaded] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const [metricsStatus, setMetricsStatus] = useState<ProgressStatus>('pending');
  const [metricsUploaded, setMetricsUploaded] = useState(false);

  const getStatusBadge = (status: ProgressStatus) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      approved: 'Aprobado',
      rejected: 'Rechazado',
      pending: 'Pendiente',
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleUploadVideoHD = () => {
    setVideoHDUploaded(true);
    setVideoHDStatus('approved');
  };

  const handleSubmitLink = () => {
    if (linkText.trim()) {
      setLinkUploaded(true);
      setLinkStatus('approved');
      setShowLinkModal(false);
    }
  };

  const handleUploadMetrics = () => {
    setMetricsUploaded(true);
    setMetricsStatus('approved');
  };

  const allStatuses = [scriptStatus, videoStatus, videoHDStatus, linkStatus, metricsStatus];
  const completedCount = allStatuses.filter(s => s === 'approved').length;
  const totalCount = allStatuses.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/campaigns/${id}`)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-primary-950">Reel 1</h1>
            {/* Botón temporal para desarrollo - resetear estado del script */}
            <button
              onClick={resetScriptState}
              className="ml-auto px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              title="Resetear estado del script (para desarrollo)"
            >
              Reset Script
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-violet-50 border-b border-violet-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-950">
              Progreso: {completedCount}/{totalCount}
            </span>
            <span className="text-sm text-violet-600 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-4xl space-y-6">
        {/* Título con icono de plataforma */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF0069]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary-950">Reel 1 - Instagram</h2>
        </div>

        {/* Mensaje de vencimiento */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <p className="text-sm text-violet-800 text-center">
            ⏰ <strong>Vence en 15 días</strong> - Completa todos los entregables antes de la fecha límite
          </p>
        </div>

        {/* Guión */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF0069]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-primary-950">Guión</h3>
            </div>
            {hasScript && getStatusBadge(scriptStatus)}
          </div>
          
          {hasScript ? (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/campaigns/${id}/posts/${postId}/script-history`)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver historial
              </button>
              <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Ver guión
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/campaigns/${id}/posts/${postId}/add-script`)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Agregar guión
            </button>
          )}
        </div>

        {/* Video */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary-950" />
              <h3 className="font-semibold text-primary-950">Video</h3>
            </div>
            {getStatusBadge(videoStatus)}
          </div>
          <p className="text-sm text-green-700">✓ Video aprobado</p>
        </div>

        {/* Video HD */}
        <div className={`border-2 rounded-lg p-4 ${
          videoHDUploaded ? 'border-gray-200 bg-white' : 'border-primary-950 bg-white shadow-lg'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary-950" />
              <h3 className="font-semibold text-primary-950">Video en HD</h3>
            </div>
            {videoHDUploaded && getStatusBadge(videoHDStatus)}
          </div>
          
          {videoHDUploaded ? (
            <>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary-950">Video_HD.mp4</p>
                  <p className="text-sm text-gray-500">8,7 MB</p>
                </div>
              </div>
              <button className="text-primary-950 underline hover:text-primary-700">
                Cambiar video
              </button>
            </>
          ) : (
            <button
              onClick={handleUploadVideoHD}
              className="text-primary-950 underline hover:text-primary-700 font-medium"
            >
              Subir video
            </button>
          )}
        </div>

        {/* Link */}
        <div className={`border-2 rounded-lg p-4 ${
          linkUploaded ? 'border-gray-200 bg-white' : 'border-primary-950 bg-white shadow-lg'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary-950" />
              <h3 className="font-semibold text-primary-950">Link</h3>
            </div>
            {linkUploaded && getStatusBadge(linkStatus)}
          </div>
          
          {linkUploaded ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-6 h-6 text-gray-600" />
                <p className="text-primary-950 flex-1 truncate">{linkText}</p>
              </div>
              <button
                onClick={() => setShowLinkModal(true)}
                className="text-primary-950 underline hover:text-primary-700"
              >
                Cambiar link
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLinkModal(true)}
              className="text-primary-950 underline hover:text-primary-700 font-medium"
            >
              Subir link
            </button>
          )}
        </div>

        {/* Métricas */}
        <div className={`border-2 rounded-lg p-4 ${
          metricsUploaded ? 'border-gray-200 bg-white' : 'border-primary-950 bg-white shadow-lg'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-950" />
              <h3 className="font-semibold text-primary-950">Métricas</h3>
            </div>
            {metricsUploaded && getStatusBadge(metricsStatus)}
          </div>
          
          {metricsUploaded ? (
            <>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary-950">Metricas_IG.pdf</p>
                  <p className="text-sm text-gray-500">2,3 MB</p>
                </div>
              </div>
              <button className="text-primary-950 underline hover:text-primary-700">
                Cambiar archivo
              </button>
            </>
          ) : (
            <button
              onClick={handleUploadMetrics}
              className="text-primary-950 underline hover:text-primary-700 font-medium"
            >
              Subir métricas
            </button>
          )}
        </div>

        {/* Mensaje de finalización */}
        {completedCount === totalCount && (
          <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              ¡Contenido completado!
            </h3>
            <p className="text-green-700">
              Has completado todos los entregables de este Reel. La marca revisará tu trabajo.
            </p>
          </div>
        )}
      </main>

      {/* Modal para agregar link */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Agregar link de publicación"
      >
        <div className="space-y-4">
          <Input
            label="Link de Instagram"
            placeholder="https://www.instagram.com/p/..."
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLinkModal(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitLink}
              className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
