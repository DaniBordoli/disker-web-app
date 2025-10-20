// Pantalla Home - Feed de campañas
import { useNavigate } from 'react-router-dom';
import { CampaignCard } from '../components/cards/CampaignCard';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Filter } from 'lucide-react';
import headerGradient from '../assets/header-gradient.svg';

// Datos mock como en el mobile
const mockCampaigns = [
  {
    id: 1,
    title: 'Rutina Glow',
    description: 'Contá tu experiencia con nuestra línea de skincare natural.',
    image_url: '',
    status: 'active',
    platforms: [
      { name: 'Instagram' },
      { name: 'TikTok' },
      { name: 'YouTube' }
    ],
    offer: {
      payment: {
        amount: 350,
        currency: 'USD'
      }
    },
    created_at: '2025-05-20T00:00:00Z'
  },
  {
    id: 2,
    title: 'Run With Me',
    description: 'Mostrá cómo usás tus zapatillas Nike en tu día a día.',
    image_url: '',
    status: 'active',
    platforms: [
      { name: 'Instagram' },
      { name: 'TikTok' }
    ],
    offer: {
      payment: {
        amount: 300,
        currency: 'USD'
      }
    },
    created_at: '2025-05-17T00:00:00Z'
  },
  {
    id: 3,
    title: 'Movete con estilo by Stay Fresh',
    description: 'Presentá tu outfit urbano favorito con la nueva colección SS24.',
    image_url: '',
    status: 'active',
    platforms: [
      { name: 'YouTube' }
    ],
    offer: {
      payment: {
        amount: 500,
        currency: 'USD'
      }
    },
    created_at: '2025-05-15T00:00:00Z'
  }
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header con gradiente */}
      <div className="relative">
        <img
          src={headerGradient}
          alt="Header"
          className="w-full h-48 object-cover rounded-b-2xl"
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 relative">
        {/* Campaigns List - Mock data */}
        <div className="max-w-2xl mx-auto">
          {mockCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
              actionLabel="Cierra esta semana"
              actionColor="#F3E7FF"
              onClick={() => navigate(`/proposals/${campaign.id}`)}
            />
          ))}
        </div>
      </main>

      {/* Botón de filtros flotante */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center z-40">
        <button
          onClick={() => console.log('Filtros - Pendiente de implementación')}
          className="flex items-center gap-2 bg-primary-950 text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary-900 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
