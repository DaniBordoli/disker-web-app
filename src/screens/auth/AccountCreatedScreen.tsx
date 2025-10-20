// Pantalla de Cuenta Creada - Success
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function AccountCreatedScreen() {
  const navigate = useNavigate();

  // Auto-redirect después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-primary-950 mb-4">
          ¡Cuenta creada!
        </h1>
        <p className="text-lg text-primary-600 mb-8">
          Tu perfil está listo. Ahora puedes empezar a explorar campañas y conectar con marcas.
        </p>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6 mb-8 text-left">
          <h2 className="font-semibold text-primary-950 mb-4">
            ¿Qué puedes hacer ahora?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-violet-600 mt-0.5">✓</span>
              <span className="text-sm text-primary-700">
                Explorar campañas activas de marcas reales
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-600 mt-0.5">✓</span>
              <span className="text-sm text-primary-700">
                Aplicar a oportunidades que se ajusten a tu perfil
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-600 mt-0.5">✓</span>
              <span className="text-sm text-primary-700">
                Vincular tus redes sociales para mostrar tu alcance
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-600 mt-0.5">✓</span>
              <span className="text-sm text-primary-700">
                Conectar con marcas y empezar a generar ingresos
              </span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          variant="dark"
          fullWidth
          onClick={() => navigate('/')}
          className="mb-4"
        >
          Explorar campañas
        </Button>

        <p className="text-sm text-primary-500">
          Serás redirigido automáticamente en 5 segundos...
        </p>
      </div>
    </div>
  );
}
