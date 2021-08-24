import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import 'swiper/swiper-bundle.css';
import '../styles/Slider.scss';
import SlideCard from './SlideCard';
import { getElementDimensions, getPositionX } from './utils/sliderUtils';

const data = [];
for (let i = 0; i < 7; i++) {
  data.push({
    header: 'Mon',
    iconSrc: './assets/weather-icons/01d.png',
    footer: ['8', '-8'],
  });
}

const Slider = () => {
  const sliderRef = useRef();
  const sliderContainerRef = useRef();
  const slideCardRef = useRef();

  // const [isDragging, setIsDragging] = useState(false);
  // const [startPos, setStartPos] = useState(0);
  // const [currentTranslate, setCurrentTranslate] = useState(0);
  // const [prevTranslate, setPrevTranslate] = useState(0);
  // const [animationId, setAnimationId] = useState(0);

  // function touchStart(event) {
  //   setIsDragging(true);
  //   setStartPos(getPositionX(event));

  //   setAnimationId(requestAnimationFrame(animation));
  // }

  // function touchMove(event) {
  //   if (isDragging) {
  //     const currentPosition = getPositionX(event);
  //     setCurrentTranslate(prevTranslate + currentPosition - startPos);
  //   }
  // }

  // function touchEnd() {
  //   setIsDragging(false);
  //   cancelAnimationFrame(animationId);
  // }

  // const animation = () => {
  //   setSliderPosition();
  //   if (isDragging) requestAnimationFrame(animation);
  // };

  // const setSliderPosition = () => {
  //   sliderRef.current.style.transform = `translateX(${currentTranslate}px)`;
  // };

  const isDragging = useRef(false);
  const startPos = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationId = useRef(null);

  function touchStart(event) {
    isDragging.current = true;
    startPos.current = getPositionX(event);

    animationId.current = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (isDragging.current) {
      const currentPosition = getPositionX(event);
      currentTranslate.current =
        prevTranslate.current + currentPosition - startPos.current;
    }
  }

  function touchEnd() {
    isDragging.current = false;
    cancelAnimationFrame(animationId.current);
    prevTranslate.current = currentTranslate.current;

    if (currentTranslate.current > 0) {
      currentTranslate.current = 0;
      prevTranslate.current = 0;
      setSliderPosition();
    }

    if (
      -currentTranslate.current >
      sliderRef.current.scrollWidth - sliderContainerRef.current.clientWidth
    ) {
      currentTranslate.current = -(
        sliderRef.current.scrollWidth - sliderContainerRef.current.clientWidth
      );
      prevTranslate.current = -(
        sliderRef.current.scrollWidth - sliderContainerRef.current.clientWidth
      );
      console.log(sliderRef);
      setSliderPosition();
    }
  }

  const animation = () => {
    setSliderPosition();
    if (isDragging.current) requestAnimationFrame(animation);
  };

  const setSliderPosition = () => {
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };
  return (
    <div
      className="slider-container"
      onTouchStart={touchStart}
      onMouseDown={touchStart}
      onTouchMove={touchMove}
      onMouseMove={touchMove}
      onTouchEnd={touchEnd}
      onMouseUp={touchEnd}
      onMouseLeave={() => {
        if (isDragging.current) touchEnd();
      }}
      ref={sliderContainerRef}
    >
      <ul
        className={`slider ${isDragging.current ? 'grabbing' : ''}`}
        ref={sliderRef}
      >
        {data.map((slide, index) => (
          <SlideCard key={`slide-${index}`} {...slide} />
        ))}
      </ul>
    </div>
  );
};

export default Slider;
