import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { TimeSlot } from './types';
import styles from './Booking.module.css';

interface DetailsStepProps {
  pickupAddress: string;
  selectedDate: string;
  selectedTime: string;
  contactNumber: string;
  timeSlots: TimeSlot[];
  onBack: () => void;
  onAddressChange: (address: string) => void;
  onDateChange: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onContactNumberChange: (number: string) => void;
  onContinue: () => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  pickupAddress,
  selectedDate,
  selectedTime,
  contactNumber,
  timeSlots,
  onBack,
  onAddressChange,
  onDateChange,
  onTimeSelect,
  onContactNumberChange,
  onContinue,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Book Delivery</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={styles.step}></div>
        <div className={styles.step}></div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Delivery Address</label>
        <input 
          type="text" 
          className={styles.formInput} 
          value={pickupAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Delivery Date</label>
        <input 
          type="date" 
          className={styles.formInput} 
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Preferred Time Slot</label>
        <div className={styles.timeSlots}>
          {timeSlots.map((slot) => (
            <div 
              key={slot.id}
              className={`${styles.timeSlot} ${selectedTime === slot.label ? styles.selected : ''}`}
              onClick={() => onTimeSelect(slot.label)}
            >
              {slot.label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Contact Number</label>
        <input 
          type="tel" 
          className={styles.formInput} 
          placeholder="+1 (555) 123-4567"
          value={contactNumber}
          onChange={(e) => onContactNumberChange(e.target.value)}
          required
        />
      </div>

      <div className={styles.ctaSection}>
        <button 
          type="submit"
          className={`${styles.ctaBtn} ${!selectedDate || !selectedTime || !contactNumber ? styles.disabled : ''}`}
          disabled={!selectedDate || !selectedTime || !contactNumber}
        >
          Continue to Summary
        </button>
      </div>
    </form>
  );
};

export default DetailsStep;
