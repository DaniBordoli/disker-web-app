// Pantalla de Mis Campañas
// Adaptada del mobile - Usa getCampaigns con scope
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns, type CampaignScope } from '../services/campaigns';
import { CampaignCard } from '../components/cards/CampaignCard';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Filter } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

type TabType = 'active' | 'applied' | 'finished';

export function MyCampaignsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('Más reciente');
  
  const orderOptions = [
    'Más reciente',
    'Fecha de inicio',
    'Fecha de cierre',
    'Mayor pago',
    'Menor pago',
    'Nombre (A–Z)'
  ];

  // Obtener campañas según el tab activo (como en mobile)
  const { data, isLoading, error } = useQuery({
    queryKey: ['campaigns', activeTab],
    queryFn: () => getCampaigns(activeTab as CampaignScope),
  });

  const campaigns = data?.data?.campaigns || [];

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'active':
        return 'Activas';
      case 'applied':
        return 'Mis postulaciones';
      case 'finished':
        return 'Finalizadas';
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-primary-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-950 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Inicio</span>
            </button>
            <h1 className="text-xl font-bold text-primary-950">Mis Campañas</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Tabs - Como en mobile */}
      <div className="bg-white border-b border-primary-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto py-4">
            {(['active', 'applied', 'finished'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-6 max-w-2xl">
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-primary-600">Cargando campañas...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">😕</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error al cargar campañas
            </h3>
            <p className="text-red-700 mb-4">{(error as Error).message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-primary-600">
              No hay campañas {getTabLabel(activeTab).toLowerCase()}
            </p>
          </div>
        )}

        {/* Campaigns List */}
        {!isLoading && !error && campaigns.length > 0 && (
          <div>
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                {...campaign}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Botón de filtros flotante */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center z-40">
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 bg-primary-950 text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary-900 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
        </button>
      </div>

      {/* Modal de filtros */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Ordenar campañas"
      >
        <div className="space-y-6">
          {/* Opciones de ordenamiento */}
          <div className="flex flex-wrap gap-2">
            {orderOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOrder(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedOrder === option
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Botón aplicar */}
          <button
            onClick={() => {
              // TODO: Implementar lógica de ordenamiento
              console.log('Ordenar por:', selectedOrder);
              setShowFilterModal(false);
            }}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
