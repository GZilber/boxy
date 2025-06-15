import React from 'react';
import { FaArrowLeft, FaTruck, FaPhone } from 'react-icons/fa';
import styles from './Booking.module.css';

interface TrackingStepProps {
  onBack: () => void;
}

export const TrackingStep: React.FC<TrackingStepProps> = ({ onBack }) => {
  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Track Order</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusIcon}>
          <FaTruck />
        </div>
        <div className={styles.statusTitle}>Out for Delivery</div>
        <div className={styles.statusSubtitle}>Your courier is on the way</div>
      </div>

      <div className={styles.navTabs}>
        <div className={`${styles.navTab} ${styles.active}`}>Live Tracking</div>
        <div className={styles.navTab}>My Boxes</div>
      </div>

      <div className={styles.timeline}>
        {[
          { title: 'Order Confirmed', time: 'Today, 10:30 AM', active: true },
          { title: 'Package Prepared', time: 'Today, 11:15 AM', active: true },
          { title: 'Out for Delivery', time: 'Today, 12:30 PM', active: true },
          { title: 'Delivered & Packed', time: 'Estimated: 1:30 PM', active: false },
          { title: 'Collected & Stored', time: 'Estimated: 2:30 PM', active: false },
        ].map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={`${styles.timelineDot} ${item.active ? styles.active : ''}`}></div>
            <div className={styles.timelineContent}>
              <div className={`${styles.timelineTitle} ${!item.active ? styles.pending : ''}`}>
                {item.title}
              </div>
              <div className={styles.timelineTime}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.courierCard}>
        <div className={styles.courierHeader}>
          <div className={styles.courierAvatar}>
            <FaPhone />
          </div>
          <div>
            <div className={styles.courierName}>Alex - Your Courier</div>
            <div className={styles.courierStatus}>Arriving in 15-20 minutes</div>
          </div>
        </div>
        <button className={styles.callButton}>
          <FaPhone className={styles.callIcon} /> Call Courier
        </button>
      </div>
    </div>
  );
};

export default TrackingStep;
