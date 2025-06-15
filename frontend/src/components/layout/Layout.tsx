import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
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

  // Always show navigation unless explicitly disabled
  const showNavigation = showNav;
  
  console.log('Layout - navigation state:', {
    showNavigation,
    path: location.pathname,
    showNav
  });

  return (
    <div className={`${styles.layout} ${className}`}>
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
      
      {showNavigation && <BottomNavigation />}
      
      {/* Global toast container */}
      <div id="toast-container" className={styles.toastContainer} />
    </div>
  );
};

export default Layout;