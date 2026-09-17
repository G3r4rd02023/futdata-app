import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLink = ({ to, children, onClick, mobile = false }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`rounded-lg text-sm font-medium transition-all duration-200 ${
          mobile ? 'block px-3 py-2' : 'px-3 py-2'
        } ${
          isActive
            ? 'bg-green-800 dark:bg-green-600 text-white shadow-md'
            : 'text-green-100 hover:bg-green-600 dark:hover:bg-green-700 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  const navItems = (
    <>
      <NavLink to="/" onClick={() => setIsMenuOpen(false)} mobile={false}>Inicio</NavLink>
      <NavLink to="/teams" onClick={() => setIsMenuOpen(false)} mobile={false}>Equipos</NavLink>
      <NavLink to="/leagues" onClick={() => setIsMenuOpen(false)} mobile={false}>Ligas</NavLink>
      <NavLink to="/matches" onClick={() => setIsMenuOpen(false)} mobile={false}>Partidos</NavLink>
      <NavLink to="/rankings" onClick={() => setIsMenuOpen(false)} mobile={false}>Rankings</NavLink>
      {isAdmin && (
        <NavLink to="/simulation" onClick={() => setIsMenuOpen(false)} mobile={false}>Simulación</NavLink>
      )}
    </>
  );

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
            {navItems}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-800 dark:bg-slate-600 hover:bg-green-900 dark:hover:bg-slate-500 transition-all duration-200"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
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

            <button
              type="button"
              className="md:hidden p-2 rounded-lg bg-green-800 dark:bg-slate-600 hover:bg-green-900 dark:hover:bg-slate-500 transition-all duration-200"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {user && (
              <>
                <span className="text-sm hidden sm:block text-green-100">
                  Hola, <span className="font-semibold">{user.username}</span>
                  {isAdmin && <span className="ml-1 text-yellow-300 font-medium">(Admin)</span>}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-green-800 dark:bg-slate-600 hover:bg-red-600 dark:hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-3 space-y-1">
            {[
              { to: '/', label: 'Inicio' },
              { to: '/teams', label: 'Equipos' },
              { to: '/leagues', label: 'Ligas' },
              { to: '/matches', label: 'Partidos' },
              { to: '/rankings', label: 'Rankings' },
              ...(isAdmin ? [{ to: '/simulation', label: 'Simulación' }] : [])
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                mobile={true}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
