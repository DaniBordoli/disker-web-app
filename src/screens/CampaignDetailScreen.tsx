// Pantalla de Detalle de Campaña
// Adaptada del mobile con diseño completo
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaignDetail } from '../services/campaigns';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { ProgressTab } from '../components/campaign/ProgressTab';
import { DescriptionTab } from '../components/campaign/DescriptionTab';
import { ArrowLeft, Share2, Loader } from 'lucide-react';

type TabType = 'Progreso' | 'Descripción';

export function CampaignDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('Descripción');
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaignDetail(Number(id)),
    enabled: !!id,
    retry: false, // No reintentar si falla
  });

  // Datos mock para cuando no hay endpoint
  const mockCampaign = {
    id: Number(id) || 1,
    title: 'Rutina Glow',
    status: 'active',
    launch_date: '2025-05-20T00:00:00Z',
    image_url: '',
    platforms: [
      { name: 'Instagram', short_name: 'IG' },
      { name: 'TikTok', short_name: 'TT' },
      { name: 'YouTube', short_name: 'YT' }
    ],
    offer: {
      price: 350,
      currency: 'USD',
      contents: {
        instagram: {
          ig_post: '1',
          ig_story: '2',
          ig_reel: '1'
        },
        tiktok: {
          tt_video: '1'
        },
        youtube: {
          yt_video: '1'
        }
      }
    },
    created_at: '2025-05-20T00:00:00Z'
  };

  // Usar datos del endpoint si están disponibles, sino usar mock
  const campaign = data?.data?.campaign || mockCampaign;

  // Detectar scroll para sticky header
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-violet-600 mx-auto" />
          <p className="mt-4 text-primary-600">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  // Ya no mostramos error, siempre usamos mock si falla

  return (
    <div className="min-h-screen bg-violet-600 pb-24">
      {/* Sticky Header - Aparece al hacer scroll */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 transition-all duration-300 ${
          showStickyHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 mx-4">
            <h2 className="font-semibold text-primary-950 truncate">{campaign.title}</h2>
            <p className="text-sm text-gray-500">ID: #{campaign.id}</p>
          </div>
          
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header violeta */}
      <div className="bg-violet-600 pb-6 relative">
        <div className="container mx-auto px-6 pt-4 pb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenido principal con fondo blanco redondeado */}
      <div className="bg-white rounded-t-3xl -mt-10 relative z-10">
        <main className="container mx-auto px-6 py-6 max-w-4xl">
          {/* Header de campaña */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">{campaign.title[0]}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-primary-950">{campaign.title}</h1>
                  <p className="text-sm text-gray-500">ID: #{campaign.id}</p>
                </div>
              </div>
              
              {/* Iconos de plataformas superpuestos */}
              <div className="flex items-center">
                {campaign.platforms.slice(0, 2).map((platform, idx) => {
                  const bgColor = platform.name.toLowerCase().includes('instagram') 
                    ? '#FF0069' 
                    : platform.name.toLowerCase().includes('tiktok')
                    ? '#000000'
                    : '#FF0000';
                  
                  return (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: bgColor,
                        marginLeft: idx > 0 ? '-8px' : '0',
                        zIndex: campaign.platforms.length - idx,
                      }}
                    >
                      {platform.name.toLowerCase().includes('instagram') && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {platform.name.toLowerCase().includes('tiktok') && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      )}
                      {platform.name.toLowerCase().includes('youtube') && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('Progreso')}
                className={`flex-1 pb-3 border-b-2 transition-colors ${
                  activeTab === 'Progreso'
                    ? 'border-primary-950 text-primary-950'
                    : 'border-transparent text-gray-500'
                }`}
              >
                <span className="font-medium">Progreso</span>
              </button>
              <button
                onClick={() => setActiveTab('Descripción')}
                className={`flex-1 pb-3 border-b-2 transition-colors ${
                  activeTab === 'Descripción'
                    ? 'border-primary-950 text-primary-950'
                    : 'border-transparent text-gray-500'
                }`}
              >
                <span className="font-medium">Descripción</span>
              </button>
            </div>

            {/* Contenido según tab activo */}
            {activeTab === 'Progreso' ? (
              <ProgressTab />
            ) : (
              <DescriptionTab campaign={campaign} />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
