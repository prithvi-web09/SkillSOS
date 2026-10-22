import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  { value: 'ACADEMIC_HELP', label: 'Academic Help (Concept explanations, lab queries)' },
  { value: 'NOTES_AND_STUDY_MATERIAL', label: 'Notes & Study Material (Xerox, lecture notes, textbook slides)' },
  { value: 'BORROW_OR_LEND', label: 'Borrow or Lend (Scientific calculator, lab coat, drawing drafter)' },
  { value: 'LOST_AND_FOUND', label: 'Lost & Found (Student ID, keys, earphones, notebook)' },
  { value: 'CAMPUS_NAVIGATION', label: 'Campus Navigation (Exam hall, professor cabin, lab directions)' },
  { value: 'PROGRAMMING_HELP', label: 'Programming Help (Java exceptions, OOP inheritance, syntax bugs)' },
  { value: 'OTHER', label: 'Other General Assistance' },
];

export default function CreateRequest({ showToast }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'ACADEMIC_HELP',
    priority: 'NORMAL',
    requesterName: '',
    requesterEmail: '',
    campusLocation: '',
    deadline: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters long.';
    } else if (form.title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters.';
    }

    if (!form.description.trim() || form.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long.';
    } else if (form.description.trim().length > 1500) {
      errs.description = 'Description cannot exceed 1500 characters.';
    }

    if (!form.requesterName.trim() || form.requesterName.trim().length < 2) {
      errs.requesterName = 'Name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.requesterEmail.trim() || !emailRegex.test(form.requesterEmail.trim())) {
      errs.requesterEmail = 'Please provide a valid student email address.';
    }

    if (!form.campusLocation.trim()) {
      errs.campusLocation = 'Campus location is required (e.g. Block B Room 304).';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const created = await api.createRequest({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        requesterName: form.requesterName.trim(),
        requesterEmail: form.requesterEmail.trim().toLowerCase(),
        campusLocation: form.campusLocation.trim(),
        deadline: form.deadline.trim()
      });

      showToast?.('Help request successfully created!', 'success');
      navigate(`/requests/${created.id}`);
    } catch (err) {
      if (err.data?.validationErrors) {
        setErrors(err.data.validationErrors);
      } else {
        setGeneralError(err.message || 'Failed to create help request. Please verify server connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ marginBottom: '20px', fontSize: '0.85rem', padding: '6px 14px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
            Publish a Campus Help Request
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Fill in the details below so nearby peers can understand what you need and volunteer to assist you.
          </p>
        </div>

        {generalError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fca5a5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Request Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Need scientific calculator FX-991EX for 10 AM practical exam"
              value={form.title}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Explain specifically what you need, how long you will need it for, and how the volunteer can reach you..."
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>

          {/* Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                disabled={submitting}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Priority *</label>
              <select
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="LOW">Low (Can wait later in the week)</option>
                <option value="NORMAL">Normal (Within today or tomorrow)</option>
                <option value="HIGH">High (Urgent - Within hours or exam upcoming)</option>
              </select>
            </div>
          </div>

          {/* Requester Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Your Full Name *</label>
              <input
                type="text"
                name="requesterName"
                className="form-input"
                placeholder="e.g. Aryan Deshmukh"
                value={form.requesterName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {errors.requesterName && <div className="form-error">{errors.requesterName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Your Campus Email *</label>
              <input
                type="email"
                name="requesterEmail"
                className="form-input"
                placeholder="e.g. aryan.d@campus.edu"
                value={form.requesterEmail}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {errors.requesterEmail && <div className="form-error">{errors.requesterEmail}</div>}
            </div>
          </div>

          {/* Location & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Campus Location *</label>
              <input
                type="text"
                name="campusLocation"
                className="form-input"
                placeholder="e.g. Engineering Block B, Room 304 / Library 1st Floor"
                value={form.campusLocation}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {errors.campusLocation && <div className="form-error">{errors.campusLocation}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Deadline / Timing (Optional)</label>
              <input
                type="text"
                name="deadline"
                className="form-input"
                placeholder="e.g. By 10:15 AM today / Before practical batch B"
                value={form.deadline}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '12px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '160px' }}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }} />
                  Saving to Firestore...
                </>
              ) : (
                <>
                  <Send size={16} /> Publish Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
