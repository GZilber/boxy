import React from 'react';
import { Box } from './types';
import styles from './Booking.module.css';

interface BoxSelectionStepProps {
  boxes: Box[];
  selectedBox: Box | null;
  onSelectBox: (box: Box) => void;
  onContinue: () => void;
}

export const BoxSelectionStep: React.FC<BoxSelectionStepProps> = ({
  boxes,
  selectedBox,
  onSelectBox,
  onContinue,
}) => {
  return (
    <div className={styles.bookingContainer}>
      <div className={styles.locationBar}>
        <div className={styles.locationText}>Deliver to</div>
        <div className={styles.locationValue}>📍 123 Main Street, City</div>
      </div>

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Store your stuff,<br />effortlessly</h1>
        <p className={styles.heroSubtitle}>
          Choose your box size, we deliver it, you pack it, we store it. Simple as that.
        </p>
      </div>

      <div className={styles.boxGrid}>
        {boxes.map((box) => (
          <div 
            key={box.id}
            className={`${styles.boxCard} ${selectedBox?.id === box.id ? styles.selected : ''}`}
            onClick={() => onSelectBox(box)}
          >
            <div className={styles.boxIcon}>{box.icon}</div>
            <div className={styles.boxName}>{box.name}</div>
            <div className={styles.boxSize}>{box.size}</div>
            <div className={styles.boxPrice}>€{box.price}/month</div>
          </div>
        ))}
      </div>

      <div className={styles.ctaSection}>
        <button 
          className={`${styles.ctaBtn} ${!selectedBox ? styles.disabled : ''}`}
          disabled={!selectedBox}
          onClick={onContinue}
        >
          {selectedBox 
            ? `Continue with ${selectedBox.name}` 
            : 'Select a box to continue'}
        </button>
      </div>
    </div>
  );
};

export default BoxSelectionStep;
