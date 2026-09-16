import { useState, useEffect } from 'react';
import { rankingService } from '../api/rankingService';

export function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const data = await rankingService.getGeneralRanking();
      setRankings(data);
    } catch (err) {
      setError('Error al cargar rankings');
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-400';
    if (rank === 2) return 'bg-gray-100 border-gray-400';
    if (rank === 3) return 'bg-orange-50 border-orange-300';
    return 'bg-white border-gray-200';
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rankings Generales</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : rankings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl">🏆</span>
          <p className="text-gray-500 mt-4">No hay datos de rankings disponibles</p>
          <p className="text-gray-400 text-sm mt-2">Los rankings se generan automáticamente al registrar resultados de partidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((team) => (
            <div
              key={team.teamId}
              className={`rounded-lg border-2 p-4 flex items-center gap-4 transition-shadow hover:shadow-md ${getMedalColor(team.rank)}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                {getMedalIcon(team.rank)}
              </div>

              <div className="flex items-center gap-3 flex-1 min-w-0">
                {team.teamLogo ? (
                  <img src={team.teamLogo} alt="" className="h-10 w-10 object-contain flex-shrink-0" />
                ) : (
                  <span className="text-2xl flex-shrink-0">⚽</span>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 truncate">{team.teamName}</p>
                  <p className="text-xs text-gray-500">{team.leaguesCount} liga(s)</p>
                </div>
              </div>

              <div className="flex gap-6 text-center flex-shrink-0">
                <div>
                  <p className="text-2xl font-bold text-green-600">{team.totalPoints}</p>
                  <p className="text-xs text-gray-500">Puntos</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{team.totalMatches}</p>
                  <p className="text-xs text-gray-500">Partidos</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{team.winRate}%</p>
                  <p className="text-xs text-gray-500">Victorias</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-purple-600">{team.avgGoals}</p>
                  <p className="text-xs text-gray-500">Goles/PJ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
