import React, { useCallback, useState, useRef, useEffect } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import styles from './SwipeToConfirm.module.css';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  confirmText?: string;
  sliderText?: string;
  confirmedText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  showPrice?: boolean;
  price?: number;
}

const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  onConfirm,
  confirmText = 'Swipe to confirm handoff',
  sliderText = 'Swipe to confirm',
  confirmedText = 'Confirmed!',
  disabled = false,
  isLoading = false,
  showPrice = false,
  price = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const sliderWidthRef = useRef(0);
  const sliderLeftRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Initialize slider width and position
  useEffect(() => {
    if (sliderRef.current && trackRef.current) {
      const updateDimensions = () => {
        if (trackRef.current) {
          const rect = trackRef.current.getBoundingClientRect();
          sliderWidthRef.current = rect.width - 56; // Subtract thumb width
          sliderLeftRef.current = rect.left;
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!sliderRef.current || !trackRef.current) return;
    
    let newX = clientX - sliderLeftRef.current - 28; // Center the thumb
    newX = Math.max(0, Math.min(newX, sliderWidthRef.current));
    
    const percentage = (newX / sliderWidthRef.current) * 100;
    setSliderValue(percentage);
    
    // If dragged to the end, confirm
    if (percentage >= 90 && !isConfirmed) {
      setIsConfirmed(true);
      onConfirm();
    }
  }, [isConfirmed, onConfirm]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled || isLoading) return;
    
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX - (sliderValue / 100 * sliderWidthRef.current);
    currentXRef.current = startXRef.current;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, isLoading, sliderValue]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isLoading) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    startXRef.current = touch.clientX - (sliderValue / 100 * sliderWidthRef.current);
    currentXRef.current = startXRef.current;
    
    document.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [disabled, isLoading, sliderValue]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    currentXRef.current = e.clientX;
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    currentXRef.current = touch.clientX;
    updateSliderPosition(touch.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset if not confirmed
    if (!isConfirmed) {
      setSliderValue(0);
    }
  }, [isDragging, isConfirmed, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // Reset if not confirmed
    if (!isConfirmed) {
      setSliderValue(0);
    }
  }, [isDragging, isConfirmed, handleTouchMove]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const getSliderContent = () => {
    if (isConfirmed) {
      return (
        <div className={styles.confirmedContent}>
          {confirmedText} <FaCheck className={styles.checkIcon} />
        </div>
      );
    }
    
    return (
      <div className={styles.sliderText}>
        {isLoading ? 'Processing...' : sliderText}
        {showPrice && price > 0 && <span className={styles.priceTag}>• €{price}</span>}
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''} ${isLoading ? styles.loading : ''}`}>
      <div 
        ref={trackRef}
        className={styles.track} 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div 
          className={styles.trackFill}
          style={{ width: `${isLoading ? '100%' : `${sliderValue}%`}` }}
        />
        <div 
          ref={sliderRef}
          className={`${styles.thumb} ${isDragging ? styles.dragging : ''}`}
          style={{ transform: `translateX(${sliderValue}%)` }}
        >
          {isLoading ? (
            <div className={styles.spinner} />
          ) : (
            <FaArrowRight className={styles.arrowIcon} />
          )}
        </div>
        {getSliderContent()}
      </div>
      {confirmText && !isLoading && !isConfirmed && (
        <p className={styles.helpText}>
          {confirmText}
        </p>
      )}
    </div>
  );
};

export default SwipeToConfirm;
