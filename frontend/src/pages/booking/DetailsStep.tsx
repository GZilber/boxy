import React, { useState } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TimeSlot } from './types';
import styles from './Booking.module.css';
import { Address } from '../../contexts/AuthContext';

interface DetailsStepProps {
  addresses: Address[];
  selectedAddressId: string;
  selectedDate: string;
  selectedTime: string;
  timeSlots: TimeSlot[];
  onBack: () => void;
  onAddressChange: (addressId: string) => void;
  onDateChange: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onContinue: () => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  addresses,
  selectedAddressId,
  selectedDate,
  selectedTime,
  timeSlots,
  onBack,
  onAddressChange,
  onDateChange,
  onTimeSelect,
  onContinue,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId || !selectedDate || !selectedTime) {
      return; // Validation will be handled by required attributes
    }
    setIsSubmitting(true);
    onContinue();
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a date is a weekend
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  };

  // Calculate minimum date (next business day if today is Friday/Saturday)
  const getMinDate = () => {
    const today = new Date();
    const day = today.getDay();
    let daysToAdd = 1;
    
    // If it's Friday, add 3 days to get to Monday
    if (day === 5) daysToAdd = 3;
    // If it's Saturday, add 2 days to get to Monday
    else if (day === 6) daysToAdd = 2;
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + daysToAdd);
    return minDate;
  }; 
  
  const minDate = getMinDate();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Allow selection up to 2 months in advance
  
  // Custom input component to style the date picker input
  const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
    <div className={styles.inputWithIcon} onClick={onClick}>
      <input
        type="text"
        className={styles.formInput}
        value={value}
        readOnly
        placeholder="Select a date"
      />
      <FaCalendarAlt className={styles.inputIcon} />
    </div>
  ));

  return (
    <form onSubmit={handleSubmit} className={styles.bookingContainer}>
      <div className={styles.header}>
        <button 
          type="button" 
          className={styles.backButton} 
          onClick={onBack}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h2 className={styles.pageTitle}>Schedule Pickup</h2>
        <div style={{ width: 24 }} aria-hidden="true"></div>
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaMapMarkerAlt className={styles.sectionIcon} />
            Delivery Address
          </h3>
          {!addresses || addresses.length === 0 ? (
            <div className={styles.errorMessage}>
              No delivery addresses found. Please add an address to your profile.
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="delivery-address" className={styles.inputLabel}>
                Select a delivery address
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="delivery-address"
                  className={`${styles.formSelect} ${!selectedAddressId ? styles.placeholderSelected : ''}`}
                  value={selectedAddressId}
                  onChange={(e) => onAddressChange(e.target.value)}
                  required
                >
                  <option value="" disabled>Select an address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {`${address.street}, ${address.city}`}
                      {address.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
                <div className={styles.selectArrow}>▼</div>
              </div>
              {selectedAddressId && (
                <div className={styles.selectedAddressDetails}>
                  <p className={styles.addressLine}>
                    {addresses.find(a => a.id === selectedAddressId)?.street}
                  </p>
                  <p className={styles.addressLine}>
                    {`${addresses.find(a => a.id === selectedAddressId)?.city}, `}
                    {`${addresses.find(a => a.id === selectedAddressId)?.state} `}
                    {addresses.find(a => a.id === selectedAddressId)?.zipCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaCalendarAlt className={styles.sectionIcon} />
            Delivery Date
          </h3>
          <div className={styles.formGroup}>
            <label htmlFor="delivery-date" className={styles.inputLabel}>
              Select a date
            </label>
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  onDateChange(date.toISOString().split('T')[0]);
                }
              }}
              filterDate={isWeekday}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select a weekday"
              className={styles.formInput}
              customInput={<CustomInput />}
              required
              excludeDates={[]}
              includeDates={[]}
              calendarClassName={styles.datePicker}
              wrapperClassName={styles.datePickerWrapper}
              popperPlacement="bottom-start"
            />
            {selectedDate && (
              <p className={styles.selectedInfo}>
                Selected: {formatDisplayDate(selectedDate)}
              </p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaClock className={styles.sectionIcon} />
            Delivery Time
          </h3>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              Select a time slot
            </label>
            <div className={styles.timeSlots}>
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`${styles.timeSlot} ${
                    selectedTime === slot.id ? styles.timeSlotActive : ''
                  }`}
                  onClick={() => onTimeSelect(slot.id)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          className={`${styles.continueButton} ${
            isSubmitting ? styles.buttonLoading : ''
          }`}
          disabled={isSubmitting || !selectedAddressId || !selectedDate || !selectedTime}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Summary'}
        </button>
      </div>

      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={styles.step}></div>
        <div className={styles.step}></div>
      </div>
    </form>
  );
};

export default DetailsStep;
