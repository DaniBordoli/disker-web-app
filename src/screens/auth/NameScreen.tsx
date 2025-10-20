// Pantalla de Nombres - Paso 4
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { setUserNamesStep4 } from '../../services/user';

export function NameScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [errors, setErrors] = useState<{ name?: string; lastname?: string }>({});

  const namesMutation = useMutation({
    mutationFn: () => setUserNamesStep4(userId, { set_names: { name, lastname } }),
    onSuccess: () => {
      toast.success('Nombres guardados');
      navigate(`/register/about?userId=${userId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar nombres');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    if (!name.trim()) {
      setErrors({ name: 'El nombre es requerido' });
      return;
    }

    if (!lastname.trim()) {
      setErrors({ lastname: 'El apellido es requerido' });
      return;
    }

    if (name.trim().length < 2) {
      setErrors({ name: 'El nombre debe tener al menos 2 caracteres' });
      return;
    }

    if (lastname.trim().length < 2) {
      setErrors({ lastname: 'El apellido debe tener al menos 2 caracteres' });
      return;
    }

    if (!userId) {
      toast.error('Error: No se encontró el ID de usuario');
      navigate('/register');
      return;
    }

    namesMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-600">Paso 3 de 4</span>
            <span className="text-sm font-medium text-violet-600">75%</span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div className="bg-violet-600 h-2 rounded-full transition-all" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-950 mb-2">
            ¿Cómo te llamas?
          </h1>
          <p className="text-primary-600">
            Queremos conocerte mejor
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            label="Nombre"
            placeholder="Juan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
            autoFocus
          />

          <Input
            type="text"
            label="Apellido"
            placeholder="Pérez"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            error={errors.lastname}
            required
          />

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <p className="text-sm text-violet-800">
              💡 <strong>Tip:</strong> Usa tu nombre real para que las marcas puedan identificarte fácilmente.
            </p>
          </div>

          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={namesMutation.isPending}
          >
            {namesMutation.isPending ? 'Guardando...' : 'Continuar'}
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
