/**
 * Centralized API service for SkillSOS communicating exclusively with the Spring Boot backend.
 */

const BASE_URL = '/api';

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || (data?.error ? `${data.error}: ${data.message || ''}` : response.statusText);
    const error = new Error(errorMsg || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Health & diagnostics
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err) {
      if (err.data) return err.data;
      return {
        status: 'DOWN',
        backendProcess: false,
        firebaseInitialized: false,
        firestoreConnected: false,
        message: 'Could not connect to Spring Boot backend process on http://localhost:8080'
      };
    }
  },

  // Requests
  async getRequests({ search = '', category = '', priority = '', status = '', sortBy = 'newest' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);

    const res = await fetch(`${BASE_URL}/requests?${params.toString()}`);
    return await handleResponse(res);
  },

  async getRequestById(id) {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}`);
    return await handleResponse(res);
  },

  async createRequest(payload) {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async acceptRequest(id, payload) {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/accept`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async resolveRequest(id, payload) {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async reopenRequest(id, payload) {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/reopen`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async getVolunteers(id) {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/volunteers`);
    return await handleResponse(res);
  },

  // Student demonstration activity lookup
  async getActivity(email) {
    const params = new URLSearchParams({ email: email.trim() });
    const res = await fetch(`${BASE_URL}/activity?${params.toString()}`);
    return await handleResponse(res);
  },

  // Platform statistics
  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`);
    return await handleResponse(res);
  },

  // Campus Directory (XML/DOM Lab Syllabus demo)
  async getCampusResources() {
    const res = await fetch(`${BASE_URL}/resources`);
    return await handleResponse(res);
  }
};
