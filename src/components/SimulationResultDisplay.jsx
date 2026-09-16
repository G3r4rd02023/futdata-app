export function SimulationResultDisplay({ result }) {
  if (!result) return null;

  const resultConfig = {
    Local: { text: 'Victoria Local', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30', icon: '🏠' },
    Empate: { text: 'Empate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30', icon: '🤝' },
    Visitante: { text: 'Victoria Visitante', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', icon: '✈️' }
  };

  const config = resultConfig[result.result] || resultConfig.Empate;

  return (
    <div className={`${config.bg} rounded-xl p-6 border-2 ${config.color.replace('text-', 'border-')}/30 dark:border-opacity-30`}>
      <div className="text-center mb-4">
        <span className="text-4xl">{config.icon}</span>
        <h3 className={`text-xl font-bold mt-2 ${config.color}`}>{config.text}</h3>
        <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">{result.message}</p>
      </div>

      <div className="flex items-center justify-center gap-6 py-4">
        <div className="text-center">
          {result.homeTeamLogo && (
            <img src={result.homeTeamLogo} alt="" className="h-16 w-16 object-contain mx-auto mb-2" />
          )}
          <p className="font-bold text-gray-800 dark:text-slate-100">{result.homeTeamName}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black text-gray-800 dark:text-slate-100">{result.simulatedHomeGoals}</span>
            <span className="text-2xl text-gray-400 dark:text-slate-500">-</span>
            <span className="text-5xl font-black text-gray-800 dark:text-slate-100">{result.simulatedAwayGoals}</span>
          </div>
        </div>

        <div className="text-center">
          {result.awayTeamLogo && (
            <img src={result.awayTeamLogo} alt="" className="h-16 w-16 object-contain mx-auto mb-2" />
          )}
          <p className="font-bold text-gray-800 dark:text-slate-100">{result.awayTeamName}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
        <p className="text-xs text-gray-500 dark:text-slate-400 text-center mb-2">Probabilidades configuradas</p>
        <div className="flex justify-center gap-6 text-sm">
          <span className="text-green-600 dark:text-green-400">Local: {result.probabilities.homeWin}%</span>
          <span className="text-yellow-600 dark:text-yellow-400">Empate: {result.probabilities.draw}%</span>
          <span className="text-red-600 dark:text-red-400">Visitante: {result.probabilities.awayWin}%</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-3">
        {new Date(result.simulatedAt).toLocaleString('es-ES')}
      </p>
    </div>
  );
}
