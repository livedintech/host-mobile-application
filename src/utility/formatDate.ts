export const formatDateDisplay = (dateString: any) => {
  if (!dateString || typeof dateString !== 'string' || dateString === 'N/A') {
    return 'N/A';
  }

  const date = new Date(dateString);
  
  // If the date string is invalid (e.g. "random-text"), new Date() returns NaN
  if (isNaN(date.getTime())) return 'N/A';

  const day = date.getDate();
  // 'long' gives "April", 'en-GB' ensures Day-Month-Year order
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};