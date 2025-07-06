import React from 'react';
import { FiCamera, FiMapPin, FiClock, FiCheck, FiArrowLeft, FiChevronRight, FiX, FiHash } from 'react-icons/fi';
import styles from '../../pages/NewHandoffFlow.module.css';

// Re-export types
export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  size: 'small' | 'medium' | 'large';
}

export interface Address {
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

// Item Details Step
export const ItemDetailsStep: React.FC<{
  item: Item | null;
  onNext: () => void;
  onItemUpdate: (updates: React.SetStateAction<Item | null>) => void;
  onCapturePhoto: () => void;
  isPickupFlow: boolean;
  capturedImage: string | null;
  onOpenCamera: () => void;
}> = ({
  item,
  onNext,
  onItemUpdate,
  onCapturePhoto,
  isPickupFlow,
  capturedImage,
  onOpenCamera
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onItemUpdate(prev => ({
      ...prev,
      id: prev?.id || `item-${Date.now()}`,
      name: e.target.value,
      size: prev?.size || 'medium',
      description: prev?.description || ''
    } as Item));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onItemUpdate(prev => ({
      ...prev,
      id: prev?.id || `item-${Date.now()}`,
      name: prev?.name || '',
      description: e.target.value,
      size: prev?.size || 'medium'
    } as Item));
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    onItemUpdate(prev => ({
      ...prev,
      id: prev?.id || `item-${Date.now()}`,
      name: prev?.name || '',
      description: prev?.description || '',
      size
    } as Item));
  };

  return (
    <div className={styles.stepContainer}>
      <h2>{isPickupFlow ? 'What are you storing?' : 'Item Details'}</h2>
      <p className={styles.stepDescription}>
        {isPickupFlow ? 'Take a photo and add a description' : 'Update item details'}
      </p>

      <div className={styles.photoUpload} onClick={onOpenCamera}>
        {capturedImage ? (
          <div className={styles.photoPreview}>
            <img
              src={capturedImage}
              alt="Captured item"
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.changePhotoButton}
              onClick={(e) => {
                e.stopPropagation();
                onOpenCamera();
              }}
            >
              Change Photo
            </button>
          </div>
        ) : (
          <div className={styles.photoButton}>
            <FiCamera size={24} />
            <span>Take a photo</span>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Item Name</label>
        <input
          type="text"
          placeholder="e.g., Winter Clothes, Books, etc."
          value={item?.name || ''}
          onChange={handleNameChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Description (Optional)</label>
        <textarea
          placeholder="Add any details about the item"
          value={item?.description || ''}
          onChange={handleDescriptionChange}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Size</label>
        <div className={styles.sizeOptions}>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeButton} ${
                item?.size === size ? styles.sizeButtonActive : ''
              }`}
              onClick={() => handleSizeChange(size)}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNext}
          disabled={!item?.name || !item?.size}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Address Step
export const AddressStep: React.FC<{
  addresses: Address[];
  onSelect: (address: Address) => void;
  onBack: () => void;
  isPickupFlow: boolean;
}> = ({ addresses, onSelect, onBack, isPickupFlow }) => {
  return (
    <div className={styles.stepContainer}>
      <h2>Select {isPickupFlow ? 'Pickup' : 'Delivery'} Address</h2>
      <p className={styles.stepDescription}>
        Choose where you want us to {isPickupFlow ? 'pick up' : 'deliver'} your items
      </p>

      <div className={styles.addressList}>
        {addresses.map((address) => (
          <div
            key={address.id}
            className={styles.addressCard}
            onClick={() => onSelect(address)}
          >
            <div className={styles.addressIcon}>
              <FiMapPin size={20} />
            </div>
            <div className={styles.addressDetails}>
              <h3>{address.name}</h3>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.country} {address.postalCode}
              </p>
            </div>
            <FiChevronRight size={20} className={styles.chevronIcon} />
          </div>
        ))}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

// Schedule Step
export const ScheduleStep: React.FC<{
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onConfirm: (e?: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  isPickupFlow: boolean;
}> = ({ selectedTime, onTimeSelect, onConfirm, onBack, isLoading, isPickupFlow }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(e);
  };

  return (
    <div className={styles.stepContainer}>
      <h2>Schedule {isPickupFlow ? 'Pickup' : 'Delivery'}</h2>
      <p className={styles.stepDescription}>
        Choose when you'd like us to {isPickupFlow ? 'pick up' : 'deliver'} your items
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.timeOptions}>
          <button
            type="button"
            className={`${styles.timeOption} ${
              selectedTime === 'asap' || selectedTime.startsWith('asap') ? styles.selected : ''
            }`}
            onClick={() => onTimeSelect('asap')}
          >
            <div className={styles.timeIcon}>
              <FiClock size={20} />
            </div>
            <div className={styles.timeDetails}>
              <h3>As soon as possible</h3>
              <p>We'll be there within 2 hours</p>
            </div>
            {selectedTime === 'asap' || selectedTime.startsWith('asap') ? (
              <div className={styles.checkIcon}>
                <FiCheck size={20} />
              </div>
            ) : (
              <div className={styles.radioButton}>
                <div className={styles.radioButtonInner} />
              </div>
            )}
          </button>

          <button
            type="button"
            className={`${styles.timeOption} ${
              selectedTime !== 'asap' && selectedTime !== '' ? styles.selected : ''
            }`}
            onClick={() => onTimeSelect('later')}
          >
            <div className={styles.timeIcon}>
              <FiClock size={20} />
            </div>
            <div className={styles.timeDetails}>
              <h3>Schedule for later</h3>
              <p>Choose a specific date and time</p>
            </div>
            {selectedTime !== 'asap' && selectedTime !== '' ? (
              <div className={styles.checkIcon}>
                <FiCheck size={20} />
              </div>
            ) : (
              <div className={styles.radioButton}>
                <div className={styles.radioButtonInner} />
              </div>
            )}
          </button>
        </div>

        {selectedTime === 'later' && (
          <div className={styles.formGroup}>
            <label>Select Date & Time</label>
            <input
              type="datetime-local"
              className={styles.dateTimeInput}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => onTimeSelect(e.target.value)}
            />
          </div>
        )}

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
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Confirmation Step
export const ConfirmationStep: React.FC<{
  item: Item | null;
  address: Address;
  pickupTime: string;
  confirmationCode?: string;
  onDone: () => void;
  isPickupFlow: boolean;
}> = ({ item, address, pickupTime, confirmationCode, onDone, isPickupFlow }) => {
  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.successIcon}>
        <FiCheck size={48} />
      </div>
      
      <h2>{isPickupFlow ? 'Pickup Scheduled!' : 'Delivery Scheduled!'}</h2>
      <p className={styles.confirmationMessage}>
        {isPickupFlow 
          ? 'Your items will be picked up soon.'
          : 'Your items will be delivered to you soon.'}
      </p>
      
      {confirmationCode && isPickupFlow && (
        <div className={styles.confirmationCode}>
          <div className={styles.codeLabel}>Your Pickup Code</div>
          <div className={styles.codeValue}>
            <FiHash size={24} />
            <span>{confirmationCode}</span>
          </div>
          <p className={styles.codeInstructions}>
            Please provide this code to the courier when they arrive for pickup.
          </p>
        </div>
      )}
      
      <div className={styles.detailsCard}>
        <h3>{isPickupFlow ? 'Pickup' : 'Delivery'} Details</h3>
        
        {item && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Item:</span>
            <span className={styles.detailValue}>{item.name}</span>
          </div>
        )}
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            {isPickupFlow ? 'Pickup' : 'Delivery'} Address:
          </span>
          <div className={styles.addressDetails}>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>{address.city}, {address.country} {address.postalCode}</p>
          </div>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Scheduled Time:</span>
          <span className={styles.detailValue}>
            {pickupTime === 'asap' 
              ? 'As soon as possible' 
              : new Date(pickupTime).toLocaleString()}
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
};
