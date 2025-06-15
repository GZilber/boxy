import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/hooks/useToast';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: 'test@example.com',
    password: 'password',
    confirmPassword: 'password'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: showError } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result) {
        success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }, [formData.name, formData.email, formData.password, formData.confirmPassword, register, navigate, success, showError]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
        
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Sign up to get started with BoxY</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                minLength={8}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                minLength={8}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className={styles.authFooter}>
          Already have an account?{' '}
          <Link to="/login" className={styles.authLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
