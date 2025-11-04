// Pantalla de Progreso de Instagram
// Adaptada del mobile - Mock sin backend
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, Video, Upload, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { createDraft } from '../services/drafts';
import { getCampaignPosts } from '../services/campaigns';
import type { DraftStatus, CreateDraftRequest } from '../types/api';
import { ApiError } from '../types/api';

type ProgressStatus = 'pending' | 'approved' | 'rejected';

export function InstagramProgressScreen() {
  const navigate = useNavigate();
  const { id, postId } = useParams();
  
  // Estados para cada sección
  
  // Estados para drafts
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftUrl, setDraftUrl] = useState('');
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{title?: string[], url?: string[], file?: string[]}>({});
  
  const [linkStatus, setLinkStatus] = useState<ProgressStatus>('pending');
  const [linkUploaded, setLinkUploaded] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  

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

  // Obtener campaign posts (incluye drafts y scripts)
  const { data: campaignPostsData, refetch: refetchCampaignPosts } = useQuery({
    queryKey: ['campaignPosts', id],
    queryFn: () => getCampaignPosts(id!, { page: 1, per_page: 100 }),
    enabled: !!id,
  });

  // Encontrar el campaign post actual por postId
  const currentCampaignPost = campaignPostsData?.data.campaign_posts.find(
    (post) => post.id === Number(postId)
  );

  // Obtener último draft y último script
  const latestDraft = currentCampaignPost?.drafts[currentCampaignPost.drafts.length - 1];
  const latestScript = currentCampaignPost?.scripts[currentCampaignPost.scripts.length - 1];
  
  const canAddDraft = !latestDraft || 
    (latestDraft.status !== 'approval_client' && latestDraft.status !== 'approved');

  // Helper para obtener badge de draft
  const getDraftStatusBadge = (status: DraftStatus) => {
    const config = {
      approval_client: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En revisión' },
      approval_agency: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En revisión (agencia)' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobado' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' },
    };
    
    const { bg, text, label } = config[status];
    
    return (
      <span className={`${bg} px-3 py-1 rounded text-sm ${text} font-medium`}>
        {label}
      </span>
    );
  };

  // Manejar envío de draft
  const handleSubmitDraft = async () => {
    if (!postId) return;
    
    // Reset errors
    setDraftError(null);
    setFieldErrors({});
    
    // Validación básica
    if (!draftTitle.trim()) {
      setFieldErrors({ title: ["can't be blank"] });
      return;
    }
    
    if (!draftUrl.trim() && !draftFile) {
      setDraftError('Debes proporcionar un link o subir un archivo');
      return;
    }
    
    setIsSubmittingDraft(true);
    
    try {
      const payload: CreateDraftRequest = {
        draft: {
          title: draftTitle.trim(),
          url: draftUrl.trim() || undefined,
          file: draftFile || undefined,
        }
      };
      
      await createDraft(postId, payload);
      
      // Refrescar campaign posts para obtener drafts actualizados
      refetchCampaignPosts();
      
      // Limpiar y cerrar modal
      setDraftTitle('');
      setDraftUrl('');
      setDraftFile(null);
      setShowDraftModal(false);
      
    } catch (err) {
      console.error('Error creating draft:', err);
      
      if (err instanceof ApiError) {
        setDraftError(err.message);
        
        if (err.body?.errors) {
          setFieldErrors(err.body.errors);
        }
      } else {
        setDraftError('Error al crear el draft');
      }
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  const handleSubmitLink = () => {
    if (linkText.trim()) {
      setLinkUploaded(true);
      setLinkStatus('approved');
      setShowLinkModal(false);
    }
  };


  // Calcular progreso basado en datos reales (sin métricas)
  const isScriptApproved = latestScript?.status === 'approved';
  const isDraftApproved = latestDraft?.status === 'approved';
  const isLinkApproved = linkStatus === 'approved';
  
  const completedCount = (isScriptApproved ? 1 : 0) + (isDraftApproved ? 1 : 0) + (isLinkApproved ? 1 : 0);
  const totalCount = 3; // Guión, Video (draft), Link
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
            {latestScript && (
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                latestScript.status === 'approved' ? 'bg-green-100 text-green-800' :
                latestScript.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {latestScript.status === 'approved' ? 'Aprobado' :
                 latestScript.status === 'rejected' ? 'Rechazado' :
                 'En revisión'}
              </span>
            )}
          </div>
          
          {latestScript ? (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/campaigns/${id}/posts/${postId}/script-history`)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver historial
              </button>
              <button 
                onClick={() => navigate(`/campaigns/${id}/posts/${postId}/scripts/${latestScript.id}`)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
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

        {/* Video (Draft) */}
        <div className={`border-2 rounded-lg p-4 ${
          latestDraft ? 'border-gray-200 bg-white' : 'border-primary-950 bg-white shadow-lg'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary-950" />
              <h3 className="font-semibold text-primary-950">Video</h3>
            </div>
            {latestDraft && getDraftStatusBadge(latestDraft.status)}
          </div>
          
          {latestDraft ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
                  <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                    {latestDraft.file_url ? (
                      <Video className="w-6 h-6 text-gray-600" />
                    ) : (
                      <LinkIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary-950">{latestDraft.title}</p>
                    <button
                      onClick={() => navigate(`/campaigns/${id}/posts/${postId}/drafts/${latestDraft.id}`)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
                
                {/* Feedback si está rechazado */}
                {latestDraft.status === 'rejected' && latestDraft.feedback && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-800 mb-1">Feedback:</p>
                    <p className="text-sm text-red-700">{latestDraft.feedback}</p>
                  </div>
                )}
                
                {/* Botón para agregar nuevo draft (solo si puede) */}
                {canAddDraft && (
                  <button 
                    onClick={() => setShowDraftModal(true)}
                    className="text-primary-950 underline hover:text-primary-700"
                  >
                    Subir nuevo video
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowDraftModal(true)}
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
        {/* <div className={`border-2 rounded-lg p-4 ${
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
        </div> */}

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

      {/* Modal para subir draft */}
      <Modal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        title="Subir Video"
      >
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                fieldErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Draft Instagram Reel 1"
            />
            {fieldErrors.title && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.title[0]}</p>
            )}
          </div>
          
          {/* Opción: Subir archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subir video
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setDraftFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {draftFile && (
                <Upload className="w-5 h-5 text-green-600" />
              )}
            </div>
            {fieldErrors.file && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.file[0]}</p>
            )}
          </div>
          
          <div className="text-center text-gray-500 text-sm">O</div>
          
          {/* Opción: URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link de la publicación
            </label>
            <input
              type="url"
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                fieldErrors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://instagram.com/p/..."
            />
            {fieldErrors.url && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.url[0]}</p>
            )}
          </div>
          
          {/* Error general */}
          {draftError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{draftError}</p>
            </div>
          )}
          
          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowDraftModal(false);
                setDraftError(null);
                setFieldErrors({});
              }}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              disabled={isSubmittingDraft}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitDraft}
              disabled={isSubmittingDraft}
              className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmittingDraft ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Subir'
              )}
            </button>
          </div>
        </div>
      </Modal>

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
