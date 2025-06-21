import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { useAuth } from '@contexts/AuthContext';
import BottomNavigation from '../BottomNavigation';
import styles from '../../styles/Layout.module.css';

interface LayoutProps {
  children?: ReactNode;
  title?: string;
  showNav?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = '',
  showNav = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { info } = useToast();

  const handleBack = () => {
    navigate(-1);
  };

  const { isAuthenticated, loading, logout } = useAuth();
  
  // Debug function to clear auth data
  const handleDebugLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  // Show navigation only when authenticated and not loading
  const showNavigation = showNav && isAuthenticated && !loading;
  
  console.log('Layout - navigation state:', {
    showNavigation,
    path: location.pathname,
    showNav
  });

  // Show a loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div className={`${styles.layout} ${className}`}>
      {/* Debug button - only show in development */}
      {process.env.NODE_ENV === 'development' && isAuthenticated && (
        <button 
          onClick={handleDebugLogout}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '5px 10px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Debug: Clear Auth
        </button>
      )}
      
      <main className={styles.mainContent}>
        {title && (
          <header className={styles.header}>
            <button onClick={handleBack} className={styles.backButton}>
              ←
            </button>
            <h1 className={styles.title}>{title}</h1>
          </header>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </main>
      
      {/* Bottom navigation - only shown when user is authenticated and showNav is true */}
      {isAuthenticated && showNav && (
        <div className={styles.navigationContainer}>
          <BottomNavigation />
        </div>
      )}
      
      {/* Global toast container */}
      <div id="toast-container" className={styles.toastContainer} />
    </div>
  );
};

export default Layout;