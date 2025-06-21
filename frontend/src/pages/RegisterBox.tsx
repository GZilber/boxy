import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import BoxYLogo from '../components/BoxYLogo';
import { 
  FiCamera, 
  FiCheck, 
  FiRefreshCw, 
  FiX, 
  FiSun, 
  FiLayers, 
  FiGrid, 
  FiCheckCircle 
} from 'react-icons/fi';
import styles from './RegisterBox.module.css';

const PhotoInstructions = ({ onContinue }: { onContinue: () => void }) => (
  <div className={styles.instructionsContainer}>
    <div className={styles.instructionsCard}>
      <h2 className={styles.instructionsTitle}>How to Take a Good Photo</h2>
      <div className={styles.instructionsGrid}>
        <div className={styles.instructionItem}>
          <div className={styles.instructionIcon}>
            <FiSun size={20} />
          </div>
          <p><span className={styles.stepNumber}>1.</span> Find a well-lit area with good lighting</p>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.instructionIcon}>
            <FiLayers size={20} />
          </div>
          <p><span className={styles.stepNumber}>2.</span> Lay out all items on a clean, flat surface</p>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.instructionIcon}>
            <FiGrid size={20} />
          </div>
          <p><span className={styles.stepNumber}>3.</span> Arrange items so they're all visible</p>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.instructionIcon}>
            <FiCheckCircle size={20} />
          </div>
          <p><span className={styles.stepNumber}>4.</span> Ensure the photo is clear and in focus</p>
        </div>
      </div>
      <button 
        onClick={onContinue} 
        className={styles.continueButton}
      >
        Continue to Take Photo
      </button>
    </div>
  </div>
);

