import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiArrowLeft } from 'react-icons/fi';
import styles from '../styles/Layout.module.css';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isHome = location.pathname === '/';
  const showBackButton = !isDashboard && !isHome;

  return (
    <div className={styles.appLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {showBackButton && (
            <Link 
              to="/dashboard" 
              className={styles.backButton}
              aria-label="Back to Dashboard"
            >
              <FiArrowLeft className={styles.backIcon} />
              <span>Dashboard</span>
            </Link>
          )}
          <h1 className={styles.logo}>
            {showBackButton ? (
              <Link to="/dashboard" className={styles.logoLink}>
                BoxY
              </Link>
            ) : (
              <Link to="/" className={styles.logoLink}>
                BoxY
              </Link>
            )}
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      </header>
      
      <main className={styles.main}>
        {children || <Outlet />}
      </main>
      
      <footer className={styles.footer}>
        © {new Date().getFullYear()} BoxY - Seamless Storage Solutions
      </footer>
    </div>
  );
};

export default Layout;
