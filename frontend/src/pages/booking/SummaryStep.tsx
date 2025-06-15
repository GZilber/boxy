import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Box } from './types';
import styles from './Booking.module.css';

interface SummaryStepProps {
  selectedBox: Box | null;
  selectedDate: string;
  selectedTime: string;
  pickupAddress: string;
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  selectedBox,
  selectedDate,
  selectedTime,
  pickupAddress,
  onBack,
  onConfirm,
  isLoading,
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
        <button type="button" className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Order Summary</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={styles.step}></div>
      </div>

      <div className={styles.summaryCard}>
        <h3>Selected Box</h3>
        <div className={styles.summaryItem}>
          <span>{selectedBox?.name} ({selectedBox?.size})</span>
          <span>€{selectedBox?.price}/month</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Delivery Fee</span>
          <span>€5</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Setup Fee</span>
          <span>€3</span>
        </div>
        <div className={styles.summaryItem}>
          <span><strong>Total First Month</strong></span>
          <span><strong>€{selectedBox ? selectedBox.price + 8 : 0}</strong></span>
        </div>
      </div>

      <div className={styles.summaryCard}>
        <h3>Delivery Details</h3>
        <div className={styles.summaryItem}>
          <span>Date</span>
          <span>{formatDate(selectedDate)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Time</span>
          <span>{selectedTime || 'Not selected'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Address</span>
          <span>{pickupAddress}</span>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h4>How it works</h4>
        <ol>
          <li>We deliver your empty box</li>
          <li>Pack your items securely</li>
          <li>We collect and store safely</li>
          <li>Request return anytime via app</li>
        </ol>
      </div>

      <div className={styles.ctaSection}>
        <button 
          className={styles.ctaBtn}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Confirm Order - €${selectedBox ? selectedBox.price + 8 : 0}`}
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
