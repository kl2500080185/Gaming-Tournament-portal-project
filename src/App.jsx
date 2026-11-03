import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicLayout from './components/PublicLayout';
import Toast from './components/Toast';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetails from './pages/TournamentDetails';
import Information from './pages/Information';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { useApp } from './context/AppContext';
import useToast from './hooks/useToast';

export default function App() {
  const { currentUser } = useApp();
  const { toast, notify, dismiss } = useToast();
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  const protectedPage = (element, role) => {
    if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    if (role && currentUser.role !== role) return <Navigate to="/dashboard" replace />;
    return element;
  };
  return <>
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetails notify={notify} />} />
        <Route path="/about" element={<Information page="about" />} />
        <Route path="/contact" element={<Information page="contact" notify={notify} />} />
        <Route path="/faq" element={<Information page="faq" />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Auth mode="login" notify={notify} />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" replace /> : <Auth mode="signup" notify={notify} />} />
        <Route path="/dashboard/*" element={protectedPage(<Dashboard notify={notify} />)} />
        <Route path="*" element={<Information page="not-found" />} />
      </Routes>
    </PublicLayout>
    <Toast toast={toast} onClose={dismiss} />
  </>;
}
