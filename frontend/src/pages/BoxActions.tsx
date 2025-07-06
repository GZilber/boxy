import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPackage, FiTruck } from 'react-icons/fi';
import styles from './BoxActions.module.css';

const BoxActions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'store' | 'request'>('store');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'store' ? styles.active : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <FiPackage className={styles.tabIcon} />
          Store Items
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'request' ? styles.active : ''}`}
          onClick={() => setActiveTab('request')}
        >
          <FiTruck className={styles.tabIcon} />
          Request Items
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'store' ? (
          <div className={styles.actionCard}>
            <h2>Store Your Items</h2>
            <p>Add new items to your storage or update existing ones</p>
            <button 
              className={styles.actionButton}
              onClick={() => navigate('/store-items')}
            >
              Get Started
              <FiArrowRight className={styles.buttonIcon} />
            </button>
          </div>
        ) : (
          <div className={styles.actionCard}>
            <h2>Request Items</h2>
            <p>Request delivery of your stored items to your location</p>
            <button 
              className={styles.actionButton}
              onClick={() => navigate('/request-items')}
            >
              Request Now
              <FiArrowRight className={styles.buttonIcon} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxActions;
