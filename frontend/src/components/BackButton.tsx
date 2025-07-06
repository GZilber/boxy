import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from '../styles/BackButton.module.css';

interface BackButtonProps {
  to?: string;
  text?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  text = 'Back',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`${styles.backButton} ${className}`}
      aria-label={text}
    >
      <FiArrowLeft className={styles.backIcon} />
      {text}
    </button>
  );
};

export default BackButton;
