import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function TeamForm({ team, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        city: team.city,
        stadium: team.stadium || ''
      });
      if (team.logoUrl) {
        setLogoPreview(team.logoUrl);
      }
    }
  }, [team, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo excede el tamaño máximo de 2MB');
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('Solo se permiten archivos JPG o PNG');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data, logoFile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {team ? 'Editar Equipo' : 'Nuevo Equipo'}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              {...register('name', { required: 'El nombre es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              {...register('city', { required: 'La ciudad es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estadio
            </label>
            <input
              {...register('stadium')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo del equipo
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" className="h-24 w-24 object-contain" />
                ) : (
                  <>
                    <span className="text-4xl">⚽</span>
                    <span className="text-xs text-gray-400 mt-1">Subir logo</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => { setLogoFile(null); setLogoPreview(team?.logoUrl || null); }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Quitar
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">JPG o PNG, máximo 2MB</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
