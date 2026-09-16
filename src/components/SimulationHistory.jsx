export function SimulationHistory({ history, stats }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Simulaciones</h3>
        <p className="text-gray-400 text-center py-4">No hay simulaciones realizadas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Simulaciones</h3>

      {stats && stats.totalSimulations > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.homeWins}</p>
            <p className="text-xs text-gray-500">Victoria Local ({stats.homeWinRate}%)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.draws}</p>
            <p className="text-xs text-gray-500">Empates ({stats.drawRate}%)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{stats.awayWins}</p>
            <p className="text-xs text-gray-500">Victoria Visitante ({stats.awayWinRate}%)</p>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1 text-right">
              <span className="text-sm font-semibold text-gray-800">{item.homeTeamName}</span>
            </div>
            <div className="px-4 text-center">
              <span className="font-bold text-gray-800">
                {item.homeGoals} - {item.awayGoals}
              </span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                item.result === 'Local' ? 'bg-green-100 text-green-700' :
                item.result === 'Empate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.result}
              </span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-gray-800">{item.awayTeamName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
