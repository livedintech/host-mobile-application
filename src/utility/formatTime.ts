export const formatTimeWithPeriod = (timeString: any) => {
  if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) {
    return '';
  }

  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);

  if (isNaN(hour)) return '';

  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour ? hour : 12;

  return `${hour}:${minuteStr} ${period}`;
};

export const formatDateDisplay = (dateString: any) => {
  if (!dateString || typeof dateString !== 'string') return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};
