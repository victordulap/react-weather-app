export const celsiusToFahrenheit = (celsius) => {
  const fahrenheit = celsius * (9 / 5) + 32;
  return fahrenheit;
};

export const metresPerSecondToMilesPerHour = (metresPerSecond) => {
  const milesPerHour = metresPerSecond * 2.237;
  console.log(metresPerSecond, ' -> ', milesPerHour);
  return milesPerHour;
};
