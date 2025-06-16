import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        
        if (!token) {
          console.log('No token found, user is not authenticated');
          setUser(null);
          setLoading(false);
          return;
        }

        // In a real app, you would validate the token with your backend
        // For now, we'll just set a mock user
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          token: token
        };
        console.log('Setting authenticated user:', mockUser);
        setUser(mockUser);
        return mockUser;
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        return null;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      console.log('Logging in with email:', email);
      setLoading(true);
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email,
        token: 'mock-jwt-token-' + Date.now() // Add timestamp to make token unique
      };
      
      console.log('Setting token in localStorage');
      localStorage.setItem('token', mockUser.token);
      console.log('Setting user in state:', mockUser);
      setUser(mockUser);
      setLoading(false);
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: '1',
        name,
        email,
        token: 'mock-jwt-token-' + Date.now()
      };
      
      console.log('Registering user and setting token in localStorage');
      localStorage.setItem('token', mockUser.token);
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
    return Promise.resolve();
  }, []);

  // Debug logs for auth state changes
  useEffect(() => {
    console.log('Auth state updated:', { 
      user, 
      isAuthenticated: !!user,
      loading 
    });
  }, [user, loading]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
