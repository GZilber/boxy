import React from 'react';
import { FiPackage, FiTruck, FiUser, FiHome, FiSettings, FiClock, FiMapPin, FiInfo, FiCalendar } from 'react-icons/fi';
import { FaBoxOpen, FaWarehouse, FaSearchLocation, FaShippingFast, FaBoxes } from 'react-icons/fa';
import { GiCardboardBox, GiCardboardBoxClosed } from 'react-icons/gi';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

// Custom Box Icon
export const BoxIcon = ({ size = 24, className = '', ...props }: IconProps) => (
  <GiCardboardBox 
    size={size} 
    className={`text-primary ${className}`} 
    style={{ 
      background: 'linear-gradient(135deg, var(--primary-light), var(--bg-tertiary))',
      padding: '4px',
      borderRadius: '6px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }} 
    {...props} 
  />
);

// Storage Location Icon
export const StorageIcon = ({ size = 24, className = '', ...props }: IconProps) => (
  <FaWarehouse 
    size={size} 
    className={`text-primary ${className}`} 
    style={{ 
      color: 'var(--primary)',
      background: 'var(--bg-tertiary)',
      padding: '4px',
      borderRadius: '6px',
      border: '1px solid var(--border-color)'
    }} 
    {...props} 
  />
);

// Request Pickup Icon
export const RequestPickupIcon = ({ size = 24, className = '', ...props }: IconProps) => (
  <FaShippingFast 
    size={size} 
    className={className} 
    style={{ 
      color: 'var(--primary)',
      background: 'var(--bg-tertiary)',
      padding: '8px',
      borderRadius: '12px',
      border: '1px solid var(--border-color)'
    }} 
    {...props} 
  />
);

// Profile Icon
export const ProfileIcon = ({ size = 24, className = '', ...props }: IconProps) => (
  <div 
    className={`flex items-center justify-center rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, var(--primary-light), var(--bg-tertiary))',
      border: '2px solid var(--primary)'
    }}
  >
    <FiUser 
      size={typeof size === 'number' ? size * 0.6 : '60%'} 
      className="text-primary" 
      {...props} 
    />
  </div>
);

// Sealed Box Icon
export const SealedBoxIcon = ({ size = 24, className = '', ...props }: IconProps) => (
  <GiCardboardBoxClosed 
    size={size} 
    className={`text-primary ${className}`} 
    style={{ 
      color: 'var(--primary)',
      background: 'var(--bg-tertiary)',
      padding: '4px',
      borderRadius: '6px',
      border: '1px solid var(--border-color)'
    }} 
    {...props} 
  />
);

// Box with Arrow Icon
export const BoxWithArrowIcon = ({ size = 24, className = '', ...props }: IconProps) => {
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <GiCardboardBox 
        size={sizeNum} 
        className="text-primary absolute" 
        style={{ 
          color: 'var(--primary)',
          zIndex: 1
        }} 
        {...props}
      />
      <FaShippingFast 
        size={Math.max(12, sizeNum * 0.5)} 
        className="text-white absolute" 
        style={{ 
          bottom: '0',
          right: '0',
          transform: 'translate(25%, 25%)',
          zIndex: 2,
          background: 'var(--primary)',
          padding: '2px',
          borderRadius: '4px'
        }} 
      />
    </div>
  );
};

// Re-export other icons for convenience
export { 
  FiPackage as PackageIcon,
  FiTruck as TruckIcon,
  FiUser as UserIcon,
  FiHome as HomeIcon,
  FiSettings as SettingsIcon,
  FiClock as ClockIcon,
  FiMapPin as MapPinIcon,
  FiInfo as InfoIcon,
  FiCalendar as CalendarIcon,
  FaBoxOpen as OpenBoxIcon,
  FaBoxes as BoxesIcon,
  FaSearchLocation as SearchLocationIcon
};
