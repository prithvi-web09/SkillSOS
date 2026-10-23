/**
 * Centralized API service for SkillSOS.
 * Communicates with the Spring Boot backend on localhost, and seamlessly
 * falls back to an in-browser storage layer when deployed statically on GitHub Pages.
 */

const BASE_URL = '/api';

// Check if running on GitHub Pages (static hosting without local Spring Boot process)
const isGitHubPages = typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || window.location.protocol === 'file:');

// Client-side demo fallback storage for GitHub Pages preview
const STORAGE_KEY_REQUESTS = 'skillsos_requests';
const STORAGE_KEY_VOLUNTEERS = 'skillsos_volunteers';

function getLocalRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRequests(reqs) {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(reqs));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

function getLocalVolunteers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalVolunteers(vols) {
  try {
    localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(vols));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

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
  // Authentication
  async login(username, password) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages && err.status === 401) {
          throw err;
        }
      }
    }

    // Client-side fallback for GitHub Pages or offline mode
    const norm = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const mockUsers = [
      { id: 'usr-rohan', username: 'rohan', name: 'Rohan Sharma', email: 'rohan@campus.edu', department: 'Computer Engineering (Sem III)', avatarInitial: 'R' },
      { id: 'usr-priya', username: 'priya', name: 'Priya Patel', email: 'priya@campus.edu', department: 'Electronics Engineering (Sem III)', avatarInitial: 'P' },
      { id: 'usr-aryan', username: 'aryan', name: 'Aryan Deshmukh', email: 'aryan@campus.edu', department: 'Information Technology (Sem V)', avatarInitial: 'A' }
    ];
    const found = mockUsers.find(u => u.username === norm);
    if (found && cleanPass === '123') {
      return found;
    }
    const err = new Error('Invalid credentials. Please enter a valid username and password (123).');
    err.status = 401;
    throw err;
  },

  async getUsers() {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/auth/users`);
        return await handleResponse(res);
      } catch {
        // Fall back below
      }
    }
    return [
      { id: 'usr-rohan', username: 'rohan', name: 'Rohan Sharma', email: 'rohan@campus.edu', department: 'Computer Engineering (Sem III)', avatarInitial: 'R' },
      { id: 'usr-priya', username: 'priya', name: 'Priya Patel', email: 'priya@campus.edu', department: 'Electronics Engineering (Sem III)', avatarInitial: 'P' },
      { id: 'usr-aryan', username: 'aryan', name: 'Aryan Deshmukh', email: 'aryan@campus.edu', department: 'Information Technology (Sem V)', avatarInitial: 'A' }
    ];
  },

  // Health & diagnostics
  async checkHealth() {
    if (isGitHubPages) {
      return {
        status: 'UP',
        backendProcess: true,
        firebaseInitialized: true,
        firestoreConnected: true,
        message: 'SkillSOS Live GitHub Pages Preview (Browser Persistent Mode)'
      };
    }
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse(res);
    } catch {
      return {
        status: 'DEGRADED',
        backendProcess: false,
        firebaseInitialized: false,
        firestoreConnected: false,
        message: 'Backend server not detected on localhost:8080'
      };
    }
  },

  // Requests
  async getRequests({ search = '', category = '', priority = '', status = '', sortBy = 'newest' } = {}) {
    if (!isGitHubPages) {
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (category) params.append('category', category);
        if (priority) params.append('priority', priority);
        if (status) params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);

        const res = await fetch(`${BASE_URL}/requests?${params.toString()}`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    // Client-side fallback for GitHub Pages
    let list = getLocalRequests();
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.campusLocation && r.campusLocation.toLowerCase().includes(q))
      );
    }
    if (category) list = list.filter(r => r.category === category);
    if (priority) list = list.filter(r => r.priority === priority);
    if (status) list = list.filter(r => r.status === status);

    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const w = { HIGH: 3, NORMAL: 2, LOW: 1 };
        return (w[b.priority] || 0) - (w[a.priority] || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  },

  async getRequestById(id) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const list = getLocalRequests();
    const found = list.find(r => r.id === id);
    if (!found) {
      const err = new Error('Campus help request not found with ID: ' + id);
      err.status = 404;
      throw err;
    }
    return found;
  },

  async createRequest(payload) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const newReq = {
      ...payload,
      id: 'req-' + Math.random().toString(36).substring(2, 10),
      status: 'OPEN',
      volunteerCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      demoSeeded: false
    };

    const list = getLocalRequests();
    list.unshift(newReq);
    saveLocalRequests(list);
    return newReq;
  },

  async acceptRequest(id, payload) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/accept`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const list = getLocalRequests();
    const req = list.find(r => r.id === id);
    if (!req) throw new Error('Request not found');

    if (req.status !== 'OPEN') {
      const err = new Error('Only OPEN requests can be accepted. Current status: ' + req.status);
      err.status = 409;
      throw err;
    }

    const normEmail = payload.volunteerEmail.trim().toLowerCase();
    if (normEmail === req.requesterEmail.trim().toLowerCase()) {
      const err = new Error('You cannot volunteer for your own request (Rule 5).');
      err.status = 400;
      throw err;
    }

    const vols = getLocalVolunteers();
    if (vols.some(v => v.requestId === id && v.volunteerEmail.toLowerCase() === normEmail)) {
      const err = new Error('You have already volunteered for this campus request.');
      err.status = 409;
      throw err;
    }

    const newVol = {
      id: id + '_' + normEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      requestId: id,
      volunteerName: payload.volunteerName,
      volunteerEmail: normEmail,
      createdAt: new Date().toISOString()
    };

    vols.push(newVol);
    saveLocalVolunteers(vols);

    req.volunteerCount = (req.volunteerCount || 0) + 1;
    req.status = 'ACCEPTED';
    req.updatedAt = new Date().toISOString();
    saveLocalRequests(list);

    return newVol;
  },

  async resolveRequest(id, payload) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/resolve`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const list = getLocalRequests();
    const req = list.find(r => r.id === id);
    if (!req) throw new Error('Request not found');

    if (req.status !== 'ACCEPTED') {
      const err = new Error('A request can only be resolved once it has been accepted.');
      err.status = 409;
      throw err;
    }

    req.status = 'RESOLVED';
    req.resolvedAt = new Date().toISOString();
    req.updatedAt = new Date().toISOString();
    saveLocalRequests(list);
    return req;
  },

  async reopenRequest(id, payload) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/reopen`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const list = getLocalRequests();
    const req = list.find(r => r.id === id);
    if (!req) throw new Error('Request not found');

    if (req.status !== 'RESOLVED') {
      const err = new Error('Only RESOLVED requests can be reopened.');
      err.status = 409;
      throw err;
    }

    req.status = 'OPEN';
    req.resolvedAt = null;
    req.updatedAt = new Date().toISOString();
    saveLocalRequests(list);
    return req;
  },

  async getVolunteers(id) {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(id)}/volunteers`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const vols = getLocalVolunteers();
    return vols.filter(v => v.requestId === id);
  },

  async getActivity(email) {
    if (!isGitHubPages) {
      try {
        const params = new URLSearchParams({ email: email.trim() });
        const res = await fetch(`${BASE_URL}/activity?${params.toString()}`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const norm = email.trim().toLowerCase();
    const allReqs = getLocalRequests();
    const allVols = getLocalVolunteers();

    const created = allReqs.filter(r => r.requesterEmail && r.requesterEmail.toLowerCase() === norm);
    const volRecords = allVols.filter(v => v.volunteerEmail && v.volunteerEmail.toLowerCase() === norm);
    const volunteered = volRecords.map(v => allReqs.find(r => r.id === v.requestId)).filter(Boolean);

    return {
      email: norm,
      createdRequests: created,
      volunteeredRequests: volunteered,
      disclaimer: 'DEMONSTRATION LOOKUP ONLY: Queries client-side records for this email address.'
    };
  },

  async getStats() {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/stats`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    const list = getLocalRequests();
    const vols = getLocalVolunteers();

    const total = list.length;
    const open = list.filter(r => r.status === 'OPEN').length;
    const accepted = list.filter(r => r.status === 'ACCEPTED').length;
    const resolved = list.filter(r => r.status === 'RESOLVED').length;

    const uniqueEmails = new Set(vols.map(v => v.volunteerEmail.toLowerCase()));
    const uniqueVolunteers = uniqueEmails.size;
    const resolutionPercentage = total > 0 ? Math.round(((resolved / total) * 1000.0)) / 10.0 : 0.0;

    return {
      totalRequests: total,
      openRequests: open,
      acceptedRequests: accepted,
      resolvedRequests: resolved,
      uniqueVolunteers: uniqueVolunteers,
      resolutionPercentage: resolutionPercentage
    };
  },

  async getCampusResources() {
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${BASE_URL}/resources`);
        return await handleResponse(res);
      } catch (err) {
        if (!isGitHubPages) throw err;
      }
    }

    // Default parsed campus resources
    return [
      {
        id: 'res-01',
        name: 'Advanced Computing & Java Lab',
        category: 'LABORATORY',
        building: 'Engineering Block B',
        floor: 'Third Floor (Room 304)',
        contact: 'cse-lab@campus.edu',
        timings: '08:30 AM - 05:30 PM',
        description: 'Equipped with high-performance workstations, JDK 21, Linux/Windows environments, and network analysis tools.'
      },
      {
        id: 'res-02',
        name: 'Central Digital Library & Study Commons',
        category: 'LIBRARY',
        building: 'Knowledge Hub',
        floor: 'Ground & First Floor',
        contact: 'library@campus.edu',
        timings: '08:00 AM - 09:00 PM',
        description: 'Quiet study zones, computer terminals, access to IEEE/ACM digital repositories, reference textbooks, and journal archives.'
      },
      {
        id: 'res-03',
        name: 'Electronics & Embedded Systems Lab',
        category: 'LABORATORY',
        building: 'Engineering Block A',
        floor: 'Second Floor (Room 212)',
        contact: 'ece-lab@campus.edu',
        timings: '09:00 AM - 05:00 PM',
        description: 'Oscilloscopes, microcontrollers, Arduino/Raspberry Pi boards, FPGA kits, and component testing stations.'
      },
      {
        id: 'res-04',
        name: 'Auditorium & Seminar Hall',
        category: 'EVENT_SPACE',
        building: 'Administrative Complex',
        floor: 'First Floor',
        contact: 'events@campus.edu',
        timings: 'By Prior Booking',
        description: 'Audio-visual projection, 350-seat capacity, stage acoustics for guest lectures, hackathons, and technical symposiums.'
      },
      {
        id: 'res-05',
        name: 'Student Wellness & First Aid Cell',
        category: 'SUPPORT',
        building: 'Student Activity Center',
        floor: 'Ground Floor (Room 102)',
        contact: 'wellness@campus.edu',
        timings: '24x7 On Campus Care',
        description: 'Primary first aid, basic medical supplies, emergency resting room, and campus ambulance dispatch coordination.'
      }
    ];
  }
};
