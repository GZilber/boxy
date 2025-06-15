import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiPackage, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import QRCodeScanner from '../components/QRCodeScanner';
import Button from '../components/ui/Button';
import styles from './Scan.module.css';

interface ScanResult {
  data: string;
  timestamp: number;
}

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = (result: { data: string }) => {
    if (result && result.data) {
      setScanResult({ data: result.data, timestamp: Date.now() });
      setIsScanning(false);
      setError(null);
      console.log('Scanned data:', result.data);
    }
  };

  const handleError = (error: unknown) => {
    console.error('QR Scanner error:', error);
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Failed to initialize QR scanner');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = manualId.trim();
    if (!trimmedId) {
      setError('Please enter a box ID');
      inputRef.current?.focus();
      return;
    }
    handleScan({ data: trimmedId });
  };

  const resetScan = () => {
    setScanResult(null);
    setManualId('');
    setError(null);
    setIsScanning(true);
  };

  const confirmScan = () => {
    // Here you would typically make an API call to process the scan
    console.log('Processing scan result:', scanResult);
    // For demo, just navigate to box details
    navigate(`/box/${scanResult?.data}`);
  };

  // Focus the input when manual entry is selected
  useEffect(() => {
    if (!isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanning]);

  return (
    <div className={styles.scanContainer}>
      <div className={styles.header}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
          aria-label="Go back"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Scan QR Code</h1>
      </div>

      <div className={styles.scannerContainer}>
        {isScanning ? (
          <>
            <QRCodeScanner 
              onScan={handleScan}
              onError={handleError}
              active={isScanning}
            />
            <div className={styles.scannerPlaceholder}>
              <FiCamera size={64} className={styles.cameraIcon} />
              <p>Position QR code within frame to scan</p>
            </div>
          </>
        ) : (
          <div className={styles.scannerPlaceholder}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <FiCheck size={48} color="var(--success-500)" />
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>QR Code Scanned!</h2>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                wordBreak: 'break-all',
                backgroundColor: 'var(--surface-elevated)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}>{scanResult?.data}</p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                <Button 
                  variant="secondary" 
                  onClick={resetScan}
                  style={{ flex: 1 }}
                >
                  Scan Again
                </Button>
                <Button 
                  onClick={confirmScan}
                  style={{ flex: 1 }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        margin: '1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-tertiary)'
      }}>
        <span style={{
          display: 'inline-block',
          height: '1px',
          backgroundColor: 'var(--border)',
          flex: 1,
          maxWidth: '100px'
        }}></span>
        <span style={{ margin: '0 1rem' }}>or</span>
        <span style={{
          display: 'inline-block',
          height: '1px',
          backgroundColor: 'var(--border)',
          flex: 1,
          maxWidth: '100px'
        }}></span>
      </div>

      <div className={styles.manualEntry}>
        <h3 style={{
          fontSize: '1.125rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}>Enter Box ID Manually</h3>
        <form 
          onSubmit={handleManualSubmit}
          style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            width: '100%'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter box ID"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: error ? '1px solid var(--error-500)' : '1px solid var(--border)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              disabled={!isScanning && !!scanResult}
            />
            <Button 
              type="submit"
              variant="primary"
              disabled={!isScanning && !!scanResult}
              style={{
                minWidth: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <FiPackage size={20} />
              <span>Submit</span>
            </Button>
          </div>
          {error && (
            <p style={{
              color: 'var(--error-500)',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              textAlign: 'left',
              paddingLeft: '0.5rem'
            }}>
              {error}
            </p>
          )}
        </form>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>Having trouble scanning? Make sure the QR code is well-lit and clearly visible.</p>
      </div>
    </div>
  );
};

export default Scan;
