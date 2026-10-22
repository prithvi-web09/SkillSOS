import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LifeBuoy,
  LayoutDashboard,
  Search,
  PlusCircle,
  Clock,
  HelpCircle,
  MapPin,
  Menu,
  X,
  Server
} from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      try {
        const data = await api.checkHealth();
        if (mounted) setHealthStatus(data);
      } catch {
        if (mounted) setHealthStatus({ status: 'DOWN' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusBadge = () => {
    if (!healthStatus) return null;
    const isUp = healthStatus.status === 'UP';
    const isDegraded = healthStatus.status === 'DEGRADED';
    return (
      <div
        title={healthStatus.message || 'Backend Health'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: '600',
          background: isUp ? 'rgba(16, 185, 129, 0.15)' : isDegraded ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isUp ? '#10b981' : isDegraded ? '#f59e0b' : '#ef4444',
          border: `1px solid ${isUp ? 'rgba(16, 185, 129, 0.3)' : isDegraded ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isUp ? '#10b981' : isDegraded ? '#f59e0b' : '#ef4444'
          }}
        />
        API: {healthStatus.status || 'CHECKING'}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
          <div className="brand-icon-wrap">
            <LifeBuoy size={20} strokeWidth={2.4} />
          </div>
          <span>Skill<span className="brand-text-accent">SOS</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={17} />
            Explore Requests
          </NavLink>
          <NavLink to="/activity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Clock size={17} />
            My Activity
          </NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <HelpCircle size={17} />
            How It Works
          </NavLink>
          <NavLink to="/campus-resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MapPin size={17} />
            Directory
          </NavLink>
          {getStatusBadge()}
          <Link to="/create" className="btn nav-cta-btn">
            <PlusCircle size={16} />
            Create Request
          </Link>
        </div>

        {/* Mobile menu button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="mobile-health" style={{ display: 'none' }}>
            {getStatusBadge()}
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <Search size={18} />
          Explore Requests
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <PlusCircle size={18} />
          Create Request
        </NavLink>
        <NavLink to="/activity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <Clock size={18} />
          My Activity
        </NavLink>
        <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <HelpCircle size={18} />
          How It Works
        </NavLink>
        <NavLink to="/campus-resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
          <MapPin size={18} />
          Campus Directory
        </NavLink>
        <div style={{ marginTop: '8px', padding: '4px 8px' }}>
          {getStatusBadge()}
        </div>
      </div>
    </nav>
  );
}
