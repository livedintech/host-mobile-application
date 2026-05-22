import i18n from '@/locales/i18n/i18n';
import STORAGE_CONST from "@/constants/storage";
import NavigationRoutes from "@/navigation/NavigationRoutes";
import { queryClient } from "@/services/api";
import { navigate } from "@/services/navigationService";
import { getPaymentMethodsApi, subscriptionActiveApi } from "@/services/paymentService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function usePaymentMethodListContainer() {

  const [isDefault, setIsDefault] = useState<string | null>(null);
  const { user } = useAuthStore();

  const customerId = user?.subs_customer_id;

  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.SAVED_CARDS, customerId],
    queryFn: () => getPaymentMethodsApi(customerId!),
    enabled: !!user?.id && !!customerId,
  });

  const cards = data?.data?.data ?? [];

  useEffect(() => {
    const defaultCard = cards.find(c => c.default === 1);
    if (defaultCard) {
      setIsDefault(defaultCard.id);
    }
  }, [data]);

  const { mutate: subscriptionActivePayload } = useMutation({
    mutationFn: subscriptionActiveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.SAVED_CARDS] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.payment_save_failed'),
        text2: error?.message || i18n.t('common.toast.failed_save_payment'),
      });
    },
  });

  const onAddNew = () => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD);
  };

  const handleSetDefault = (id: string) => {
    setIsDefault(id);
    subscriptionActivePayload({ token: id });
  };

  return {
    isDefault,
    onAddNew,
    cards,
    isLoading,
    refetch,
    handleSetDefault,
  };
}