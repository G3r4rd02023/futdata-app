import { useState, useEffect } from 'react';
import { simulationService } from '../api/simulationService';
import { leagueService } from '../api/leagueService';
import { ProbabilitySlider } from '../components/ProbabilitySlider';
import { SimulationResultDisplay } from '../components/SimulationResultDisplay';
import { SimulationHistory } from '../components/SimulationHistory';

export function Simulation() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [homeWinProb, setHomeWinProb] = useState(40);
  const [drawProb, setDrawProb] = useState(20);
  const [awayWinProb, setAwayWinProb] = useState(40);
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));
  const [round, setRound] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      loadLeagueTeams(selectedLeague);
    }
  }, [selectedLeague]);

  useEffect(() => {
    loadHistory();
  }, [selectedLeague]);

  const loadLeagues = async () => {
    try {
      const data = await leagueService.getAll();
      setLeagues(data.filter(l => l.status === 'Activa'));
    } catch (err) {
      console.error('Error loading leagues', err);
    }
  };

  const loadLeagueTeams = async (leagueId) => {
    try {
      const league = await leagueService.getById(leagueId);
      setLeagueTeams(league.teams);
      setHomeTeamId('');
      setAwayTeamId('');
    } catch (err) {
      console.error('Error loading league teams', err);
      setLeagueTeams([]);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await simulationService.getHistory(selectedLeague || undefined);
      setHistory(data);
      const statsData = await simulationService.getStats(selectedLeague || undefined);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading history', err);
    }
  };

  const handleHomeWinChange = (value) => {
    setHomeWinProb(value);
    const remaining = 100 - value;
    if (drawProb + awayWinProb !== remaining) {
      const ratio = drawProb + awayWinProb > 0 ? drawProb / (drawProb + awayWinProb) : 0.5;
      setDrawProb(Math.round(remaining * ratio));
      setAwayWinProb(remaining - Math.round(remaining * ratio));
    }
  };

  const handleDrawChange = (value) => {
    setDrawProb(value);
    const remaining = 100 - value;
    if (homeWinProb + awayWinProb !== remaining) {
      const ratio = homeWinProb + awayWinProb > 0 ? homeWinProb / (homeWinProb + awayWinProb) : 0.5;
      setHomeWinProb(Math.round(remaining * ratio));
      setAwayWinProb(remaining - Math.round(remaining * ratio));
    }
  };

  const handleAwayWinChange = (value) => {
    setAwayWinProb(value);
    const remaining = 100 - value;
    if (homeWinProb + drawProb !== remaining) {
      const ratio = homeWinProb + drawProb > 0 ? homeWinProb / (homeWinProb + drawProb) : 0.5;
      setHomeWinProb(Math.round(remaining * ratio));
      setDrawProb(remaining - Math.round(remaining * ratio));
    }
  };

  const handleSimulate = async () => {
    if (!selectedLeague || !homeTeamId || !awayTeamId) {
      setError('Selecciona liga, equipo local y visitante');
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError('Los equipos deben ser distintos');
      return;
    }

    if (homeWinProb + drawProb + awayWinProb !== 100) {
      setError('Las probabilidades deben sumar 100');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await simulationService.simulate({
        leagueId: selectedLeague,
        homeTeamId,
        awayTeamId,
        homeWinProbability: homeWinProb,
        drawProbability: drawProb,
        awayWinProbability: awayWinProb,
        matchDate: new Date(matchDate).toISOString(),
        round: round ? parseInt(round) : null
      });

      setResult(response);
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al simular');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Simulación de Partidos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Configurar Simulación</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liga *</label>
              <select
                value={selectedLeague || ''}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              >
                <option value="">Seleccionar liga</option>
                {leagues.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Local *</label>
                <select
                  value={homeTeamId}
                  onChange={(e) => setHomeTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  disabled={!selectedLeague}
                >
                  <option value="">Seleccionar</option>
                  {leagueTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Visitante *</label>
                <select
                  value={awayTeamId}
                  onChange={(e) => setAwayTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  disabled={!selectedLeague}
                >
                  <option value="">Seleccionar</option>
                  {leagueTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input
                  type="datetime-local"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jornada</label>
                <input
                  type="number"
                  min="1"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Probabilidades */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Probabilidades</h3>
                <span className={`text-sm font-bold ${
                  homeWinProb + drawProb + awayWinProb === 100 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Total: {homeWinProb + drawProb + awayWinProb}%
                </span>
              </div>

              <div className="space-y-4">
                <ProbabilitySlider
                  label="Victoria Local"
                  value={homeWinProb}
                  onChange={handleHomeWinChange}
                  color="green"
                  icon="🏠"
                />
                <ProbabilitySlider
                  label="Empate"
                  value={drawProb}
                  onChange={handleDrawChange}
                  color="yellow"
                  icon="🤝"
                />
                <ProbabilitySlider
                  label="Victoria Visitante"
                  value={awayWinProb}
                  onChange={handleAwayWinChange}
                  color="red"
                  icon="✈️"
                />
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading || !selectedLeague || !homeTeamId || !awayTeamId}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Simulando...' : '🎲 Simular Partido'}
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div className="space-y-6">
          {result ? (
            <SimulationResultDisplay result={result} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <span className="text-6xl">🎮</span>
              <p className="text-gray-500 mt-4">Configura las probabilidades y simula un partido</p>
              <p className="text-gray-400 text-sm mt-2">El resultado se mostrará aquí</p>
            </div>
          )}

          {/* Stats */}
          {stats && stats.totalSimulations > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Estadísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalSimulations}</p>
                  <p className="text-xs text-gray-500">Total Simulaciones</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.avgHomeGoals}</p>
                  <p className="text-xs text-gray-500">Prom. Goles Local</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{stats.avgAwayGoals}</p>
                  <p className="text-xs text-gray-500">Prom. Goles Visitante</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Historial</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          {showHistory ? 'Ocultar' : 'Ver historial'}
        </button>
      </div>

      {showHistory && (
        <SimulationHistory history={history} stats={stats} />
      )}
    </div>
  );
}
