import React from 'react';
import '../styles/SemiCircleChart.scss';

const SemiCircleChart = ({ list, mainText, percent }) => {
  const rotationDeg = (percent / 100) * 180;
  return (
    <ul className="semi-circle-chart">
      <div
        className="semi-circle-chart-degrees"
        style={{ transform: `rotate(${rotationDeg}deg)` }}
      ></div>
      <div className="semi-circle-chart-total-degrees"></div>
      {list.map((item, index) => (
        <li key={index + item} className="semi-circle-chart-item">
          {item}
        </li>
      ))}

      <p className="semi-circle-chart-text">{mainText}</p>
    </ul>
  );
};

export default SemiCircleChart;
