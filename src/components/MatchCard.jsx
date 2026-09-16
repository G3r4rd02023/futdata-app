import { useAuth } from '../context/AuthContext';

export function MatchCard({ match, onEdit, onDelete, onResult, onChangeStatus }) {
  const { isAdmin } = useAuth();

  const statusConfig = {
    Programado: { color: 'bg-blue-100 text-blue-800', icon: '📅' },
    EnJuego: { color: 'bg-yellow-100 text-yellow-800', icon: '⚽' },
    Finalizado: { color: 'bg-green-100 text-green-800', icon: '✅' },
    Postergado: { color: 'bg-gray-100 text-gray-600', icon: '⏳' }
  };

  const config = statusConfig[match.status] || statusConfig.Programado;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">
            {match.leagueName}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
            {config.icon} {match.status}
          </span>
        </div>
        {match.round && (
          <span className="text-green-100 text-xs">Jornada {match.round}</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {match.homeTeamLogo ? (
                <img src={match.homeTeamLogo} alt="" className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-2xl">⚽</span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-800">{match.homeTeamName}</p>
          </div>

          <div className="text-center px-4">
            {match.status === 'Finalizado' && match.homeGoals != null && match.awayGoals != null ? (
              <span className="text-2xl font-bold text-gray-800">
                {match.homeGoals} - {match.awayGoals}
              </span>
            ) : (
              <span className="text-xl font-bold text-gray-400">vs</span>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {match.awayTeamLogo ? (
                <img src={match.awayTeamLogo} alt="" className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-2xl">⚽</span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-800">{match.awayTeamName}</p>
          </div>
        </div>

        <div className="mt-3 text-center text-sm text-gray-500">
          {new Date(match.matchDate).toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {match.notes && (
          <p className="mt-2 text-xs text-gray-400 text-center italic">{match.notes}</p>
        )}
      </div>

      {isAdmin && (
        <div className="px-4 pb-4 flex gap-2 flex-wrap">
          {match.status !== 'Finalizado' && (
            <>
              <button
                onClick={() => onResult(match)}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-md text-sm hover:bg-green-600 transition-colors"
              >
                Resultado
              </button>
              <button
                onClick={() => onEdit(match)}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            </>
          )}
          {match.status !== 'Finalizado' && (
            <button
              onClick={() => onDelete(match)}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
