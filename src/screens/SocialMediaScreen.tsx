// Pantalla de Redes Sociales Vinculadas
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getLinkedAccounts, unlinkAccount } from '../services/social';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useState } from 'react';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

export function SocialMediaScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [unlinkingId, setUnlinkingId] = useState<string | number | null>(null);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts', 'linked'],
    queryFn: getLinkedAccounts,
  });

  const unlinkMutation = useMutation({
    mutationFn: (accountId: string | number) => unlinkAccount(accountId),
    onSuccess: () => {
      toast.success('Cuenta desvinculada');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setUnlinkingId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al desvincular cuenta');
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'youtube':
        return '▶️';
      default:
        return '🔗';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'tiktok':
        return 'from-black to-gray-800';
      case 'youtube':
        return 'from-red-500 to-red-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  const handleUnlink = (accountId: string | number) => {
    setUnlinkingId(accountId);
  };

  const confirmUnlink = () => {
    if (unlinkingId) {
      unlinkMutation.mutate(unlinkingId);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-primary-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-950 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Perfil</span>
            </button>
            <h1 className="text-xl font-bold text-primary-950">Redes Sociales</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Info Card */}
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-violet-900 mb-2">
            ¿Por qué vincular tus redes?
          </h2>
          <ul className="space-y-2 text-sm text-violet-800">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Las marcas pueden ver tu alcance real</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Aumenta tus posibilidades de ser seleccionado</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Accede a campañas exclusivas</span>
            </li>
          </ul>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-primary-600">Cargando cuentas...</p>
          </div>
        )}

        {/* Linked Accounts */}
        {!isLoading && accounts && accounts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary-950 mb-4">
              Cuentas Vinculadas
            </h3>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-xl border border-primary-200 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${getPlatformColor(
                        account.platform
                      )} rounded-xl flex items-center justify-center text-2xl`}
                    >
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-950 capitalize">
                        {account.platform}
                      </h4>
                      {account.username && (
                        <p className="text-sm text-primary-600">
                          @{account.username}
                        </p>
                      )}
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Vinculada correctamente
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnlink(account.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Desvincular
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms */}
        <div>
          <h3 className="text-lg font-semibold text-primary-950 mb-4">
            Vincular Nueva Cuenta
          </h3>
          <div className="space-y-3">
            {/* Instagram */}
            <button
              disabled
              className="w-full bg-white rounded-xl border border-primary-200 p-6 hover:border-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📷
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-primary-950">Instagram</h4>
                  <p className="text-sm text-primary-600">
                    Conecta tu cuenta de Instagram
                  </p>
                </div>
                <span className="text-sm text-primary-500">Próximamente</span>
              </div>
            </button>

            {/* TikTok */}
            <button
              disabled
              className="w-full bg-white rounded-xl border border-primary-200 p-6 hover:border-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-primary-950">TikTok</h4>
                  <p className="text-sm text-primary-600">
                    Conecta tu cuenta de TikTok
                  </p>
                </div>
                <span className="text-sm text-primary-500">Próximamente</span>
              </div>
            </button>

            {/* YouTube */}
            <button
              disabled
              className="w-full bg-white rounded-xl border border-primary-200 p-6 hover:border-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl">
                  ▶️
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-primary-950">YouTube</h4>
                  <p className="text-sm text-primary-600">
                    Conecta tu canal de YouTube
                  </p>
                </div>
                <span className="text-sm text-primary-500">Próximamente</span>
              </div>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && accounts && accounts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-primary-200">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-primary-950 mb-2">
              No tienes cuentas vinculadas
            </h3>
            <p className="text-primary-600 mb-6">
              Vincula tus redes sociales para acceder a más oportunidades
            </p>
          </div>
        )}
      </main>

      {/* Unlink Confirmation Modal */}
      <Modal
        isOpen={!!unlinkingId}
        onClose={() => setUnlinkingId(null)}
        title="Desvincular cuenta"
        footer={
          <>
            <Button
              variant="light"
              onClick={() => setUnlinkingId(null)}
              className="flex-1"
              disabled={unlinkMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="dark"
              onClick={confirmUnlink}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={unlinkMutation.isPending}
            >
              {unlinkMutation.isPending ? 'Desvinculando...' : 'Desvincular'}
            </Button>
          </>
        }
      >
        <p className="text-primary-600">
          ¿Estás seguro que deseas desvincular esta cuenta? Las marcas no podrán ver tu alcance en esta plataforma.
        </p>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
