import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'ACADEMIC_HELP', label: 'Academic Help' },
  { value: 'NOTES_AND_STUDY_MATERIAL', label: 'Notes & Study Material' },
  { value: 'BORROW_OR_LEND', label: 'Borrow or Lend' },
  { value: 'LOST_AND_FOUND', label: 'Lost & Found' },
  { value: 'CAMPUS_NAVIGATION', label: 'Campus Navigation' },
  { value: 'PROGRAMMING_HELP', label: 'Programming Help' },
  { value: 'OTHER', label: 'Other' },
];

const PRIORITIES = [
  { value: '', label: 'All Priorities' },
  { value: 'HIGH', label: 'High Priority' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'LOW', label: 'Low' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'ACCEPTED', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'priority', label: 'Highest Priority First' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function FilterBar({ filters, onChange, onReset }) {
  const isFiltered = filters.search || filters.category || filters.priority || filters.status || filters.sortBy !== 'newest';

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', gridColumn: 'span 2' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by keywords, subject, or classroom location..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => onChange('priority', e.target.value)}
          >
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onChange('sortBy', e.target.value)}
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isFiltered && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
