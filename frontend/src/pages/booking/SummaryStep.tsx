import React, { useState } from 'react';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCheck, FaArrowRight, FaImage } from 'react-icons/fa';
import Slider from 'react-slider';
import './Slider.css';
import type { ItemDetails } from './BoxSelection';
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}
import styles from './Booking.module.css';

interface SummaryStepProps {
  itemDetails: ItemDetails | null;
  address: Address | null;
  date: string;
  time: string;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  itemDetails,
  address,
  date,
  time,
  onBack,
  onConfirm,
  loading,
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

  const formatAddress = (addr: Address | null) => {
    if (!addr) return 'No address selected';
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  if (!itemDetails) {
    return (
      <div className={styles.bookingContainer}>
        <p>No item details found. Please go back and add your items.</p>
        <button onClick={onBack} className={styles.backButton}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const deliveryFee = 5;
  const setupFee = 3;
  const total = deliveryFee + setupFee;

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="Go back">
          <FaArrowLeft />
        </button>
        <h1 className={styles.pageTitle}>Order Summary</h1>
        <div style={{ width: 24 }}></div>
        <button 
          className={`${styles.confirmButton} ${loading ? styles.loading : ''}`}
          disabled={loading}
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.active}`}></div>
          <div className={`${styles.step} ${styles.active}`}></div>
          <div className={styles.step}></div>
        </div>

        <div className={styles.summarySection}>
          <h3 className={styles.summaryTitle}>Your Items</h3>
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemIcon}>
              <FaBox />
            </div>
            <div className={styles.summaryItemDetails}>
              <h4>Item Details</h4>
              <p>{itemDetails.description}</p>
              <p>Estimated Size: {itemDetails.estimatedSize}</p>
              {itemDetails.specialInstructions && (
                <p>Special Instructions: {itemDetails.specialInstructions}</p>
              )}
            </div>
          </div>

          {itemDetails.photos.length > 0 && (
            <div className={styles.photoGrid}>
              {itemDetails.photos.map((photo, index) => (
                <div key={index} className={styles.photoThumbnail}>
                  <img src={photo} alt={`Item ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.summaryCard}>
          <h3>
            <FaBox /> Pricing Summary
          </h3>
          <div className={styles.summaryItem}>
            <span>Pickup Fee</span>
            <span className={styles.price}>€5.00</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Setup Fee</span>
            <span className={styles.price}>€3.00</span>
          </div>
          <div className={styles.summaryDivider}></div>
          <div className={`${styles.summaryItem} ${styles.total}`}>
            <span>Total</span>
            <span className={styles.price}>€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h3>
            <FaMapMarkerAlt /> Delivery Details
          </h3>
          <div className={styles.summaryItem}>
            <span>Date</span>
            <span><strong>{formatDate(date)}</strong></span>
          </div>
          <div className={styles.summaryItem}>
            <span>Time Slot</span>
            <span><strong>{time || 'Not selected'}</strong></span>
          </div>
          <div className={styles.summaryItem}>
            <span>Delivery Address</span>
            <p>{formatAddress(address)}</p>
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
