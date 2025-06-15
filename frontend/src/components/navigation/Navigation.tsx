import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '../../types';
import Button from '../ui/Button';

interface NavigationProps {
  boxes?: Box[];
  onFilterChange?: (status: string) => void;
  selectedFilter?: string;
}

const Navigation: React.FC<NavigationProps> = ({ boxes, onFilterChange, selectedFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const renderNavigationItems = () => {
    switch (location.pathname) {
      case '/':
        return (
          <div className="nav-home">
            <Button 
              variant="secondary" 
              onClick={() => handleNavigate('/my-boxes')}
            >
              My Boxes
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleNavigate('/request-pickup')}
            >
              Request Pickup
            </Button>
          </div>
        );
      case '/my-boxes':
        return (
          <div className="nav-boxes">
            <div className="filter-tabs">
              <Button 
                variant={selectedFilter === 'all' ? 'primary' : 'secondary'}
                onClick={() => onFilterChange?.('all')}
              >
                All
              </Button>
              <Button 
                variant={selectedFilter === 'stored' ? 'primary' : 'secondary'}
                onClick={() => onFilterChange?.('stored')}
              >
                Stored
              </Button>
              <Button 
                variant={selectedFilter === 'transit' ? 'primary' : 'secondary'}
                onClick={() => onFilterChange?.('transit')}
              >
                Transit
              </Button>
              <Button 
                variant={selectedFilter === 'delivered' ? 'primary' : 'secondary'}
                onClick={() => onFilterChange?.('delivered')}
              >
                Delivered
              </Button>
            </div>
          </div>
        );
      case '/request-pickup':
        return (
          <div className="nav-pickup">
            <Button 
              variant="secondary" 
              onClick={() => handleNavigate('/my-boxes')}
            >
              Back to Boxes
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="navigation">
      {renderNavigationItems()}
    </div>
  );
};

export default Navigation;
