import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import Dashboard from './pages/Dashboard';
import ExploreRequests from './pages/ExploreRequests';
import CreateRequest from './pages/CreateRequest';
import RequestDetails from './pages/RequestDetails';
import MyActivity from './pages/MyActivity';
import HowItWorks from './pages/HowItWorks';
import CampusResources from './pages/CampusResources';
import Login from './pages/Login';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AuthProvider>
      <HashRouter>
        <div className="app-container">
          {/* Campus emergency disclaimer banner */}
          <DisclaimerBanner />

          {/* Global sticky navigation bar */}
          <Navbar />

          {/* Main Routed Page Content */}
          <main className="main-content">
            <Routes>
              {/* Public Authentication Screen */}
              <Route path="/login" element={<Login />} />

              {/* Protected Student Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <ExploreRequests showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/:id"
                element={
                  <ProtectedRoute>
                    <RequestDetails showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateRequest showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <MyActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <ProtectedRoute>
                    <HowItWorks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campus-resources"
                element={
                  <ProtectedRoute>
                    <CampusResources />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Toast Feedback Notification Container */}
          <div className="toast-container">
            {toasts.map(t => (
              <div key={t.id} className={`toast toast-${t.type}`}>
                {t.type === 'success' && <CheckCircle size={18} style={{ flexShrink: 0 }} />}
                {t.type === 'error' && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
                {t.type === 'info' && <Info size={18} style={{ flexShrink: 0 }} />}
                <span style={{ flex: 1 }}>{t.message}</span>
                <button
                  onClick={() => removeToast(t.id)}
                  style={{ background: 'transparent', color: 'inherit', padding: '2px', display: 'flex' }}
                  aria-label="Close notification"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
