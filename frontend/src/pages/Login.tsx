import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import { useAuth } from '@contexts/AuthContext';
import BoxYLogo from '../components/BoxYLogo';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize refs with default values
  useEffect(() => {
    if (emailRef.current) emailRef.current.value = 'test@example.com';
    if (passwordRef.current) passwordRef.current.value = 'password';
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';
    
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call login and wait for it to complete
      console.log('Attempting login with email:', email);
      try {
        await login(email, password);
        console.log('Login successful, redirecting to dashboard');
        success('Login successful!');
        
        // Get the redirect path from the router state or default to '/dashboard'
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
      } catch (error) {
        // Re-throw the error to be caught by the outer catch block
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Invalid credentials. Please use test@example.com / password');
      if (passwordRef.current) passwordRef.current.value = '';
      emailRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate, showError, success, location.state]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <BoxYLogo size={80} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            margin: '16px 0 8px',
            color: '#1a1a1a'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#666',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Sign in to your account
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div>
            <label 
              htmlFor="email" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333'
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your email"
              defaultValue="test@example.com"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your password"
              defaultValue="password"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.8 : 1,
              pointerEvents: isLoading ? 'none' : 'auto',
              marginTop: '8px'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          Don't have an account?{' '}
          <a 
            href="/signup" 
            style={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/signup');
            }}
          >
            Sign up
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
