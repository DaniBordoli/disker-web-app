// Pantalla de Historial de Guiones
// Adaptada del mobile
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

type ScriptStatus = 'approved' | 'pending' | 'rejected';

interface ScriptItem {
  id: string;
  status: ScriptStatus;
  title: string;
  date: string;
  hasMessage?: boolean;
}

const scriptItems: ScriptItem[] = [
  {
    id: '1',
    status: 'approved',
    title: 'Propuesta aprobada',
    date: '15 de mayo'
  },
  {
    id: '2',
    status: 'pending',
    title: 'Propuesta pendiente',
    date: '15 de mayo'
  },
  {
    id: '3',
    status: 'rejected',
    title: 'Propuesta rechazada',
    date: '13 de mayo',
    hasMessage: true
  }
];

const getStatusConfig = (status: ScriptStatus) => {
  switch (status) {
    case 'approved':
      return {
        bgColor: 'bg-green-100',
        iconColor: 'text-green-800',
        textColor: 'text-green-700'
      };
    case 'pending':
      return {
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-800',
        textColor: 'text-violet-700'
      };
    case 'rejected':
      return {
        bgColor: 'bg-red-100',
        iconColor: 'text-red-800',
        textColor: 'text-red-700'
      };
  }
};

export function ScriptHistoryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleItemPress = (item: ScriptItem) => {
    // Mock: Navegar a detalle del guión según estado
    console.log('Ver guión:', item);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(`/campaigns/${id}/instagram-progress`)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-2xl font-bold text-primary-950 ml-2">
            Historial de guiones
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {scriptItems.map((item) => {
            const config = getStatusConfig(item.status);
            
            return (
              <div
                key={item.id}
                onClick={() => handleItemPress(item)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {/* Icono con fondo de color */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${config.bgColor}`}>
                  <FileText className={`w-6 h-6 ${config.iconColor}`} />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <p className={`font-semibold mb-1 ${config.textColor}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>

                {/* Ver mensaje si existe */}
                {item.hasMessage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Ver mensaje');
                    }}
                    className="ml-3 text-sm text-blue-600 underline hover:text-blue-700"
                  >
                    Ver mensaje
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
