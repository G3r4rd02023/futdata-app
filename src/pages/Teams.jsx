import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../api/teamService';
import { TeamCard } from '../components/TeamCard';
import { TeamForm } from '../components/TeamForm';

export function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAll(search);
      setTeams(data);
    } catch (err) {
      setError('Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadTeams();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleCreate = async (data, logoFile) => {
    const created = await teamService.create(data);
    if (logoFile) {
      await teamService.uploadLogo(created.id, logoFile);
    }
    setShowForm(false);
    loadTeams();
  };

  const handleUpdate = async (data, logoFile) => {
    await teamService.update(editingTeam.id, data);
    if (logoFile) {
      await teamService.uploadLogo(editingTeam.id, logoFile);
    }
    setEditingTeam(null);
    loadTeams();
  };

  const handleDelete = async (team) => {
    if (!confirm(`¿Eliminar el equipo "${team.name}"?`)) return;
    try {
      await teamService.delete(team.id);
      loadTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleLogoUpload = async (team, file) => {
    try {
      await teamService.uploadLogo(team.id, file);
      loadTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al subir logo');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Equipos</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 w-full sm:w-64"
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
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl">⚽</span>
          <p className="text-gray-500 mt-4">No se encontraron equipos</p>
        </div>
      ) : (
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
