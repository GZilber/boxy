import React from 'react';
import { FaArrowLeft, FaBox, FaTruck, FaShieldAlt, FaCamera, FaBoxOpen } from 'react-icons/fa';
import styles from './Booking.module.css';

interface ServiceFlowStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export const ServiceFlowStep: React.FC<ServiceFlowStepProps> = ({ onContinue, onBack }) => {
  const steps = [
    {
      icon: <FaCamera className={styles.flowIcon} />,
      title: 'Snap & Send',
      description: 'Take photos of the items you wish to store'
    },
    {
      icon: <FaTruck className={styles.flowIcon} />,
      title: 'Courier Collection',
      description: 'Our partner courier collects your items from your location'
    },
    {
      icon: <FaShieldAlt className={styles.flowIcon} />,
      title: 'Secure Storage',
      description: 'Your items are stored safely in our secure facility'
    },
    {
      icon: <FaBox className={styles.flowIcon} />,
      title: 'On-Demand Returns',
      description: 'Get your items back whenever you need them'
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
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFlowStep;
