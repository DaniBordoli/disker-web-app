// Pantalla de Editar Perfil
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { getCurrentUser, updateUserProfile } from '../services/user';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

export function EditProfileScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Obtener datos del usuario
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: getCurrentUser,
  });

  const user = userData?.data?.user;

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: () => {
      if (!currentUser?.id) throw new Error('No user ID');
      return updateUserProfile(currentUser.id, {
        set_names: {
          name: firstName,
          lastname: lastName,
        },
      });
    },
    onSuccess: () => {
      toast.success('Perfil actualizado');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar perfil');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Nombre y apellido son requeridos');
      return;
    }

    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-primary-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="border-b border-primary-200 sticky top-0 z-10 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-950 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Cancelar</span>
            </button>
            <h1 className="text-xl font-bold text-primary-950">Editar Perfil</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">
                {firstName?.[0]?.toUpperCase() || '👤'}
              </span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
              disabled
            >
              Cambiar foto (próximamente)
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-primary-200 p-6 space-y-6">
            <Input
              label="Nombre"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              required
            />

            <Input
              label="Apellido"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled
              helperText="El email no se puede modificar"
            />
          </div>

          {/* Password Change */}
          <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-950 mb-1">
                  Contraseña
                </h3>
                <p className="text-sm text-primary-600">
                  ••••••••
                </p>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
                disabled
              >
                Cambiar (próximamente)
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="light"
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="dark"
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
