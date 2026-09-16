import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function ResultForm({ match, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      homeGoals: match?.homeGoals ?? 0,
      awayGoals: match?.awayGoals ?? 0
    }
  });

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit({
        homeGoals: parseInt(data.homeGoals),
        awayGoals: parseInt(data.awayGoals)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Registrar Resultado</h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="font-medium text-gray-800">{match.homeTeamName}</p>
            </div>
            <div className="text-center px-4">
              <span className="text-gray-400">vs</span>
            </div>
            <div className="text-center flex-1">
              <p className="font-medium text-gray-800">{match.awayTeamName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                Goles {match.homeTeamName}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                {...register('homeGoals', {
                  required: 'Requerido',
                  min: { value: 0, message: 'Mínimo 0' },
                  max: { value: 50, message: 'Máximo 50' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-center text-2xl font-bold"
              />
              {errors.homeGoals && (
                <p className="text-red-500 text-xs mt-1 text-center">{errors.homeGoals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                Goles {match.awayTeamName}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                {...register('awayGoals', {
                  required: 'Requerido',
                  min: { value: 0, message: 'Mínimo 0' },
                  max: { value: 50, message: 'Máximo 50' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-center text-2xl font-bold"
              />
              {errors.awayGoals && (
                <p className="text-red-500 text-xs mt-1 text-center">{errors.awayGoals.message}</p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Al registrar el resultado se actualizarán las estadísticas de la liga
          </p>

          <div className="flex gap-3 mt-4">
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
              {loading ? 'Guardando...' : 'Guardar Resultado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
