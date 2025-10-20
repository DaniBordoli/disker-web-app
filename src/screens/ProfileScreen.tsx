// Pantalla de Perfil de Usuario
// Adaptada del mobile
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getCurrentUser } from '../services/user';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Bell, User, CreditCard, Megaphone, Gift, FileText, HelpCircle, ChevronRight, AlertCircle } from 'lucide-react';

export function ProfileScreen() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);

  // Obtener datos completos del usuario
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: getCurrentUser,
  });

  const user = userData?.data?.user;

  // Construir nombre completo
  const fullName = (() => {
    const fn = (user?.first_name || '').trim();
    const ln = (user?.last_name || '').trim();
    const combined = `${fn} ${ln}`.trim();
    if (combined.length > 0) return combined;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  })();

  const displayEmail = user?.email || '';

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-primary-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Content */}
      <main className="container mx-auto px-6 pt-10 pb-4 max-w-2xl">
        {/* Header con notificaciones */}
        <div className="flex justify-end mb-2">
          <button className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center hover:bg-gray-50">
            <Bell className="w-6 h-6 text-primary-950" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-primary-950 mb-6">Perfil</h1>

        {/* Profile Info */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-primary-950" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black mb-1">{fullName}</h2>
            <p className="text-base text-primary-600">{displayEmail}</p>
          </div>
        </div>

        {/* Verification Banner */}
        <div className="bg-yellow-50 border-l-4 border-[#FFD600] rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 text-yellow-700 mb-2" />
          <div className="flex items-center mb-1">
            <p className="text-yellow-700 font-semibold">Activá tu cuenta bancaria</p>
          </div>
          <p className="text-primary-950 text-sm mb-2">
            Verificá tu cuenta para poder cobrar sin demoras.
          </p>
          <button className="text-primary-950 font-medium text-base underline">
            Verificar ahora
          </button>
        </div>

        {/* Mi cuenta */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">Mi cuenta</h3>
        <div className="bg-white rounded-xl mb-4">
          <button
            onClick={() => navigate('/profile/edit')}
            className="flex items-center w-full py-4 border-b border-primary-100 hover:bg-gray-50"
          >
            <User className="w-5 h-5 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Información personal</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
          <button className="flex items-center w-full py-4 border-b border-primary-100 hover:bg-gray-50">
            <CreditCard className="w-5 h-5 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Forma de cobro</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
          <button
            onClick={() => navigate('/profile/social')}
            className="flex items-center w-full py-4 hover:bg-gray-50"
          >
            <Megaphone className="w-5 h-5 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Redes sociales</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
        </div>

        {/* Preferencias */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">Preferencias</h3>
        <div className="bg-white rounded-xl mb-4">
          <button className="flex items-center w-full py-4 hover:bg-gray-50">
            <Bell className="w-5 h-6 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Notificaciones</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
        </div>

        {/* Beneficios y comunidad */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">Beneficios y comunidad</h3>
        <div className="bg-white rounded-xl mb-4">
          <button className="flex items-center w-full py-4 hover:bg-gray-50">
            <Gift className="w-5 h-5 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Referí y ganá</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
        </div>

        {/* Soporte y legales */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">Soporte y legales</h3>
        <div className="bg-white rounded-xl mb-4">
          <button className="flex items-center w-full py-4 border-b border-primary-100 hover:bg-gray-50">
            <FileText className="w-5 h-6 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Términos y condiciones</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
          <button className="flex items-center w-full py-4 hover:bg-gray-50">
            <HelpCircle className="w-5 h-5 mr-3 text-primary-950" />
            <span className="flex-1 text-base text-gray-900 text-left">Centro de ayuda</span>
            <ChevronRight className="w-7 h-7 text-primary-950" />
          </button>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="mb-8 text-primary-950 font-medium text-base underline hover:text-primary-700"
        >
          Cerrar sesión
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
