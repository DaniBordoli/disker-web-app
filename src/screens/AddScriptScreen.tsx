// Pantalla de Agregar/Editar Guión
// Adaptada del mobile
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

export function AddScriptScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scriptText, setScriptText] = useState('');

  const handleSubmit = () => {
    // Mock: Simular envío y marcar como enviado
    console.log('Guión enviado:', scriptText);
    
    // Guardar en localStorage que el guión fue enviado
    localStorage.setItem('scriptSubmitted', 'true');
    
    navigate(`/campaigns/${id}/instagram-progress`);
  };

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/campaigns/${id}/instagram-progress`)}
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
          <h2 className="text-2xl font-bold text-primary-950">Hola a todos 👋</h2>
        </div>

        {/* Textarea para el guión */}
        <textarea
          className="flex-1 text-primary-950 text-base leading-6 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          placeholder="Hoy les quiero contar una noticia que nos tiene muy emocionados. Después de meses de trabajo, finalmente llegó el momento de mostrarles lo que preparamos.

Esta app está pensada para simplificarles el día a día: con un solo clic van a poder organizar sus tareas, conectarse con sus amigos y además..."
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          style={{ minHeight: '400px' }}
        />

        {/* Botón de enviar */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Enviar guión
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
