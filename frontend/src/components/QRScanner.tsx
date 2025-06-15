import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onScan: (boxId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isScanning) {
      const videoElement = document.createElement('video');
      setVideo(videoElement);

      const startScanning = async () => {
        try {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            videoElement.play();
          } catch (err) {
            setError('Failed to access camera');
            console.error('Camera access error:', err);
            stopScanning();
            throw err;
          }

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            const scan = () => {
              if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                  // Extract box ID from QR code
                  const boxId = code.data;
                  onScan(boxId);
                  stopScanning();
                }
              }
              requestAnimationFrame(scan);
            };
            scan();
          }
        } catch (error) {
          setError('Camera error occurred');
          console.error('Camera error:', error);
          stopScanning();
        }
      };

      startScanning();
    }
  }, [isScanning]);

  const stopScanning = () => {
    if (video?.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="qr-scanner">
      <button 
        onClick={() => setIsScanning(!isScanning)}
        className="scan-button"
      >
        {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
      </button>
      {error ? (
        <div className="error-message">{error}</div>
      ) : video && isScanning && (
        <video 
          ref={videoRef}
          autoPlay
          playsInline
        />
      )}
    </div>
  );
};

export default QRScanner;
