import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">⚽ FutData</span>
          </Link>

          <nav className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/teams"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/teams' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              Equipos
            </Link>
            <Link
              to="/leagues"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/leagues' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              Ligas
            </Link>
            <Link
              to="/matches"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/matches' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              Partidos
            </Link>
            <Link
              to="/rankings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/rankings' ? 'bg-green-800' : 'hover:bg-green-600'
              }`}
            >
              Rankings
            </Link>
            {isAdmin && (
              <Link
                to="/simulation"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/simulation' ? 'bg-green-800' : 'hover:bg-green-600'
                }`}
              >
                Simulación
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm hidden sm:block">
                  Hola, {user.username}
                  {isAdmin && <span className="ml-1 text-yellow-300">(Admin)</span>}
                </span>
                <button
                  onClick={logout}
                  className="bg-green-800 hover:bg-green-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
