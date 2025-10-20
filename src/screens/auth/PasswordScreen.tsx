// Pantalla de Contraseña - Paso 3
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { setUserPasswordStep3 } from '../../services/user';

export function PasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const passwordMutation = useMutation({
    mutationFn: () => setUserPasswordStep3(userId, { set_password: { password } }),
    onSuccess: () => {
      toast.success('Contraseña establecida');
      navigate(`/register/name?userId=${userId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al establecer contraseña');
    },
  });

  const validatePassword = (pwd: string): string | undefined => {
    if (pwd.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Debe contener al menos una minúscula';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Debe contener al menos un número';
    }
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    if (!userId) {
      toast.error('Error: No se encontró el ID de usuario');
      navigate('/register');
      return;
    }

    passwordMutation.mutate();
  };

  // Indicador de fortaleza
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente'];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-600">Paso 2 de 4</span>
            <span className="text-sm font-medium text-violet-600">50%</span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div className="bg-violet-600 h-2 rounded-full transition-all" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-950 mb-2">
            Crea tu contraseña
          </h1>
          <p className="text-primary-600">
            Debe ser segura y fácil de recordar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              autoFocus
            />
            
            {/* Strength indicator */}
            {password && (
              <div className="mt-3">
                <div className="flex gap-1 mb-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i < strength ? strengthColors[strength - 1] : 'bg-primary-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-primary-600">
                  Fortaleza: <span className="font-medium">{strengthLabels[strength - 1] || 'Muy débil'}</span>
                </p>
              </div>
            )}
          </div>

          <Input
            type="password"
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          {/* Requirements */}
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-950 mb-2">
              La contraseña debe contener:
            </p>
            <ul className="space-y-1 text-sm text-primary-600">
              <li className={password.length >= 8 ? 'text-green-600' : ''}>
                {password.length >= 8 ? '✓' : '○'} Al menos 8 caracteres
              </li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                {/[A-Z]/.test(password) ? '✓' : '○'} Una letra mayúscula
              </li>
              <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                {/[a-z]/.test(password) ? '✓' : '○'} Una letra minúscula
              </li>
              <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                {/[0-9]/.test(password) ? '✓' : '○'} Un número
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={passwordMutation.isPending}
          >
            {passwordMutation.isPending ? 'Guardando...' : 'Continuar'}
          </Button>
        </form>

        {/* Back */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-primary-600 hover:text-primary-950"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
