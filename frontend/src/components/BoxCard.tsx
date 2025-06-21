import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '../types/box';
import { FiMapPin, FiTruck, FiCalendar, FiInfo } from 'react-icons/fi';
import DeliveryTimer from './DeliveryTimer';

interface BoxCardProps {
  box: Box;
  viewMode?: 'grid' | 'list';
  onClick: () => void;
  getBoxSizeInfo: (size: string) => any;
  getStatusDetails: (status: string) => any;
  formatDate: (dateString: string) => string;
}

const BoxCard: React.FC<BoxCardProps> = ({
  box,
  viewMode = 'grid',
  onClick,
  getBoxSizeInfo,
  getStatusDetails,
  formatDate
}) => {
  const sizeInfo = getBoxSizeInfo(box.size);
  const statusInfo = getStatusDetails(box.status);
  const isInTransit = box.status === 'transit';
  const hasDeliveryTimer = isInTransit && box.estimatedDelivery;
  
  const renderGridCard = () => (
    <motion.div 
      className={`box-card ${viewMode}`}
      whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="box-card-content">
        <div className="box-icon-container">
          <div className={`box-icon ${box.size.toLowerCase()}`}>
            {box.size.charAt(0).toUpperCase()}
          </div>
          {isInTransit && (
            <div className="transit-indicator">
              <FiTruck size={12} />
            </div>
          )}
        </div>
        
        <div className="box-details">
          <div className="box-header">
            <h3>{box.name || `${sizeInfo.label} Box`}</h3>
            <span 
              className="status-badge" 
              style={{ 
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                borderColor: statusInfo.color
              }}
            >
              {statusInfo.label}
            </span>
          </div>
          
          {box.contents && (
            <p className="box-contents">
              {Array.isArray(box.contents) 
                ? box.contents.length > 0 
                  ? box.contents[0].length > 80 
                    ? `${box.contents[0].substring(0, 80)}...` 
                    : box.contents[0]
                  : 'No description'
                : box.contents.length > 80 
                  ? `${box.contents.substring(0, 80)}...` 
                  : box.contents}
            </p>
          )}
          
          <div className="box-meta">
            <div className="meta-item">
              <FiMapPin size={14} className="meta-icon" />
              <span>{box.location || box.currentLocation || 'In transit'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Size:</span>
              <span className="meta-value">{sizeInfo.size}</span>
            </div>
          </div>
          
          {hasDeliveryTimer && (
            <div className="delivery-timer-container">
              <DeliveryTimer 
                startTime={new Date(box.lastUpdated)} 
                estimatedDuration={60} // 60 minutes for demo
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderListItem = () => (
    <motion.div 
      className={`box-list-item ${viewMode}`}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      onClick={onClick}
    >
      <div className="list-item-icon">
        <div className={`box-icon ${box.size.toLowerCase()}`}>
          {box.size.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="list-item-content">
        <div className="list-item-header">
          <h3>{box.name || `${sizeInfo.label} Box`}</h3>
          <span 
            className="status-badge" 
            style={{ 
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
              borderColor: statusInfo.color
            }}
          >
            {statusInfo.label}
          </span>
        </div>
        
        <div className="list-item-meta">
          <div className="meta-item">
            <FiMapPin size={14} className="meta-icon" />
            <span>{box.location || box.currentLocation || 'In transit'}</span>
          </div>
          <div className="meta-item">
            <FiInfo size={14} className="meta-icon" />
            <span>{sizeInfo.size}</span>
          </div>
          {box.lastUpdated && (
            <div className="meta-item">
              <FiCalendar size={14} className="meta-icon" />
              <span>{formatDate(box.lastUpdated)}</span>
            </div>
          )}
        </div>
        
        {box.contents && (
          <p className="list-item-contents">
            {Array.isArray(box.contents)
              ? box.contents.length > 0 
                ? box.contents[0].length > 120 
                  ? `${box.contents[0].substring(0, 120)}...` 
                  : box.contents[0]
                : 'No description'
              : box.contents.length > 120 
                ? `${box.contents.substring(0, 120)}...` 
                : box.contents}
          </p>
        )}
      </div>
      
      {isInTransit && (
        <div className="list-item-status">
          <FiTruck size={16} className="status-icon" />
          <span>In Transit</span>
        </div>
      )}
    </motion.div>
  );

  return viewMode === 'grid' ? renderGridCard() : renderListItem();
};

export default BoxCard;
