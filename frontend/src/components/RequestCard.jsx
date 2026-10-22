import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Clock, Users, ArrowRight, ShieldAlert } from 'lucide-react';

const CATEGORY_NAMES = {
  ACADEMIC_HELP: 'Academic Help',
  NOTES_AND_STUDY_MATERIAL: 'Notes & Material',
  BORROW_OR_LEND: 'Borrow / Lend',
  LOST_AND_FOUND: 'Lost & Found',
  CAMPUS_NAVIGATION: 'Campus Navigation',
  PROGRAMMING_HELP: 'Programming Help',
  OTHER: 'Other'
};

export default function RequestCard({ request, onQuickVolunteer }) {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return <span className="badge badge-status-open">Open</span>;
      case 'ACCEPTED':
        return <span className="badge badge-status-accepted">In Progress</span>;
      case 'RESOLVED':
        return <span className="badge badge-status-resolved">Resolved</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return <span className="badge badge-priority-high">High Priority</span>;
      case 'NORMAL':
        return <span className="badge badge-priority-normal">Normal</span>;
      case 'LOW':
        return <span className="badge badge-priority-low">Low</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Badges Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '14px' }}>
        {getStatusBadge(request.status)}
        {getPriorityBadge(request.priority)}
        <span className="badge badge-category">
          {CATEGORY_NAMES[request.category] || request.category}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff', lineHeight: 1.4 }}>
        <Link to={`/requests/${request.id}`} style={{ color: 'inherit' }}>
          {request.title}
        </Link>
      </h3>

      {/* Description Snippet */}
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {request.description}
      </p>

      {/* Metadata */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '12px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <User size={14} color="var(--accent-primary)" />
          <span>{request.requesterName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {request.campusLocation}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            <span>{formatDate(request.createdAt)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: request.volunteerCount > 0 ? '#38bdf8' : 'var(--text-muted)' }}>
            <Users size={14} />
            <span style={{ fontWeight: '600' }}>{request.volunteerCount || 0} helpers</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/requests/${request.id}`} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}>
          Details
          <ArrowRight size={14} />
        </Link>
        {request.status === 'OPEN' && onQuickVolunteer && (
          <button
            onClick={() => onQuickVolunteer(request)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
          >
            I'll Help
          </button>
        )}
      </div>
    </div>
  );
}
