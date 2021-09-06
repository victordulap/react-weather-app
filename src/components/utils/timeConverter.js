export const getHoursFromUnix = (timestamp) => {
  return new Date(timestamp * 1000).getUTCHours();
};

/**
 *
 * @param timestamp - unixTimeStamp
 * @param {boolean} [longDay] - if true, returns day in long
 * @returns
 */
export const getDayFromUnix = (timestamp, longDay) => {
  const date = new Date(timestamp * 1000);
  let weekDay = '';
  switch (date.getUTCDay()) {
    case 0:
      weekDay = longDay ? 'Sunday' : 'Sun';
      break;
    case 1:
      weekDay = longDay ? 'Monday' : 'Mon';
      break;
    case 2:
      weekDay = longDay ? 'Tuesday' : 'Tue';
      break;
    case 3:
      weekDay = longDay ? 'Wednesday' : 'Wed';
      break;
    case 4:
      weekDay = longDay ? 'Thursday' : 'Thu';
      break;
    case 5:
      weekDay = longDay ? 'Friday' : 'Fri';
      break;
    case 6:
      weekDay = longDay ? 'Saturday' : 'Sat';
      break;
  }
  return `${weekDay}, ${date.getUTCDate()}`;
};
