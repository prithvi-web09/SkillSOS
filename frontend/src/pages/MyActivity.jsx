import React, { useState, useEffect } from 'react';
import { Search, Clock, PlusCircle, HeartHandshake, AlertCircle, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';

export default function MyActivity() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [searchedEmail, setSearchedEmail] = useState('');
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('created');

  const fetchForEmail = async (targetEmail) => {
    if (!targetEmail.trim()) return;
    try {
      setLoading(true);
      setError('');
      const data = await api.getActivity(targetEmail.trim());
      setActivity(data);
      setSearchedEmail(targetEmail.trim());
    } catch (err) {
      setError(err.message || 'Failed to retrieve activity for this email.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      fetchForEmail(user.email);
    }
  }, [user]);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide a campus email address.');
      return;
    }

    fetchForEmail(email.trim());
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
          My Campus Activity
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Demonstration lookup to review campus requests you published or volunteered for.
        </p>
      </div>

      {/* Security Disclaimer Box */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontSize: '0.85rem',
        color: '#93c5fd'
      }}>
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#60a5fa' }} />
        <div>
          <strong style={{ color: '#ffffff' }}>Demonstration Lookup Notice:</strong>
          <span style={{ display: 'block', marginTop: '3px', color: 'var(--text-secondary)' }}>
            This lookup queries public request and volunteer records associated with your campus email address. It is intended for project demonstration and viva evaluation and does not constitute an authenticated session.
          </span>
        </div>
      </div>

      {/* Search Input Form */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <input
              type="email"
              className="form-input"
              placeholder="Enter student campus email (e.g. rohan@campus.edu)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
            {loading ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }} />
            ) : (
              <>
                <Search size={16} /> Look Up
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {activity && (
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button
              onClick={() => setActiveTab('created')}
              className="btn"
              style={{
                background: activeTab === 'created' ? 'var(--accent-subtle)' : 'transparent',
                color: activeTab === 'created' ? '#ffffff' : 'var(--text-secondary)',
                border: activeTab === 'created' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                fontSize: '0.9rem'
              }}
            >
              <PlusCircle size={16} />
              Requests Created ({activity.createdRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('volunteered')}
              className="btn"
              style={{
                background: activeTab === 'volunteered' ? 'var(--accent-subtle)' : 'transparent',
                color: activeTab === 'volunteered' ? '#ffffff' : 'var(--text-secondary)',
                border: activeTab === 'volunteered' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                fontSize: '0.9rem'
              }}
            >
              <HeartHandshake size={16} />
              Volunteered For ({activity.volunteeredRequests?.length || 0})
            </button>
          </div>

          {activeTab === 'created' && (
            <div>
              {(!activity.createdRequests || activity.createdRequests.length === 0) ? (
                <div className="empty-state">
                  <Clock className="empty-state-icon" />
                  <h3 className="empty-state-title">No requests published</h3>
                  <p className="empty-state-desc">
                    No campus help requests have been posted under {searchedEmail}.
                  </p>
                  <Link to="/create" className="btn btn-primary">
                    <PlusCircle size={16} /> Post a Help Request
                  </Link>
                </div>
              ) : (
                <div className="grid-3">
                  {activity.createdRequests.map(req => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'volunteered' && (
            <div>
              {(!activity.volunteeredRequests || activity.volunteeredRequests.length === 0) ? (
                <div className="empty-state">
                  <HeartHandshake className="empty-state-icon" />
                  <h3 className="empty-state-title">No volunteer participations recorded</h3>
                  <p className="empty-state-desc">
                    {searchedEmail} has not volunteered for any open campus requests yet.
                  </p>
                  <Link to="/requests" className="btn btn-secondary">
                    Browse Requests to Help
                  </Link>
                </div>
              ) : (
                <div className="grid-3">
                  {activity.volunteeredRequests.map(req => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
