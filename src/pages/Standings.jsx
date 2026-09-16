import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rankingService } from '../api/rankingService';
import { leagueService } from '../api/leagueService';
import { StandingTable } from '../components/StandingTable';

export function Standings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [league, setLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leagueData, standingsData] = await Promise.all([
        leagueService.getById(id),
        rankingService.getLeagueStandings(id)
      ]);
      setLeague(leagueData);
      setStandings(standingsData);
    } catch (err) {
      setError('Error al cargar tabla de posiciones');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/rankings/team/${teamId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md">{error || 'Liga no encontrada'}</div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/leagues')}
        className="text-green-600 hover:text-green-800 mb-4 inline-flex items-center gap-1"
      >
        ← Volver a Ligas
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{league.name}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Tabla de Posiciones</p>
      </div>

      <StandingTable
        standings={standings}
        showTeamLink={true}
        onTeamClick={handleTeamClick}
      />
    </div>
  );
}
