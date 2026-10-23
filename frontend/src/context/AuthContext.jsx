import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'skillsos_auth_user';

export const DEMO_ACCOUNTS = [
  {
    username: 'rohan',
    name: 'Rohan Sharma',
    email: 'rohan@campus.edu',
    department: 'Computer Engineering (Sem III)',
    avatarInitial: 'R',
    roleColor: '#3b82f6'
  },
  {
    username: 'priya',
    name: 'Priya Patel',
    email: 'priya@campus.edu',
    department: 'Electronics Engineering (Sem III)',
    avatarInitial: 'P',
    roleColor: '#10b981'
  },
  {
    username: 'aryan',
    name: 'Aryan Deshmukh',
    email: 'aryan@campus.edu',
    department: 'Information Technology (Sem V)',
    avatarInitial: 'A',
    roleColor: '#f59e0b'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const normUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check credentials via API or demo fallback
    try {
      const res = await api.login(normUser, cleanPass);
      setUser(res);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
      return res;
    } catch (err) {
      // Fallback for static GitHub Pages or offline mode
      const found = DEMO_ACCOUNTS.find(a => a.username === normUser);
      if (found && cleanPass === '123') {
        const fallbackUser = {
          id: `usr-${found.username}`,
          username: found.username,
          name: found.name,
          email: found.email,
          department: found.department,
          avatarInitial: found.avatarInitial
        };
        setUser(fallbackUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, demoAccounts: DEMO_ACCOUNTS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
