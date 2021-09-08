export const getHoursFromUnix = (timestamp) => {
  return new Date(timestamp * 1000).getUTCHours();
};

const getWeekDayFromUTCDay = (utcDay, longDay) => {
  switch (utcDay) {
    case 0:
      return longDay ? 'Sunday' : 'Sun';
    case 1:
      return longDay ? 'Monday' : 'Mon';
    case 2:
      return longDay ? 'Tuesday' : 'Tue';
    case 3:
      return longDay ? 'Wednesday' : 'Wed';
    case 4:
      return longDay ? 'Thursday' : 'Thu';
    case 5:
      return longDay ? 'Friday' : 'Fri';
    case 6:
      return longDay ? 'Saturday' : 'Sat';
  }
};

const getDateWithEndingFromUtcDate = (utcDate) => {
  utcDate = '' + utcDate;
  if (utcDate[utcDate.length - 1] == 1) {
    return utcDate + 'st';
  } else if (utcDate[utcDate.length - 1] == 2) {
    return utcDate + 'nd';
  } else if (utcDate[utcDate.length - 1] == 3) {
    return utcDate + 'rd';
  } else {
    return utcDate + 'th';
  }
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 *
 * @param timestamp - unixTimeStamp
 * @param {boolean} [longDay] - if true, returns day in long
 * @returns
 */
export const getDayFromUnix = (timestamp, longDay) => {
  const date = new Date(timestamp * 1000);
  let weekDay = getWeekDayFromUTCDay(date.getUTCDay(), longDay);

  return `${weekDay}, ${date.getUTCDate()}`;
};

export const getFullDateTimeFromUnix = (timestamp) => {
  const date = new Date(timestamp * 1000);

  let hours = date.getUTCHours() + '';
  hours = hours.length === 1 ? '0' + hours : hours;
  let minutes = date.getUTCMinutes() + '';
  minutes = minutes.length === 1 ? '0' + minutes : minutes;

  return {
    date: getDateWithEndingFromUtcDate(date.getUTCDate()),
    month: monthNames[date.getUTCMonth()],
    weekDay: getWeekDayFromUTCDay(date.getUTCDay(), true),
    time: `${hours}:${minutes}`,
  };
};
