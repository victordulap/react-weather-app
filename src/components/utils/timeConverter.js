export const getHoursFromUnix = (timestamp) => {
  return new Date(timestamp * 1000).getUTCHours();
};

export const getDayFromUnix = (timestamp) => {
  const date = new Date(timestamp * 1000);
  let weekDay = '';
  switch (date.getUTCDay()) {
    case 0:
      weekDay = 'Sun';
      break;
    case 1:
      weekDay = 'Mon';
      break;
    case 2:
      weekDay = 'Tue';
      break;
    case 3:
      weekDay = 'Wed';
      break;
    case 4:
      weekDay = 'Thu';
      break;
    case 5:
      weekDay = 'Fri';
      break;
    case 6:
      weekDay = 'Sat';
      break;
  }
  return `${weekDay}, ${date.getUTCDate()}`;
};
