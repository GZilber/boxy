import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCamera, 
  FiMapPin, 
  FiClock, 
  FiCheck, 
  FiArrowLeft, 
  FiChevronRight,
  FiX,
  FiZap,
  FiImage,
  FiPackage
} from 'react-icons/fi';
import styles from './NewHandoffFlow.module.css';
import CameraComponent from './CameraComponent';

interface NewHandoffFlowProps {
  isPickupFlow?: boolean;
}

interface Item {
  id: string;
  name: string;
  description: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  image?: string;
}

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const NewHandoffFlow: React.FC<NewHandoffFlowProps> = ({ isPickupFlow = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [item, setItem] = useState<Item | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [pickupTime, setPickupTime] = useState<string>('asap');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sample addresses - in a real app, these would come from user's saved addresses
  const addresses: Address[] = [
    {
      id: 'home',
      name: 'Home',
      address: '123 Main St',
      city: 'Tel Aviv',
      country: 'Israel',
      postalCode: '12345',
      isDefault: true,
      coordinates: { lat: 32.0853, lng: 34.7818 }
    },
  ];

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Debug effect for camera state
  useEffect(() => {
    console.log('CAMERA DEBUG - showCamera state changed:', showCamera);
    console.log('CAMERA DEBUG - capturedImage:', capturedImage ? 'Image available' : 'No image');
    
    // Log the current state of the DOM when showCamera changes
    if (showCamera) {
      console.log('CAMERA DEBUG - Camera should be visible now');
      const cameraEl = document.querySelector(`.${styles.cameraFullScreen}`);
      console.log('CAMERA DEBUG - Camera element in DOM:', cameraEl);
      console.log('CAMERA DEBUG - Camera component should be mounted now');
    }
  }, [showCamera, capturedImage]);
  
  // Debug effect for showCamera state
  useEffect(() => {
    console.log('showCamera state changed:', showCamera);
  }, [showCamera]);
  
  const handleOpenCamera = useCallback(() => {
    console.log('CAMERA DEBUG - handleOpenCamera called');
    console.log('CAMERA DEBUG - Current showCamera state:', showCamera);
    setShowCamera(true);
    // Log again after state update (though note this won't reflect immediately)
    setTimeout(() => {
      console.log('CAMERA DEBUG - After setShowCamera, showCamera state:', showCamera);
    }, 0);
  }, [showCamera]);
  
  const handleCloseCamera = useCallback(() => {
    console.log('CAMERA DEBUG - handleCloseCamera called');
    console.log('CAMERA DEBUG - Current showCamera state:', showCamera);
    setShowCamera(false);
    // Log again after state update (though note this won't reflect immediately)
    setTimeout(() => {
      console.log('CAMERA DEBUG - After setShowCamera(false), showCamera state:', showCamera);
    }, 0);
  }, [showCamera]);
  
  const handleCapturePhoto = useCallback((imageData: string) => {
    console.log('CAMERA DEBUG - handleCapturePhoto called with image data');
    setCapturedImage(imageData);
    setShowCamera(false);
    
    // Update item with the captured image
    setItem(prev => {
      const updatedItem = {
        ...(prev || {}),
        id: prev?.id || `item-${Date.now()}`,
        name: prev?.name || '',
        description: prev?.description || '',
        size: prev?.size || 'medium',
        image: imageData
      } as Item;
      console.log('CAMERA DEBUG - Updated item with image:', updatedItem);
      return updatedItem;
    });
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!item || !selectedAddress) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(4); // Move to confirmation
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsLoading(false);
    }
  }, [item, selectedAddress]);

  const renderStep = useCallback(() => {
    console.log('renderStep called, showCamera:', showCamera);
    console.log('CAMERA DEBUG - renderStep - capturedImage:', capturedImage ? 'Image available' : 'No image');
    
    const stepTitles = [
      isPickupFlow ? 'What are you sending?' : 'Item Details',
      isPickupFlow ? 'Pickup Address' : 'Delivery Address',
      isPickupFlow ? 'Schedule Pickup' : 'Schedule Delivery',
      'Confirmation'
    ];
    
    const currentStepTitle = stepTitles[Math.min(currentStep - 1, stepTitles.length - 1)];
    
    if (showCamera) {
      console.log('Rendering CameraComponent in full screen mode');
      return (
      <div className={styles.cameraFullScreen}>
        <div className={styles.cameraHeader}>
          <button 
            onClick={handleCloseCamera} 
            className={styles.backButton}
            aria-label="Close camera"
          >
            <FiX size={24} color="#fff" />
          </button>
        </div>
        <CameraComponent
          onCapture={handleCapturePhoto}
          onClose={handleCloseCamera}
          itemName={item?.name || 'Item'}
          itemId={item?.id || ''}
        />
      </div>
    );
  }
    
    return (
      <div className={styles.container}>
        {/* Debug button - can be removed later */}
        <button 
          onClick={() => {
            console.log('DEBUG: Manually triggering camera');
            handleOpenCamera();
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer'
          }}
          title="Debug Camera"
        >
          <FiCamera size={24} />
        </button>
        
        <div className={styles.header}>
          <h1>{currentStepTitle}</h1>
          {currentStep > 1 && (
            <button 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} 
              className={styles.backButton}
              aria-label="Go back"
            >
              <FiArrowLeft size={24} />
            </button>
          )}
        </div>
        
        <div className={styles.stepIndicator}>
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step}
              className={`${styles.stepDot} ${currentStep >= step ? styles.active : ''}`}
              onClick={() => currentStep > step ? setCurrentStep(step) : null}
            >
              {currentStep > step ? <FiCheck size={14} /> : step}
            </div>
          ))}
        </div>
        
        <div className={styles.stepContent}>
          {currentStep === 1 && (
            <ItemDetailsStep
              item={item}
              onNext={() => setCurrentStep(2)}
              onItemUpdate={setItem}
              onCapturePhoto={handleCapturePhoto}
              isPickupFlow={isPickupFlow}
              capturedImage={capturedImage}
              onOpenCamera={handleOpenCamera}
            />
          )}
          
          {currentStep === 2 && (
            <AddressStep
              addresses={addresses}
              onSelect={(address) => {
                setSelectedAddress(address);
                setCurrentStep(3);
              }}
              onBack={() => setCurrentStep(1)}
              isPickupFlow={isPickupFlow}
            />
          )}
          
          {currentStep === 3 && (
            <ScheduleStep
              selectedTime={pickupTime}
              onTimeSelect={setPickupTime}
              onConfirm={handleSubmit}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
              isPickupFlow={isPickupFlow}
            />
          )}
          
          {currentStep === 4 && selectedAddress && item && (
            <ConfirmationStep
              item={item}
              address={selectedAddress}
              pickupTime={pickupTime}
              onDone={() => navigate('/my-boxes')}
              isPickupFlow={isPickupFlow}
            />
          )}
        </div>
      </div>
    );
  }, [currentStep, item, selectedAddress, pickupTime, isLoading, isPickupFlow, handleSubmit, navigate, addresses, capturedImage, showCamera, handleOpenCamera, handleCloseCamera, handleCapturePhoto]);

  // Add a test button to verify camera component mounting
  const TestCameraButton = () => (
    <button 
      onClick={handleOpenCamera}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      Test Camera
    </button>
  );

  return (
    <>
      {renderStep()}
      <TestCameraButton />
    </>
  );
};

