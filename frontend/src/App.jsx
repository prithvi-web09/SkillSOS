import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import Dashboard from './pages/Dashboard';
import ExploreRequests from './pages/ExploreRequests';
import CreateRequest from './pages/CreateRequest';
import RequestDetails from './pages/RequestDetails';
import MyActivity from './pages/MyActivity';
import HowItWorks from './pages/HowItWorks';
import CampusResources from './pages/CampusResources';
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
    <BrowserRouter>
      <div className="app-container">
        {/* Campus emergency disclaimer banner */}
        <DisclaimerBanner />

        {/* Global sticky navigation bar */}
        <Navbar />

        {/* Main Routed Page Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard showToast={showToast} />} />
            <Route path="/requests" element={<ExploreRequests showToast={showToast} />} />
            <Route path="/requests/:id" element={<RequestDetails showToast={showToast} />} />
            <Route path="/create" element={<CreateRequest showToast={showToast} />} />
            <Route path="/activity" element={<MyActivity />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/campus-resources" element={<CampusResources />} />
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
    </BrowserRouter>
  );
}
