import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Inbox,
  UserCheck,
  HeartHandshake
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import RequestCard from '../components/RequestCard';
import VolunteerModal from '../components/VolunteerModal';

export default function Dashboard({ showToast }) {
  const { user, login, demoAccounts } = useAuth();

  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    acceptedRequests: 0,
    resolvedRequests: 0,
    uniqueVolunteers: 0,
    resolutionPercentage: 0
  });
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('peers'); // 'peers' | 'mine' | 'all'

  const loadData = async () => {
    try {
      setLoading(true);

      const [statsData, requestsData] = await Promise.all([
        api.getStats().catch(() => ({
          totalRequests: 0,
          openRequests: 0,
          acceptedRequests: 0,
          resolvedRequests: 0,
          uniqueVolunteers: 0,
          resolutionPercentage: 0
        })),
        api.getRequests({ sortBy: 'newest' }).catch(() => [])
      ]);

      setStats(statsData);
      setAllRequests(requestsData);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVolunteerSuccess = async (volunteerPayload) => {
    if (!selectedRequest) return;
    try {
      await api.acceptRequest(selectedRequest.id, volunteerPayload);
      showToast?.('Thank you for volunteering! The request has been marked in progress.', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to accept request.', 'error');
      throw err;
    }
  };

  const handleSwitchAccount = async (targetUser) => {
    try {
      await login(targetUser.username, '123');
      showToast?.(`Switched student profile to ${targetUser.name}`, 'info');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter requests based on current student profile
  const userEmail = (user?.email || '').trim().toLowerCase();
  const peerRequests = allRequests.filter(r => (r.requesterEmail || '').trim().toLowerCase() !== userEmail);
  const myRequests = allRequests.filter(r => (r.requesterEmail || '').trim().toLowerCase() === userEmail);
  const urgentRequests = peerRequests.filter(r => r.priority === 'HIGH' && r.status === 'OPEN');

  return (
    <div>
      {/* Personalized Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={14} /> Student Dashboard &bull; {user?.department || 'Campus Peer Network'}
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '12px', color: '#ffffff' }}>
              Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Student'}</span>! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: '22px', lineHeight: 1.6 }}>
              You are signed in as <strong>{user?.email}</strong>. Browse assistance requests from your classmates, volunteer with 1 click, or publish a new request when you need help.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link to="/create" className="btn btn-primary" style={{ padding: '11px 22px', fontSize: '0.92rem' }}>
                <PlusCircle size={17} />
                Post New Help Request
              </Link>
              <Link to="/requests" className="btn btn-secondary" style={{ padding: '11px 18px', fontSize: '0.92rem' }}>
                Browse All Requests
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Quick Viva Switcher Pill */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            minWidth: '240px'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Quick Switch Student Account:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {demoAccounts.map(acc => {
                const isActive = acc.username === user?.username;
                return (
                  <button
                    key={acc.username}
                    onClick={() => handleSwitchAccount(acc)}
                    style={{
                      background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isActive ? '#10b981' : 'var(--text-muted)'
                      }} />
                      <span style={{ fontWeight: isActive ? '700' : '500' }}>{acc.name}</span>
                    </div>
                    {isActive ? (
                      <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>ACTIVE</span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Switch &rarr;</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Real Platform Statistics */}
      <div className="grid-stats">
        <StatCard
          icon={Inbox}
          number={stats.totalRequests}
          label="Total Requests"
          accentColor="#3b82f6"
          subtitle="All campus requests"
        />
        <StatCard
          icon={Clock}
          number={stats.openRequests}
          label="Open Requests"
          accentColor="#10b981"
          subtitle="Awaiting peer helpers"
        />
        <StatCard
          icon={TrendingUp}
          number={stats.acceptedRequests}
          label="In Progress"
          accentColor="#38bdf8"
          subtitle="Currently being resolved"
        />
        <StatCard
          icon={CheckCircle2}
          number={stats.resolvedRequests}
          label="Resolved"
          accentColor="#a855f7"
          subtitle="Successfully fulfilled"
        />
        <StatCard
          icon={Users}
          number={stats.uniqueVolunteers}
          label="Peer Helpers"
          accentColor="#ec4899"
          subtitle="Unique student volunteers"
        />
        <StatCard
          icon={LifeBuoy}
          number={`${stats.resolutionPercentage}%`}
          label="Resolution Rate"
          accentColor="#f59e0b"
          subtitle="Percentage fulfilled"
        />
      </div>

      {/* Urgent High-Priority Needs from Peers */}
      {urgentRequests.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff' }}>
                Urgent High-Priority Peer Needs
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Immediate assistance required by your classmates right now
              </div>
            </div>
          </div>
          <div className="grid-3">
            {urgentRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onQuickVolunteer={(r) => setSelectedRequest(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Peer Help Exchange Area */}
      <div style={{ marginTop: '36px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('peers')}
              style={{
                background: activeTab === 'peers' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'peers' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeTab === 'peers' ? 'var(--accent-primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Users size={16} />
              Peer Requests From Classmates ({peerRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              style={{
                background: activeTab === 'mine' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'mine' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeTab === 'mine' ? 'var(--accent-primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <UserCheck size={16} />
              My Requests ({myRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'all' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeTab === 'all' ? 'var(--accent-primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Inbox size={16} />
              All Campus Requests ({allRequests.length})
            </button>
          </div>

          <Link to="/requests" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.88rem', fontWeight: '600' }}>
            Search &amp; Filter Requests <ArrowRight size={15} />
          </Link>
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: '36px', height: '36px' }} />
          </div>
        ) : activeTab === 'peers' ? (
          peerRequests.length === 0 ? (
            <div className="empty-state">
              <HeartHandshake className="empty-state-icon" />
              <h3 className="empty-state-title">No other peer requests open right now</h3>
              <p className="empty-state-desc">
                When another classmate logs in and creates a help request, it will appear here instantly for you to volunteer.
              </p>
              <Link to="/create" className="btn btn-secondary">
                <PlusCircle size={16} /> Post Your Own Request
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Showing requests published by other students. Click <strong>"I'll Help"</strong> to accept and assist them.
              </p>
              <div className="grid-3">
                {peerRequests.map(req => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onQuickVolunteer={(r) => setSelectedRequest(r)}
                  />
                ))}
              </div>
            </div>
          )
        ) : activeTab === 'mine' ? (
          myRequests.length === 0 ? (
            <div className="empty-state">
              <Inbox className="empty-state-icon" />
              <h3 className="empty-state-title">You haven't posted any help requests yet</h3>
              <p className="empty-state-desc">
                Need a scientific calculator, practical notes, or help with Java programming? Create a request now.
              </p>
              <Link to="/create" className="btn btn-primary">
                <PlusCircle size={16} /> Post Your First Request
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                These are requests you created as <strong>{user?.name}</strong>. Fellow classmates can volunteer to help you.
              </p>
              <div className="grid-3">
                {myRequests.map(req => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onQuickVolunteer={(r) => setSelectedRequest(r)}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          allRequests.length === 0 ? (
            <div className="empty-state">
              <Inbox className="empty-state-icon" />
              <h3 className="empty-state-title">No requests recorded yet</h3>
              <p className="empty-state-desc">
                Be the first to post a campus assistance request.
              </p>
              <Link to="/create" className="btn btn-primary">
                <PlusCircle size={16} /> Create Request
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {allRequests.map(req => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onQuickVolunteer={(r) => setSelectedRequest(r)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Volunteer Modal */}
      <VolunteerModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={handleVolunteerSuccess}
      />
    </div>
  );
}
