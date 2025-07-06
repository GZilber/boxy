import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaCamera, FaTrash, FaUpload } from 'react-icons/fa';
import styles from './Booking.module.css';

export interface ItemDetails {
  photos: string[];
  description: string;
  estimatedSize: string;
  specialInstructions: string;
}

interface BoxSelectionProps {
  onSelectBox: (details: ItemDetails) => void;
  onBack: () => void;
  onContinue: () => void;
  loading?: boolean;
}

const BoxSelection: React.FC<BoxSelectionProps> = ({ 
  onSelectBox, 
  onBack,
  onContinue,
  loading = false
}) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails>({
    photos: [],
    description: '',
    estimatedSize: '',
    specialInstructions: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Convert files to data URLs
    const newPhotos: string[] = [];
    const fileReaders: FileReader[] = [];
    
    Array.from(files).forEach((file, index) => {
      if (index >= 5) return; // Limit to 5 photos
      
      const reader = new FileReader();
      fileReaders.push(reader);
      
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          
          if (newPhotos.length === Math.min(files.length, 5)) {
            setItemDetails(prev => ({
              ...prev,
              photos: [...prev.photos, ...newPhotos].slice(0, 5) // Ensure max 5 photos
            }));
            setIsUploading(false);
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const removePhoto = (index: number) => {
    setItemDetails(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeSelect = (size: string) => {
    setItemDetails(prev => ({
      ...prev,
      estimatedSize: size
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemDetails.description && itemDetails.estimatedSize) {
      onSelectBox(itemDetails);
      onContinue();
    }
  };

  if (loading) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.header}>
          <button onClick={onBack} className={styles.backButton}>
            <FaArrowLeft />
          </button>
          <h2>Item Details</h2>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Item Details</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}></div>
        <div className={styles.step}></div>
        <div className={styles.step}></div>
      </div>

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Document Your Items</h1>
        <p className={styles.heroSubtitle}>
          Take photos of the items you want to store. Our team will handle the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.itemForm}>
        <div className={styles.formGroup}>
          <label>Item Photos *</label>
          <div className={styles.photoUploadSection}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            
            <div className={styles.photosGrid}>
              {itemDetails.photos.map((photo, index) => (
                <div key={index} className={styles.photoPreview}>
                  <img src={photo} alt={`Item ${index + 1}`} />
                  <button 
                    type="button" 
                    className={styles.removePhotoButton}
                    onClick={() => removePhoto(index)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
              
              {itemDetails.photos.length < 5 && (
                <button 
                  type="button"
                  className={styles.addPhotoButton}
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <FaCamera size={24} />
                      <span>Add Photo</span>
                      <span className={styles.photoCount}>
                        {itemDetails.photos.length}/5
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className={styles.photoHint}>
              Take clear photos of your items. You can upload up to 5 photos.
            </p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="itemDescription">Item Description *</label>
          <textarea 
            id="itemDescription"
            name="description"
            className={styles.textarea} 
            placeholder="List the items you're storing (e.g., 'Winter coats, 5 books, small electronics')"
            rows={3}
            value={itemDetails.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Estimated Volume *</label>
          <div className={styles.sizeOptions}>
            {['Small (e.g., 1-2 boxes)', 'Medium (e.g., 3-5 boxes)', 'Large (e.g., 6+ boxes)'].map((size) => (
              <button 
                key={size} 
                type="button"
                className={`${styles.sizeOption} ${itemDetails.estimatedSize === size ? styles.selected : ''}`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="specialInstructions">Special Handling Instructions</label>
          <textarea 
            id="specialInstructions"
            name="specialInstructions"
            className={styles.textarea} 
            placeholder="Any special handling requirements (fragile, temperature sensitive, etc.)"
            rows={2}
            value={itemDetails.specialInstructions}
            onChange={handleInputChange}
          />
        </div>
        
        <div className={styles.formFooter}>
          <button 
            type="submit" 
            className={`${styles.continueButton} ${
              !itemDetails.description || !itemDetails.estimatedSize || itemDetails.photos.length === 0 ? styles.disabled : ''
            }`}
            disabled={
              !itemDetails.description || 
              !itemDetails.estimatedSize || 
              itemDetails.photos.length === 0 || 
              loading || 
              isUploading
            }
          >
            {loading ? 'Processing...' : 'Continue to Pickup'}
          </button>
          
          {itemDetails.photos.length === 0 && (
            <p className={styles.photoRequired}>
              Please add at least one photo of your items
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BoxSelection;
