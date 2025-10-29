// Pantalla de Agregar/Editar Guión
// Adaptada del mobile
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { createScript } from '../services/scripts';
import type { CreateScriptRequest } from '../types/api';
import { ApiError } from '../types/api';

export function AddScriptScreen() {
  const navigate = useNavigate();
  const { id, postId } = useParams();
  const [title, setTitle] = useState('Hola a todos 👋');
  const [scriptText, setScriptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{title?: string[], content?: string[]}>({});

  const handleSubmit = async () => {
    if (!postId) return;
    
    // Reset errors
    setError(null);
    setFieldErrors({});
    
    // Validación básica
    if (!title.trim()) {
      setFieldErrors({ title: ["can't be blank"] });
      return;
    }
    if (!scriptText.trim()) {
      setFieldErrors({ content: ["can't be blank"] });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const payload: CreateScriptRequest = {
        script: {
          title: title.trim(),
          content: scriptText.trim()
        }
      };
      
      // Usar el postId de la URL como campaign_post_id
      const response = await createScript(postId, payload);
      
      console.log('Script creado exitosamente:', response.data.script);
      
      // Guardar en localStorage que el guión fue enviado
      localStorage.setItem('scriptSubmitted', 'true');
      
      // Determinar la ruta de regreso (por ahora asumimos instagram, podría venir de un state)
      navigate(`/campaigns/${id}/posts/${postId}/instagram-progress`);
      
    } catch (err) {
      console.error('Error creating script:', err);
      
      if (err instanceof ApiError) {
        setError(err.message);
        
        // Si hay errores de validación específicos
        if (err.body?.errors) {
          setFieldErrors(err.body.errors);
        }
      } else {
        setError('Error al enviar el guión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-primary-950">Guión</h1>
              <p className="text-sm text-gray-500">Última edición hace 4 min</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-6 max-w-4xl flex flex-col">
        {/* Título del guión */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del guión
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full text-xl font-bold text-primary-950 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              fieldErrors.title ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Título del guión"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.title.join(', ')}
            </p>
          )}
        </div>

        {/* Textarea para el guión */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido del guión
          </label>
          <textarea
            className={`flex-1 text-primary-950 text-base leading-6 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none ${
              fieldErrors.content ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Hoy les quiero contar una noticia que nos tiene muy emocionados. Después de meses de trabajo, finalmente llegó el momento de mostrarles lo que preparamos.\n\nEsta app está pensada para simplificarles el día a día: con un solo clic van a poder organizar sus tareas, conectarse con sus amigos y además..."
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            style={{ minHeight: '400px' }}
          />
          {fieldErrors.content && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.content.join(', ')}
            </p>
          )}
        </div>

        {/* Error general */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Botón de enviar */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !scriptText.trim()}
            className={`w-full py-4 rounded-xl font-medium transition-colors flex items-center justify-center ${
              isLoading || !title.trim() || !scriptText.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar guión'
            )}
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
