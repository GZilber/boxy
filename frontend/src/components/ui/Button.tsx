import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  // Generate CSS classes based on props
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    isDisabled ? styles.disabled : '',
    isLoading ? styles.loading : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type as 'button' | 'submit' | 'reset' | undefined}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {isLoading && (
        <span className={styles.loader}>
          <span className={styles.spinner} />
        </span>
      )}
      {startIcon && !isLoading && (
        <span className={styles.startIcon}>{startIcon}</span>
      )}
      <span className={styles.content}>{children}</span>
      {endIcon && !isLoading && (
        <span className={styles.endIcon}>{endIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
