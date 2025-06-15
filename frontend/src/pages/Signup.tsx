import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/hooks/useToast';
import styles from './Auth.module.css';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
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

    // Basic validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Combine first and last name for the register function
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await register(fullName, formData.email, formData.password);
      
      if (result) {
        success('Account created successfully!');
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
  }, [formData, register, navigate, success, showError]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <button 
          onClick={() => navigate('/')}
          className={styles.backButton}
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
        
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join BoxY today and simplify your storage needs</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1, marginRight: '1rem' }}>
              <div className={styles.inputGroup}>
                <FiUser className={styles.inputIcon} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  style={{ paddingLeft: '3rem' }}
                  required
                />
              </div>
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
              <FiPhone className={styles.inputIcon} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FiMapPin className={styles.inputIcon} />
              <input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
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
                placeholder="Password (min 8 characters)"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className={styles.authFooter}>
            <p>Already have an account? <Link to="/login" className={styles.authLink}>Log in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
