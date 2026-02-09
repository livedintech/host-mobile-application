import { useState } from 'react';

export const useRateGuest = () => {
  const [loading, setLoading] = useState(false);

  const submitRating = async (payload: any) => {
    setLoading(true);
    try {
      // API call here
      return { success: true };
    } catch (e) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { submitRating, loading };
};