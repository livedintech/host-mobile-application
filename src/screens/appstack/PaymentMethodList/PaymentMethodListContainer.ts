import STORAGE_CONST from "@/constants/storage";
import NavigationRoutes from "@/navigation/NavigationRoutes";
import { queryClient } from "@/services/api";
import { navigate } from "@/services/navigationService";
import { getSubscriptionSaveCardsApi, subscriptionActiveApi } from "@/services/paymentService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function usePaymentMethodListContainer() {
  const { user } = useAuthStore();

  const [isSecure, setIsSecure] = useState(true);
  const [isDefault, setIsDefault] = useState<string | null>(null); // fix: was boolean

  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.SAVED_CARDS],
    queryFn: () =>
      getSubscriptionSaveCardsApi({
        customer_identifier: user?.phone,
      }),
    enabled: !!user?.id,
  });

  useEffect(() => {
  const activeToken = data?.tokens?.find(t => t.status === 'active')?.Token;
  if (activeToken) {
    setIsDefault(activeToken);
  }
}, [data]);

  const { mutate: subscriptionActivePayload, isPending: isSaving } = useMutation({
    mutationFn: subscriptionActiveApi,
    onSuccess: ({ message }) => {
      // Toast.show({ type: 'success', text1: message });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.SAVED_CARDS] });

    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Payment Save Failed',
        text2: error?.message || 'Failed to save payment information',
      });
    },
  });

  const onAddNew = () => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD);
  };

 const handleSetDefault = (token: string) => {
  setIsDefault(token);           // UI optimistically update
  subscriptionActivePayload({ token }); // sirf token pass karo
};


  return {
    isSecure,
    setIsSecure,
    isDefault,
    onAddNew,
    cards: data?.tokens ?? [],
    isLoading,
    refetch,
    handleSetDefault
  };
}