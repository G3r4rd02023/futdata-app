import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-green-800 dark:bg-green-600 text-white shadow-md'
            : 'text-green-100 hover:bg-green-600 dark:hover:bg-green-700 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-extrabold tracking-tight group-hover:scale-105 transition-transform">
              ⚽ FutData
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/teams">Equipos</NavLink>
            <NavLink to="/leagues">Ligas</NavLink>
            <NavLink to="/matches">Partidos</NavLink>
            <NavLink to="/rankings">Rankings</NavLink>
            {isAdmin && (
              <NavLink to="/simulation">Simulación</NavLink>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-800 dark:bg-slate-600 hover:bg-green-900 dark:hover:bg-slate-500 transition-all duration-200"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user && (
              <>
                <span className="text-sm hidden sm:block text-green-100">
                  Hola, <span className="font-semibold">{user.username}</span>
                  {isAdmin && <span className="ml-1 text-yellow-300 font-medium">(Admin)</span>}
                </span>
                <button
                  onClick={logout}
                  className="bg-green-800 dark:bg-slate-600 hover:bg-red-600 dark:hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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
