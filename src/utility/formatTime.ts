export const formatTimeWithPeriod = (timeString: any) => {
  if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) {
    return 'N/A';
  }

  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  
  if (isNaN(hour)) return 'N/A';

  const period = hour >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  return `${hour}:${minuteStr} ${period}`;
};