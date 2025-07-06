import React from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiPackage, 
  FiMapPin, 
  FiArrowLeft,
  FiCopy,
  FiCheck,
  FiHome,
  FiTruck
} from 'react-icons/fi';
import { Box } from '../types/box';
import styles from './HandoffSummary.module.css';
import { useToast } from '../contexts/ToastContext';

interface HandoffSummaryProps {
  boxes: Box[];
  handoffCode: string;
  pickupTime: string;
  onBack: () => void;
  onDone: () => void;
}

const HandoffSummary: React.FC<HandoffSummaryProps> = ({
  boxes,
  handoffCode,
  pickupTime,
  onBack,
  onDone,
}) => {
  const { showSuccess } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(handoffCode);
    showSuccess('Handoff code copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton} aria-label="Go back">
          <FiArrowLeft size={20} />
        </button>
        <h1>Handoff Complete</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.successAnimation}>
          <div className={styles.circle}>
            <FiCheckCircle className={styles.checkIcon} size={48} />
          </div>
        </div>
        
        <h2 className={styles.title}>Handoff Confirmed!</h2>
        <p className={styles.subtitle}>
          Your items are now in transit. You can track their status in the "My Boxes" section.
        </p>
        
        <div className={styles.detailsCard}>
          <div className={styles.detailSection}>
            <h3><FiPackage className={styles.sectionIcon} /> Items Handed Off</h3>
            <ul className={styles.boxList}>
              {boxes.map((box) => (
                <li key={box.id} className={styles.boxItem}>
                  <span className={styles.boxName}>{box.name || `Box #${box.id.slice(0, 6)}`}</span>
                  <span className={`${styles.boxStatus} ${box.status?.toLowerCase()}`}>
                    {box.status?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.detailSection}>
            <h3><FiClock className={styles.sectionIcon} /> Pickup Details</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Time:</span>
              <span className={styles.detailValue}>{pickupTime}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Location:</span>
              <span className={styles.detailValue}>{boxes[0]?.location || 'Your location'}</span>
            </div>
          </div>
          
          <div className={styles.detailSection}>
            <h3><FiTruck className={styles.sectionIcon} /> Courier Information</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Status:</span>
              <span className={styles.detailValue}>
                <span className={styles.statusBadge}>In Transit</span>
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Handoff Code:</span>
              <div className={styles.codeContainer}>
                <span className={styles.handoffCode}>{handoffCode}</span>
                <button 
                  className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                  onClick={handleCopyCode}
                  aria-label="Copy handoff code"
                >
                  {copied ? (
                    <>
                      <FiCheck className={styles.copyIcon} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className={styles.copyIcon} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.doneButton}
            onClick={onDone}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandoffSummary;
