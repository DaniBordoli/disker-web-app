// Pantalla de Datos Personales - Paso 5
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { setPersonalDataStep5 } from '../../services/user';

export function AboutScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [country, setCountry] = useState('Argentina');
  const cityUid = '1'; // Default city ID
  const [errors, setErrors] = useState<{ birthdate?: string; gender?: string }>({});

  const personalDataMutation = useMutation({
    mutationFn: () => {
      // Convertir fecha de YYYY-MM-DD a DD-MM-YYYY
      const [year, month, day] = birthdate.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      return setPersonalDataStep5(userId, {
        set_personal_data: {
          country,
          city_uid: parseInt(cityUid),
          birthdate: formattedDate,
          gender: gender as 'male' | 'female',
        },
      });
    },
    onSuccess: () => {
      toast.success('¡Perfil completado!');
      navigate('/register/success');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar datos personales');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    if (!birthdate) {
      setErrors({ birthdate: 'La fecha de nacimiento es requerida' });
      return;
    }

    // Validar edad mínima (18 años)
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      if (age - 1 < 18) {
        setErrors({ birthdate: 'Debes tener al menos 18 años' });
        return;
      }
    } else if (age < 18) {
      setErrors({ birthdate: 'Debes tener al menos 18 años' });
      return;
    }

    if (!gender) {
      setErrors({ gender: 'El género es requerido' });
      return;
    }

    if (!userId) {
      toast.error('Error: No se encontró el ID de usuario');
      navigate('/register');
      return;
    }

    personalDataMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-600">Paso 4 de 4</span>
            <span className="text-sm font-medium text-violet-600">100%</span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div className="bg-violet-600 h-2 rounded-full transition-all" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-950 mb-2">
            Cuéntanos sobre ti
          </h1>
          <p className="text-primary-600">
            Última información para completar tu perfil
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="date"
            label="Fecha de nacimiento"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            error={errors.birthdate}
            required
            max={new Date().toISOString().split('T')[0]}
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Género
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  gender === 'male'
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-primary-200 hover:border-primary-300'
                }`}
              >
                <div className="text-2xl mb-1">👨</div>
                <div className="text-sm font-medium text-primary-950">Masculino</div>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  gender === 'female'
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-primary-200 hover:border-primary-300'
                }`}
              >
                <div className="text-2xl mb-1">👩</div>
                <div className="text-sm font-medium text-primary-950">Femenino</div>
              </button>
            </div>
            {errors.gender && (
              <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Perú">Perú</option>
              <option value="Uruguay">Uruguay</option>
              <option value="España">España</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-sm text-primary-700">
              ℹ️ Esta información nos ayuda a conectarte con campañas relevantes para tu perfil.
            </p>
          </div>

          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={personalDataMutation.isPending}
          >
            {personalDataMutation.isPending ? 'Finalizando...' : 'Finalizar registro'}
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
