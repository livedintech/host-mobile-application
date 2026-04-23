import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { MFSDK, MFLanguage, MFCurrencyISO, MFInitiatePaymentRequest } from 'myfatoorah-reactnative';
import { useTranslation } from 'react-i18next';

// Payment Method Types
export type PaymentMethodType =
  | 'mada'
  | 'stc_pay'
  | 'visa_master'
  | 'apple_pay'
  | 'google_pay';

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  icon: any;
  apiIdentifier: number; // MyFatoorah payment method ID
  isCardMethod: boolean; // true = card form, false = redirect
}

export default function useSelectPaymentContainer() {
  const navigation = useNavigation();
   const { t } = useTranslation();

  const { params } = useRoute();
  const country_code = params?.country_code;
  const phone_number = params?.phone_number;
  const phone_with_code = params?.phone_with_code;

  // 🔧 GET PAYMENT METHOD IDs - Run once to see IDs in console
  useEffect(() => {
    // ⚠️ Comment out after getting IDs
    getPaymentMethodIds();
  }, []);

  const getPaymentMethodIds = async () => {
    try {
      const request: MFInitiatePaymentRequest = {
        InvoiceAmount: 1,
        CurrencyIso: MFCurrencyISO.SAUDIARABIA_SAR, // ✅ Use enum
      };

      const response = await MFSDK.initiatePayment(request, MFLanguage.ENGLISH);

      // Response might be PaymentMethods array directly or nested
      const methods = response.PaymentMethods || response;

      if (Array.isArray(methods)) {
        methods.forEach((method: any) => {
          console.log(`
Name: ${method.PaymentMethodEn}
ID: ${method.PaymentMethodId}
Type: ${method.IsDirectPayment ? 'CARD (Shows form)' : 'WALLET (Redirects)'}
---`);
        });
      } else {
        console.log('Full response:', response);
      }


    } catch (error) {
      console.error('❌ Error getting payment methods:', error);
    }
  };

  // Payment Methods Configuration
  // ⚠️ UPDATE apiIdentifier with actual IDs from console above
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'stc_pay',
      name: t('auth.select_payment.stc_pay'),       // ✅
      icon: 'LogoStcCardIcon',
      apiIdentifier: 11,
      isCardMethod: false,
    },
    {
      id: '2',
      type: 'visa_master',
      name: t('auth.select_payment.credit_card'),   // ✅
      icon: 'LogoVisaCardIcon',
      apiIdentifier: 2,
      isCardMethod: true,
    },
    {
      id: '4',
      type: 'apple_pay',
      name: t('auth.select_payment.apple_pay'),     // ✅
      icon: 'LogoAppleCardICon',
      apiIdentifier: 20,
      isCardMethod: false,
    },
    {
      id: '5',
      type: 'google_pay',
      name: t('auth.select_payment.google_pay'),    // ✅
      icon: 'LogoGooglePayCardIcon',
      apiIdentifier: 21,
      isCardMethod: false,
    },
  ];

  const onSelect = (methodId: string) => {
    // Find selected payment method
    const selectedMethod = paymentMethods.find(m => m.id === methodId);

    if (!selectedMethod) {
      console.error('Payment method not found');
      return;
    }


    // Navigate to payment screen with method details
    navigate(NavigationRoutes.APP_STACK.ADD_NEW_PAYMENT_METHOD, {
      paymentMethodType: selectedMethod.type,
      paymentMethodId: selectedMethod.apiIdentifier,
      paymentMethodName: selectedMethod.name,
      isCardMethod: selectedMethod.isCardMethod,
      country_code,
      phone_number,
      phone_with_code,
    });
  };

  return {
    paymentMethods,
    onSelect,
    navigation
  };
}

/**
 * 📝 STEPS TO GET ACTUAL IDs:
 * 
 * 1. Run app and navigate to SelectPaymentScreen
 * 2. Check console - you'll see:
 *    Name: MADA
 *    ID: 1
 *    Type: CARD (Shows form)
 *    ---
 *    Name: STC PAY
 *    ID: 11
 *    Type: WALLET (Redirects)
 *    ---
 * 
 * 3. Update paymentMethods array above with actual IDs:
 *    apiIdentifier: 1 → Replace with actual ID
 *    isCardMethod: true → true if "CARD", false if "WALLET"
 * 
 * 4. Comment out getPaymentMethodIds() in useEffect
 * 
 * 5. Done! Test payment methods
 */