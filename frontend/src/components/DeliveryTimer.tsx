import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DeliveryTimerProps {
  startTime: Date;
  estimatedDuration: number; // in minutes
}

const DeliveryTimer: React.FC<DeliveryTimerProps> = ({ startTime, estimatedDuration }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = (now.getTime() - startTime.getTime()) / 1000 / 60; // in minutes
      const remaining = Math.max(0, estimatedDuration - elapsed);
      
      setTimeLeft(Math.ceil(remaining));
      setProgress(Math.min(100, (elapsed / estimatedDuration) * 100));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, estimatedDuration]);

  return (
    <div className="delivery-timer">
      <div className="delivery-timer-circle">
        <svg viewBox="0 0 44 44">
          <circle
            className="delivery-timer-bg"
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="3"
          />
          <motion.circle
            className="delivery-timer-progress"
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 126, rotate: -90 }}
            animate={{ 
              strokeDashoffset: 126 - (progress * 1.26),
              rotate: -90
            }}
            transition={{ duration: 0.5 }}
            strokeDasharray="126 126"
          />
        </svg>
        <div className="delivery-timer-text">
          {timeLeft}'
        </div>
      </div>
      <div className="delivery-timer-label">
        {timeLeft > 0 ? 'Arriving in' : 'Arriving soon'}
      </div>
    </div>
  );
};

export default DeliveryTimer;
