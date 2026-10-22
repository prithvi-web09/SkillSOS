import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResolveModal({ request, isOpen, onClose, onSuccess }) {
  const [resolverEmail, setResolverEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resolverEmail.trim()) {
      setError('Please provide your campus email address.');
      return;
    }

    try {
      setLoading(true);
      await onSuccess({ resolverEmail: resolverEmail.trim() });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to mark request as resolved.');
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
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="modal-title">Mark Request as Resolved</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Completing: {request.title}
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
            <label className="form-label">Your Campus Email (Requester or Helper)</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. yourname@campus.edu"
              value={resolverEmail}
              onChange={(e) => setResolverEmail(e.target.value)}
              required
            />
            <div className="form-hint">
              Verification check: Only the requester or registered volunteers can mark this request as resolved.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Resolving...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
