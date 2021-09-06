import React, { useEffect, useRef, useState } from 'react';
import '../styles/Slider.scss';

const SlideCard = ({ header, icon, main, footer }) => {
  // const [isTapped, setIsTapped] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardImg = useRef('cardImg');

  // const onMouseDown = () => {
  //   setIsTapped(true);
  // };

  // const onMouseUp = () => {
  //   setIsTapped(false);
  // };

  useEffect(() => {
    if (isImageLoaded) setIsImageLoaded(false);
  }, [icon]);

  return (
    <div
      // onMouseDown={onMouseDown}
      // onMouseUp={onMouseUp}
      // onTouchStart={onMouseDown}
      // onTouchEnd={onMouseUp}
      // onTouchCancel={onMouseUp}
      // onMouseLeave={onMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      // className={`slide-card ${isTapped ? 'grabbing' : ''}`}
      className={`slide-card`}
    >
      <header
        className={`slide-header ${
          header === '' ? 'skeleton skeleton-text' : ''
        }`}
      >
        {header}
      </header>
      <img
        ref={cardImg}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
      <main
        className={`slide-main ${
          main[0] === '' ? 'skeleton skeleton-text' : ''
        }`}
      >
        {main[0] !== '' &&
          main.map((item, index) => {
            return (
              <span
                key={`main-${index}-${Math.random()}`}
                style={index < main.length - 1 ? { marginRight: '0.8rem' } : {}}
              >
                {item}
              </span>
            );
          })}
      </main>
      <footer
        className={`slide-footer ${
          footer === '' ? 'skeleton skeleton-text' : ''
        }`}
      >
        <span>{footer}</span>
      </footer>
    </div>
  );
};

export default SlideCard;
