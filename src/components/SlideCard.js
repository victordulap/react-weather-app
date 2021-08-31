import React, { useEffect, useRef, useState } from 'react';
import '../styles/Slider.scss';

const SlideCard = ({ header, icon, footer, slidesData }) => {
  const [isTapped, setIsTapped] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const onMouseDown = () => {
    setIsTapped(true);
  };

  const onMouseUp = () => {
    setIsTapped(false);
  };

  useEffect(() => {
    if (isImageLoaded) setIsImageLoaded(false);
  }, [icon]);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      onMouseLeave={onMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`slide-card ${isTapped ? 'grabbing' : ''}`}
    >
      <header
        className={`slide-header ${
          header === '' ? 'skeleton skeleton-text' : ''
        }`}
      >
        {header}
      </header>
      <img
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        key={`${header}-${icon}${footer[0]}${Math.random()}`}
        src={`/assets/weather-icons/${icon}.png`}
        alt={icon}
        className={`slide-icon ${
          icon === '1x1transparent' || !isImageLoaded ? 'skeleton' : ''
        }`}
        onLoad={() => {
          setIsImageLoaded(true);
        }}
      />
      <footer
        className={`slide-footer ${
          footer[0] === '' ? 'skeleton skeleton-text' : ''
        }`}
      >
        <span style={footer.length > 1 ? { marginRight: '0.5rem' } : {}}>
          {footer[0]}
          {footer[0] !== '' && '°'}
        </span>
        {footer.length > 1 && <span>{footer[1]}°</span>}
      </footer>
    </div>
  );
};

export default SlideCard;
