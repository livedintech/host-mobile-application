export const getOtaConfig = (source: string) => {
  const s = source?.toLowerCase();
  switch (s) {
    case 'airbnb':
      return { key: 'AIRBNB', label: 'Airbnb', color: '#FF5A5F' };
    case 'gathern':
      return { key: 'GATHERN', label: 'Gathern', color: '#A855F7' };
    case 'bookingcom':
    case 'booking_com':
    case 'booking.com':
    case 'booking':
      return { key: 'BOOKING', label: 'Booking.com', color: '#49A6E9' };
    default:
      // Covers 'livedin', 'direct', 'host_booking', etc.
      return { key: 'LIVEDIN', label: 'Livedin', color: '#3B82F6' };
  }
};