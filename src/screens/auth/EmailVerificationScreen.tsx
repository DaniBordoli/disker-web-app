// Pantalla de Verificación de Email - Paso 2
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { confirmEmailStep2, registerUserStep1 } from '../../services/user';

export function EmailVerificationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const userId = searchParams.get('userId') || '';
  const [token, setToken] = useState('');

  // Auto-confirmar si viene token en URL (desde email)
  const tokenFromUrl = searchParams.get('confirmation_token');

  const confirmMutation = useMutation({
    mutationFn: (confirmationToken: string) => confirmEmailStep2(confirmationToken),
    onSuccess: (data) => {
      toast.success('¡Email confirmado!');
      const user = data?.data?.user;
      // Navegar a siguiente paso con userId
      navigate(`/register/password?userId=${user?.id || userId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al confirmar email');
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => registerUserStep1({ user: { email } }),
    onSuccess: () => {
      toast.success('Email de confirmación reenviado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al reenviar email');
    },
  });

  // Auto-confirmar si viene token en URL
  useEffect(() => {
    if (tokenFromUrl && !confirmMutation.isPending) {
      confirmMutation.mutate(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleManualConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      confirmMutation.mutate(token);
    }
  };

  const handleResend = () => {
    if (email) {
      resendMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-950 mb-2">
            Verifica tu email
          </h1>
          <p className="text-primary-600">
            Hemos enviado un email de confirmación a:
          </p>
          <p className="font-medium text-primary-950 mt-2">{email}</p>
        </div>

        {/* Loading state */}
        {confirmMutation.isPending && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-primary-600">Confirmando email...</p>
          </div>
        )}

        {/* Instructions */}
        {!confirmMutation.isPending && !tokenFromUrl && (
          <div className="space-y-6">
            <div className="bg-primary-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-primary-700">
                <strong>Paso 1:</strong> Abre tu email
              </p>
              <p className="text-sm text-primary-700">
                <strong>Paso 2:</strong> Haz click en el enlace de confirmación
              </p>
              <p className="text-sm text-primary-700">
                <strong>Paso 3:</strong> Serás redirigido automáticamente
              </p>
            </div>

            {/* Manual token input */}
            <form onSubmit={handleManualConfirm} className="space-y-4">
              <Input
                label="¿Tienes el código de confirmación?"
                placeholder="Pega el código aquí"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Button
                type="submit"
                variant="dark"
                fullWidth
                disabled={!token || confirmMutation.isPending}
              >
                Confirmar manualmente
              </Button>
            </form>

            {/* Resend */}
            <div className="text-center">
              <p className="text-sm text-primary-600 mb-2">
                ¿No recibiste el email?
              </p>
              <button
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className="text-sm font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50"
              >
                {resendMutation.isPending ? 'Reenviando...' : 'Reenviar email'}
              </button>
            </div>

            {/* Back */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate('/register')}
                className="text-sm text-primary-600 hover:text-primary-950"
              >
                ← Volver a registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
