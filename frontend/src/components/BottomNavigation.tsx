import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiPackage, 
  FiPlusCircle, 
  FiUser, 
  FiUserPlus,
  FiTruck,
  FiMapPin,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiBox
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
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const mainNavItems: NavItem[] = [
    { 
      path: '/', 
      icon: <FiHome className={styles.icon} />,
      activeIcon: <FiHome className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Home',
      exact: true
    },
    { 
      path: '/my-boxes',
      icon: <FiPackage className={styles.icon} />,
      activeIcon: <FiPackage className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'My Boxes',
      showWhenLoggedIn: true
    },
    {
      path: '/request-pickup',
      icon: <div className={styles.scanButton}><FiPlusCircle className={styles.scanIcon} /></div>,
      activeIcon: <div className={`${styles.scanButton} ${styles.activeScanButton}`}><FiPlusCircle className={styles.scanIcon} /></div>,
      label: 'Request Pickup',
      showWhenLoggedIn: true
    },
    {
      path: '/storage-locations',
      icon: <FiMapPin className={styles.icon} />,
      activeIcon: <FiMapPin className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Storage',
      showWhenLoggedIn: true
    }
  ];

  const authNavItems: NavItem[] = [
    {
      path: '/login',
      icon: <FiLogIn className={styles.icon} />,
      activeIcon: <FiLogIn className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Login',
      showWhenLoggedOut: true
    },
    {
      path: '/register',
      icon: <FiUserPlus className={styles.icon} />,
      activeIcon: <FiUserPlus className={`${styles.icon} ${styles.activeIcon}`} />,
      label: 'Register',
      showWhenLoggedOut: true
    }
  ];

  const navItems = user 
    ? [...mainNavItems, {
        path: '/profile',
        icon: <FiUser className={styles.icon} />,
        activeIcon: <FiUser className={`${styles.icon} ${styles.activeIcon}`} />,
        label: 'Profile',
        showWhenLoggedIn: true
      }]
    : [...mainNavItems.filter(item => !item.showWhenLoggedIn), ...authNavItems];

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
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
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={() => handleNavClick(item.path)}
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
          <FiBox size={24} className={styles.logoIcon} />
          <h2>BoxY</h2>
        </div>
      </div>
      {navContent}
    </nav>
  );
};

export default BottomNavigation;
