import React, { useRef, useEffect, useCallback } from 'react';
import { FiCameraOff, FiCamera } from 'react-icons/fi';

// Extend the Window interface to include BarcodeDetector
declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => BarcodeDetector;
  }
  
  interface BarcodeDetector {
    detect(image: ImageBitmapSource): Promise<Barcode[]>;
  }
  
  interface Barcode {
    format: string;
    rawValue: string;
    // Add other properties as needed
  }
}

interface QRCodeScannerProps {
  onScan: (result: { data: string }) => void;
  onError: (error: Error) => void;
  active: boolean;
  className?: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onError,
  active,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const lastScanTimeRef = useRef<number>(0);
  const scanInterval = 1000; // 1 second between scans

  const handleScan = useCallback((result: { data: string }) => {
    const now = Date.now();
    if (now - lastScanTimeRef.current > scanInterval) {
      lastScanTimeRef.current = now;
      onScan(result);
    }
  }, [onScan]);

  const detectBarcode = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !active) {
      animationFrameRef.current = requestAnimationFrame(detectBarcode);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(detectBarcode);
      return;
    }

    // Set canvas dimensions to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Try to detect barcodes
    try {
      if (!window.BarcodeDetector) {
        throw new Error('BarcodeDetector is not supported in this browser');
      }
      
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await detector.detect(canvas);

      if (barcodes && barcodes.length > 0) {
        handleScan({ data: barcodes[0].rawValue });
      }
    } catch (err) {
      console.error('Barcode detection error:', err);
      if (err instanceof Error) {
        onError(err);
      } else {
        onError(new Error('Failed to detect barcode'));
      }
    }

    // Continue the detection loop
    if (active) {
      animationFrameRef.current = requestAnimationFrame(detectBarcode);
    }
  }, [active, handleScan, onError]);

  // Start/stop the scanner when active prop changes
  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (!active || !mounted) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          await videoRef.current.play();
          animationFrameRef.current = requestAnimationFrame(detectBarcode);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        if (mounted) {
          if (err instanceof Error) {
            onError(err);
          } else {
            onError(new Error('Failed to access camera'));
          }
        }
      }
    };

    const stopScanner = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (active) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [active, detectBarcode, onError]);

  return (
    <div 
      className={`scanner ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover' as const,
        }}
        playsInline
        muted
      />
      <canvas 
        ref={canvasRef} 
        style={{
          display: 'none',
        }} 
      />
    </div>
  );
};

export default QRCodeScanner;
