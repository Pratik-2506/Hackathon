import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import History from './pages/History';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import About from './pages/About';
import Garden from './pages/Garden';
import Journal from './pages/Journal';
import Calm from './pages/Calm';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/calm" element={<Calm />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="about" element={<About />} />

          <Route path="onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
          <Route path="/garden" element={<ProtectedRoute><Garden /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
