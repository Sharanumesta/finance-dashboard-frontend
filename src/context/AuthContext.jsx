import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      console.log('Checking auth - User exists:', !!currentUser);
      console.log('Checking auth - Token exists:', !!token);
      
      if (currentUser && token) {
        setUser(currentUser);
        console.log('User restored from storage:', currentUser);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Login attempt for:', credentials.email);
      const result = await authService.login(credentials);
      console.log('Login successful, user:', result.user);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Register attempt for:', userData.email);
      const result = await authService.register(userData);
      console.log('Register successful, user:', result.user);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    console.log('User logged out');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!user && !!authService.getToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};