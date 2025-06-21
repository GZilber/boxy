import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './Booking.module.css';
import type { Box } from './types';

interface BoxSelectionProps {
  boxes: Box[];
  onSelectBox: (box: Box) => void;
  onBack: () => void;
  onContinue: () => void;
  loading?: boolean;
}

const BoxSelection: React.FC<BoxSelectionProps> = ({ 
  boxes, 
  onSelectBox, 
  onBack,
  onContinue,
  loading = false
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);

  useEffect(() => {
    if (selectedBoxId) {
      const box = boxes.find(b => b.id === selectedBoxId) || null;
      setSelectedBox(box);
      if (box) onSelectBox(box);
    }
  }, [selectedBoxId, boxes, onSelectBox]);

  const handleBoxSelect = (box: Box) => {
    setSelectedBoxId(box.id);
  };

  const handleContinue = () => {
    if (selectedBox) {
      onContinue();
    }
  };

  if (loading) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.header}>
          <button onClick={onBack} className={styles.backButton}>
            <FaArrowLeft />
          </button>
          <h2>Select Box</h2>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your boxes...</p>
        </div>
      </div>
    );
  }

  if (boxes.length === 0) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.header}>
          <button onClick={onBack} className={styles.backButton}>
            <FaArrowLeft />
          </button>
          <h2>No Boxes Available</h2>
        </div>
        <div className={styles.emptyState}>
          <p>You don't have any boxes available for pickup.</p>
          <p>Please register a box first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Select Box Size</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={styles.step}></div>
        <div className={styles.step}></div>
      </div>

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Store your stuff,<br />effortlessly</h1>
        <p className={styles.heroSubtitle}>
          Choose your box size, we deliver it, you pack it, we store it. Simple as that.
        </p>
      </div>

      <div className={styles.boxGrid}>
        {boxes.map((box) => {
          // Get size indicator (S, M, L, XL) from the name
          const sizeIndicator = box.name.split(' ')[0].charAt(0);
          return (
            <div 
              key={box.id}
              className={`${styles.boxCard} ${selectedBoxId === box.id ? styles.selected : ''}`}
              onClick={() => handleBoxSelect(box)}
            >
              <div className={styles.boxIcon}>
                <div className={styles.sizeIndicator}>{sizeIndicator}</div>
              </div>
              <div className={styles.boxName}>{box.name}</div>
              <div className={styles.boxSize}>{box.size}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.ctaSection}>
        <button 
          className={`${styles.ctaBtn} ${!selectedBox ? styles.disabled : ''}`}
          disabled={!selectedBox}
          onClick={handleContinue}
        >
          {selectedBox 
            ? `Continue with ${selectedBox.name}` 
            : 'Select a box to continue'}
        </button>
      </div>
    </div>
  );
};

export default BoxSelection;
