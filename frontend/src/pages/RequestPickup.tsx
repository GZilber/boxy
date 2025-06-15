import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoxSelection from './booking/BoxSelection';
import DetailsStep from './booking/DetailsStep';
import SummaryStep from './booking/SummaryStep';
import ConfirmationStep from './booking/ConfirmationStep';
import TrackingStep from './booking/TrackingStep';
import { Box, BookingStep, TimeSlot } from './booking/types';
import styles from './booking/Booking.module.css';
import { useToast } from '../components/hooks/useToast';

// Box options
const BOXES: Box[] = [
  { id: 'small', name: 'Small Box', size: '30×20×20 cm' },
  { id: 'medium', name: 'Medium Box', size: '40×30×30 cm' },
  { id: 'large', name: 'Large Box', size: '50×40×40 cm' },
  { id: 'xl', name: 'XL Box', size: '60×50×50 cm' },
];

const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: '9:00 AM - 12:00 PM' },
  { id: 'afternoon', label: '1:00 PM - 4:00 PM' },
  { id: 'evening', label: '5:00 PM - 8:00 PM' },
];

const RequestPickup: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>('box-selection');
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [pickupAddress, setPickupAddress] = useState('123 Main Street, City');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleBoxSelect = (box: Box) => {
    setSelectedBox(box);
  };

  const handleBoxContinue = () => {
    setCurrentStep('details');
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('box-selection');
    } else if (currentStep === 'summary') {
      setCurrentStep('details');
    } else if (currentStep === 'tracking') {
      setCurrentStep('confirmation');
    } else {
      navigate(-1);
    }
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('summary');
  };

  const handleConfirmOrder = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrderNumber(`SS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setCurrentStep('confirmation');
      setIsLoading(false);
      success('Order confirmed successfully!');
    }, 1500);
  };

  const handleTrackOrder = () => {
    setCurrentStep('tracking');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'box-selection':
        return (
          <BoxSelection 
            boxes={BOXES}
            onSelectBox={handleBoxSelect}
            onBack={() => navigate(-1)}
            onContinue={handleBoxContinue}
          />
        );
      case 'details':
        return (
          <DetailsStep
            pickupAddress={pickupAddress}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            contactNumber={contactNumber}
            timeSlots={TIME_SLOTS}
            onBack={handleBack}
            onAddressChange={setPickupAddress}
            onDateChange={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onContactNumberChange={setContactNumber}
            onContinue={() => setCurrentStep('summary')}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            selectedBox={selectedBox}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            pickupAddress={pickupAddress}
            onBack={handleBack}
            onConfirm={handleConfirmOrder}
            isLoading={isLoading}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep
            selectedBox={selectedBox}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTrackOrder={handleTrackOrder}
          />
        );
      case 'tracking':
        return (
          <TrackingStep
            onBack={() => setCurrentStep('confirmation')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.bookingContainer}>
      {renderStep()}
    </div>
  );
};

export default RequestPickup;
