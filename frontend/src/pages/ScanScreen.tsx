import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import BoxYLogo from '../components/BoxYLogo';
const ScanScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { info, error } = useToast();
  const navigate = useNavigate();
  // Request camera permission and start scanning
  useEffect(() => {
    const startCamera = async () => {
      // First check if we have permission to access the camera
      try {
        // Check if browser supports mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }

        // Try to get the camera stream with more permissive constraints
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        
        // Try with exact constraints first
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
          console.warn('Failed with exact constraints, trying more permissive...', err);
          // Try with more permissive constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' }
            },
            audio: false
          });
        }
        
        if (!stream) {
          throw new Error('Could not access camera stream');
        }
        
        if (videoRef.current) {
          // Set the video source
          videoRef.current.srcObject = stream;
          
          // When the video can play, set its dimensions and start scanning
          const onCanPlay = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log('Video playback started successfully');
                  streamRef.current = stream;
                  setHasPermission(true);
                  setIsScanning(true);
                })
                .catch(err => {
                  console.error('Error playing video:', err);
                  error('Could not start camera. Please ensure camera permissions are granted.');
                  setHasPermission(false);
                });
            }
          };
          
          videoRef.current.addEventListener('canplay', onCanPlay, { once: true });
          
          // Cleanup function for this effect
          return () => {
            if (videoRef.current) {
              videoRef.current.removeEventListener('canplay', onCanPlay);
            }
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
        const errorMessage = err instanceof Error ? err.message : 'Could not access camera';
        error(errorMessage);
      }
    };
    
    // Only try to start camera if we're on the client side
    if (typeof window !== 'undefined' && 'mediaDevices' in navigator) {
      startCamera();
    } else {
      setHasPermission(false);
      error('Camera not supported on this device');
    }
    
    // Cleanup function for the effect
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
    };
  }, [error]);
  // Mock QR code scanning for demonstration
  useEffect(() => {
    if (!isScanning) return;
    const timer = setTimeout(() => {
      // In a real app, this would be replaced with actual QR code scanning logic
      const mockResults = [
        'BOX-2024-001847',
        'BOX-2024-001848',
        'BOX-2024-001849'
      ];
      // Simulate scanning a random box
      if (Math.random() > 0.7) {
        const randomBox = mockResults[Math.floor(Math.random() * mockResults.length)];
        handleScanSuccess(randomBox);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isScanning, scanResult]);
  const handleScanSuccess = (result: string) => {
    setScanResult(result);
    setIsScanning(false);
    info(`Scanned: ${result}`);
    // In a real app, you would process the scan result here
    // For now, we'll just show a success message
    setTimeout(() => {
      setScanResult(null);
      setIsScanning(true);
    }, 3000);
  };
  const toggleScanning = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setScanResult(null);
      setIsScanning(true);
    }
  };
  if (hasPermission === null) {
    return (
      <div className="scan-screen">
        <div className="container">
          <div className="page-header">
            <button 
              className="back-button" 
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              ←
            </button>
            <h1>Scan QR Code</h1>
          </div>
          <div className="scanner-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            minHeight: '300px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div className="scan-overlay">
              <div className="scan-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                width: '100%',
                padding: '0 20px',
                zIndex: 2
              }}>
                <div className="spinner" style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  borderTopColor: '#0066ff',
                  animation: 'spin 1s ease-in-out infinite',
                  margin: '0 auto 20px'
                }}></div>
                <p>Requesting camera permission...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (hasPermission === false) {
    return (
      <div className="scan-screen error">
        <div className="scan-header">
          <h2>Camera Access Required</h2>
          <p>Please enable camera access in your browser settings to scan QR codes.</p>
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry Camera Access
          </button>
        </div>
        <div className="scanner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📷</div>
            <p>Camera access is required to scan QR codes.</p>
            <p>Please check your browser permissions and try again.</p>
            <button 
              className="btn primary" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '20px' }}
            >
              Try Again
            </button>
            <button 
              className="btn secondary" 
              onClick={() => navigate('/')}
              style={{ marginTop: '10px' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="scan-screen">
      <div className="app-header">
        <BoxYLogo size={40} showText={true} />
      </div>
      <div className="container">
        <div className="page-header">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
          <h1>Scan QR Code</h1>
        </div>
        <p className="scan-instructions">Point your camera at a QR code to scan</p>
        
        <div className="scanner-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`scanner-video ${!isScanning ? 'paused' : ''}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)' // Mirror the video for a more natural feel
            }}
          />
          <div className="scan-overlay">
            <div className="scan-frame">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            {scanResult && (
              <div className="scan-result">
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <p>Scanned Successfully!</p>
                  <p className="box-id">{scanResult}</p>
                </div>
              </div>
            )}
            {!isScanning && !scanResult && (
              <div className="scan-paused">
                <p>Scanning paused</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="scan-controls">
          <button 
            className={`btn ${isScanning ? 'secondary' : 'primary'}`}
            onClick={toggleScanning}
            disabled={!hasPermission}
          >
            {isScanning ? 'Pause' : 'Resume'}
          </button>
          <button 
            className="btn primary"
            onClick={() => navigate('/my-boxes')}
          >
            My Boxes
          </button>
        </div>
      </div>
    </div>
  );
};
export default ScanScreen;
