import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiHome, 
  FiPackage, 
  FiTruck,
  FiMapPin,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiBox,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';
import styles from '../styles/Navigation.module.css';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  exact?: boolean;
  showWhenLoggedIn?: boolean;
  showWhenLoggedOut?: boolean;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll for header shadow
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) {
      setIsMenuOpen(false);
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, handleScroll]);

  // Refs for handling click outside
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Toggle mobile menu function
  const toggleMenu = useCallback(() => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    document.body.classList.toggle('menu-open', newMenuState);
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        toggleMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, toggleMenu]);

  // Handle logout
  const handleLogout = useCallback(() => {
    authLogout();
    navigate('/');
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [authLogout, navigate, isMobile]);

  // Navigation items configuration
  const mainNavItems: NavItem[] = [
    { 
      path: '/', 
      icon: <FiHome />,
      activeIcon: <FiHome />,
      label: 'Home',
      exact: true
    },
    { 
      path: '/my-boxes',
      icon: <FiPackage />,
      activeIcon: <FiPackage />,
      label: 'My Boxes',
      showWhenLoggedIn: true
    },
    {
      path: '/request-pickup',
      icon: <FiTruck />,
      activeIcon: <FiTruck />,
      label: 'Request Pickup',
      showWhenLoggedIn: true
    },
    {
      path: '/locations',
      icon: <FiMapPin />,
      activeIcon: <FiMapPin />,
      label: 'Locations',
      showWhenLoggedIn: true
    },
    {
      path: '/settings',
      icon: <FiSettings />,
      activeIcon: <FiSettings />,
      label: 'Settings',
      showWhenLoggedIn: true
    }
  ];

  const authNavItems: NavItem[] = [
    {
      path: '/login',
      icon: <FiLogIn />,
      activeIcon: <FiLogIn />,
      label: 'Login',
      showWhenLoggedOut: true
    },
    {
      path: '/register',
      icon: <FiUserPlus />,
      activeIcon: <FiUserPlus />,
      label: 'Sign Up',
      showWhenLoggedOut: true
    }
  ];

  // Filter navigation items based on auth state
  const navItems = React.useMemo(() => [
    ...mainNavItems.filter(item => 
      (user && item.showWhenLoggedIn !== false) || 
      (!user && item.showWhenLoggedOut !== false) ||
      (item.showWhenLoggedIn === undefined && item.showWhenLoggedOut === undefined)
    ),
    ...(user ? [] : authNavItems)
  ], [user]);

  const isActive = useCallback((path: string, exact: boolean = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleNavClick = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [navigate, isMobile]);

  // Only show navigation on specific routes
  const shouldHideNav = useCallback(() => {
    const hideOnRoutes = ['/login', '/register', '/splash'];
    return hideOnRoutes.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  if (shouldHideNav()) {
    return null;
  }

  // Mobile navigation
  if (isMobile) {
    return (
      <>
        <div 
          className={`${styles.overlay} ${isMenuOpen ? styles.visible : ''}`} 
          onClick={toggleMenu} 
          aria-hidden="true" 
        />
        <nav 
          ref={menuRef}
          className={`${styles.mobileNav} ${isMenuOpen ? styles.menuOpen : ''}`}
          aria-label="Main navigation"
        >
          <div className={styles.mobileNavHeader}>
            <div 
              className={styles.logo}
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            >
              <FiBox size={24} />
              <span>Box Logistics</span>
            </div>
            <button 
              ref={menuButtonRef}
              className={styles.menuButton}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          
          <div id="mobile-menu" className={styles.navItems}>
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.navItem} ${isActive(item.path, item.exact) ? styles.active : ''}`}
                onClick={() => handleNavClick(item.path)}
                aria-label={item.label}
                aria-current={isActive(item.path, item.exact) ? 'page' : undefined}
              >
                <span className={styles.iconContainer}>
                  {isActive(item.path, item.exact) ? item.activeIcon : item.icon}
                </span>
                <span className={styles.navText}>{item.label}</span>
              </button>
            ))}
            
            {user && (
              <div className={styles.mobileUserSection}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    <FiUser />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.email}</span>
                    <span className={styles.userRole}>User</span>
                  </div>
                </div>
                <button 
                  className={`${styles.navItem} ${styles.logoutButton}`}
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <FiLogOut />
                  <span className={styles.navText}>Logout</span>
                </button>
              </div>
            )}
            
            <div className={styles.themeToggleContainer}>
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <><FiSun /> <span>Light Mode</span></>
                ) : (
                  <><FiMoon /> <span>Dark Mode</span></>
                )}
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Desktop navigation
  return (
    <nav 
      className={`${styles.desktopNav} ${isScrolled ? styles.scrolled : ''}`}
      aria-label="Main navigation"
    >
      <div className={styles.desktopNavContent}>
        <div 
          className={styles.logo}
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          <FiBox size={24} />
          <span>Box Logistics</span>
        </div>
        
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${isActive(item.path, item.exact) ? styles.active : ''}`}
              onClick={() => handleNavClick(item.path)}
              aria-label={item.label}
              aria-current={isActive(item.path, item.exact) ? 'page' : undefined}
            >
              <span className={styles.iconContainer}>
                {isActive(item.path, item.exact) ? item.activeIcon : item.icon}
              </span>
              <span className={styles.navText}>{item.label}</span>
            </button>
          ))}
          
          <div className={styles.desktopRightSection}>
            <div className={styles.themeToggleContainer}>
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
              </button>
            </div>
            
            {user ? (
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    <FiUser />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.email}</span>
                    <span className={styles.userRole}>User</span>
                  </div>
                </div>
                <button 
                  className={`${styles.navItem} ${styles.logoutButton}`}
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <button 
                  className={`${styles.navItem} ${styles.authButton}`}
                  onClick={() => navigate('/login')}
                >
                  Log In
                </button>
                <button 
                  className={`${styles.navItem} ${styles.authButton} ${styles.primaryButton}`}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
