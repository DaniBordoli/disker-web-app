// Componente ProgressTab - Adaptado del mobile
// Muestra el progreso de los entregables de una campaña
import { useNavigate, useParams } from 'react-router-dom';

export function ProgressTab() {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div>
      {/* Estado de postulación */}
      <div className="mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-primary-950 font-medium">Postulación</p>
            <span className="bg-green-100 px-3 py-1 rounded-lg text-sm text-green-800 font-medium">
              Aceptado
            </span>
          </div>
          <button className="text-primary-950 underline hover:text-primary-700">
            Ver postulación
          </button>
        </div>
      </div>

      {/* Entregables con progreso */}
      <div className="mb-6 space-y-4">
        {/* Instagram Reel */}
        <div className="border-2 border-primary-950 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#FF0069]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-primary-950 font-medium">Reel 1</p>
              <p className="text-sm text-gray-500">Vence en 15 días</p>
            </div>
            <span className="bg-purple-100 px-3 py-1 rounded text-sm text-purple-700 font-medium">
              En progreso
            </span>
          </div>
          
          {/* Barras de progreso */}
          <div className="mb-4 flex gap-1">
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-100 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-100 rounded-full w-[62px]" />
          </div>
          
          <button
            onClick={() => navigate(`/campaigns/${id}/instagram-progress`)}
            className="text-primary-950 underline hover:text-primary-700"
          >
            Completar contenido
          </button>
        </div>

        {/* TikTok */}
        <div className="border-2 border-primary-950 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-black">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-primary-950 font-medium">TikTok 1</p>
              <p className="text-sm text-gray-500">Vence en 21 días</p>
            </div>
            <span className="bg-purple-100 px-3 py-1 rounded text-sm text-purple-700 font-medium">
              En progreso
            </span>
          </div>
          
          {/* Barras de progreso */}
          <div className="mb-4 flex gap-1">
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-400 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-100 rounded-full w-[62px]" />
            <div className="h-1 bg-violet-100 rounded-full w-[62px]" />
          </div>
          
          <button
            onClick={() => navigate(`/campaigns/${id}/tiktok-progress`)}
            className="text-primary-950 underline hover:text-primary-700"
          >
            Completar contenido
          </button>
        </div>

        {/* Finalizado */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 font-medium">Finalizado</p>
        </div>
      </div>
    </div>
  );
}
