import React from 'react';
import { FaArrowLeft, FaBoxOpen, FaTruck, FaWarehouse, FaMobileAlt, FaHome } from 'react-icons/fa';
import styles from './Booking.module.css';

interface ServiceFlowStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export const ServiceFlowStep: React.FC<ServiceFlowStepProps> = ({ onContinue, onBack }) => {
  const steps = [
    {
      icon: <FaBoxOpen className={styles.flowIcon} />,
      title: 'Pack Your Items',
      description: 'Securely pack your items in a box of your choice'
    },
    {
      icon: <FaTruck className={styles.flowIcon} />,
      title: 'We Collect',
      description: 'We pick up your packed box at the scheduled time'
    },
    {
      icon: <FaWarehouse className={styles.flowIcon} />,
      title: 'Secure Storage',
      description: 'Your items are stored safely in our secure facility'
    },
    {
      icon: <FaMobileAlt className={styles.flowIcon} />,
      title: 'Request Return',
      description: 'Use the app to request your items back anytime'
    },
    {
      icon: <FaHome className={styles.flowIcon} />,
      title: 'We Deliver',
      description: 'We bring your items back to you when needed'
    }
  ];

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button 
          type="button" 
          className={styles.backButton} 
          onClick={onBack}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h1 className={styles.pageTitle}>How It Works</h1>
        <div style={{ width: 24 }} aria-hidden="true"></div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.flowContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.flowStep}>
              <div className={styles.flowStepIcon}>{step.icon}</div>
              <div className={styles.flowStepContent}>
                <h3 className={styles.flowStepTitle}>
                  <span className={styles.flowStepNumber}>{index + 1}</span>
                  {step.title}
                </h3>
                <p className={styles.flowStepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.flowConnector}></div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.continueButton}
            onClick={onContinue}
          >
            Continue to Box Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFlowStep;
