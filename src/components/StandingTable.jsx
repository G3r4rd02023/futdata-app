import { TeamFormBadge } from './TeamFormBadge';

export function StandingTable({ standings, showTeamLink = false, onTeamClick }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No hay datos de posiciones disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">PJ</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">G</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">E</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">P</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">GF</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">GC</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">DG</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-12">Pts</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standings.map((standing) => (
              <tr
                key={standing.teamId}
                className={`hover:bg-gray-50 transition-colors ${standing.position <= 3 ? 'bg-green-50/30' : ''}`}
              >
                <td className="px-4 py-3 font-bold text-gray-800">{standing.position}</td>
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
                    <span className="font-medium text-gray-800">{standing.teamName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.played}</td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.won}</td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.drawn}</td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.lost}</td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.goalsFor}</td>
                <td className="px-4 py-3 text-center text-gray-600">{standing.goalsAgainst}</td>
                <td className={`px-4 py-3 text-center font-medium ${standing.goalDifference > 0 ? 'text-green-600' : standing.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                </td>
                <td className="px-4 py-3 text-center font-bold text-gray-800">{standing.points}</td>
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
