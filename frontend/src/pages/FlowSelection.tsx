import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiArrowRight } from 'react-icons/fi';
import styles from './FlowSelection.module.css';

const FlowSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.flowSelection}>
      <h1>What would you like to do?</h1>
      
      <div className={styles.flowOptions}>
        <div className={styles.flowCard} onClick={() => navigate('/store-items')}>
          <div className={styles.flowIcon}>
            <FiPackage size={48} />
          </div>
          <h2>Store Items</h2>
          <p>Schedule a pickup to store your items in our secure facility</p>
          <div className={styles.flowAction}>
            <span>Get Started</span>
            <FiArrowRight />
          </div>
        </div>

        <div className={styles.flowCard} onClick={() => navigate('/request-items')}>
          <div className={styles.flowIcon}>
            <FiTruck size={48} />
          </div>
          <h2>Request Items</h2>
          <p>Retrieve your stored items with scheduled delivery</p>
          <div className={styles.flowAction}>
            <span>Get Started</span>
            <FiArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowSelection;
