import { useEffect, useRef, useState, useCallback } from 'react';
import { processColor, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  MFCardViewInput,
  MFCardViewLabel,
  MFCardViewPlaceHolder,
  MFCardViewStyle,
  MFCardViewText,
  MFExecutePaymentRequest,
  MFFontFamily,
  MFFontWeight,
  MFInitiateSessionRequest,
  MFLanguage,
  MFSDK,
  MFCardViewError,
} from 'myfatoorah-reactnative';

import { savePaymentIdentifierApi, SavePaymentPayload } from '@/services/paymentService';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { reset } from '@/services/navigationService';
import { usePhoneStore } from '@/store/usePhoneStore';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useAddCardDetailContainer() {
  const { params } = useRoute();
  const plan = params?.plan;
  const { phoneNumber } = usePhoneStore();
  const [sessionId, setSessionId] = useState('');
  const [cardLoading, setCardLoading] = useState(true);
  const cardPaymentView = useRef<any>(null);

  // --- React Query Mutation ---
  const { mutate: saveIdentifier, isPending: isSaving } = useMutation({
    mutationFn: savePaymentIdentifierApi,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Payment Successful' });
      reset(NavigationRoutes.AUTH_STACK.TRIAL_SUCCESS, { plan: plan })
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Something went wrong while saving payment',
      });
    },
  });

  const getCardViewStyle = useCallback(() => {
    const cardViewInput = new MFCardViewInput(
      processColor(Colors.BLACK),
      16,
      MFFontFamily.Helvetica,
      40,
      Metrics.verticalScale(20),
      processColor(Colors.BLACK),
      1,
      12,
      new MFCardViewPlaceHolder('Name on Card', 'Card Number', 'MM / YY', 'CVV')
    );

    const cardViewLabel = new MFCardViewLabel(
      true,
      processColor(Colors.SUPER_GREY),
      14,
      MFFontFamily.Helvetica,
      MFFontWeight.Medium,
      new MFCardViewText('Card Holder Name', 'Card Number', 'Expiry Date', 'Security Code')
    );

    return new MFCardViewStyle(false, 'initial', 340, cardViewInput, cardViewLabel, new MFCardViewError(processColor(Colors.INDIAN_RED), 8));
  }, []);

  const initiateSession = async () => {
    const request = new MFInitiateSessionRequest();
    request.CustomerIdentifier = 'user11';
    request.SaveToken = true;

    try {
      const response = await MFSDK.initiateSession(request);
      setSessionId(response.SessionId);

      setTimeout(() => {
        cardPaymentView.current?.load(response, (bin: string) => console.log('BIN:', bin))
          .then(() => setCardLoading(false))
          .catch(() => setCardLoading(false));
      }, 200);
    } catch (error) {
      console.error('Session Error:', error);
      setCardLoading(false);
    }
  };

  useEffect(() => { initiateSession(); }, []);

  const handlePay = async () => {
    if (!sessionId) return;

    const executeRequest = new MFExecutePaymentRequest(0.01);
    executeRequest.SessionId = sessionId;

    try {
      const result = await cardPaymentView.current?.pay(
        executeRequest,
        MFLanguage.ENGLISH,
        (invoiceId: string) => console.log('Invoice:', invoiceId)
      );
      
      if (result?.InvoiceStatus === 'Paid') {
        saveIdentifier({
          country: phoneNumber,
          status: 'Paid',
          card_token: phoneNumber,
          card_holder_name: phoneNumber,
          zipcode: phoneNumber
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: 'Transaction was not successful. Please try again.',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred during payment";
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: errorMessage,
      });

    }
  };

  return {
    isSaving,
    cardLoading,
    cardPaymentView,
    getCardViewStyle,
    handlePay,
  };
}