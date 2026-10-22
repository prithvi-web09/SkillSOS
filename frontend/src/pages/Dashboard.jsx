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
  Inbox
} from 'lucide-react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import RequestCard from '../components/RequestCard';
import VolunteerModal from '../components/VolunteerModal';

export default function Dashboard({ showToast }) {
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    acceptedRequests: 0,
    resolvedRequests: 0,
    uniqueVolunteers: 0,
    resolutionPercentage: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [highPriorityRequests, setHighPriorityRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setRecentRequests(requestsData.slice(0, 6));
      setHighPriorityRequests(
        requestsData.filter(r => r.priority === 'HIGH' && r.status === 'OPEN').slice(0, 3)
      );
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
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
      showToast?.('Thank you for volunteering! The request has been updated.', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to accept request.', 'error');
      throw err;
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
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
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={14} /> Campus Peer Support Network
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '14px', color: '#ffffff' }}>
            Need help on campus? <br />
            <span style={{ color: 'var(--accent-primary)' }}>Your fellow students are ready.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', marginBottom: '24px', lineHeight: 1.6 }}>
            SkillSOS connects students in need with peers who can lend calculators, share practical notes, explain programming concepts, or help find misplaced items.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <Link to="/create" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <PlusCircle size={18} />
              Post a Help Request
            </Link>
            <Link to="/requests" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
              Explore Requests
              <ArrowRight size={18} />
            </Link>
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
          subtitle="All recorded peer requests"
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
          label="Student Volunteers"
          accentColor="#ec4899"
          subtitle="Unique peer contributors"
        />
        <StatCard
          icon={LifeBuoy}
          number={`${stats.resolutionPercentage}%`}
          label="Resolution Rate"
          accentColor="#f59e0b"
          subtitle="Percentage fulfilled"
        />
      </div>

      {/* Urgent High-Priority Needs */}
      {highPriorityRequests.length > 0 && (
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
                Urgent High-Priority Needs
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Immediate assistance required by fellow students right now
              </div>
            </div>
          </div>
          <div className="grid-3">
            {highPriorityRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onQuickVolunteer={(r) => setSelectedRequest(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Requests Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff' }}>
              Recent Campus Requests
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Browse recently published student help requests
            </div>
          </div>
          <Link to="/requests" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
            View all ({stats.totalRequests}) <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: '36px', height: '36px' }} />
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-state-icon" />
            <h3 className="empty-state-title">No requests yet</h3>
            <p className="empty-state-desc">
              Be the first to post a campus assistance request or volunteer for a peer.
            </p>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={16} /> Create First Request
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {recentRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onQuickVolunteer={(r) => setSelectedRequest(r)}
              />
            ))}
          </div>
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
