import React from 'react';
import styles from '../../styles/LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const colorClasses = {
    primary: styles.colorPrimary,
    white: styles.colorWhite,
    muted: styles.colorMuted,
  };

  const spinner = (
    <div className={`${styles.spinner} ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
