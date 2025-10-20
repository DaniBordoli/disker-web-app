// Pantalla de Mensajes
// Placeholder - Pendiente de implementación
import { useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { MessageCircle } from 'lucide-react';

export function MessagesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="border-b border-primary-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-950 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-xl font-bold text-primary-950">Mensajes</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-12 h-12 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-950 mb-3">
            Mensajes
          </h2>
          <p className="text-primary-600 mb-6 max-w-md">
            Próximamente podrás comunicarte directamente con las marcas y gestionar 
            todas tus conversaciones desde aquí.
          </p>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 max-w-md">
            <p className="text-sm text-violet-800">
              💡 <strong>Próximamente:</strong> Chat en tiempo real, notificaciones, 
              historial de conversaciones y más.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
