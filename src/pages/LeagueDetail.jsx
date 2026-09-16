import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leagueService } from '../api/leagueService';
import { teamService } from '../api/teamService';

export function LeagueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [league, setLeague] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);

  useEffect(() => {
    loadLeague();
  }, [id]);

  const loadLeague = async () => {
    try {
      setLoading(true);
      const data = await leagueService.getById(id);
      setLeague(data);

      if (isAdmin) {
        const allTeams = await teamService.getAll();
        const leagueTeamIds = data.teams.map(t => t.id);
        setAvailableTeams(allTeams.filter(t => !leagueTeamIds.includes(t.id)));
      }
    } catch (err) {
      setError('Error al cargar liga');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (teamId) => {
    try {
      await leagueService.addTeam(id, teamId);
      setShowAddTeam(false);
      loadLeague();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar equipo');
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (!confirm('¿Remover equipo de la liga?')) return;
    try {
      await leagueService.removeTeam(id, teamId);
      loadLeague();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al remover equipo');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await leagueService.updateStatus(id, newStatus);
      loadLeague();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la liga "${league.name}"?`)) return;
    try {
      await leagueService.delete(id);
      navigate('/leagues');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const statusColors = {
    Programada: 'bg-yellow-100 text-yellow-800',
    Activa: 'bg-green-100 text-green-800',
    Finalizada: 'bg-gray-100 text-gray-600'
  };

  const nextStatus = {
    Programada: 'Activa',
    Activa: 'Finalizada'
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded-md">{error || 'Liga no encontrada'}</div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/leagues')}
        className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-1"
      >
        ← Volver a Ligas
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{league.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full ${statusColors[league.status]}`}>
                {league.status}
              </span>
              <span className="text-gray-500 capitalize">{league.format}</span>
            </div>
            {league.description && (
              <p className="text-gray-500 mt-2">{league.description}</p>
            )}
            {league.startDate && (
              <p className="text-gray-400 text-sm mt-1">
                {new Date(league.startDate).toLocaleDateString()} - {league.endDate ? new Date(league.endDate).toLocaleDateString() : 'Sin fecha fin'}
              </p>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              {nextStatus[league.status] && (
                <button
                  onClick={() => handleStatusChange(nextStatus[league.status])}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  → {nextStatus[league.status]}
                </button>
              )}
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(`/leagues/${id}/standings`)}
          className="bg-white border-2 border-green-500 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors font-medium"
        >
          📊 Ver Tabla de Posiciones
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Equipos ({league.teams.length})
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddTeam(!showAddTeam)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              + Agregar Equipo
            </button>
          )}
        </div>

        {showAddTeam && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Seleccionar equipo:</h3>
            {availableTeams.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay equipos disponibles</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleAddTeam(team.id)}
                    className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-md hover:border-blue-500 transition-colors text-left"
                  >
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-xl">⚽</span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{team.name}</p>
                      <p className="text-xs text-gray-400">{team.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {league.teams.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">⚽</span>
            <p className="text-gray-400 mt-2">No hay equipos en esta liga</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {league.teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <span className="text-2xl">⚽</span>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{team.name}</p>
                  <p className="text-sm text-gray-400">{team.city}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleRemoveTeam(team.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
