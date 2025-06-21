import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoxes } from '@contexts/BoxesContext';
import BoxYLogo from '../components/BoxYLogo';
import { FiArrowLeft, FiPackage, FiMapPin, FiCalendar, FiTruck, FiCheckCircle } from 'react-icons/fi';

const BoxDetails: React.FC = () => {
  const { boxes } = useBoxes();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const box = boxes.find(b => b.id === id);
  
  if (!box) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium">Box not found</p>
          <button 
            onClick={() => navigate('/my-boxes')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Back to My Boxes
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="box-details-screen">
      <div className="app-header">
        <BoxYLogo size={40} showText={true} />
      </div>
      <div className="container">
        <div className="page-header">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
          <h1>Box Details</h1>
        </div>
        <div className="box-details">
          <div className="box-header">
            <div className="box-id">{box.id}</div>
            <h1 className="box-title">{box.size.charAt(0).toUpperCase() + box.size.slice(1)} Box</h1>
            <span className={`status-badge status-${box.status}`}>
              {box.status.charAt(0).toUpperCase() + box.status.slice(1)}
            </span>
          </div>
          <div className="info-cards">
            <div className="info-card">
              <h4>Current Location</h4>
              <p>📍 {box.currentLocation || 'Not available'}</p>
            </div>
            <div className="info-card">
              <h4>Estimated Delivery</h4>
              <p>🕐 {box.estimatedDelivery || 'Not available'}</p>
            </div>
            {box.courier && (
              <div className="info-card">
                <h4>Courier</h4>
                <p>
                  👨‍💼 {box.courier.name} • ⭐ {box.courier.rating} • 📞 {box.courier.contact}
                </p>
              </div>
            )}
          </div>
          <div className="timeline">
            <h3>Timeline</h3>
            {box.timeline.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{event.status}</h4>
                  <p>{event.time} • {event.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoxDetails;
