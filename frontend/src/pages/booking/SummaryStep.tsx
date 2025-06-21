import React, { useState } from 'react';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCheck, FaArrowRight } from 'react-icons/fa';
import Slider from 'react-slider';
import './Slider.css';
import type { Box } from './types';
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
  const [sliderValue, setSliderValue] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (value >= 95 && !isConfirmed) {
      setIsConfirmed(true);
      onConfirm();
    }
  };
  
  const handleAfterChange = () => {
    if (!isConfirmed) {
      setSliderValue(0);
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate total price
  const boxPrice = selectedBox?.price || 0;
  const deliveryFee = 5;
  const setupFee = 3;
  const total = boxPrice + deliveryFee + setupFee;

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="Go back">
          <FaArrowLeft />
        </button>
        <h1 className={styles.pageTitle}>Order Summary</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.active}`}></div>
          <div className={`${styles.step} ${styles.active}`}></div>
          <div className={styles.step}></div>
        </div>

        <div className={styles.summaryCard}>
          <h3>
            <FaBox /> Selected Box
          </h3>
          <div className={styles.summaryItem}>
            <span>{selectedBox?.name} Storage</span>
            <span className={styles.price}>€{boxPrice}/month</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Delivery Fee</span>
            <span className={styles.price}>€{deliveryFee}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Setup Fee</span>
            <span className={styles.price}>€{setupFee}</span>
          </div>
          <div className={styles.summaryItem} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <strong>Total First Month</strong>
            <span className={styles.total}>€{total}</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h3>
            <FaMapMarkerAlt /> Delivery Details
          </h3>
          <div className={styles.summaryItem}>
            <span>Date</span>
            <span><strong>{formatDate(selectedDate)}</strong></span>
          </div>
          <div className={styles.summaryItem}>
            <span>Time Slot</span>
            <span><strong>{selectedTime || 'Not selected'}</strong></span>
          </div>
          <div className={styles.summaryItem}>
            <span>Delivery Address</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500' }}>Home</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>{pickupAddress}</div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className="slider-container">
            <Slider
              className="slider"
              thumbClassName="slider-thumb"
              trackClassName="slider-track"
              value={sliderValue}
              onChange={handleSliderChange}
              onAfterChange={handleAfterChange}
              min={0}
              max={100}
              disabled={isLoading || isConfirmed}
              renderThumb={(props, state) => (
                <div {...props} className="slider-thumb">
                  {isConfirmed ? <FaCheck /> : <FaArrowRight />}
                </div>
              )}
              renderTrack={(props, state) => (
                <div 
                  {...props} 
                  className={`slider-track ${state.index === 0 ? 'slider-track-fill' : ''}`}
                >
                  {state.index === 1 && (
                    <div className="slider-text">
                      Slide to Confirm • €{total}
                    </div>
                  )}
                  {state.index === 0 && (
                    <div className="slider-track-text">
                      Confirmed <FaCheck style={{ marginLeft: '8px' }} />
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
