import STORAGE_CONST from '@/constants/storage';
import { getTransactionHistoryApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export default function useTransactionHistoryContainer() {
  const { user } = useAuthStore();

  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.TRANSACTION_HISTORY],
    queryFn: () =>
      getTransactionHistoryApi({
        host_id: user?.id!,
      }),
    enabled: !!user?.id,
  });

  // 🔥 API response ko UI format me convert karna
  const transactions =
    data?.data?.map((item: any) => ({
      id: item.id,

      // Date format: 12 February 2026
      date: new Date(item.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),

      cardType: item.card_type?.toLowerCase() || 'visa',

      // Last 4 digits
      cardNumber: item.token ? item.token.slice(-4) : '0000',

      // Amount format
      amount: Number(item.amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      }),
    })) || [];

  return {
    transactions,
    refetch,
    isLoading,
  };
}
