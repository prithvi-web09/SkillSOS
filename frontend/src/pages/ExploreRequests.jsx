import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, RefreshCw, AlertCircle, Inbox } from 'lucide-react';
import { api } from '../services/api';
import RequestCard from '../components/RequestCard';
import FilterBar from '../components/FilterBar';
import VolunteerModal from '../components/VolunteerModal';

export default function ExploreRequests({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
    sortBy: 'newest'
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRequests(filters);
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load requests from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      priority: '',
      status: '',
      sortBy: 'newest'
    });
  };

  const handleVolunteerSuccess = async (volunteerPayload) => {
    if (!selectedRequest) return;
    try {
      await api.acceptRequest(selectedRequest.id, volunteerPayload);
      showToast?.('You have successfully volunteered for this request!', 'success');
      loadRequests();
    } catch (err) {
      showToast?.(err.message || 'Failed to accept request.', 'error');
      throw err;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            Explore Campus Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Find requests you can assist with, or check progress across your campus.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadRequests}
            className="btn btn-secondary"
            title="Refresh requests"
            aria-label="Refresh requests"
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            Refresh
          </button>
          <Link to="/create" className="btn btn-primary">
            <PlusCircle size={16} />
            Post Request
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          color: '#fca5a5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button onClick={loadRequests} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-state-icon" />
          <h3 className="empty-state-title">No matching requests found</h3>
          <p className="empty-state-desc">
            {filters.search || filters.category || filters.priority || filters.status
              ? 'Try adjusting your search criteria or resetting the filters.'
              : 'There are currently no active help requests on the network.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {(filters.search || filters.category || filters.priority || filters.status) && (
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            )}
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={16} /> Create Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {requests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              onQuickVolunteer={(r) => setSelectedRequest(r)}
            />
          ))}
        </div>
      )}

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
