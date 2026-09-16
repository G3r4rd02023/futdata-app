import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../api/dashboardService';
import { StatsCard } from '../components/StatsCard';

export function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError('Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
    );
  }

  if (!dashboard) return null;

  const { summary, activeLeagues, recentMatches, upcomingMatches, topTeams, charts } = dashboard;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Equipos" value={summary.totalTeams} icon="⚽" color="green" />
        <StatsCard title="Ligas" value={summary.totalLeagues} icon="🏆" color="blue" />
        <StatsCard title="Total Partidos" value={summary.totalMatches} icon="📊" color="purple" />
        <StatsCard title="Jugados" value={summary.matchesPlayed} icon="✅" color="green" />
        <StatsCard title="Pendientes" value={summary.matchesPending} icon="⏳" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matches by Month Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Partidos por Mes</h2>
          <div className="space-y-3">
            {charts.matchesByMonth.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max((item.count / Math.max(...charts.matchesByMonth.map(m => m.count), 1)) * 100, 4)}%`
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Distribución de Resultados</h2>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">{charts.resultDistribution.wins}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Victorias</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-yellow-600">{charts.resultDistribution.draws}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Empates</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-red-600">{charts.resultDistribution.losses}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Derrotas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Últimos Partidos</h2>
          {recentMatches.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No hay partidos recientes</p>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold text-gray-800 truncate">{match.homeTeamName}</span>
                    {match.homeTeamLogo && (
                      <img src={match.homeTeamLogo} alt="" className="h-5 w-5 object-contain flex-shrink-0" />
                    )}
                  </div>
                  <div className="px-3 text-center flex-shrink-0">
                    <span className="font-bold text-base text-gray-800">
                      {match.homeGoals} - {match.awayGoals}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    {match.awayTeamLogo && (
                      <img src={match.awayTeamLogo} alt="" className="h-5 w-5 object-contain flex-shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-gray-800 truncate">{match.awayTeamName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Próximos Partidos</h2>
          {upcomingMatches.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No hay partidos programados</p>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold text-gray-800 truncate">{match.homeTeamName}</span>
                      {match.homeTeamLogo && (
                        <img src={match.homeTeamLogo} alt="" className="h-5 w-5 object-contain flex-shrink-0" />
                      )}
                    </div>
                    <span className="px-2 text-xs text-gray-400">vs</span>
                    <div className="flex-1 flex items-center gap-2">
                      {match.awayTeamLogo && (
                        <img src={match.awayTeamLogo} alt="" className="h-5 w-5 object-contain flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-gray-800 truncate">{match.awayTeamName}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    {new Date(match.matchDate).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {match.round && ` · J${match.round}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Teams */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top 5 Equipos</h2>
          {topTeams.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No hay datos disponibles</p>
          ) : (
            <div className="space-y-3">
              {topTeams.map((team) => (
                <div
                  key={team.teamId}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    team.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    team.rank === 2 ? 'bg-gray-100 text-gray-600' :
                    team.rank === 3 ? 'bg-orange-50 text-orange-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {team.rank}
                  </span>
                  {team.teamLogo ? (
                    <img src={team.teamLogo} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="text-lg">⚽</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{team.teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{team.points} pts</p>
                    <p className="text-xs text-gray-400">{team.winRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Leagues */}
      {activeLeagues.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ligas Activas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLeagues.map((league) => (
              <div
                key={league.id}
                onClick={() => navigate(`/leagues/${league.id}`)}
                className="p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-bold text-gray-800">{league.name}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>⚽ {league.teamsCount} equipos</span>
                  <span>📊 {league.matchesCount} partidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
