import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiCamera, FiRotateCw, FiX, FiZap, FiZapOff, FiCheck, FiXCircle } from 'react-icons/fi';
import styles from './NewHandoffFlow.module.css';

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  itemName: string;
  itemId: string;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onClose, itemName, itemId }) => {
  console.log('CAMERA DEBUG - CameraComponent mounted with props:', { itemName, itemId });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  // Initialize camera
  const initCamera = useCallback(async (): Promise<void> => {
    console.log('CAMERA DEBUG - initCamera called');
    console.log('CAMERA DEBUG - navigator.mediaDevices available:', !!navigator.mediaDevices);
    console.log('CAMERA DEBUG - getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);
    
    // Skip if video ref is not available
    if (!videoRef.current) {
      console.log('CAMERA DEBUG - Video ref not available yet');
      return;
    }
    
    let mediaStream: MediaStream | null = null;
    
    try {
      setStatus('Initializing camera...');
      
      // Stop any existing stream
      if (stream) {
        console.log('CAMERA DEBUG - Stopping existing stream...');
        stream.getTracks().forEach(track => {
          console.log('CAMERA DEBUG - Stopping track:', track.kind);
          track.stop();
        });
      }
      
      console.log('CAMERA DEBUG - Requesting camera permissions...');

      // Try with ideal constraints first
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      console.log('CAMERA DEBUG - Requesting camera access with constraints:', JSON.stringify(constraints));
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.warn('CAMERA DEBUG - Failed with ideal constraints, trying with simpler constraints', error);
        // Try with simpler constraints
        const simpleConstraints = {
          video: { facingMode: facingMode },
          audio: false
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
      }
      
      console.log('CAMERA DEBUG - Camera access granted, stream active:', mediaStream.active);
      
      // Double check video ref is still available
      if (!videoRef.current) {
        console.log('CAMERA DEBUG - Video ref no longer available');
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      
      // Set the source
      videoRef.current.srcObject = mediaStream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        const video = videoRef.current;
        if (!video) {
          console.log('CAMERA DEBUG - Video ref lost while waiting for metadata');
          resolve();
          return;
        }
        
        const onLoaded = () => {
          console.log('CAMERA DEBUG - Video metadata loaded');
          video.play()
            .then(() => {
              console.log('CAMERA DEBUG - Video playback started');
              resolve();
            })
            .catch(error => {
              console.error('CAMERA DEBUG - Error starting video playback:', error);
              // Try again with a smaller resolution
              if (constraints.video && typeof constraints.video === 'object') {
                console.log('CAMERA DEBUG - Trying with smaller resolution...');
                video.srcObject = null;
                mediaStream?.getTracks().forEach(track => track.stop());
                
                const smallConstraints = {
                  video: { facingMode: facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
                  audio: false
                };
                
                navigator.mediaDevices.getUserMedia(smallConstraints)
                  .then(newStream => {
                    video.srcObject = newStream;
                    video.play()
                      .then(() => {
                        console.log('CAMERA DEBUG - Video playback started with smaller resolution');
                        mediaStream = newStream;
                        resolve();
                      })
                      .catch(playError => {
                        console.error('CAMERA DEBUG - Still cannot play video:', playError);
                        resolve();
                      });
                  })
                  .catch(streamError => {
                    console.error('CAMERA DEBUG - Failed to get media with smaller resolution:', streamError);
                    resolve();
                  });
              } else {
                resolve();
              }
            });
        };
        
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA
          console.log('CAMERA DEBUG - Video already has data, playing directly');
          onLoaded();
        } else {
          video.onloadedmetadata = onLoaded;
          // Add a timeout in case onloadedmetadata never fires
          setTimeout(() => {
            if (video.readyState < 2) {
              console.log('CAMERA DEBUG - onloadedmetadata timeout, trying to play anyway');
              onLoaded();
            }
          }, 2000);
        }
      });
      
      setStream(mediaStream);
      setStatus(''); // Clear status when camera is ready
      
    } catch (error) {
      console.error('CAMERA DEBUG - Error accessing camera:', error);
      setStatus('Error accessing camera. Please check permissions and try again.');
      
      // Clean up if we got a stream but had an error
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    }
  }, [facingMode]); // Removed stream from dependencies to prevent infinite loops

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Initialize camera on mount and when facingMode changes
  useEffect(() => {
    console.log('CAMERA DEBUG - useEffect for camera initialization triggered');
    
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      console.log('CAMERA DEBUG - Starting camera initialization');
      console.log('CAMERA DEBUG - Video element:', videoRef.current);
      initCamera().catch(error => {
        console.error('CAMERA DEBUG - Error in initCamera:', error);
      });
    }, 100);
    
    return () => {
      console.log('CAMERA DEBUG - Cleaning up camera');
      clearTimeout(timer);
      if (stream) {
        console.log('CAMERA DEBUG - Stopping all tracks');
        stream.getTracks().forEach(track => {
          console.log('CAMERA DEBUG - Stopping track:', track.kind);
          track.stop();
        });
      }
    };
  }, [facingMode, initCamera, stream]);
  
  // Add a mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleFlash = () => setFlashOn(prev => !prev);
  const toggleCamera = () => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the image data as a base64 string
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Show flash effect
    if (flashOn && flashOverlayRef.current) {
      flashOverlayRef.current.style.opacity = '1';
      setTimeout(() => {
        if (flashOverlayRef.current) {
          flashOverlayRef.current.style.opacity = '0';
        }
      }, 200);
    }
    
    setCapturedImage(imageData);
    setShowPreview(true);
  }, [flashOn]);

  const retakePhoto = () => {
    setShowPreview(false);
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  console.log('CAMERA DEBUG - Rendering CameraComponent');
  
  const handleRetry = useCallback(() => {
    console.log('CAMERA DEBUG - Retry button clicked');
    setStatus('Retrying camera initialization...');
    initCamera().catch(error => {
      console.error('CAMERA DEBUG - Error retrying camera initialization:', error);
      setStatus('Failed to initialize camera. Please check permissions.');
    });
  }, [initCamera]);

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.cameraView}>
        {status && (
          <div className={styles.statusOverlay}>
            {status}
            {status.includes('Error') && (
              <button 
                onClick={handleRetry}
                className={styles.retryButton}
              >
                Retry
              </button>
            )}
          </div>
        )}
        <video 
          ref={videoRef}
          className={styles.videoElement}
          autoPlay 
          playsInline 
          muted 
          style={{
            display: showPreview ? 'none' : 'block'
          }}
        />
        
        {showPreview && capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured preview"
            className={styles.previewImage}
          />
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Flash overlay */}
        <div 
          ref={flashOverlayRef}
          className={styles.flashOverlay}
        />
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close camera"
        >
          <FiX size={24} />
        </button>
        
        {/* Flash toggle */}
        <button 
          onClick={toggleFlash}
          className={`${styles.cameraButton} ${styles.flashButton} ${flashOn ? styles.flashOn : ''}`}
          aria-label={flashOn ? 'Turn off flash' : 'Turn on flash'}
        >
          {flashOn ? <FiZapOff size={24} /> : <FiZap size={24} />}
        </button>
        
        {/* Camera toggle */}
        <button 
          onClick={toggleCamera}
          className={`${styles.cameraButton} ${styles.switchCameraButton}`}
          aria-label="Switch camera"
        >
          <FiRotateCw size={24} />
        </button>
        
        {/* Capture button */}
        {!showPreview && (
          <button 
            onClick={capturePhoto}
            className={styles.captureButton}
            aria-label="Take photo"
          >
            <div className={styles.captureButtonInner} />
          </button>
        )}
        
        {/* Preview controls */}
        {showPreview && capturedImage && (
          <div className={styles.previewControls}>
            <button 
              onClick={retakePhoto}
              className={styles.retakeButton}
            >
              <FiXCircle size={20} />
              <span>Retake</span>
            </button>
            
            <button 
              onClick={confirmPhoto}
              className={styles.confirmButton}
            >
              <FiCheck size={20} />
              <span>Use Photo</span>
            </button>
          </div>
        )}
        
        {/* Status message */}
        {status && !showPreview && (
          <div className={styles.statusMessage}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
