import React, { useState } from 'react';
import { X, HeartHandshake, AlertCircle } from 'lucide-react';

export default function VolunteerModal({ request, isOpen, onClose, onSuccess }) {
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!volunteerName.trim() || !volunteerEmail.trim()) {
      setError('Please provide both your name and campus email address.');
      return;
    }

    if (volunteerEmail.trim().toLowerCase() === request.requesterEmail?.trim().toLowerCase()) {
      setError('You cannot volunteer for your own request (Rule 5).');
      return;
    }

    try {
      setLoading(true);
      await onSuccess({
        volunteerName: volunteerName.trim(),
        volunteerEmail: volunteerEmail.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register volunteer offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h3 className="modal-title">Volunteer to Help</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Accepting request: {request.title}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fca5a5',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Priya Sharma"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Campus Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. priya.s@campus.edu"
              value={volunteerEmail}
              onChange={(e) => setVolunteerEmail(e.target.value)}
              required
            />
            <div className="form-hint">
              Used to record participation and contact you regarding this assistance.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Confirming...' : "Confirm: I'll Help"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
