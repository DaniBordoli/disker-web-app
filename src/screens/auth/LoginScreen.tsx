// Pantalla de Login - Adaptada del mobile
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { loginSession } from '../../services/auth';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginSession({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-950 mb-2">Disker</h1>
          <p className="text-lg text-primary-600">
            La plataforma para creadores con marcas reales
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-primary-500">O continúa con</span>
          </div>
        </div>

        {/* Google Login - TODO: Implementar */}
        <Button variant="light" fullWidth disabled>
          <div className="flex items-center justify-center gap-2">
            <span>🔍</span>
            <span>Continuar con Google</span>
          </div>
        </Button>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-primary-600">
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Crear cuenta gratis
          </button>
        </p>
      </div>
    </div>
  );
}
