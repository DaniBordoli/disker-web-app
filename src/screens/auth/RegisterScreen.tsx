// Pantalla de Registro - Paso 1: Email
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { registerUserStep1 } from '../../services/user';

export function RegisterScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: () => registerUserStep1({ user: { email } }),
    onSuccess: (data) => {
      const userId = data?.data?.user?.id;
      toast.success('¡Registro iniciado! Revisa tu email para confirmar.');
      // Navegar a verificación con el userId
      navigate(`/register/verify?email=${encodeURIComponent(email)}&userId=${userId}`);
    },
    onError: (error: any) => {
      const message = error.message || 'Error al registrar usuario';
      setError(message);
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-950 mb-2">Crear cuenta</h1>
          <p className="text-lg text-primary-600">
            Únete a Disker y conecta con marcas reales
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creando cuenta...' : 'Continuar'}
          </Button>
        </form>

        {/* Términos */}
        <p className="mt-6 text-center text-sm text-primary-600">
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="font-medium text-violet-600 hover:text-violet-700">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="font-medium text-violet-600 hover:text-violet-700">
            Política de Privacidad
          </a>
        </p>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-primary-500">O continúa con</span>
          </div>
        </div>

        {/* Google Sign Up */}
        <Button variant="light" fullWidth disabled>
          <div className="flex items-center justify-center gap-2">
            <span>🔍</span>
            <span>Registrarse con Google</span>
          </div>
        </Button>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-primary-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
