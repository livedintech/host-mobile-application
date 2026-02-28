import STORAGE_CONST from "@/constants/storage";
import NavigationRoutes from "@/navigation/NavigationRoutes";
import { navigate } from "@/services/navigationService";
import { getSubscriptionSaveCardsApi } from "@/services/paymentService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

  const onAddNew = () => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD);
  };

  return {
    isSecure,
    setIsSecure,
    isDefault,
    setIsDefault,
    onAddNew,
    cards: data?.tokens ?? [],
    isLoading,
    refetch,
  };
}