// Step Components
interface ItemDetailsStepProps {
  item: Item | null;
  onNext: () => void;
  onItemUpdate: (updates: React.SetStateAction<Item | null>) => void;
  onCapturePhoto: (imageData: string) => void;
  isPickupFlow: boolean;
  capturedImage: string | null;
  onOpenCamera: () => void;
}

const ItemDetailsStep: React.FC<ItemDetailsStepProps> = ({ 
  item, 
  onNext, 
  onItemUpdate,
  onCapturePhoto,
  isPickupFlow,
  capturedImage,
  onOpenCamera
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onItemUpdate((prev) => ({
      ...(prev || { id: `item-${Date.now()}`, description: '', size: 'medium' }),
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onItemUpdate((prev) => ({
      ...(prev || { id: `item-${Date.now()}`, name: '', size: 'medium' }),
      description: e.target.value,
    }));
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
    onItemUpdate((prev) => ({
      ...(prev || { id: `item-${Date.now()}`, name: '', description: '' }),
      size,
    }));
  };

  const handleCameraClick = useCallback((e: React.MouseEvent) => {
    console.log('Camera button clicked');
    e.stopPropagation();
    onOpenCamera();
  }, [onOpenCamera]);

  return (
    <div className={styles.stepContainer}>
      <h2>What are you storing?</h2>
      <p className={styles.stepDescription}>Take a photo and add a description</p>

      <div className={styles.photoUpload}>
        {capturedImage ? (
          <div className={styles.photoPreview}>
            <img 
              src={capturedImage} 
              alt="Captured item" 
              className={styles.previewImage}
              onClick={handleCameraClick}
            />
            <button 
              className={styles.retakeButton}
              onClick={handleCameraClick}
            >
              <FiCamera size={20} />
            </button>
          </div>
        ) : (
          <div 
            className={styles.photoPlaceholder}
            onClick={handleCameraClick}
          >
            <FiCamera size={32} className={styles.cameraIcon} />
            <span>Take a photo of the item</span>
          </div>
        )}
        
        {/* Camera functionality is now handled by the CameraComponent */}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="itemName">Item Name</label>
        <input
          id="itemName"
          type="text"
          value={item?.name || ''}
          onChange={(e) =>
            onItemUpdate((prev) => ({
              ...(prev || { id: `item-${Date.now()}`, description: '', size: 'medium' }),
              name: e.target.value,
            }))
          }
          placeholder="e.g., Winter Clothes, Books"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="itemDescription">Description (Optional)</label>
        <textarea
          id="itemDescription"
          value={item?.description || ''}
          onChange={(e) =>
            onItemUpdate((prev) => ({
              ...(prev || { id: `item-${Date.now()}`, name: '', size: 'medium' }),
              description: e.target.value,
            }))
          }
          placeholder="Add any details about the item"
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Size</label>
        <div className={styles.sizeOptions}>
          {['small', 'medium', 'large', 'xlarge'].map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeButton} ${
                item?.size === size ? styles.selected : ''
              }`}
              onClick={() =>
                onItemUpdate((prev) => ({
                  ...(prev || { id: `item-${Date.now()}`, name: '', description: '' }),
                  size: size as 'small' | 'medium' | 'large' | 'xlarge',
                }))
              }
            >
              <div className={`${styles.sizeIcon} ${styles[size]}`}>
                <FiPackage size={20} />
              </div>
              <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={onNext}
        disabled={!item?.name || !capturedImage}
      >
        Continue
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

const AddressStep: React.FC<{
  addresses: Address[];
  onSelect: (address: Address) => void;
  onBack: () => void;
  isPickupFlow: boolean;
}> = ({ addresses, onSelect, onBack, isPickupFlow }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((addr) => addr.isDefault)?.id || null
  );

  const handleSelect = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  const handleContinue = () => {
    const address = addresses.find((addr) => addr.id === selectedAddressId);
    if (address) onSelect(address);
  };

  return (
    <div className={styles.stepContainer}>
      <h2>{isPickupFlow ? 'Select Pickup Address' : 'Select Delivery Address'}</h2>
      <p className={styles.stepDescription}>
        {isPickupFlow
          ? 'Where should we pick up your items?'
          : 'Where should we deliver your items?'}
      </p>

      <div className={styles.addressList}>
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`${styles.addressCard} ${selectedAddressId === address.id ? styles.selected : ''}`}
            onClick={() => handleSelect(address)}
          >
            <div className={styles.addressIcon}>
              {/* Add address icon */}
            </div>
            <div className={styles.addressDetails}>
              <p>{address.name}</p>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.country} {address.postalCode}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

const ScheduleStep: React.FC<{
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onConfirm: (e?: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  isPickupFlow: boolean;
}> = ({
  selectedTime,
  onTimeSelect,
  onConfirm,
  onBack,
  isLoading,
  isPickupFlow,
}) => (
  <div className={styles.stepContainer}>
    <h2>Schedule {isPickupFlow ? 'Pickup' : 'Delivery'}</h2>
    <p className={styles.stepDescription}>
      When would you like us to {isPickupFlow ? 'pick up' : 'deliver'} your items?
    </p>

    <div className={styles.timeOptions}>
      <button
        type="button"
        className={`${styles.timeOption} ${selectedTime === 'asap' ? styles.selected : ''}`}
        onClick={() => onTimeSelect('asap')}
      >
        <FiClock className={styles.timeIcon} />
        <div>
          <h3>As soon as possible</h3>
          <p>Within the next 2 hours</p>
        </div>
        {selectedTime === 'asap' && <FiCheck className={styles.checkIcon} />}
      </button>

      <button
        type="button"
        className={`${styles.timeOption} ${selectedTime === 'later' ? styles.selected : ''}`}
        onClick={() => onTimeSelect('later')}
      >
        <FiClock className={styles.timeIcon} />
        <div>
          <h3>Schedule for later</h3>
          <p>Select date & time</p>
        </div>
        {selectedTime === 'later' && <FiCheck className={styles.checkIcon} />}
      </button>
    </div>

    <div className={styles.buttonGroup}>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onBack}
        disabled={isLoading}
      >
        Back
      </button>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading
          ? `Scheduling ${isPickupFlow ? 'Pickup' : 'Delivery'}...`
          : `Confirm ${isPickupFlow ? 'Pickup' : 'Delivery'}`}
      </button>
    </div>
  </div>
);

const ConfirmationStep: React.FC<{
  item: Item;
  address: Address;
  pickupTime: string;
  onDone: () => void;
  isPickupFlow: boolean;
}> = ({ item, address, pickupTime, onDone, isPickupFlow }) => (
  <div className={styles.confirmationContainer}>
    <div className={styles.successIcon}>
      <FiCheck size={48} />
    </div>
    
    <h2>{isPickupFlow ? 'Pickup Scheduled!' : 'Delivery Scheduled!'}</h2>
    <p className={styles.confirmationMessage}>
      Your {isPickupFlow ? 'pickup' : 'delivery'} has been confirmed. We'll send you a notification when your courier is on the way.
    </p>
    
    <div className={styles.detailsCard}>
      <h3>Details</h3>
      
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Item:</span>
        <span className={styles.detailValue}>{item.name}</span>
      </div>
      
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Size:</span>
        <span className={styles.detailValue}>
          {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
        </span>
      </div>
      
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>
          {isPickupFlow ? 'Pickup Address:' : 'Delivery Address:'}
        </span>
        <div className={styles.addressDetails}>
          <p>{address.name}</p>
          <p>{address.address}</p>
          <p>{address.city}, {address.country} {address.postalCode}</p>
        </div>
      </div>
      
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>
          {isPickupFlow ? 'Pickup Time:' : 'Delivery Time:'}
        </span>
        <span className={styles.detailValue}>
          {pickupTime === 'asap' 
            ? 'As soon as possible' 
            : 'Scheduled for later'}
        </span>
      </div>
    </div>
    
    <button 
      type="button"
      className={styles.primaryButton}
      onClick={onDone}
    >
      Done
    </button>
  </div>
);

export default NewHandoffFlow;
