import { useAuthStore } from '@/store/useAuthStore';

const ADD_PAYMENT_BASE = 'https://livedin.subscriptionflow.com/en/public-checkout/payment-method-update';

export default function useSelectPaymentContainer() {
  const user = useAuthStore((s) => s.user);
  const customerId = user?.subs_customer_id;

  const webViewUrl = customerId
    ? `${ADD_PAYMENT_BASE}/${customerId}?payment_widget=true`
    : null;

  return { webViewUrl };
}
