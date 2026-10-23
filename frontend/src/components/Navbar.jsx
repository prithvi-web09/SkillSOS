import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  LogOut,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        {user ? (
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

            {/* Logged In Student Identity Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              marginLeft: '4px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: user.roleColor || 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.8rem'
              }}>
                {user.avatarInitial || user.name?.charAt(0) || 'S'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  @{user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out / Switch Student"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            {getStatusBadge()}
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <UserCheck size={16} />
              Student Login
            </Link>
          </div>
        )}

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
        {user ? (
          <>
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: user.roleColor || 'var(--accent-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700'
                }}>
                  {user.avatarInitial || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.department}</div>
                </div>
              </div>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
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
          </>
        ) : (
          <NavLink to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
            <UserCheck size={18} />
            Student Login
          </NavLink>
        )}
        <div style={{ marginTop: '8px', padding: '4px 8px' }}>
          {getStatusBadge()}
        </div>
      </div>
    </nav>
  );
}
