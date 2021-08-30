import React, { useState } from 'react';
import '../styles/Slider.scss';

const SlideCard = ({ header, icon, footer }) => {
  const [isTapped, setIsTapped] = useState(false);
  const onMouseDown = () => {
    setIsTapped(true);
  };

  const onMouseUp = () => {
    setIsTapped(false);
  };

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
      <header className="slide-header">{header}</header>
      <img
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        src={`/assets/weather-icons/${icon}.png`}
        alt={icon}
        className="slide-icon"
      />
      <footer className="slide-footer">
        <span style={footer.length > 1 ? { marginRight: '0.5rem' } : {}}>
          {footer[0]}°
        </span>
        {footer.length > 1 && <span>{footer[1]}°</span>}
      </footer>
    </div>
  );
};

export default SlideCard;
