import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, AuthContextType } from '@contexts/AuthContext';
import { 
  FiHome, 
  FiPackage, 
  FiUser,
  FiUpload,
  FiDownload,
  FiInbox,
  FiLogOut
} from 'react-icons/fi';
import styles from '../styles/BottomNavigation.module.css';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  exact?: boolean;
  showWhenLoggedIn?: boolean;
  showWhenLoggedOut?: boolean;
}

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth() as AuthContextType;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't render anything while loading or if user is not logged in
  if (loading || !user) {
    return null;
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.classList.toggle('menu-open', newState);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest(`.${styles.mobileMenu}`) && !target.closest(`.${styles.menuButton}`)) {
        toggleMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Always show navigation
  const shouldHide = false;
  
  if (shouldHide) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      icon: <FiHome className={styles.icon} />,
      activeIcon: <FiHome className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Home',
      exact: true,
      showWhenLoggedIn: true
    },
    {
      path: '/my-items',
      icon: <FiInbox className={styles.icon} />,
      activeIcon: <FiInbox className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'My Storage',
      showWhenLoggedIn: true
    },
    {
      path: '/store-items',
      icon: <FiUpload className={styles.icon} />,
      activeIcon: <FiUpload className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Store Items',
      showWhenLoggedIn: true
    },
    {
      path: '/request-items',
      icon: <FiDownload className={styles.icon} />,
      activeIcon: <FiDownload className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Request Items',
      showWhenLoggedIn: true
    },
    {
      path: '/profile',
      icon: <FiUser className={styles.icon} />,
      activeIcon: <FiUser className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Profile',
      showWhenLoggedIn: true
    },
    {
      path: '/logout',
      icon: <FiLogOut className={styles.icon} />,
      activeIcon: <FiLogOut className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Logout',
      showWhenLoggedIn: true
    }
  ];

  const filteredNavItems = user 
    ? navItems.filter(item => item.showWhenLoggedIn)
    : navItems.filter(item => item.showWhenLoggedOut);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.path === '/logout') {
      logout();
      navigate('/login');
      return;
    }
    
    navigate(item.path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const navContent = (
    <div className={`${styles.navItems} ${isMobile ? styles.mobileNavItems : ''}`}>
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item.path}
            className={`${styles.navItem} ${active ? styles.active : ''} ${item.path === '/logout' ? styles.logoutButton : ''}`}
            onClick={() => handleNavClick(item)}
            aria-label={item.label}
          >
            <div className={styles.iconContainer}>
              {active ? item.activeIcon : item.icon}
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <nav className={`${styles.bottomNav} ${isMenuOpen ? styles.menuOpen : ''}`}>
          {navContent}
        </nav>
        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu} />
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <FiPackage size={24} className={styles.logoIcon} />
          <h2>BoxY</h2>
        </div>
      </div>
      {navContent}
    </nav>
  );
};

export default BottomNavigation;