const CameraView = ({ onCapture, onClose }: { onCapture: (imageData: string) => void, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      console.log('Attempting to access camera...');
      try {
        // First check if we have media devices support
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          throw new Error('MediaDevices API not supported in this browser');
        }

        // List available devices for debugging
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Available media devices:', devices);

        const constraints: MediaStreamConstraints = {
          video: { 
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };

        console.log('Requesting media with constraints:', constraints);
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!isMounted) {
          // Component unmounted while we were waiting for the camera
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log('Got media stream:', mediaStream);
        
        if (videoRef.current) {
          console.log('Setting video source');
          videoRef.current.srcObject = mediaStream;
          // Play the video to start the camera
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setError('Could not start camera preview. Please try again.');
          });
          setStream(mediaStream);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        if (isMounted) {
          let errorMessage = 'Could not access the camera. ';
          
          if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') {
              errorMessage += 'Please check your browser permissions and allow camera access.';
            } else if (error.name === 'NotFoundError') {
              errorMessage += 'No camera found. Please connect a camera and try again.';
            } else if (error.name === 'NotReadableError') {
              errorMessage += 'Camera is already in use by another application.';
            } else {
              errorMessage += `Error: ${error.message || 'Unknown error occurred'}`;
            }
          } else if (error instanceof Error) {
            errorMessage += error.message;
          } else {
            errorMessage += 'An unknown error occurred while accessing the camera.';
          }
          
          console.error('Camera error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
          
          setError(errorMessage);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (mediaStream) {
        console.log('Cleaning up media stream');
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
        
        // Stop all video tracks
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (error) {
    return (
      <div className={styles.cameraError}>
        <p>{error}</p>
        <button onClick={onClose} className={styles.closeButton}>
          <FiX /> Close
        </button>
      </div>
    );
  }

  return (
    <div className={styles.cameraContainer}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className={styles.cameraView}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
        }}
        onLoadedMetadata={(e) => {
          console.log('Video metadata loaded:', e);
          const video = e.target as HTMLVideoElement;
          video.play().catch(err => {
            console.error('Error playing video after metadata loaded:', err);
          });
        }}
        onError={(e) => {
          console.error('Video error:', e);
          setError('Failed to load camera feed. Please try again.');
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className={styles.cameraControls}>
        <button onClick={onClose} className={styles.closeButton}>
          <FiX />
        </button>
        
        <button 
          onClick={capturePhoto} 
          className={styles.captureButton}
          aria-label="Take photo"
        >
          <div className={styles.captureButtonInner} />
        </button>
        
        <button 
          onClick={switchCamera} 
          className={styles.switchCameraButton}
          aria-label="Switch camera"
        >
          <FiRefreshCw />
        </button>
      </div>
    </div>
  );
};

const RegisterBox: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const boxNameRef = useRef<HTMLInputElement>(null);
  const boxContentsRef = useRef<HTMLTextAreaElement>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boxSize, setBoxSize] = useState<'small' | 'medium' | 'large' | 'xl'>('medium');

  const handleCapturePhoto = (imageData: string) => {
    setImage(imageData);
    setShowCamera(false);
  };

  const handleRetakePhoto = () => {
    setShowCamera(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const boxName = boxNameRef.current?.value || '';
    const boxContents = boxContentsRef.current?.value || '';
    
    if (!boxName.trim()) {
      showError('Please enter a box name');
      boxNameRef.current?.focus();
      return;
    }
    
    if (!image) {
      showError('Please take a photo of the box contents');
      return;
    }
    
    try {
      // In a real app, you would upload the image and save the box data
      console.log('Registering box:', { boxName, boxContents, image: 'Image data...' });
      
      success('Box registered successfully!');
      setTimeout(() => {
        navigate('/my-boxes');
      }, 1500);
    } catch (err) {
      showError('Failed to register box. Please try again.');
      console.error('Error registering box:', err);
    }
  };

  if (showCamera) {
    return (
      <CameraView 
        onCapture={handleCapturePhoto} 
        onClose={() => setShowCamera(false)} 
      />
    );
  }

  if (showInstructions) {
    return <PhotoInstructions onContinue={() => {
      setShowInstructions(false);
      setShowCamera(true);
    }} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BoxYLogo />
        <h1 className={styles.title}>Register a New Box</h1>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="boxName" className={styles.label}>
            Box Name <span className={styles.required}>*</span>
          </label>
          <input
            ref={boxNameRef}
            type="text"
            id="boxName"
            placeholder="e.g., Winter Clothes"
            className={styles.input}
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Box Size <span className={styles.required}>*</span>
          </label>
          <div className={styles.sizeOptions}>
            {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
              <label 
                key={size}
                className={`${styles.sizeOption} ${boxSize === size ? styles.sizeOptionSelected : ''}`}
              >
                <input
                  type="radio"
                  name="boxSize"
                  value={size}
                  checked={boxSize === size}
                  onChange={() => setBoxSize(size)}
                  className={styles.radioInput}
                />
                <span className={styles.sizeLabel}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Box Contents Photo <span className={styles.required}>*</span>
          </label>
          <div 
            className={`${styles.photoUploadArea} ${image ? styles.hasImage : ''}`} 
            onClick={() => !image && setShowInstructions(true)}
          >
            {image ? (
              <div className={styles.imagePreview}>
                <img 
                  src={image} 
                  alt="Box contents preview" 
                  className={styles.previewImage}
                />
                <div className={styles.retakeButton} onClick={(e) => {
                  e.stopPropagation();
                  setShowInstructions(true);
                }}>
                  <FiCamera size={16} />
                  <span>Retake Photo</span>
                </div>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <FiCamera size={32} className={styles.cameraIcon} />
                <span className={styles.uploadText}>Take a photo of the box contents</span>
                <span className={styles.uploadHint}>
                  We'll guide you through taking the perfect photo
                </span>
              </div>
            )}
          </div>
          <p className={styles.helpText}>
            Take a clear photo of the box contents laid out on a flat surface
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="boxContents" className={styles.label}>
            Additional Notes (Optional)
          </label>
          <textarea
            ref={boxContentsRef}
            id="boxContents"
            placeholder="Any additional details about the box contents"
            className={styles.textarea}
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          className={`${styles.submitButton} ${!image ? styles.disabled : ''}`}
          disabled={!image || isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.buttonText}>Saving...</span>
          ) : (
            <>
              <FiCheck size={18} className={styles.buttonIcon} />
              <span className={styles.buttonText}>Save Box</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterBox;
