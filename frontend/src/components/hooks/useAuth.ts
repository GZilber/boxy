import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | void>;
  register: (name: string, email: string, password: string) => Promise<User | void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Memoize the auth context value to prevent unnecessary re-renders
  const authContextValue = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (email: string, password: string) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'test@example.com' && password === 'password') {
          const mockUser = {
            id: '1',
            name: 'Test User',
            email,
            token: 'mock-jwt-token',
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          return mockUser;
        } else {
          throw new Error('Invalid credentials');
        }
      } finally {
        setIsLoading(false);
      }
    },
    register: async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          token: 'mock-jwt-token',
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    checkAuth: async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          return !!userData?.token;
        }
        return false;
      } catch (error) {
        console.error('Auth check failed:', error);
        return false;
      }
    },
  }), [user, isLoading]);

  // The auth context value is now fully defined in the useMemo above

  return React.createElement(AuthContext.Provider, { value: authContextValue }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
