import { useAuth } from '../context/AuthContext';

export function TeamCard({ team, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="h-32 w-32 object-contain"
          />
        ) : (
          <span className="text-6xl">⚽</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
        <p className="text-gray-500 text-sm">{team.city}</p>
        {team.stadium && (
          <p className="text-gray-400 text-xs mt-1">🏟️ {team.stadium}</p>
        )}
      </div>

      {isAdmin && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => onEdit(team)}
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(team)}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
