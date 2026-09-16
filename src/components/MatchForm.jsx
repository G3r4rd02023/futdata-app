import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { leagueService } from '../api/leagueService';
import { teamService } from '../api/teamService';

export function MatchForm({ match, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const selectedLeagueId = watch('leagueId');

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeagueId) {
      loadLeagueTeams(selectedLeagueId);
    }
  }, [selectedLeagueId]);

  useEffect(() => {
    if (match) {
      reset({
        leagueId: match.leagueId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        matchDate: match.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : '',
        round: match.round || '',
        notes: match.notes || ''
      });
      if (match.leagueId) {
        loadLeagueTeams(match.leagueId);
      }
    }
  }, [match, reset]);

  const loadLeagues = async () => {
    try {
      const data = await leagueService.getAll();
      setLeagues(data);
    } catch (err) {
      console.error('Error loading leagues', err);
    }
  };

  const loadLeagueTeams = async (leagueId) => {
    try {
      const league = await leagueService.getById(leagueId);
      setLeagueTeams(league.teams);
    } catch (err) {
      console.error('Error loading league teams', err);
      setLeagueTeams([]);
    }
  };

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        round: data.round ? parseInt(data.round) : null,
        notes: data.notes || null
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {match ? 'Editar Partido' : 'Nuevo Partido'}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liga *
            </label>
            <select
              {...register('leagueId', { required: 'La liga es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="">Seleccionar liga</option>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {errors.leagueId && (
              <p className="text-red-500 text-xs mt-1">{errors.leagueId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipo Local *
              </label>
              <select
                {...register('homeTeamId', { required: 'El equipo local es requerido' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                disabled={!selectedLeagueId}
              >
                <option value="">Seleccionar</option>
                {leagueTeams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {errors.homeTeamId && (
                <p className="text-red-500 text-xs mt-1">{errors.homeTeamId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipo Visitante *
              </label>
              <select
                {...register('awayTeamId', { required: 'El equipo visitante es requerido' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                disabled={!selectedLeagueId}
              >
                <option value="">Seleccionar</option>
                {leagueTeams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {errors.awayTeamId && (
                <p className="text-red-500 text-xs mt-1">{errors.awayTeamId.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora *
            </label>
            <input
              type="datetime-local"
              {...register('matchDate', { required: 'La fecha es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
            {errors.matchDate && (
              <p className="text-red-500 text-xs mt-1">{errors.matchDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jornada
            </label>
            <input
              type="number"
              min="1"
              {...register('round')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
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
