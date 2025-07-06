import React from 'react';
import { FaCheck, FaHome, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Booking.module.css';
import type { ItemDetails } from './BoxSelection';
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

interface ConfirmationStepProps {
  orderNumber: string;
  onBackToHome: () => void;
  message: string;
  itemDetails?: ItemDetails;
  address?: Address | null;
  date?: string;
  time?: string;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  orderNumber,
  onBackToHome,
  message,
  itemDetails,
  address,
  date,
  time,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatAddress = (addr?: Address | null) => {
    if (!addr) return 'No address specified';
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.confirmationContent}>
        <div className={styles.successIcon}>
          <FaCheck />
        </div>
        <h2>Pickup Scheduled!</h2>
        <p className={styles.confirmationMessage}>
          {message || 'Your pickup request has been received.'}
        </p>
        
        <p className={styles.orderNumber}>
          Order #{orderNumber}
        </p>

        {(date || time || address) && (
          <div className={styles.summaryCard}>
            <h3>
              <FaCalendarAlt /> Pickup Details
            </h3>
            
            {date && (
              <div className={styles.summaryItem}>
                <span>Date</span>
                <span>{formatDate(date)}</span>
              </div>
            )}
            
            {time && (
              <div className={styles.summaryItem}>
                <span>Time Slot</span>
                <span>{time}</span>
              </div>
            )}
            
            {address && (
              <div className={styles.summaryItem}>
                <span>Address</span>
                <div className={styles.addressText}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div>{formatAddress(address)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.ctaSection}>
          <button 
            className={styles.primaryButton}
            onClick={onBackToHome}
          >
            <FaHome /> Back to Home
          </button>
          
          <p className={styles.helpText}>
            Need help? Contact our support team at support@boxy.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
