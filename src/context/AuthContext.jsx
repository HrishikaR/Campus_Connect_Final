import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('cc_token');
      if (token) {
        try {
          const data = await API.get('/auth/me');
          if (data.success) {
            setUser(data.user);
          }
        } catch (err) {
          console.error('Failed to verify session token:', err.message);
          localStorage.removeItem('cc_token');
          localStorage.removeItem('cc_refresh_token');
        }
      } else {
        // Default demo guest session as student for instant preview interactivity
        try {
          const data = await API.post('/auth/login', {
            email: 'alex.student@university.edu',
            password: 'password123'
          });
          if (data.success) {
            localStorage.setItem('cc_token', data.token);
            if (data.refreshToken) localStorage.setItem('cc_refresh_token', data.refreshToken);
            setUser(data.user);
          }
        } catch (e) {
          console.warn('Default demo login fallback skipped:', e.message);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const data = await API.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('cc_token', data.token);
      if (data.refreshToken) localStorage.setItem('cc_refresh_token', data.refreshToken);
      setUser(data.user);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await API.post('/auth/signup', userData);
    if (data.success) {
      localStorage.setItem('cc_token', data.token);
      if (data.refreshToken) localStorage.setItem('cc_refresh_token', data.refreshToken);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_refresh_token');
    setUser(null);
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  // Demo helper: allows switching roles smoothly on the fly
  const switchRole = async (targetRole) => {
    const roleEmails = {
      student: 'alex.student@university.edu',
      club_admin: 'sarah.admin@university.edu',
      super_admin: 'admin@university.edu'
    };

    const targetEmail = roleEmails[targetRole];
    if (targetEmail) {
      try {
        const data = await API.post('/auth/login', {
          email: targetEmail,
          password: 'password123'
        });
        if (data.success) {
          localStorage.setItem('cc_token', data.token);
          setUser(data.user);
          return true;
        }
      } catch (err) {
        console.error('Failed to switch role:', err.message);
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateUserData,
      switchRole,
      isAuthenticated: !!user,
      isStudent: user?.role === 'student',
      isClubAdmin: user?.role === 'club_admin' || user?.role === 'super_admin',
      isSuperAdmin: user?.role === 'super_admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
