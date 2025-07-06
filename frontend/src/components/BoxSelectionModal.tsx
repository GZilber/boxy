import React, { useState, useEffect } from 'react';
import type { Box } from '../types/box';
import { 
  FiX, 
  FiCheck, 
  FiMapPin, 
  FiClock, 
  FiFileText, 
  FiInfo, 
  FiAlertCircle,
  FiSunrise,
  FiSun,
  FiMoon,
  FiTruck,
  FiPackage
} from 'react-icons/fi';
import { BoxIcon, CalendarIcon, ClockIcon } from './icons';

type TimeSlot = {
  id: string;
  label: string;
  time: string;
  icon: React.ReactNode;
};

type AvailableDate = {
  date: Date;
  formatted: string;
  isToday: boolean;
};
import styles from '../styles/BoxSelectionModal.module.css';
import { CreateCourierRequestInput } from '../types/courier';

interface BoxSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxes: Box[];
  selectedBoxes: string[];
  onBoxSelect: (boxId: string) => void;
  onMove: (request: CreateCourierRequestInput) => void;
  locationName: string;
  locationAddress: string;
}

const BoxSelectionModal: React.FC<BoxSelectionModalProps> = ({
  isOpen,
  onClose,
  boxes,
  selectedBoxes,
  onBoxSelect,
  onMove,
  locationName,
  locationAddress
}) => {
  const [showCourierForm, setShowCourierForm] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate available dates (today + next 7 days)
  const availableDates = React.useMemo<AvailableDate[]>(() => {
    const dates: AvailableDate[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        date,
        formatted: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0
      });
    }
    
    return dates;
  }, []);

  // Available time slots with icons
  const timeSlots: TimeSlot[] = [
    { 
      id: 'morning', 
      label: 'Morning', 
      time: '09:00 - 12:00',
      icon: <FiSunrise size={20} className="text-yellow-500" />
    },
    { 
      id: 'afternoon', 
      label: 'Afternoon', 
      time: '12:00 - 15:00',
      icon: <FiSun size={20} className="text-orange-500" />
    },
    { 
      id: 'evening', 
      label: 'Evening', 
      time: '15:00 - 18:00',
      icon: <FiMoon size={20} className="text-blue-500" />
    }
  ];

  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting'>('entering');

  useEffect(() => {
    if (isOpen) {
      setAnimationState('entering');
      const timer = setTimeout(() => setAnimationState('entered'), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
    }
  }, [isOpen]);

  if (!isOpen && animationState === 'exiting') return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pickup address is required';
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a pickup date';
    }
    
    if (!selectedTimeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting || !selectedDate || !selectedTimeSlot) return;
    
    try {
      setIsSubmitting(true);
      
      // Format the selected date and time
      const [startTime] = timeSlots.find(slot => slot.id === selectedTimeSlot)?.time.split(' - ') || ['12:00'];
      const [hours, minutes] = startTime.split(':').map(Number);
      
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      await onMove({
        boxIds: selectedBoxes,
        pickupAddress: pickupAddress.trim(),
        deliveryAddress: locationAddress,
        scheduledDate: scheduledDate.toISOString(),
        notes: notes.trim() || undefined
      });
      
      // Reset form if submission is successful
      setPickupAddress('');
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setNotes('');
      setErrors({});
      setShowCourierForm(false);
      
      // Show success feedback (you might want to replace this with a toast notification)
      alert('Pickup scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
      setErrors({
        ...errors,
        form: 'Failed to schedule pickup. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${animationState === 'entered' ? styles.entered : animationState === 'exiting' ? styles.exiting : ''}`}>
      <div className={`${styles.modalContent} ${animationState === 'entered' ? styles.entered : ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiTruck className="mr-2" />
            Move to {locationName}
          </h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>
        
        {!showCourierForm ? (
          <>
            <div className={styles.locationInfo}>
              <h3 className={styles.locationName}>
                <FiMapPin size={18} />
                {locationName}
              </h3>
              <p className={styles.locationAddress}>
                <FiMapPin size={16} className="flex-shrink-0 mt-0.5" />
                {locationAddress}
              </p>
            </div>

            <div className={styles.boxList}>
              {boxes.length > 0 ? (
                boxes.map((box) => (
                  <div 
                    key={box.id}
                    className={`${styles.boxItem} ${selectedBoxes.includes(box.id) ? styles.selected : ''}`}
                    onClick={() => onBoxSelect(box.id)}
                  >
                    <div className={styles.boxInfo}>
                      <h4>
                        <BoxIcon size={16} />
                        {box.name || `Box ${box.id}`}
                      </h4>
                      <p>
                        <FiInfo size={14} />
                        {box.contents || 'No description'}
                      </p>
                    </div>
                    {selectedBoxes.includes(box.id) && (
                      <div className={styles.selectedIndicator}>
                        <FiCheck size={16} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiPackage size={32} />
                  <p>No boxes available to move from this location</p>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                onClick={onClose} 
                className={styles.cancelButton}
              >
                <FiX size={16} />
                Cancel
              </button>
              <button 
                onClick={() => setShowCourierForm(true)}
                className={styles.confirmButton}
                disabled={selectedBoxes.length === 0}
              >
                <FiTruck size={16} />
                Schedule Pickup for {selectedBoxes.length} {selectedBoxes.length === 1 ? 'Box' : 'Boxes'}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.courierForm}>
            <div className={styles.formGroup}>
              <label htmlFor="pickupAddress" className={styles.formLabel}>
                <FiMapPin className={styles.inputIcon} /> Pickup Address
              </label>
              <div className={styles.inputContainer}>
                <FiMapPin className={styles.inputIcon} />
                <input
                  type="text"
                  id="pickupAddress"
                  value={pickupAddress}
                  onChange={(e) => {
                    setPickupAddress(e.target.value);
                    if (errors.pickupAddress) {
                      setErrors({ ...errors, pickupAddress: '' });
                    }
                  }}
                  placeholder="Enter pickup address"
                  className={`${styles.input} ${errors.pickupAddress ? styles.inputError : ''}`}
                  aria-invalid={!!errors.pickupAddress}
                  aria-describedby={errors.pickupAddress ? 'pickupAddress-error' : undefined}
                />
                {errors.pickupAddress && (
                  <FiAlertCircle className={styles.inputErrorIcon} />
                )}
                {errors.pickupAddress && (
                  <p id="pickupAddress-error" className={styles.errorMessage}>
                    {errors.pickupAddress}
                  </p>
                )}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="deliveryAddress" className={styles.formLabel}>
                <FiMapPin className={styles.inputIcon} /> Delivery Address
              </label>
              <div className={styles.inputContainer}>
                <FiMapPin className={styles.inputIcon} />
                <input
                  type="text"
                  id="deliveryAddress"
                  value={locationAddress}
                  disabled
                  placeholder="Delivery address"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <CalendarIcon className={styles.inputIcon} /> Pickup Date
              </label>
              <div className={styles.datePicker}>
                {availableDates.map((date) => (
                  <button
                    key={date.formatted}
                    type="button"
                    className={`${styles.dateButton} ${
                      selectedDate?.toDateString() === date.date.toDateString() ? styles.selectedDate : ''
                    } ${date.isToday ? styles.today : ''}`}
                    onClick={() => {
                      setSelectedDate(date.date);
                      if (errors.date) {
                        setErrors({ ...errors, date: '' });
                      }
                    }}
                  >
                    <div className={styles.dateButtonDay}>
                      {date.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={styles.dateButtonNumber}>
                      {date.date.getDate()}
                    </div>
                    {date.isToday && <div className={styles.todayBadge}>Today</div>}
                  </button>
                ))}
              </div>
              {errors.date && (
                <p className={styles.errorMessage}>
                  {errors.date}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <ClockIcon className={styles.inputIcon} /> Time Slot
              </label>
              <div className={styles.timeSlots}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`${styles.timeSlot} ${
                      selectedTimeSlot === slot.id ? styles.selectedTimeSlot : ''
                    }`}
                    onClick={() => {
                      setSelectedTimeSlot(slot.id);
                      if (errors.timeSlot) {
                        setErrors({ ...errors, timeSlot: '' });
                      }
                    }}
                  >
                    <div className={styles.timeSlotIcon}>
                      {slot.icon}
                    </div>
                    <div className={styles.timeSlotContent}>
                      <div className={styles.timeSlotLabel}>{slot.label}</div>
                      <div className={styles.timeSlotTime}>{slot.time}</div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.timeSlot && (
                <p className={styles.errorMessage}>
                  {errors.timeSlot}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.formLabel}>
                <FiFileText className={styles.inputIcon} /> Notes (Optional)
              </label>
              <div className={`${styles.inputContainer} ${styles.textareaContainer}`}>
                <FiFileText className={styles.inputIcon} />
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for the courier"
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button 
                type="button" 
                onClick={() => setShowCourierForm(false)}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                <FiX size={16} className="mr-1" /> Back
              </button>
              {errors.form && (
                <div className={styles.formError}>
                  <FiInfo className={styles.errorIcon} />
                  <p>{errors.form}</p>
                </div>
              )}
              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={`${styles.confirmButton} ${isSubmitting ? styles.loading : ''}`}
                  disabled={!pickupAddress || !selectedDate || !selectedTimeSlot || isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <FiCheck size={16} className="mr-1" /> Confirm Pickup Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BoxSelectionModal;
