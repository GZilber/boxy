import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiArrowLeft, FiSearch } from 'react-icons/fi';
import BoxYLogo from './BoxYLogo';
import './Header.css';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  hideLogo?: boolean;
  showLogoText?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false, 
  onBack,
  hideLogo = false,
  showLogoText = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLogoClick = () => {
    if (!isHomePage) {
      navigate('/');
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {showBackButton ? (
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft size={20} />
          </button>
        ) : (
          <div className="header-spacer" />
        )}
        
        {!hideLogo && (
          <div 
            className="logo-container"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <BoxYLogo 
              size={showLogoText ? 36 : 28} 
              showText={showLogoText}
            />
            {!showLogoText && <h1 className="app-title">BoxY</h1>}
          </div>
        )}
        
        <div className="header-actions">
          <button className="icon-button" aria-label="Search">
            <FiSearch size={20} />
          </button>
          <button className="icon-button" aria-label="Notifications">
            <FiBell size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
