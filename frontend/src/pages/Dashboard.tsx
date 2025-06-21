import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiPlus, FiBox, FiLogOut, FiUserCheck } from 'react-icons/fi';
import { useBoxes } from '@contexts/BoxesContext';
import { useAuth } from '@contexts/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { boxes, loading } = useBoxes();
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log('Logging out from dashboard...');
    logout();
    navigate('/');
  };

  // Handle status click - navigate to MyBoxes with status filter in URL
  const handleStatusClick = (status: string | null) => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    navigate(`/my-boxes?${params.toString()}`);
  };

  // Calculate stats from boxes data
  const stats = useMemo(() => {
    if (loading) return {
      totalBoxes: 0,
      inTransit: 0,
      delivered: 0,
      inStorage: 0
    };

    return {
      totalBoxes: boxes.length,
      inTransit: boxes.filter(box => box.status === 'transit').length,
      delivered: boxes.filter(box => box.status === 'delivered').length,
      inStorage: boxes.filter(box => box.status === 'stored').length
    };
  }, [boxes, loading]);

  const quickActions = [
    {
      title: 'Store a Box',
      description: 'Register a new storage box',
      icon: <FiBox size={24} />,
      color: 'var(--primary-500)',
      action: () => navigate('/store-box')
    },
    {
      title: 'Handoff to Courier',
      description: 'Transfer box to a courier',
      icon: <FiUserCheck size={24} />,
      color: 'var(--accent-500)',
      action: () => navigate('/handoff')
    },
    {
      title: 'Request Pickup',
      description: 'Schedule a box pickup',
      icon: <FiTruck size={24} />,
      color: 'var(--success-500)',
      action: () => navigate('/request-pickup')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            BoxY<br />Your Storage Awaits
          </h1>
          <p className={styles.subtitle}>
            Here's an overview of your storage
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className={styles.logoutButton}
          title="Logout"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div onClick={() => handleStatusClick(null)} style={{ cursor: 'pointer' }}>
          <StatCard 
            title="Total Boxes"
            value={stats.totalBoxes}
            icon={<FiPackage size={24} />}
            color="var(--primary-500)"
          />
        </div>
        <div onClick={() => handleStatusClick('stored')} style={{ cursor: 'pointer' }}>
          <StatCard 
            title="In Storage"
            value={stats.inStorage}
            icon={<FiPackage size={24} />}
            color="var(--accent-500)"
          />
        </div>
        <div onClick={() => handleStatusClick('transit')} style={{ cursor: 'pointer' }}>
          <StatCard 
            title="In Transit"
            value={stats.inTransit}
            icon={<FiTruck size={24} />}
            color="var(--warning-500)"
          />
        </div>
        <div onClick={() => handleStatusClick('delivered')} style={{ cursor: 'pointer' }}>
          <StatCard 
            title="Delivered"
            value={stats.delivered}
            icon={<FiCheckCircle size={24} />}
            color="var(--success-500)"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={styles.actionCard}
              style={{
                '--action-color': action.color,
              } as React.CSSProperties}
            >
              <div 
                className={styles.iconContainer}
                style={{
                  backgroundColor: `${action.color}15`,
                  color: action.color,
                }}
              >
                {action.icon}
              </div>
              <div>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <FiPackage />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  Box #BOX-{Math.floor(1000 + Math.random() * 9000)} was delivered
                </p>
                <p className={styles.activityTime}>
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      <h3 className={styles.statTitle}>{title}</h3>
      <div 
        className={styles.statIcon}
        style={{
          '--icon-color': color,
          '--icon-bg': `${color}15`,
        } as React.CSSProperties}
      >
        {icon}
      </div>
    </div>
    <p className={styles.statValue}>{value}</p>
  </div>
);

export default Dashboard;