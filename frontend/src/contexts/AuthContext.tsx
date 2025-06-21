import React, { createContext, useContext, ReactNode } from 'react';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Make optional for backward compatibility
  token: string;
  addresses: Address[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const isAuthenticated = !!user;

  // Check for existing session on mount
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...');
        // Check if user is already logged in (e.g., from localStorage)
        const storedUser = localStorage.getItem('user');
        console.log('Stored user in localStorage:', storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user from localStorage:', parsedUser);
          
          // Ensure the user has the correct shape
          const validatedUser: User = {
            id: parsedUser.id || '1',
            name: parsedUser.name || 'Demo User',
            email: parsedUser.email || 'test@example.com',
            token: parsedUser.token || 'mock-jwt-token',
            phone: parsedUser.phone || '+972 50 123 4567',
            // Use the addresses from localStorage if they exist, otherwise use default addresses
            addresses: Array.isArray(parsedUser.addresses) && parsedUser.addresses.length > 0 
              ? parsedUser.addresses 
              : [
                  {
                    id: '1',
                    street: 'Rothschild Blvd 22',
                    city: 'Tel Aviv',
                    state: 'Tel Aviv',
                    zipCode: '6688210',
                    isDefault: true
                  },
                  {
                    id: '2',
                    street: 'Dizengoff St 99',
                    city: 'Tel Aviv',
                    state: 'Tel Aviv',
                    zipCode: '6439601',
                    isDefault: false
                  },
                  {
                    id: '3',
                    street: 'Ibn Gabirol St 108',
                    city: 'Tel Aviv',
                    state: 'Tel Aviv',
                    zipCode: '6203814',
                    isDefault: false
                  }
                ]
          };
          
          console.log('Validated user with addresses:', validatedUser);
          setUser(validatedUser);
          
          // Update localStorage with the validated user
          localStorage.setItem('user', JSON.stringify(validatedUser));
        } else {
          console.log('No stored user found in localStorage');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Login attempt with email:', email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, create mock addresses
      console.log('Creating mock user with addresses...');
      const addresses = [
        {
          id: '1',
          street: 'Rothschild Blvd 22',
          city: 'Tel Aviv',
          state: 'Tel Aviv',
          zipCode: '6688210',
          isDefault: true
        },
        {
          id: '2',
          street: 'Dizengoff St 99',
          city: 'Tel Aviv',
          state: 'Tel Aviv',
          zipCode: '6439601',
          isDefault: false
        },
        {
          id: '3',
          street: 'Ibn Gabirol St 108',
          city: 'Tel Aviv',
          state: 'Tel Aviv',
          zipCode: '6203814',
          isDefault: false
        }
      ];
      
      console.log('Created addresses:', JSON.stringify(addresses, null, 2));
      
      // Create the complete user object with all required fields
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        phone: '+972 50 123 4567',
        token: 'mock-jwt-token',
        addresses: addresses
      };
      
      console.log('Created mock user:', JSON.stringify({
        ...mockUser,
        // Don't log the token in production
        token: mockUser.token ? '***' : 'none'
      }, null, 2));
      
      console.log('Setting user in state and localStorage...');
      setUser(mockUser);
      // Make sure to stringify the complete user object with addresses
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Verify what was stored in localStorage
      const storedUser = localStorage.getItem('user');
      console.log('Stored user in localStorage:', storedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // For demo purposes, auto-login after registration
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        token: 'mock-jwt-token',
        phone: '',
        addresses: [
          {
            id: 'addr-' + Math.random().toString(36).substr(2, 9),
            street: '123 New User St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true
          }
        ]
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
