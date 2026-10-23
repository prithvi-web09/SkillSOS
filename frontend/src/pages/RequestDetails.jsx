import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  User,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  RefreshCw,
  HeartHandshake,
  AlertCircle,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VolunteerModal from '../components/VolunteerModal';
import ResolveModal from '../components/ResolveModal';
import ReopenModal from '../components/ReopenModal';

const CATEGORY_NAMES = {
  ACADEMIC_HELP: 'Academic Help',
  NOTES_AND_STUDY_MATERIAL: 'Notes & Study Material',
  BORROW_OR_LEND: 'Borrow or Lend',
  LOST_AND_FOUND: 'Lost & Found',
  CAMPUS_NAVIGATION: 'Campus Navigation',
  PROGRAMMING_HELP: 'Programming Help',
  OTHER: 'Other'
};

export default function RequestDetails({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reqData, volData] = await Promise.all([
        api.getRequestById(id),
        api.getVolunteers(id).catch(() => [])
      ]);
      setRequest(reqData);
      setVolunteers(volData);
    } catch (err) {
      setError(err.message || 'Failed to retrieve request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleVolunteerSuccess = async (payload) => {
    try {
      await api.acceptRequest(id, payload);
      showToast?.('You have successfully volunteered for this request!', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to accept request.', 'error');
      throw err;
    }
  };

  const handleResolveSuccess = async (payload) => {
    try {
      await api.resolveRequest(id, payload);
      showToast?.('Request marked as RESOLVED! Thank you for supporting your campus peers.', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to resolve request.', 'error');
      throw err;
    }
  };

  const handleReopenSuccess = async (payload) => {
    try {
      await api.reopenRequest(id, payload);
      showToast?.('Request has been reopened and returned to OPEN status.', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to reopen request.', 'error');
      throw err;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="empty-state" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle className="empty-state-icon" style={{ color: '#ef4444' }} />
        <h3 className="empty-state-title">Request Not Found</h3>
        <p className="empty-state-desc">{error || 'This campus request does not exist or has been removed.'}</p>
        <Link to="/requests" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Explore Requests
        </Link>
      </div>
    );
  }

  const isStatusOpen = request.status === 'OPEN';
  const isStatusAccepted = request.status === 'ACCEPTED';
  const isStatusResolved = request.status === 'RESOLVED';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/requests')}
        className="btn btn-secondary"
        style={{ marginBottom: '20px', fontSize: '0.85rem', padding: '6px 14px' }}
      >
        <ArrowLeft size={16} /> Back to Requests
      </button>

      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        {/* Status & Priority Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {isStatusOpen && <span className="badge badge-status-open" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>Open for Volunteers</span>}
            {isStatusAccepted && <span className="badge badge-status-accepted" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>In Progress (Accepted)</span>}
            {isStatusResolved && <span className="badge badge-status-resolved" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>Resolved &amp; Completed</span>}

            <span className={`badge badge-priority-${request.priority?.toLowerCase()}`}>
              {request.priority} Priority
            </span>

            <span className="badge badge-category">
              <Tag size={12} style={{ marginRight: '4px' }} />
              {CATEGORY_NAMES[request.category] || request.category}
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ID: {request.id}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '18px', lineHeight: 1.3 }}>
          {request.title}
        </h1>

        {/* Description */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '28px',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          color: 'var(--text-primary)'
        }}>
          {request.description}
        </div>

        {/* Key Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Requester
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
              <User size={16} color="var(--accent-primary)" />
              <span>{request.requesterName}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {request.requesterEmail}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Location
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
              <MapPin size={16} color="#f59e0b" />
              <span>{request.campusLocation}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Timing / Deadline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
              <Clock size={16} color="#38bdf8" />
              <span>{request.deadline || 'Flexible / As soon as possible'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Timeline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Calendar size={15} />
              <span>Created: {formatDate(request.createdAt)}</span>
            </div>
            {request.resolvedAt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#a855f7', marginTop: '2px' }}>
                <CheckCircle size={15} />
                <span>Resolved: {formatDate(request.resolvedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons conditioned on Request Lifecycle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {(() => {
            const isOwner = user?.email && request?.requesterEmail &&
              user.email.trim().toLowerCase() === request.requesterEmail.trim().toLowerCase();

            if (isStatusOpen) {
              if (isOwner) {
                return (
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontSize: '0.88rem'
                  }}>
                    You created this request. Awaiting peer helpers to volunteer.
                  </div>
                );
              }
              return (
                <button
                  onClick={() => setVolunteerModalOpen(true)}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <HeartHandshake size={18} />
                  I'll Help (Volunteer)
                </button>
              );
            }

            if (isStatusAccepted) {
              return (
                <button
                  onClick={() => setResolveModalOpen(true)}
                  className="btn btn-success"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <CheckCircle size={18} />
                  Mark as Resolved
                </button>
              );
            }

            if (isStatusResolved) {
              return (
                <button
                  onClick={() => setReopenModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                >
                  <RefreshCw size={18} />
                  Reopen Request
                </button>
              );
            }

            return null;
          })()}
        </div>
      </div>

      {/* Volunteers Participation Section */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Users size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
            Registered Peer Helpers ({volunteers.length})
          </h2>
        </div>

        {volunteers.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            No students have stepped forward to volunteer for this request yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {volunteers.map((vol, idx) => (
              <div
                key={vol.id || idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}>
                    {vol.volunteerName ? vol.volunteerName.charAt(0).toUpperCase() : 'H'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>
                      {vol.volunteerName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {vol.volunteerEmail}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Volunteered {formatDate(vol.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <VolunteerModal
        request={request}
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        onSuccess={handleVolunteerSuccess}
      />

      <ResolveModal
        request={request}
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        onSuccess={handleResolveSuccess}
      />

      <ReopenModal
        request={request}
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        onSuccess={handleReopenSuccess}
      />
    </div>
  );
}
