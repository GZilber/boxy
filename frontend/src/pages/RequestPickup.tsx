import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Address } from '../contexts/AuthContext';
import { useBoxes } from '../contexts/BoxesContext';
import type { Box as BookingBox } from './booking/types';
import type { Box as FullBox } from '../types/box';
import ServiceFlowStep from './booking/ServiceFlowStep';
import BoxSelection from './booking/BoxSelection';
import DetailsStep from './booking/DetailsStep';
import SummaryStep from './booking/SummaryStep';
import ConfirmationStep from './booking/ConfirmationStep';
import TrackingStep from './booking/TrackingStep';
import type { BookingStep, TimeSlot } from './booking/types';
import styles from './booking/Booking.module.css';
import { useToast } from '../components/hooks/useToast';

const TIME_SLOTS: TimeSlot[] = [
  { id: '9:00 AM - 12:00 PM', label: '9:00 AM - 12:00 PM' },
  { id: '1:00 PM - 4:00 PM', label: '1:00 PM - 4:00 PM' },
  { id: '5:00 PM - 8:00 PM', label: '5:00 PM - 8:00 PM' },
];

const RequestPickup: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { user } = useAuth();
  const { boxes, loading: boxesLoading } = useBoxes();
  
  // Debug: Log user data
  useEffect(() => {
    console.log('RequestPickup - User data:', user);
    if (user?.addresses) {
      console.log('RequestPickup - User addresses:', user.addresses);
    } else {
      console.log('RequestPickup - No addresses found in user data');
    }
  }, [user]);
  
  const [currentStep, setCurrentStep] = useState<BookingStep>('service-flow');
  const [selectedBox, setSelectedBox] = useState<BookingBox | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Get the selected address object
  const selectedAddress = useMemo(() => {
    if (!user?.addresses?.length) return null;
    return user.addresses.find(addr => addr.id === selectedAddressId) || user.addresses[0];
  }, [user?.addresses, selectedAddressId]);
  
  // Format address for display
  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Get available boxes for pickup (owned by user and in stored status)
  const availableBoxes = useMemo<BookingBox[]>(() => {
    if (!user?.id || !boxes.length) return [];
    
    return boxes
      .filter((box: FullBox) => 
        box.ownerId === user.id && 
        ['stored', 'processing'].includes(box.status)
      )
      .map((box: FullBox): BookingBox => ({
        ...box,
        price: 0 // Default price since it's required in the Box type
      }));
  }, [boxes, user?.id]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default address if available
    if (user?.addresses?.length) {
      console.log('User addresses:', user.addresses);
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      if (defaultAddress) {
        console.log('Setting default address:', defaultAddress);
        setSelectedAddressId(defaultAddress.id);
      } else {
        console.log('No default address found, using first address');
        setSelectedAddressId(user.addresses[0]?.id || '');
      }
    } else {
      console.log('No addresses found for user:', user);
    }
  }, [user, user?.addresses]);
  
  // Debug: Log when selectedAddressId changes
  useEffect(() => {
    console.log('Selected address ID changed:', selectedAddressId);
  }, [selectedAddressId]);

  const handleBoxSelect = (box: BookingBox) => {
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
      case 'service-flow':
        return (
          <ServiceFlowStep 
            onContinue={() => setCurrentStep('box-selection')}
            onBack={() => navigate(-1)}
          />
        );
      case 'box-selection':
        return (
          <BoxSelection 
            boxes={availableBoxes}
            onSelectBox={handleBoxSelect}
            onBack={() => setCurrentStep('service-flow')}
            onContinue={handleBoxContinue}
            loading={boxesLoading}
          />
        );
      case 'details':
        return (
          <DetailsStep
            addresses={user?.addresses || []}
            selectedAddressId={selectedAddressId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            timeSlots={TIME_SLOTS}
            onBack={handleBack}
            onAddressChange={setSelectedAddressId}
            onDateChange={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onContinue={() => setCurrentStep('summary')}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            selectedBox={selectedBox}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            pickupAddress={selectedAddress ? formatAddress(selectedAddress) : ''}
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
