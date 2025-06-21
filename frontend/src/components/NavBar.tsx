import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiPlusCircle, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.navBar}>
      <Link to="/" className={`${styles.navItem} ${isActive('/')}`}>
        <FiHome className={styles.navIcon} />
        <span className={styles.navText}>Home</span>
      </Link>
      
      <Link to="/my-boxes" className={`${styles.navItem} ${isActive('/my-boxes')}`}>
        <FiPackage className={styles.navIcon} />
        <span className={styles.navText}>My Boxes</span>
      </Link>
      
      <Link to="/request-pickup" className={`${styles.navItem} ${styles.primaryAction}`}>
        <FiPlusCircle className={styles.plusIcon} />
        <span className={styles.navText}>New Box</span>
      </Link>
      
      {user ? (
        <>
          <Link to="/profile" className={`${styles.navItem} ${isActive('/profile')}`}>
            <FiUser className={styles.navIcon} />
            <span className={styles.navText}>Profile</span>
          </Link>
          <button onClick={logout} className={`${styles.navItem} ${styles.logoutButton}`}>
            <FiLogOut className={styles.navIcon} />
            <span className={styles.navText}>Logout</span>
          </button>
        </>
      ) : (
        <Link to="/login" className={`${styles.navItem} ${isActive('/login')}`}>
          <FiLogIn className={styles.navIcon} />
          <span className={styles.navText}>Login</span>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
