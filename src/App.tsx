import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}
