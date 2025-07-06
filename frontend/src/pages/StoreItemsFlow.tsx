import React, { useState, useCallback, useRef, useEffect, FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiArrowLeft, FiX, FiRotateCw, FiCheck } from 'react-icons/fi';
import styles from './StoreItemsFlow.module.css';

declare global {
  interface Window {
    stream: MediaStream | null;
  }
}

// Define types
interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
}

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

interface CameraState {
  stream: MediaStream | null;
  status: string | undefined;
  isCapturing: boolean;
  facingMode: 'user' | 'environment';
  showModal: boolean;
}

interface StoreItemsFlowProps {
  children?: ReactNode;
}

const StoreItemsFlow: FC<StoreItemsFlowProps> = (): JSX.Element => {
  // Navigation
  const navigate = useNavigate();
  
  // Refs for camera elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraKey, setCameraKey] = useState(0); // Key to force video element recreation
  
  // Form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  
  // Item state
  const [item, setItem] = useState<Item>({
    id: '',
    name: '',
    description: ''
  });
  
  // Address state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [pickupTime, setPickupTime] = useState<string>('asap');
  
  // Camera state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    showModal: false,
    isCapturing: false,
    status: undefined,
    stream: null,
    facingMode: 'environment',
  });
  
  // Sample addresses
  const [addresses] = useState<Address[]>([
    {
      id: 'home',
      name: 'Home',
      address: '123 Main St',
      city: 'Tel Aviv',
      country: 'Israel',
      postalCode: '12345',
      isDefault: true
    },
    {
      id: 'work',
      name: 'Work',
      address: '456 Work Ave',
      city: 'Tel Aviv',
      country: 'Israel',
      postalCode: '67890',
      isDefault: false
    }
  ]);

  // State to track if modal is mounted
  const [isModalMounted, setIsModalMounted] = useState(false);

  // Initialize camera when modal is opened or facing mode changes
  useEffect(() => {
    if (!cameraState.showModal) return;

    // Set a timeout to ensure the modal is fully mounted
    const timer = setTimeout(() => {
      setIsModalMounted(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      setIsModalMounted(false);
    };
  }, [cameraState.showModal]);

  // Initialize camera after modal is mounted
  useEffect(() => {
    if (!isModalMounted) return;

    const initCamera = async () => {
      console.log('Initializing camera...');
      setCameraState(prev => ({ ...prev, status: 'Initializing camera...' }));

      try {
        // Clean up any existing stream
        cleanupCamera();

        // Get the video element
        const video = videoRef.current;
        if (!video) {
          throw new Error('Video element not found');
        }

        
        console.log('Video element found, setting up camera...');
        
        // Set up video constraints
        const constraints: MediaStreamConstraints = {
          video: { 
            facingMode: cameraState.facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        console.log('Requesting camera with constraints:', constraints);
        
        // Get the media stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Successfully got media stream');
        
        // Store the stream in window for debugging
        window.stream = stream;
        
        // Log video track details
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          console.log('Video track settings:', videoTrack.getSettings());
        }
        
        // Set the stream as the video source
        video.srcObject = stream;
        
        // Wait for the video to be ready to play
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            video.removeEventListener('canplay', onCanPlay);
            video.play().then(resolve).catch(reject);
          };
          
          video.addEventListener('canplay', onCanPlay);
          video.addEventListener('error', (e) => {
            video.removeEventListener('canplay', onCanPlay);
            console.error('Video playback error:', e);
            reject(new Error('Video playback failed'));
          });
        });

        // Update state with the stream
        setCameraState(prev => ({
          ...prev,
          stream,
          status: undefined,
          isCapturing: false
        }));
        
        console.log('Camera initialized successfully');
      } catch (error) {
        console.error('Error initializing camera:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to access camera';
        if (error instanceof DOMException) {
          if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera access was denied. Please allow camera access to continue.';
          } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found. Please check your device settings.';
          } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera is already in use by another application.';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage = 'Camera constraints could not be satisfied.';
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        console.error('Setting camera state to error:', errorMessage);
        setCameraState(prev => ({
          ...prev,
          status: `Camera error: ${errorMessage}`,
          isCapturing: false
        }));
      }
    };

    initCamera();

    // Clean up on unmount or when modal closes
    return () => {
      cleanupCamera();
    };
  }, [isModalMounted, cameraState.facingMode]);

  // Simplified camera functions
  const startCamera = useCallback(async (): Promise<void> => {
    console.log('startCamera called - camera initialization is handled by effect');
    // This function is kept for backward compatibility but the actual
    // camera initialization is now handled by the effect
  }, []);

  // Camera cleanup function
  const cleanupCamera = useCallback((): void => {
    if (cameraState.stream) {
      console.log('Cleaning up camera stream');
      cameraState.stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      
      // Clear the video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      // Clear the stream from state
      setCameraState(prev => ({
        ...prev,
        stream: null
      }));
    }
  }, [cameraState.stream]);

  // Toggle between front and back camera
  const toggleCamera = useCallback((): void => {
    const newFacingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';
    
    // Update the camera state with the new facing mode
    setCameraState(prev => ({
      ...prev,
      facingMode: newFacingMode,
      status: 'Switching camera...',
      isCapturing: false
    }));
    
    // The effect will handle restarting the camera with the new facing mode
  }, [cameraState.facingMode]);

  // Capture photo from camera
  const capturePhoto = useCallback((): void => {
    console.log('Attempting to capture photo...');
    
    if (!videoRef.current) {
      console.error('Video element not found');
      return;
    }

    const video = videoRef.current;
    
    // Create a temporary canvas if one doesn't exist
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }
    
    // Draw the current video frame to canvas
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL and update state
      const imageDataUrl = canvas.toDataURL('image/png');
      console.log('Photo captured successfully');
      
      setCapturedImage(imageDataUrl);
      
      // Update item with the captured image
      setItem(prev => ({
        ...prev,
        image: imageDataUrl
      }));
      
      // Close camera
      cleanupCamera();
      setCameraState(prev => ({
        ...prev,
        showModal: false
      }));
    } catch (error) {
      console.error('Error capturing photo:', error);
      setCameraState(prev => ({
        ...prev,
        status: 'Error capturing photo. Please try again.'
      }));
    }
  }, [cleanupCamera]);

  // Open camera modal
  const openCamera = useCallback((): void => {
    setCameraState(prev => ({
      ...prev,
      showModal: true,
      status: 'Initializing camera...'
    }));
    // The effect will handle starting the camera
  }, []);

  // Close camera modal
  const closeCamera = useCallback((): void => {
    cleanupCamera();
    setCameraState(prev => ({
      ...prev,
      showModal: false
    }));
  }, [cleanupCamera]);

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle address selection
  const handleAddressSelect = useCallback((address: Address): void => {
    setSelectedAddress(address);
  }, []);

  // Handle pickup time change
  const handlePickupTimeChange = useCallback((time: string): void => {
    setPickupTime(time);
  }, []);

  // Handle next step
  const handleNext = useCallback((): void => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  // Handle previous step
  const handleBack = useCallback((): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1); // Go back to previous page if on first step
    }
  }, [currentStep, navigate]);

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedAddress) {
      alert('Please select a pickup address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random confirmation code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setConfirmationCode(code);
      
      // Move to confirmation step
      setCurrentStep(5);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedAddress]);

  // Render current step content
  const renderStep = useCallback((): JSX.Element => {
    switch (currentStep) {
      case 1: // Take a photo
        return (
          <div className={styles.stepContent}>
            <h2>Take a photo of your item</h2>
            <p>Take a clear photo of the item you want to store.</p>
            
            {capturedImage ? (
              <div className={styles.imagePreview}>
                <img 
                  src={capturedImage} 
                  alt="Captured item" 
                  className={styles.previewImage}
                />
                <button 
                  className={styles.retakeButton}
                  onClick={openCamera}
                >
                  <FiCamera /> Retake Photo
                </button>
              </div>
            ) : (
              <div 
                className={styles.cameraPlaceholder}
                onClick={openCamera}
              >
                <FiCamera size={48} />
                <span>Tap to open camera</span>
              </div>
            )}
          </div>
        );
        
      case 2: // Item details
        return (
          <div className={styles.stepContent}>
            <h2>Item Details</h2>
            <p>Provide some details about the item you're storing.</p>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={item.name}
                onChange={handleInputChange}
                placeholder="e.g., Winter Jacket, Books, etc."
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={item.description}
                onChange={handleInputChange}
                placeholder="Add any additional details about the item"
                rows={4}
              />
            </div>
            
            {capturedImage && (
              <div className={styles.formGroup}>
                <label>Item Photo</label>
                <div className={styles.imagePreview}>
                  <img 
                    src={capturedImage} 
                    alt="Item preview" 
                    className={styles.previewImage}
                  />
                  <button 
                    className={styles.retakeButton}
                    onClick={openCamera}
                  >
                    <FiCamera /> Change Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 3: // Select address
        return (
          <div className={styles.stepContent}>
            <h2>Pickup Address</h2>
            <p>Where should we pick up your item?</p>
            
            <div className={styles.addressList}>
              {addresses.map(address => (
                <div 
                  key={address.id}
                  className={`${styles.addressCard} ${
                    selectedAddress?.id === address.id ? styles.selected : ''
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className={styles.addressHeader}>
                    <h3>{address.name}</h3>
                    {address.isDefault && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.country} {address.postalCode}</p>
                </div>
              ))}
              
              <button className={styles.addAddressButton}>
                + Add New Address
              </button>
            </div>
          </div>
        );
        
      case 4: // Schedule pickup
        return (
          <div className={styles.stepContent}>
            <h2>Schedule Pickup</h2>
            <p>When would you like us to pick up your item?</p>
            
            <div className={styles.timeSlots}>
              <button 
                className={`${styles.timeSlot} ${
                  pickupTime === 'asap' ? styles.selected : ''
                }`}
                onClick={() => handlePickupTimeChange('asap')}
              >
                <span>ASAP</span>
                <span>Within 2 hours</span>
              </button>
              
              <button 
                className={`${styles.timeSlot} ${
                  pickupTime === 'today' ? styles.selected : ''
                }`}
                onClick={() => handlePickupTimeChange('today')}
              >
                <span>Today</span>
                <span>After 6:00 PM</span>
              </button>
              
              <button 
                className={`${styles.timeSlot} ${
                  pickupTime === 'tomorrow' ? styles.selected : ''
                }`}
                onClick={() => handlePickupTimeChange('tomorrow')}
              >
                <span>Tomorrow</span>
                <span>9:00 AM - 12:00 PM</span>
              </button>
              
              <button 
                className={`${styles.timeSlot} ${
                  pickupTime === 'custom' ? styles.selected : ''
                }`}
                onClick={() => handlePickupTimeChange('custom')}
              >
                <span>Custom Time</span>
                <span>Select date & time</span>
              </button>
            </div>
            
            {selectedAddress && (
              <div className={styles.pickupSummary}>
                <h3>Pickup Details</h3>
                <p><strong>Address:</strong> {selectedAddress.address}, {selectedAddress.city}</p>
                <p><strong>Time:</strong> {
                  pickupTime === 'asap' ? 'ASAP (within 2 hours)' :
                  pickupTime === 'today' ? 'Today after 6:00 PM' :
                  pickupTime === 'tomorrow' ? 'Tomorrow 9:00 AM - 12:00 PM' :
                  'Custom time to be scheduled'
                }</p>
              </div>
            )}
          </div>
        );
        
      case 5: // Confirmation
        return (
          <div className={styles.stepContent}>
            <div className={styles.confirmationContainer}>
              <div className={styles.confirmationIcon}>
                <FiCheck size={48} />
              </div>
              <h2>Pickup Scheduled!</h2>
              <p>Your pickup has been scheduled successfully.</p>
              
              <div className={styles.confirmationDetails}>
                <h3>Confirmation Code</h3>
                <div className={styles.confirmationCode}>
                  {confirmationCode || 'ABC123'}
                </div>
                
                <p>Please have this code ready when the driver arrives.</p>
                
                <div className={styles.detailsSection}>
                  <h4>Pickup Details</h4>
                  <p><strong>Item:</strong> {item.name || 'Not specified'}</p>
                  {selectedAddress && (
                    <p>
                      <strong>Address:</strong> {selectedAddress.address}, {selectedAddress.city}
                    </p>
                  )}
                  <p>
                    <strong>Time:</strong> {
                      pickupTime === 'asap' ? 'ASAP (within 2 hours)' :
                      pickupTime === 'today' ? 'Today after 6:00 PM' :
                      pickupTime === 'tomorrow' ? 'Tomorrow 9:00 AM - 12:00 PM' :
                      'Custom time to be scheduled'
                    }
                  </p>
                </div>
                
                <button 
                  className={styles.doneButton}
                  onClick={() => navigate('/')}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Invalid step</div>;
    }
  }, [
    currentStep, 
    capturedImage, 
    item, 
    selectedAddress, 
    pickupTime, 
    confirmationCode,
    openCamera,
    handleInputChange,
    handleAddressSelect,
    handlePickupTimeChange,
    navigate
  ]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  // Main component render
  return (
    <div className={styles.container}>
      {/* Camera Modal */}
      {cameraState.showModal && (
        <div className={styles.cameraModal}>
          <div className={styles.cameraHeader}>
            <button 
              className={styles.closeButton}
              onClick={closeCamera}
              aria-label="Close camera"
            >
              <FiX size={24} />
            </button>
            <h3>Take a photo</h3>
            <div className={styles.headerSpacer} />
          </div>
          
          <div className={styles.cameraContainer}>
            <video
              key={`camera-video-${cameraKey}`}
              ref={videoRef}
              className={styles.cameraView}
              autoPlay
              playsInline
              muted
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000',
                transform: cameraState.facingMode === 'user' ? 'scaleX(-1)' : 'none',
                WebkitTransform: cameraState.facingMode === 'user' ? 'scaleX(-1)' : 'none'
              }}
              onLoadedMetadata={(e) => {
                console.log('Video metadata loaded');
                const video = e.target as HTMLVideoElement;
                video.play().catch(err => {
                  console.error('Error playing video:', err);
                  setCameraState(prev => ({
                    ...prev,
                    status: 'Error: Could not start video playback.'
                  }));
                });
              }}
              onError={(e) => {
                console.error('Video element error:', e);
                setCameraState(prev => ({
                  ...prev,
                  status: 'Error: Failed to load camera feed.'
                }));
              }}
            />
            {/* Hidden canvas for capturing photos */}
            <canvas 
              ref={canvasRef} 
              style={{ display: 'none' }} 
            />
            {cameraState.status && (
              <div className={styles.cameraStatusOverlay}>
                <p>{cameraState.status}</p>
                {cameraState.status.includes('Error') && (
                  <button
                    className={styles.retryButton}
                    onClick={startCamera}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.cameraControls}>
            <button 
              className={styles.captureButton}
              onClick={() => {
                console.log('Capture button clicked');
                capturePhoto();
              }}
              disabled={cameraState.isCapturing || !!cameraState.status}
              aria-label="Take photo"
            >
              <div className={styles.captureButtonInner} />
            </button>
            
            <button 
              className={styles.switchCameraButton}
              onClick={toggleCamera}
              disabled={cameraState.isCapturing || !!cameraState.status}
              aria-label="Switch camera"
            >
              <FiRotateCw size={24} />
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Store Items</h1>
        </header>
        
        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`${styles.step} ${
                  currentStep >= step ? styles.active : ''
                }`}
                onClick={() => step < currentStep && setCurrentStep(step)}
              >
                {step}
              </div>
              {step < 5 && <div className={styles.stepDivider} />}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step Content */}
        <div className={styles.stepContainer}>
          {renderStep()}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      {currentStep < 5 && (
        <div className={styles.bottomNav}>
          {currentStep > 1 && (
            <button 
              className={styles.secondaryButton}
              onClick={handleBack}
            >
              Back
            </button>
          )}
          
          <button 
            className={styles.primaryButton}
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            disabled={
              (currentStep === 1 && !capturedImage) ||
              (currentStep === 2 && !item.name) ||
              (currentStep === 3 && !selectedAddress) ||
              isLoading
            }
            style={currentStep === 1 ? { marginLeft: 'auto' } : {}}
          >
            {isLoading ? 'Processing...' : currentStep === 4 ? 'Confirm & Schedule' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreItemsFlow;
