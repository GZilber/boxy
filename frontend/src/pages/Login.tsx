import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import { useAuth } from '../context/AuthContext';
import BoxYLogo from '../components/BoxYLogo';
import { motion } from 'framer-motion';
import styles from './Login.module.css';
const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Initialize refs with default values
  if (emailRef.current) emailRef.current.value = 'test@example.com';
  if (passwordRef.current) passwordRef.current.value = 'password';
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
      const result = await login(email, password);
      
      if (result) {
        console.log('Login successful, redirecting to dashboard');
        success('Login successful!');
        
        // Get the redirect path from the router state or default to '/dashboard'
        const from = location.state?.from || '/dashboard';
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Invalid credentials. Please use test@example.com / password');
      if (passwordRef.current) passwordRef.current.value = '';
      emailRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate, showError, success]);

  // Auto-focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className={styles.loginContainer}>
      <motion.div 
        className={styles.loginContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.logoContainer}>
          <BoxYLogo size={72} showText={true} className={styles.logo} />
          <h1 className={styles.title}>BoxY<br />Your Storage Awaits</h1>
          <p className={styles.subtitle}>Sign in to continue to BoxY</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              placeholder="Enter your email"
              defaultValue="test@example.com"
              onBlur={(e) => e.target.value = e.target.value.trim()}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              placeholder="Enter your password"
              defaultValue="password"
              onBlur={(e) => e.target.value = e.target.value.trim()}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className={styles.authFooter}>
            <p>Don't have an account? <Link to="/signup" className={styles.authLink}>Sign up</Link></p>
          </div>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <svg className={styles.socialIcon} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className={styles.signupText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
