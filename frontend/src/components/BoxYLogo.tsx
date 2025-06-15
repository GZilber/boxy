import React from 'react';

interface BoxYLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const BoxYLogo: React.FC<BoxYLogoProps> = ({ size = 32, showText = false, className = '' }) => {
  // Calculate sizes based on the provided size prop
  const boxSize = Math.floor(size * (showText ? 1.5 : 0.8));
  const qrGap = Math.max(1, Math.floor(size / 32));
  const qrSize = Math.floor(boxSize * 0.5);
  const qrDotSize = Math.floor((qrSize - (7 * qrGap)) / 8);
  const textSize = Math.floor(size * 0.6);
  const outlineWidth = Math.max(1, Math.floor(size * 0.02));

  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        height: 'auto',
        padding: '2px',
      }}
    >
      {/* Logo Symbol - QR Code */}
      <div 
        style={{
          position: 'relative',
          width: boxSize,
          height: boxSize,
          backgroundColor: 'white',
          borderRadius: '18%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: showText ? 8 : 0,
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            border: `${outlineWidth}px solid #0066FF`,
            borderRadius: '12%',
          }}
        />
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(8, ${qrDotSize}px)`,
            gridTemplateRows: `repeat(8, ${qrDotSize}px)`,
            gap: `${qrGap}px`,
            width: qrSize,
            height: qrSize,
          }}
        >
          {Array.from({ length: 64 }).map((_, i) => {
            const dotNumber = i + 1;
            const isActive = [
              1, 2, 3, 6, 8, 9, 11, 14, 16, 17, 19, 22, 24, 25, 26, 27, 30, 32, 38, 40, 46, 48, 54, 56, 62, 64
            ].includes(dotNumber);
            
            return (
              <div 
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: isActive ? '#0066FF' : 'transparent',
                  borderRadius: '20%',
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div 
          style={{
            fontSize: `${textSize}px`,
            fontWeight: 800,
            marginTop: '4px',
            background: 'linear-gradient(45deg, #fff, #e6f3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1,
          }}
        >
          BoxY
        </div>
      )}
    </div>
  );
};

export default React.memo(BoxYLogo);
