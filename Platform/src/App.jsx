import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login'; 
import AdminDashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Tickets from './pages/Tickets';
import Attendees from './pages/Attendees';
import Settings from './pages/Settings';

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Halaman Utama User */}
        <Route path="/" element={<Home />} />

        {/* 2. Halaman Login (Harus di luar struktur admin) */}
        <Route path="/login" element={<Login />} />

        {/* 3. Area Khusus Admin yang Dilindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<CreateEvent />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="attendees" element={<Attendees />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}