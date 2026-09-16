import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../api/matchService';
import { leagueService } from '../api/leagueService';
import { MatchCard } from '../components/MatchCard';
import { MatchForm } from '../components/MatchForm';
import { ResultForm } from '../components/ResultForm';
import { Pagination } from '../components/Pagination';

export function Matches() {
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [resultMatch, setResultMatch] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;
  const { isAdmin } = useAuth();

  const loadLeagues = async () => {
    try {
      const result = await leagueService.getAll(1, 100);
      setLeagues(result.items || result);
    } catch (err) {
      console.error('Error loading leagues', err);
    }
  };

  const loadMatches = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const result = await matchService.getAll(filters, currentPage, pageSize);
      setMatches(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    loadMatches(page);
  }, [page, loadMatches]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      loadMatches(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = async (data) => {
    await matchService.create(data);
    setShowForm(false);
    loadMatches(page);
  };

  const handleUpdate = async (data) => {
    await matchService.update(editingMatch.id, data);
    setEditingMatch(null);
    loadMatches(page);
  };

  const handleResult = async (data) => {
    await matchService.registerResult(resultMatch.id, data);
    setResultMatch(null);
    loadMatches(page);
  };

  const handleDelete = async (match) => {
    if (!confirm(`¿Eliminar el partido?`)) return;
    try {
      await matchService.delete(match.id);
      loadMatches(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Partidos</h1>

        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            + Nuevo Partido
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Liga</label>
            <select
              value={filters.leagueId || ''}
              onChange={(e) => handleFilterChange('leagueId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700"
            >
              <option value="">Todas</option>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Estado</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700"
            >
              <option value="">Todos</option>
              <option value="Programado">Programado</option>
              <option value="EnJuego">En Juego</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Postergado">Postergado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Desde</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Hasta</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-slate-700">
          <span className="text-6xl">⚽</span>
          <p className="text-gray-500 dark:text-slate-400 mt-4">No se encontraron partidos</p>
        </div>
      ) : (
        <>
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
          <Pagination
            page={page}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={handlePageChange}
            totalCount={totalCount}
          />
        </>
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
