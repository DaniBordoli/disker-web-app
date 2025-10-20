// Pantalla de Detalles de Propuesta (desde Explora)
// Adaptada del mobile - Sin tabs, solo información de la campaña
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Calendar, MapPin, Ticket } from 'lucide-react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';
import { Modal } from '../components/ui/Modal';

export function ProposalDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Datos mock
  const campaign = {
    id: id || '1',
    title: 'Rutina Glow',
    brandLogo: '', // Placeholder
    startDate: '20/05',
    campaignType: 'Campaña activa',
    location: 'Remoto',
    aboutProject: {
      summary: 'Queremos invitarte a contar tu historia con nuestra línea de skincare natural como parte de tu día a día...',
      fullDescription: `Queremos invitarte a contar tu historia con nuestra línea de skincare natural como parte de tu día a día. La propuesta es que muestres cómo se integra de manera natural en tu rutina, acompañando cada uno de tus momentos: desde lo cotidiano hasta esos espacios donde encontrás disfrute, relax o conexión con vos mismo y con los demás.

No buscamos algo forzado ni producido: queremos contenido real, cercano y con tu impronta. Que se sienta auténtico. Ya sea saliendo a caminar, yendo a trabajar, compartiendo un café con amigos, entrenando, viajando o simplemente descansando, queremos que tu audiencia lo vea y lo sienta.

El foco está en el lifestyle: que se vea tu estilo, tu forma de moverte por el mundo, cómo elegís y vivís. Mostranos cómo esto refleja tu personalidad, tu forma de expresarte y de habitar los espacios. Queremos destacar el diseño, comodidad y versatilidad, pero sobre todo, cómo se vuelve parte de vos.

Animate a mostrar tu mundo. Contá tu historia, desde lo más simple hasta lo más único. Eso es lo que queremos compartir.`
    },
    deliverables: [
      {
        platform: 'Instagram',
        backgroundColor: '#FF0069',
        totalCount: 4,
        items: [
          { emoji: '📸', text: '1 posteo' },
          { emoji: '🎞️', text: '1 reel' },
          { emoji: '📖', text: '2 historias' }
        ]
      },
      {
        platform: 'TikTok',
        backgroundColor: '#000000',
        totalCount: 1,
        items: [
          { emoji: '📽', text: '1 video' }
        ]
      },
      {
        platform: 'YouTube',
        backgroundColor: '#FF0000',
        totalCount: 1,
        items: [
          { emoji: '🎬', text: '1 video' }
        ]
      }
    ],
    requirements: [
      '+10K followers en IG',
      'Público principal en Argentina',
      'Audiencia: 18 a 35 años',
      'No se permite contenido político, sexual ni con referencias a otras marcas'
    ],
    termsAndConditions: 'El contenido debe permanecer publicado por al menos 30 días.',
    categories: ['Belleza', 'Skincare', 'Lifestyle'],
    price: '350',
    currency: 'USD',
    warningMessage: 'Se piden métricas de redes'
  };

  // Detectar scroll para sticky header
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApply = () => {
    navigate('/audience-stats');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 transition-all duration-300 ${
          showStickyHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-primary-950">{campaign.title}</h2>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-violet-600 pb-6">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* White Content Area */}
      <div className="container mx-auto px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-t-3xl shadow-lg">
          {/* Campaign Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-violet-700">
                  {campaign.title[0]}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-primary-950">{campaign.title}</h1>
                <p className="text-sm text-gray-500">ID: #{campaign.id}</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Inicio: {campaign.startDate}</span>
              </div>
              <div className="flex items-center">
                <Ticket className="w-4 h-4 mr-2" />
                <span>{campaign.campaignType}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{campaign.location}</span>
              </div>
            </div>
          </div>

          {/* About Project */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-primary-950 mb-3">Acerca del proyecto</h3>
            <p className="text-primary-950 leading-6 mb-4">
              {campaign.aboutProject.summary}
            </p>
            <button
              onClick={() => setShowProjectModal(true)}
              className="text-violet-700 font-medium text-sm underline hover:text-violet-800"
            >
              Mostrar más
            </button>
          </div>

          {/* Deliverables */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-primary-950 mb-4">Entregables</h3>
            <div className="space-y-4">
              {campaign.deliverables.map((deliverable, index) => (
                <div key={index} className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: deliverable.backgroundColor }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                        {deliverable.platform === 'Instagram' && (
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        )}
                        {deliverable.platform === 'TikTok' && (
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        )}
                        {deliverable.platform === 'YouTube' && (
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary-950">{deliverable.platform}</p>
                      <p className="text-sm text-gray-500">{deliverable.totalCount} entregables</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {deliverable.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-primary-950">
                        {item.emoji} {item.text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-primary-950 mb-3">Requisitos</h3>
            <ul className="space-y-2">
              {campaign.requirements.map((req, index) => (
                <li key={index} className="flex items-start text-sm text-primary-950">
                  <span className="mr-2">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-primary-950 mb-3">Términos y condiciones</h3>
            <p className="text-sm text-primary-950 leading-6">{campaign.termsAndConditions}</p>
          </div>

          {/* Categories */}
          <div className="p-6 pb-32">
            <h3 className="text-sm font-semibold text-primary-950 mb-3">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {campaign.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-primary-100 px-3 py-2 rounded-full text-sm text-primary-950"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-950">
              ${campaign.price} {campaign.currency}
            </p>
            {campaign.warningMessage && (
              <p className="text-xs text-orange-600 mt-1">⚠️ {campaign.warningMessage}</p>
            )}
          </div>
          <button
            onClick={handleApply}
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Postularme
          </button>
        </div>
      </div>

      {/* Modal de proyecto completo */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Acerca del proyecto"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {campaign.aboutProject.fullDescription.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-primary-950 leading-6">
              {paragraph}
            </p>
          ))}
        </div>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
