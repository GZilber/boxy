import React from 'react';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import type { Box } from './types';
import styles from './Booking.module.css';

interface ConfirmationStepProps {
  selectedBox: Box | null;
  selectedDate: string;
  selectedTime: string;
  onTrackOrder: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedBox,
  selectedDate,
  selectedTime,
  onTrackOrder,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <div style={{ width: 24 }}></div>
        <h2>Order Confirmed</h2>
        <button className={styles.closeButton} onClick={onTrackOrder}>
          ✕
        </button>
      </div>

      <div className={styles.confirmationContent}>
        <div className={styles.successIcon}>
          <FaCheck />
        </div>
        <h2>Order Confirmed!</h2>
        <p>
          Your box delivery has been scheduled.<br />
          Order #SS-{new Date().getFullYear()}-{Math.floor(100 + Math.random() * 900)}
        </p>

        <div className={styles.summaryCard}>
          <div className={styles.summaryItem}>
            <span>Delivery Date</span>
            <span>{formatDate(selectedDate)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Time</span>
            <span>{selectedTime}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Box Type</span>
            <span>{selectedBox?.name}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Monthly Cost</span>
            <span>€{selectedBox?.price}/month</span>
          </div>
        </div>

        <div className={`${styles.infoBox} ${styles.important}`}>
          <h4>Important</h4>
          <p>Please have your items ready to pack. Our courier will wait 10 minutes for you to pack your box.</p>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <button 
          className={styles.ctaBtn}
          onClick={onTrackOrder}
        >
          Track Your Order
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
