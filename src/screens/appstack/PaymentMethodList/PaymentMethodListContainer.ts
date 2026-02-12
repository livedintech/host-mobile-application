import NavigationRoutes from "@/navigation/NavigationRoutes";
import { navigate } from "@/services/navigationService";
import { getSubscriptionSaveCardsApi } from "@/services/paymentService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function usePaymentMethodListContainer() {
  const { user } = useAuthStore();

  const [isSecure, setIsSecure] = useState(true);
  const [isDefault, setIsDefault] = useState(true);

  const [cards, setCards] = useState<any[]>([]);

  const { mutate: getSubscriptionSaveCardsPayload, isPending, isIdle } =
    useMutation({
      mutationFn: getSubscriptionSaveCardsApi,
      onSuccess: (res) => {
        // 👇 tokens array save kar rahe hain
        setCards(res?.tokens || []);
      },
    });

  useEffect(() => {
    getSubscriptionSaveCardsPayload({
      customer_identifier: user?.phone,
    });
  }, []);

  const onAddNew = () => {
    navigate(NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD);
  };

  return {
    isSecure,
    setIsSecure,
    isDefault,
    setIsDefault,
    onAddNew,
    cards,
    isLoading: isPending && !isIdle,
  };
}
