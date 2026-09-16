import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../api/teamService';
import { TeamCard } from '../components/TeamCard';
import { TeamForm } from '../components/TeamForm';
import { Pagination } from '../components/Pagination';

export function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;
  const { isAdmin } = useAuth();

  const loadTeams = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const result = await teamService.getAll(search, currentPage, pageSize);
      setTeams(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError('Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadTeams(page);
  }, [page, loadTeams]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      loadTeams(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = async (data, logoFile) => {
    const created = await teamService.create(data);
    if (logoFile) {
      await teamService.uploadLogo(created.id, logoFile);
    }
    setShowForm(false);
    loadTeams(page);
  };

  const handleUpdate = async (data, logoFile) => {
    await teamService.update(editingTeam.id, data);
    if (logoFile) {
      await teamService.uploadLogo(editingTeam.id, logoFile);
    }
    setEditingTeam(null);
    loadTeams(page);
  };

  const handleDelete = async (team) => {
    if (!confirm(`¿Eliminar el equipo "${team.name}"?`)) return;
    try {
      await teamService.delete(team.id);
      loadTeams(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleLogoUpload = async (team, file) => {
    try {
      await teamService.uploadLogo(team.id, file);
      loadTeams(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al subir logo');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Equipos</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-slate-700 w-full sm:w-64"
          />

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              + Nuevo Equipo
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-slate-700">
          <span className="text-6xl">⚽</span>
          <p className="text-gray-500 dark:text-slate-400 mt-4">No se encontraron equipos</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={(t) => setEditingTeam(t)}
                onDelete={handleDelete}
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
        <TeamForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTeam && (
        <TeamForm
          team={editingTeam}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTeam(null)}
        />
      )}
    </div>
  );
}
