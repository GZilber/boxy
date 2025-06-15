import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './Splash.module.css';
import BoxYLogo from '../components/BoxYLogo';
import './Splash.css';

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const logoVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.5 }
  }
};

const textVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.4 + (i * 0.1),
      duration: 0.5
    }
  })
};

const Splash: React.FC = () => {
  console.log('Splash component rendering');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    console.log('Splash mounted');
    return () => console.log('Splash unmounted');
  }, []);

  // Handle navigation to login
  const proceedToLogin = useCallback((): void => {
    navigate('/login', { replace: true });
  }, [navigate]);

  // Handle user interaction to skip the splash screen
  const handleSkip = useCallback((e: React.MouseEvent | React.KeyboardEvent): void => {
    e.preventDefault();
    proceedToLogin();
  }, [proceedToLogin]);

  // Set up timers for hint and auto-navigation
  useEffect((): (() => void) => {
    // Simulate loading
    const loadingTimer = window.setTimeout((): void => {
      setIsLoading(false);
    }, 1000);
    
    // Show continue hint after 3.5 seconds
    const hintTimer = window.setTimeout((): void => {
      setShowHint(true);
    }, 3500);

    // Auto-proceed after 6 seconds
    const navigateTimer = window.setTimeout((): void => {
      if (!isLoading) {
        proceedToLogin();
      }
    }, 6000);

    return (): void => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(hintTimer);
      window.clearTimeout(navigateTimer);
    };
  }, [isLoading, proceedToLogin]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      handleSkip(e);
    }
  }, [handleSkip]);

  return (
    <div 
      className={styles.splashScreen}
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Tap to continue"
    >
      {/* Skip button for accessibility */}
      <button 
        onClick={handleSkip}
        className={styles.skipButton}
        aria-label="Skip to login"
      >
        Skip to Login
      </button>

      {/* Main content */}
      <motion.div 
        className={styles.splashContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="main"
        aria-busy={isLoading}
        aria-live="polite"
        aria-label="Loading application"
      >
        {/* Logo */}
        <motion.div 
          className={styles.logoContainer}
          variants={logoVariants}
          custom={0}
        >
          <div className={styles.logoIcon}>
            <BoxYLogo size={120} showText={false} />
          </div>
        </motion.div>

        {/* App Title */}
        <motion.h1 
          className={styles.appTitle}
          variants={textVariants}
          custom={0}
        >
          BoxY Logistics
        </motion.h1>

        {/* App Subtitle */}
        <motion.p 
          className={styles.appSubtitle}
          variants={textVariants}
          custom={1}
        >
          Smart package management made simple
        </motion.p>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div 
            className={styles.loadingIndicator}
            variants={textVariants}
            custom={2}
          >
            <div className={styles.spinner} aria-hidden="true" />
            <span>Loading...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Continue hint */}
      <AnimatePresence>
        {showHint && !isLoading && (
          <motion.div 
            className={styles.continueHint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Tap anywhere to continue
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Splash;
