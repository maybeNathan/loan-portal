import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.get('/auth/profile')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email, password, tfaToken) => {
    try {
      const res = await api.post('/auth/login', { email, password, tfaToken });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      if (err.response?.data?.requiresTFA) {
        return { success: false, requiresTFA: true };
      }
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
