import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Teams } from './pages/Teams';
import { Leagues } from './pages/Leagues';
import { LeagueDetail } from './pages/LeagueDetail';
import { Matches } from './pages/Matches';
import { Rankings } from './pages/Rankings';
import { Standings } from './pages/Standings';
import { Simulation } from './pages/Simulation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leagues/:id" element={<LeagueDetail />} />
            <Route path="/leagues/:id/standings" element={<Standings />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/simulation" element={
              <ProtectedRoute adminOnly><Simulation /></ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
