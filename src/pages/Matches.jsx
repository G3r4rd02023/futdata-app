import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../api/matchService';
import { leagueService } from '../api/leagueService';
import { teamService } from '../api/teamService';
import { MatchCard } from '../components/MatchCard';
import { MatchForm } from '../components/MatchForm';
import { ResultForm } from '../components/ResultForm';

export function Matches() {
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [resultMatch, setResultMatch] = useState(null);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadLeagues();
    loadMatches();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [filters]);

  const loadLeagues = async () => {
    try {
      const data = await leagueService.getAll();
      setLeagues(data);
    } catch (err) {
      console.error('Error loading leagues', err);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAll(filters);
      setMatches(data);
    } catch (err) {
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleCreate = async (data) => {
    await matchService.create(data);
    setShowForm(false);
    loadMatches();
  };

  const handleUpdate = async (data) => {
    await matchService.update(editingMatch.id, data);
    setEditingMatch(null);
    loadMatches();
  };

  const handleResult = async (data) => {
    await matchService.registerResult(resultMatch.id, data);
    setResultMatch(null);
    loadMatches();
  };

  const handleDelete = async (match) => {
    if (!confirm(`¿Eliminar el partido?`)) return;
    try {
      await matchService.delete(match.id);
      loadMatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Partidos</h1>

        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            + Nuevo Partido
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga</label>
            <select
              value={filters.leagueId || ''}
              onChange={(e) => handleFilterChange('leagueId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="">Todas</option>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="">Todos</option>
              <option value="Programado">Programado</option>
              <option value="EnJuego">En Juego</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Postergado">Postergado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl">⚽</span>
          <p className="text-gray-500 mt-4">No se encontraron partidos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onEdit={(m) => setEditingMatch(m)}
              onDelete={handleDelete}
              onResult={(m) => setResultMatch(m)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <MatchForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMatch && (
        <MatchForm
          match={editingMatch}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMatch(null)}
        />
      )}

      {resultMatch && (
        <ResultForm
          match={resultMatch}
          onSubmit={handleResult}
          onCancel={() => setResultMatch(null)}
        />
      )}
    </div>
  );
}
