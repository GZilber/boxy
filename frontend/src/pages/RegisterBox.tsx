import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import BoxYLogo from '../components/BoxYLogo';
import './RegisterBox.css';

const RegisterBox: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const boxNameRef = useRef<HTMLInputElement>(null);
  const boxContentsRef = useRef<HTMLTextAreaElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Initialize refs with current values if they exist
  useEffect(() => {
    if (boxNameRef.current) boxNameRef.current.value = boxNameRef.current.value || '';
    if (boxContentsRef.current) boxContentsRef.current.value = boxContentsRef.current.value || '';
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const boxName = boxNameRef.current?.value || '';
    
    // Prevent form submission if boxName is empty or just whitespace
    if (!boxName.trim()) {
      showError('Please enter a box name');
      boxNameRef.current?.focus();
      return;
    }
    
    // Save the values from refs to state if needed
    const boxContents = boxContentsRef.current?.value || '';
    console.log('Submitting box:', { boxName, boxContents });
    
    // Only proceed to scanning if we have a valid box name
    if (boxName.trim()) {
      setIsScanning(true);
    }
  };

  const handleScanComplete = (qrData: string) => {
    console.log('Scanned QR code:', qrData);
    success('Box registered successfully!');
    // In a real app, you would save the box with the QR code
    setTimeout(() => {
      navigate('/my-boxes');
    }, 1500);
  };

  if (isScanning) {
    return (
      <div className="scanning-screen">
        <div className="scan-container">
          <h2>Scan QR Code</h2>
          <p>Point your camera at the QR code on your storage box</p>
          
          {/* QR Scanner Placeholder */}
          <div className="qr-scanner-placeholder">
            <div className="qr-placeholder">
              <div className="qr-overlay"></div>
              <div className="qr-camera-icon">📷</div>
            </div>
          </div>
          
          <div className="scan-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setIsScanning(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => handleScanComplete('simulated-qr-data')}
            >
              Simulate Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-box-screen">
      <div className="register-box-container">
        <div className="register-box-header">
          <BoxYLogo size={60} showText={false} />
          <h1>Register New Box</h1>
          <p className="subtitle">Enter the details for your new storage box</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-box-form">
          <div className="form-group">
            <label htmlFor="boxName">Box Name *</label>
            <input
              ref={boxNameRef}
              type="text"
              id="boxName"
              name="boxName"
              className="form-input"
              placeholder="e.g. Winter Clothes"
              required
              autoComplete="off"
              onBlur={(e) => {
                if (e.target.value) e.target.value = e.target.value.trim();
              }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="boxContents">Contents (Optional)</label>
            <textarea
              ref={boxContentsRef}
              id="boxContents"
              name="boxContents"
              className="form-input"
              placeholder="Brief description of box contents"
              rows={4}
              autoComplete="off"
              onBlur={(e) => {
                if (e.target.value) e.target.value = e.target.value.trim();
              }}
            />
            <p className="helper-text">Add any important details about the contents</p>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!boxNameRef.current?.value?.trim()}
            >
              Continue to Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBox;
