// Componente DescriptionTab - Adaptado del mobile
// Muestra la descripción completa de una campaña
import { useState } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { CampaignDetail } from '../../types/api';
import { Modal } from '../ui/Modal';

interface DescriptionTabProps {
  campaign: CampaignDetail;
}

export function DescriptionTab({ campaign }: DescriptionTabProps) {
  const [showProjectModal, setShowProjectModal] = useState(false);
  return (
    <div>
      {/* Información de la campaña */}
      <div className="flex items-center mb-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Inicio: {new Date(campaign.launch_date).toLocaleDateString('es-ES')}</span>
        <div className="mx-3 w-px h-4 bg-gray-400" />
        <Ticket className="w-4 h-4 mr-2" />
        <span>Campaña activa</span>
      </div>

      <div className="flex items-center mb-6 text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2" />
        <span>Remoto</span>
      </div>
      
      <div className="h-px bg-gray-200 mb-6" />

      {/* Precio */}
      {campaign.offer && (
        <>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-primary-950 mb-2">Pago</h3>
            <p className="text-2xl font-bold text-primary-950">
              {campaign.offer.currency} {campaign.offer.price}
            </p>
          </div>

          <div className="h-px bg-gray-200 mb-6" />
        </>
      )}

      {/* Acerca del proyecto */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-primary-950 mb-3">Acerca del proyecto</h3>
        <p className="text-primary-950 leading-6 mb-4">
          Descubre esta oportunidad de colaboración con {campaign.title}. Queremos invitarte a ser parte de esta campaña y mostrar tu creatividad...
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Mostrar más
          </button>
        </div>
      </div>

      {/* Entregables */}
      {campaign.offer?.contents && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-primary-950 mb-4">Entregables</h3>
          
          {/* Instagram */}
          {campaign.offer.contents.instagram && (
            <div className="mb-4 bg-primary-50 rounded-lg p-3">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#FF0069]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <p className="text-primary-950 font-medium">Instagram</p>
              </div>
              
              <div className="flex items-center ml-11 flex-wrap gap-3">
                {campaign.offer.contents.instagram.ig_post && (
                  <div className="flex items-center">
                    <span className="mr-1">📸</span>
                    <span className="text-sm text-primary-950">{campaign.offer.contents.instagram.ig_post}</span>
                  </div>
                )}
                {campaign.offer.contents.instagram.ig_story && (
                  <div className="flex items-center">
                    <span className="mr-1">📖</span>
                    <span className="text-sm text-primary-950">{campaign.offer.contents.instagram.ig_story}</span>
                  </div>
                )}
                {campaign.offer.contents.instagram.ig_reel && (
                  <div className="flex items-center">
                    <span className="mr-1">🎞️</span>
                    <span className="text-sm text-primary-950">{campaign.offer.contents.instagram.ig_reel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TikTok */}
          {campaign.offer.contents.tiktok && (
            <div className="mb-4 bg-primary-50 rounded-lg p-3">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-black">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <p className="text-primary-950 font-medium">TikTok</p>
              </div>
              
              <div className="flex items-center ml-11">
                {campaign.offer.contents.tiktok.tt_video && (
                  <div className="flex items-center">
                    <span className="mr-1">🎥</span>
                    <span className="text-sm text-primary-950">{campaign.offer.contents.tiktok.tt_video}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* YouTube */}
          {campaign.offer.contents.youtube && (
            <div className="mb-4 bg-primary-50 rounded-lg p-3">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#FF0000]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <p className="text-primary-950 font-medium">YouTube</p>
              </div>
              
              <div className="flex items-center ml-11">
                {campaign.offer.contents.youtube.yt_video && (
                  <div className="flex items-center">
                    <span className="mr-1">🎬</span>
                    <span className="text-sm text-primary-950">{campaign.offer.contents.youtube.yt_video}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plataformas */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-primary-950 mb-4">Plataformas</h3>
        <div className="flex flex-wrap gap-2">
          {campaign.platforms.map((platform, index) => (
            <span
              key={index}
              className="bg-primary-100 px-3 py-2 rounded-full text-sm text-primary-950"
            >
              {platform.name}
            </span>
          ))}
        </div>
      </div>

      {/* Modal de descripción completa */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Acerca del proyecto"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-primary-950 leading-6">
            Queremos invitarte a contar tu historia con {campaign.title} como parte de tu día a día. La propuesta es que muestres cómo se integra de manera natural en tu rutina, acompañando cada uno de tus momentos: desde lo cotidiano hasta esos espacios donde encontrás disfrute, relax o conexión con vos mismo y con los demás.
          </p>
          
          <p className="text-primary-950 leading-6">
            No buscamos algo forzado ni producido: queremos contenido real, cercano y con tu impronta. Que se sienta auténtico. Ya sea saliendo a caminar, yendo a trabajar, compartiendo un café con amigos, entrenando, viajando o simplemente descansando, queremos que tu audiencia lo vea y lo sienta.
          </p>
          
          <p className="text-primary-950 leading-6">
            El foco está en el lifestyle: que se vea tu estilo, tu forma de moverte por el mundo, cómo elegís y vivís. Mostranos cómo esto refleja tu personalidad, tu forma de expresarte y de habitar los espacios. Queremos destacar el diseño, comodidad y versatilidad, pero sobre todo, cómo se vuelve parte de vos.
          </p>
          
          <p className="text-primary-950 leading-6">
            Animate a mostrar tu mundo. Contá tu historia, desde lo más simple hasta lo más único. Eso es lo que queremos compartir.
          </p>
        </div>
      </Modal>
    </div>
  );
}
