import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiHome, FiArrowRight, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@contexts/AuthContext';
import BoxYLogo from '../components/BoxYLogo';
import styles from './Home.module.css';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, loading, user } = useAuth();

  useEffect(() => {
    console.log('Home component - auth state:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);

  const handleGetStarted = () => {
    console.log('Get Started clicked, isAuthenticated:', isAuthenticated);
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await logout();
      console.log('Logout successful, redirecting to home');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const features: Feature[] = [
    {
      icon: <FiPackage size={32} />,
      title: 'Store Your Items',
      description: 'Find secure storage locations near you and store your items with confidence.'
    },
    {
      icon: <FiTruck size={32} />,
      title: 'Easy Pickup & Delivery',
      description: 'Schedule pickups and deliveries at your convenience.'
    },
    {
      icon: <FiHome size={32} />,
      title: 'Manage Your Storage',
      description: 'Keep track of all your stored items in one place.'
    }
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <BoxYLogo size={120} showText={true} className={styles.logo} />
        <h1 className={styles.title}>
          {isAuthenticated ? (
            <>
              BoxY<br />Your Storage Awaits, {user?.name || 'User'}!
            </>
          ) : (
            <>
              BoxY<br />Your Storage Awaits
            </>
          )}
        </h1>
        <p className={styles.subtitle}>
          {isAuthenticated 
            ? 'Manage your storage with ease'
            : 'Your personal storage management solution'}
        </p>
        
        <div className={styles.ctaContainer}>
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleGetStarted} 
                className={`${styles.ctaButton} ${styles.primaryButton}`}
                disabled={loading}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleLogout} 
                className={`${styles.ctaButton} ${styles.secondaryButton}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.buttonLoading}>
                    <span className={styles.spinner}></span>
                    Logging out...
                  </span>
                ) : (
                  <>
                    <FiLogOut className={styles.buttonIcon} /> Logout
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className={`${styles.ctaButton} ${styles.secondaryButton}`}
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className={`${styles.ctaButton} ${styles.primaryButton}`}
              >
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <>
          <section className={styles.features}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Why Choose BoxY?</h2>
              <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.container}>
              <h2>Ready to get started?</h2>
              <p>Join thousands of satisfied customers who trust us with their storage needs.</p>
              <div className={styles.ctaContainer}>
                <button 
                  onClick={() => navigate('/login')}
                  className={`${styles.ctaButton} ${styles.secondaryButton}`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className={`${styles.ctaButton} ${styles.primaryButton}`}
                >
                  Sign Up Free <FiArrowRight className={styles.buttonIcon} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
