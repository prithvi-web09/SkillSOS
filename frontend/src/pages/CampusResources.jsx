import React, { useState, useEffect } from 'react';
import { Building, MapPin, Clock, Mail, BookOpen, Layers, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function CampusResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCampusResources();
      setResources(data);
    } catch (err) {
      setError(err.message || 'Failed to load campus resources from XML parser.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <Layers size={13} /> Java Lab Syllabus: XML &amp; DOM Demonstration
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            Campus Resources Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
            Parsed server-side from <code>campus-resources.xml</code> using Java's W3C DOM parser (<code>DocumentBuilderFactory</code>).
          </p>
        </div>
        <button onClick={loadResources} className="btn btn-secondary" title="Reload from XML">
          <RefreshCw size={16} className={loading ? 'spinner' : ''} />
          Reload XML
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#fca5a5'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <Building className="empty-state-icon" />
          <h3 className="empty-state-title">No resources available</h3>
          <p className="empty-state-desc">The XML campus directory file could not be parsed or contains no records.</p>
        </div>
      ) : (
        <div className="grid-3">
          {resources.map(res => (
            <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-category" style={{ color: 'var(--accent-primary)', borderColor: 'rgba(59,130,246,0.3)' }}>
                  {res.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {res.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                {res.name}
              </h3>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, lineHeight: 1.5 }}>
                {res.description}
              </p>

              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <Building size={14} color="#f59e0b" />
                  <span>{res.building} — {res.floor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} />
                  <span>{res.timings}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#38bdf8" />
                  <span>{res.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
