import { TeamFormBadge } from './TeamFormBadge';

export function StandingTable({ standings, showTeamLink = false, onTeamClick }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-slate-400">No hay datos de posiciones disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Equipo</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">PJ</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">G</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">E</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">P</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">GF</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">GC</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">DG</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase w-12">Pts</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {standings.map((standing) => (
              <tr
                key={standing.teamId}
                className={`hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${standing.position <= 3 ? 'bg-green-50/30 dark:bg-green-900/20' : ''}`}
              >
                <td className="px-4 py-3 font-bold text-gray-800 dark:text-slate-100">{standing.position}</td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => showTeamLink && onTeamClick?.(standing.teamId)}
                    style={showTeamLink ? { cursor: 'pointer' } : {}}
                  >
                    {standing.teamLogo ? (
                      <img src={standing.teamLogo} alt="" className="h-6 w-6 object-contain" />
                    ) : (
                      <span className="text-lg">⚽</span>
                    )}
                    <span className="font-medium text-gray-800 dark:text-slate-100">{standing.teamName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.played}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.won}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.drawn}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.lost}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.goalsFor}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-slate-300">{standing.goalsAgainst}</td>
                <td className={`px-4 py-3 text-center font-medium ${standing.goalDifference > 0 ? 'text-green-600 dark:text-green-400' : standing.goalDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-slate-300'}`}>
                  {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                </td>
                <td className="px-4 py-3 text-center font-bold text-gray-800 dark:text-slate-100">{standing.points}</td>
                <td className="px-4 py-3 text-center">
                  <TeamFormBadge form={standing.form} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
