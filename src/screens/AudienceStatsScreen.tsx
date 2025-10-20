// Pantalla de Estadísticas de Audiencia
// Adaptada del mobile - Para postularse a una campaña
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Modal } from '../components/ui/Modal';

interface FileUpload {
  name: string;
  size: number;
  progress: number;
  uploading: boolean;
  uri: string;
  completed: boolean;
}

export function AudienceStatsScreen() {
  const navigate = useNavigate();
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [igFile, setIgFile] = useState<FileUpload | null>(null);
  const [ttFile, setTtFile] = useState<FileUpload | null>(null);

  const handleUpload = (type: 'ig' | 'tt') => {
    const simulatedImages = [
      'https://picsum.photos/300/400?random=1',
      'https://picsum.photos/300/400?random=2',
      'https://picsum.photos/300/400?random=3',
    ];
    const randomImage = simulatedImages[Math.floor(Math.random() * simulatedImages.length)];
    const fakeFile = {
      name: 'Estadisticas.jpg',
      size: Math.floor(Math.random() * 3 + 2) * 1024 * 1024,
      progress: 0,
      uploading: true,
      uri: randomImage,
      completed: false,
    };

    if (type === 'ig') setIgFile(fakeFile);
    else setTtFile(fakeFile);

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 15 + 5);
      if (prog >= 100) {
        prog = 100;
        if (type === 'ig') {
          setIgFile(f => f && { ...f, progress: 100, uploading: false, completed: true });
        } else {
          setTtFile(f => f && { ...f, progress: 100, uploading: false, completed: true });
        }
        clearInterval(interval);
      } else {
        if (type === 'ig') {
          setIgFile(f => f && { ...f, progress: prog });
        } else {
          setTtFile(f => f && { ...f, progress: prog });
        }
      }
    }, 200);
  };

  const handleRemove = (type: 'ig' | 'tt') => {
    if (type === 'ig') setIgFile(null);
    else setTtFile(null);
  };

  const handleSubmit = () => {
    console.log('Estadísticas enviadas');
    // TODO: Navegar a la siguiente pantalla o mostrar confirmación
    navigate('/');
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canSubmit = igFile?.completed || ttFile?.completed;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-primary-950 mb-2">
          Subí tus estadísticas de audiencia
        </h1>
        <p className="text-primary-950 mb-4 leading-6">
          Antes de postularte, necesitamos que compartas información sobre tu audiencia en redes. Subí capturas de tus estadísticas.
        </p>
        <button
          onClick={() => setShowWhyModal(true)}
          className="text-primary-950 underline mb-8 hover:text-primary-700"
        >
          ¿Por qué te pedimos esto?
        </button>

        {/* Instagram */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-7 h-7 rounded-full bg-[#FF0069] flex items-center justify-center mr-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h2 className="text-base font-semibold text-primary-950">Instagram</h2>
          </div>

          {igFile ? (
            <div className="mb-3">
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 mb-2">
                {igFile.uri ? (
                  <img
                    src={igFile.uri}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl mr-3 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mr-3" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-950">{igFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(igFile.size)}</p>
                </div>
                {igFile.completed && (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                )}
                <button
                  onClick={() => handleRemove('ig')}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {igFile.uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${igFile.progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleUpload('ig')}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-violet-400 hover:bg-violet-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-950">Subir estadísticas</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
            </button>
          )}

          <button
            onClick={() => setShowHowModal(true)}
            className="text-sm text-primary-950 underline mt-2 hover:text-primary-700"
          >
            ¿Cómo obtengo mis estadísticas?
          </button>
        </div>

        {/* TikTok */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <h2 className="text-base font-semibold text-primary-950">TikTok</h2>
          </div>

          {ttFile ? (
            <div className="mb-3">
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 mb-2">
                {ttFile.uri ? (
                  <img
                    src={ttFile.uri}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl mr-3 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mr-3" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-950">{ttFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(ttFile.size)}</p>
                </div>
                {ttFile.completed && (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                )}
                <button
                  onClick={() => handleRemove('tt')}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {ttFile.uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ttFile.progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleUpload('tt')}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-violet-400 hover:bg-violet-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-950">Subir estadísticas</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
            </button>
          )}

          <button
            onClick={() => setShowHowModal(true)}
            className="text-sm text-primary-950 underline mt-2 hover:text-primary-700"
          >
            ¿Cómo obtengo mis estadísticas?
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            canSubmit
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </main>

      {/* Modal: ¿Por qué? */}
      <Modal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="¿Por qué te pedimos esto?"
      >
        <div className="space-y-4">
          <p className="text-primary-950 leading-6">
            Las marcas necesitan conocer tu audiencia para asegurarse de que tu perfil se alinea con sus objetivos de campaña.
          </p>
          <p className="text-primary-950 leading-6">
            Tus estadísticas nos ayudan a conectarte con las campañas más relevantes para ti y tu comunidad.
          </p>
          <p className="text-primary-950 leading-6">
            <strong>Tu información es confidencial</strong> y solo se comparte con las marcas cuando aplicas a sus campañas.
          </p>
        </div>
      </Modal>

      {/* Modal: ¿Cómo obtengo? */}
      <Modal
        isOpen={showHowModal}
        onClose={() => setShowHowModal(false)}
        title="¿Cómo obtengo mis estadísticas?"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-950 mb-2">Instagram:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-primary-950">
              <li>Ve a tu perfil</li>
              <li>Toca el menú (tres líneas)</li>
              <li>Selecciona "Estadísticas"</li>
              <li>Toma capturas de "Audiencia"</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-primary-950 mb-2">TikTok:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-primary-950">
              <li>Ve a tu perfil</li>
              <li>Toca el menú (tres líneas)</li>
              <li>Selecciona "Herramientas para creadores"</li>
              <li>Toca "Análisis"</li>
              <li>Toma capturas de "Seguidores"</li>
            </ol>
          </div>
        </div>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
