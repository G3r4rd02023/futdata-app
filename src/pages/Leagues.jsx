import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leagueService } from '../api/leagueService';
import { LeagueCard } from '../components/LeagueCard';
import { LeagueForm } from '../components/LeagueForm';
import { Pagination } from '../components/Pagination';

export function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLeague, setEditingLeague] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const loadLeagues = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const result = search
        ? await leagueService.search(search, currentPage, pageSize)
        : await leagueService.getAll(currentPage, pageSize);
      setLeagues(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError('Error al cargar ligas');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadLeagues(page);
  }, [page, loadLeagues]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      loadLeagues(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = async (data) => {
    await leagueService.create(data);
    setShowForm(false);
    loadLeagues(page);
  };

  const handleUpdate = async (data) => {
    await leagueService.update(editingLeague.id, data);
    setEditingLeague(null);
    loadLeagues(page);
  };

  const handleDelete = async (league) => {
    if (!confirm(`Eliminar la liga "${league.name}"?`)) return;
    try {
      await leagueService.delete(league.id);
      loadLeagues(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Ligas</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700 w-full sm:w-64"
          />

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              + Nueva Liga
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : leagues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-slate-700">
          <span className="text-6xl">🏆</span>
          <p className="text-gray-500 dark:text-slate-400 mt-4">No se encontraron ligas</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leagues.map((league) => (
              <LeagueCard
                key={league.id}
                league={league}
                onEdit={(l) => setEditingLeague(l)}
                onDelete={handleDelete}
                onView={(l) => navigate(`/leagues/${l.id}`)}
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
        <LeagueForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingLeague && (
        <LeagueForm
          league={editingLeague}
          onSubmit={handleUpdate}
          onCancel={() => setEditingLeague(null)}
        />
      )}
    </div>
  );
}
