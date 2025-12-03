import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
      {import.meta.env.MODE !== 'production' && (
        <div className="text-xs bg-yellow-100 text-yellow-900 border-b border-yellow-300 px-3 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="font-semibold">Debug:</span>
            <span>API_URL: {import.meta.env.VITE_API_URL || '(default) https://url-shortener-production-c83f.up.railway.app'}</span>
            <span className="mt-1 sm:mt-0">BASE_URL: {import.meta.env.VITE_BASE_URL || 'https://url-shortener-production-c83f.up.railway.app'}</span>
            <span className="mt-1 sm:mt-0">MODE: {import.meta.env.MODE}</span>
          </div>
        </div>
      )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/:id"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
