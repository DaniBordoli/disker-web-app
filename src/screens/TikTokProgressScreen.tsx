// Pantalla de Progreso de TikTok
// Adaptada del mobile - Mock sin backend
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Upload, Link as LinkIcon } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

type ProgressStatus = 'pending' | 'approved' | 'rejected';

interface ProgressSection {
  id: string;
  title: string;
  status: ProgressStatus;
  description: string;
}

export function TikTokProgressScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [sections, setSections] = useState<ProgressSection[]>([
    {
      id: 'script',
      title: 'Guión',
      status: 'approved',
      description: 'Guión aprobado por la marca',
    },
    {
      id: 'video',
      title: 'Video',
      status: 'approved',
      description: 'Video aprobado',
    },
    {
      id: 'video-hd',
      title: 'Video HD',
      status: 'pending',
      description: 'Sube el video en alta calidad',
    },
    {
      id: 'link',
      title: 'Link de publicación',
      status: 'pending',
      description: 'Comparte el link de tu publicación en TikTok',
    },
    {
      id: 'metrics',
      title: 'Métricas',
      status: 'pending',
      description: 'Sube las métricas de tu video',
    },
  ]);

  const getStatusIcon = (status: ProgressStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

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

  const handleUpload = (sectionId: string) => {
    // Mock: Simular upload
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, status: 'approved' as ProgressStatus }
          : section
      )
    );
  };

  const completedCount = sections.filter(s => s.status === 'approved').length;
  const totalCount = sections.length;
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
            <h1 className="text-lg font-semibold text-primary-950">TikTok 1</h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Progreso: {completedCount}/{totalCount}
            </span>
            <span className="text-sm text-cyan-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        {/* Título con icono de plataforma */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary-950">TikTok 1 - TikTok</h2>
        </div>

        {/* Mensaje de vencimiento */}
        <div className="bg-black text-white rounded-lg p-4 mb-6">
          <p className="text-sm text-center">
            ⏰ <strong>Vence en 21 días</strong> - Completa todos los entregables antes de la fecha límite
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                section.status === 'approved'
                  ? 'border-green-200 bg-green-50'
                  : section.status === 'rejected'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(section.status)}
                  <div>
                    <h3 className="font-semibold text-primary-950">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                {getStatusBadge(section.status)}
              </div>

              {/* Acciones según estado */}
              {section.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  {(section.id === 'video-hd' || section.id === 'metrics') && (
                    <button
                      onClick={() => handleUpload(section.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">Subir archivo</span>
                    </button>
                  )}
                  {section.id === 'link' && (
                    <button
                      onClick={() => handleUpload(section.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Agregar link</span>
                    </button>
                  )}
                </div>
              )}

              {section.status === 'approved' && (
                <div className="mt-4 text-sm text-green-700">
                  ✓ Completado y aprobado
                </div>
              )}

              {section.status === 'rejected' && (
                <div className="mt-4">
                  <p className="text-sm text-red-700 mb-2">
                    ✗ Rechazado. Por favor, revisa los comentarios y vuelve a intentarlo.
                  </p>
                  <button
                    onClick={() => handleUpload(section.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Volver a subir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mensaje de finalización */}
        {completedCount === totalCount && (
          <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              ¡Contenido completado!
            </h3>
            <p className="text-green-700">
              Has completado todos los entregables de este video. La marca revisará tu trabajo.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
