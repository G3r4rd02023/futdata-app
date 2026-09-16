import { useAuth } from '../context/AuthContext';

export function LeagueCard({ league, onEdit, onDelete, onView }) {
  const { isAdmin } = useAuth();

  const statusColors = {
    Programada: 'bg-yellow-100 text-yellow-800',
    Activa: 'bg-green-100 text-green-800',
    Finalizada: 'bg-gray-100 text-gray-600'
  };

  const formatIcons = {
    Liga: '🏆',
    Copa: '🏆',
    Eliminatoria: '⚔️',
    Amistoso: '🤝'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <span className="text-5xl">{formatIcons[league.format] || '🏆'}</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{league.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[league.status] || ''}`}>
            {league.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm capitalize">{league.format}</p>

        {league.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{league.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{league.teamsCount} equipo(s)</span>
          {league.startDate && (
            <span>{new Date(league.startDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => onView(league)}
          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 transition-colors"
        >
          Ver
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(league)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-md text-sm hover:bg-gray-300 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(league)}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
