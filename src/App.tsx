import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import { ToastProvider } from './components/ui/Toast';
import { PWAUpdatePrompt, PWAInstallBanner } from './components/PWAPrompt';

export default function App() {
  return (
    <>
      <ToastProvider />
      <PWAUpdatePrompt />
      <PWAInstallBanner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}
