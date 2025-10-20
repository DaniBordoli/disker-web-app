// Componente CampaignCard
// Adaptado del mobile para web
import { Instagram, Youtube } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

interface CampaignCardProps {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  status: string;
  platforms: Array<{ name: string }>;
  offer?: {
    payment?: {
      amount?: number;
      currency?: string;
    };
  };
  created_at: string;
  onClick: () => void;
  actionLabel?: string; // Ej: "Cierra esta semana", "En revisión", "En progreso"
  actionColor?: string; // Color de fondo del botón de acción
  brandLogo?: string; // Logo de la marca
}

export function CampaignCard({
  title,
  description,
  platforms,
  offer,
  created_at,
  onClick,
  actionLabel = 'Ver detalles',
  actionColor = '#F3E7FF',
  brandLogo,
}: CampaignCardProps) {
  // Mapear plataformas a iconos
  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes('instagram')) {
      return <Instagram className="w-4 h-4 text-white" />;
    }
    if (name.includes('youtube')) {
      return <Youtube className="w-4 h-4 text-white" />;
    }
    if (name.includes('tiktok')) {
      return <SiTiktok className="w-4 h-4 text-white" />;
    }
    return null;
  };

  const getPlatformColor = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes('instagram')) return '#E1306C';
    if (name.includes('youtube')) return '#FF0000';
    if (name.includes('tiktok')) return '#000000';
    return '#6B7280';
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 mb-4 border border-primary-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header - Brand y Plataformas */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={title}
              className="w-8 h-8 rounded-full mr-2 object-contain"
            />
          ) : (
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-medium text-violet-700">
                {title[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <h3 className="font-medium text-black text-sm">{title}</h3>
        </div>
        
        {/* Iconos de plataformas superpuestos */}
        <div className="flex items-center">
          {platforms.slice(0, 3).map((platform, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: getPlatformColor(platform.name),
                marginLeft: index > 0 ? '-8px' : '0',
                zIndex: platforms.length - index,
              }}
            >
              {getPlatformIcon(platform.name)}
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-700 text-sm mb-4 leading-5 line-clamp-2">
        {description || 'Descubre esta oportunidad de colaboración'}
      </p>

      {/* Información - Fecha y Tipo */}
      <div className="flex items-center mb-2 text-xs text-primary-950">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Inicio: {formatDate(created_at)}</span>
        
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
        
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span>Campaña activa</span>
      </div>

      {/* Ubicación */}
      <div className="flex items-center mb-4 text-xs text-primary-950">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Remoto</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-primary-200 mb-4" />

      {/* Footer - Monto y Acción */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-black">
          {offer?.payment?.amount ? (
            <>
              ${offer.payment.amount} {offer.payment.currency || 'USD'}
            </>
          ) : (
            'A convenir'
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: actionColor }}
        >
          <span className="text-violet-800 font-medium text-sm">{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
