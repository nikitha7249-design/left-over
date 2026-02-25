// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Restore user from localStorage
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'host'
        });
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password, role) => {
    // Mock login - use the role selected by the user
    localStorage.setItem('token', 'mock-token');
    setToken('mock-token');
    const userData = { id: 1, name: 'Test User', email, role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const register = async (userData) => {
    // Mock register - use the role from registration form
    localStorage.setItem('token', 'mock-token');
    setToken('mock-token');
    const newUser = { id: 1, name: userData.name, email: userData.email, role: userData.role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isHost: user?.role === 'host',
    isNGO: user?.role === 'ngo',
    isVolunteer: user?.role === 'volunteer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};