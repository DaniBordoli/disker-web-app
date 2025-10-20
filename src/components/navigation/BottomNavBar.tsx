// Componente BottomNavBar
// Adaptado del mobile para web
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Megaphone, Sparkles, MessageCircle, User } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
}

export function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Explora',
      icon: <Compass className="w-6 h-6" />,
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      label: 'Campañas',
      icon: <Megaphone className="w-6 h-6" />,
      path: '/my-campaigns',
      isActive: location.pathname === '/my-campaigns',
    },
    {
      label: 'Hera',
      icon: <Sparkles className="w-6 h-6" />,
      path: '/hera',
      isActive: location.pathname === '/hera',
    },
    {
      label: 'Mensajes',
      icon: <MessageCircle className="w-6 h-6" />,
      path: '/messages',
      isActive: location.pathname === '/messages',
    },
    {
      label: 'Perfil',
      icon: <User className="w-6 h-6" />,
      path: '/profile',
      isActive: location.pathname === '/profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 pt-2 pb-4 px-4 z-50">
      <div className="flex justify-around items-center max-w-screen-lg mx-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
          >
            <div
              className={`mb-1 ${
                item.isActive ? 'text-black' : 'text-primary-500'
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`text-xs ${
                item.isActive ? 'text-black font-medium' : 'text-primary-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
