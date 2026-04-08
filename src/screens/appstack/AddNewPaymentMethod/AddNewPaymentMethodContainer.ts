import { useEffect, useRef, useState, useCallback } from 'react';
import { processColor, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
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
  MFBoxShadow,
  MFSendPaymentRequest,
  MFCurrencyISO,
  MFGooglePayRequest,
  MFCountry,
} from 'myfatoorah-reactnative';

import { savePaymentIdentifierApi, savePaymentinfoApi } from '@/services/paymentService';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { goBack } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { usePhoneStore } from '@/store/usePhoneStore';
import { reset } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';

interface RouteParams {
  plan?: {
    price: number;
    country?: string;
    name?: string;
  };
  paymentMethodType?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  isCardMethod?: boolean;
  isAuthFlow?: boolean;
}

interface PaymentResult {
  InvoiceStatus?: string;
  InvoiceId?: number;
  InvoiceReference?: string;
  InvoiceValue?: number;
  InvoiceDisplayValue?: string;
  CustomerName?: string;
  CustomerMobile?: string;
  CreatedDate?: string;
  ExpiryDate?: string;
  RecurringId?: string;
  CardToken?: string;
  CustomerReference?: string;
  InvoiceError?: string;
  SessionId?: string;
  PaymentURL?: string;
  InvoiceTransactions?: Array<{
    TransactionId?: string;
    PaymentId?: string;
    AuthorizationId?: string;
    TransactionStatus?: string;
    TransactionDate?: string;
    PaymentGateway?: string;
    CardNumber?: string;
    Currency?: string;
    PaidCurrency?: string;
    PaidCurrencyValue?: string;
    TransationValue?: string;
    DueValue?: string;
    CustomerServiceCharge?: string;
    ReferenceId?: string;
    TrackId?: string;
    ErrorCode?: string;
  }>;
  InvoiceItems?: any[];
  Suppliers?: any[];
}

export default function useAddNewPaymentMethodContainer() {
  const { params } = useRoute<any>();

  const country_code = params?.country_code;
  const phone_number = params?.phone_number;
  const phone_with_code = params?.phone_with_code;
  const navigation = useNavigation();
  const plan = (params as RouteParams)?.plan;
  const paymentMethodType = (params as RouteParams)?.paymentMethodType;
  const paymentMethodId = (params as RouteParams)?.paymentMethodId;
  const paymentMethodName = (params as RouteParams)?.paymentMethodName;
  const isCardMethod = (params as RouteParams)?.isCardMethod ?? true;
  const sessionResponse = useRef<any>(null);

  const { user } = useAuthStore();
  const { phoneNumber: authPhoneNumber } = usePhoneStore();
  const isAuthFlow = !!authPhoneNumber;

  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const cardPaymentView = useRef<any>(null);
  const googlePayRef = useRef<any>(null);

  const customerName = isAuthFlow ? 'Customer' : user?.name && user?.surname ? `${user.name} ${user.surname}` : user?.name || 'Customer';
  const customerPhone = isAuthFlow ? authPhoneNumber || '' : user?.phone || '';
  const customerId = isAuthFlow ? authPhoneNumber : user?.phone || user?.id?.toString() || `user_${Date.now()}`;


  console.log('customerPhone::', customerPhone);



  const { mutate: saveIdentifier, isPending: isSaving } = useMutation({
    mutationFn: savePaymentinfoApi,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Payment Successful',
        text2: 'Your payment has been processed successfully',
      });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.SAVED_CARDS] });
      if (isAuthFlow) {
        reset(NavigationRoutes.AUTH_STACK.TRIAL_SUCCESS, { plan });
      } else {
        goBack();
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Payment Save Failed',
        text2: error?.message || 'Failed to save payment information',
      });
    },
  });

  const getCardViewStyle = useCallback(() => {
    const boxShadow = new MFBoxShadow(0, 2, 4, 0, processColor('#00000010'));
    const placeholder = new MFCardViewPlaceHolder(
      'Name on Card',
      'Card Number',
      'MM / YY',
      'CVV'
    );
    const cardViewInput = new MFCardViewInput(
      processColor(Colors.BLACK),
      16,
      MFFontFamily.Helvetica,
      40,
      Metrics.verticalScale(20),
      processColor(Colors.BLACK),
      1,
      12,
      boxShadow
    );
    cardViewInput.PlaceHolder = placeholder;

    const cardViewLabel = new MFCardViewLabel(
      true,
      processColor(Colors.SUPER_GREY),
      14,
      MFFontFamily.Helvetica,
      MFFontWeight.Medium,
      new MFCardViewText(
        'Card Holder Name',
        'Card Number',
        'Expiry Date',
        'Security Code'
      )
    );

    const style = new MFCardViewStyle(
      false,
      'initial',
      340,
      cardViewInput,
      cardViewLabel,
      new MFCardViewError(processColor(Colors.INDIAN_RED), 8)
    );

    return style;
  }, []);

  const initiateSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const request = new MFInitiateSessionRequest(customerId);
      request.SaveToken = true;
      const response = await MFSDK.initiateSession(request);
      setSessionId(response.SessionId?.toString() ?? '');
      sessionResponse.current = response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  // Card view load karo jab isLoading false ho jaye
  useEffect(() => {
    if (
      !isLoading &&
      isCardMethod &&
      paymentMethodType !== 'google_pay' &&
      sessionResponse.current
    ) {
      const onCardBinChanged = (bin: string) => {
        console.log('Card BIN changed:', bin);
      };

      const tryLoad = (attempt: number) => {
        if (cardPaymentView.current && sessionResponse.current) {
          try {
            // ✅ KEY FIX: onCardBinChanged 2nd argument hai load() ka
            cardPaymentView.current.load(sessionResponse.current, onCardBinChanged);
            console.log('✅ Card view loaded on attempt', attempt);
          } catch (e) {
            console.error('❌ Load attempt', attempt, 'failed:', e);
          }
        } else if (attempt < 5) {
          setTimeout(() => tryLoad(attempt + 1), 300);
        }
      };

      const timer = setTimeout(() => tryLoad(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isCardMethod, paymentMethodType]);

  // Google Pay Handshake
  useEffect(() => {
    let timer: any;
    if (sessionId && paymentMethodType === 'google_pay') {
      timer = setTimeout(() => {
        if (googlePayRef.current) {
          const googlePayRequest = new MFGooglePayRequest(
            (plan?.price || 1).toString(),
            '',
            'My App',
            MFCountry.SAUDIARABIA,
            MFCurrencyISO.SAUDIARABIA_SAR
          );
          googlePayRef.current.setupGooglePayHelper(
            sessionId,
            googlePayRequest,
            navigation
          );
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [sessionId, paymentMethodType]);

  const handleCardPayment = async () => {
    if (!sessionId || !cardPaymentView.current) return;
    setIsProcessingPayment(true);
    try {
      const executeRequest = new MFExecutePaymentRequest(plan?.price || 1);
      executeRequest.SessionId = sessionId;
      const onInvoiceCreated = (invoiceId: string) => {
        console.log('Invoice created:', invoiceId);
      };
      const result: any = await cardPaymentView.current?.pay(
        executeRequest,
        MFLanguage.ENGLISH,
        onInvoiceCreated
      );
      if (result?.InvoiceStatus === 'Paid') {
        saveIdentifier({
          phone_number: customerPhone,
          amount: result?.InvoiceTransactions?.[0]?.TransationValue,
          card_type: result?.InvoiceTransactions?.[0]?.PaymentGateway,
          is_active: true,
          token: result?.InvoiceTransactions?.[0]?.CardNumber,
          subscription_id: 1,
          auto_renew: true
        });
      }
    } catch (error: any) {
      console.log('🔴 Full error object:', JSON.stringify(error));
      console.log('🔴 Error message:', error?.message);
      console.log('🔴 Error string:', String(error));
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error?.message || JSON.stringify(error) || 'Unknown error',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleWalletPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentRequest = new MFSendPaymentRequest(
        plan?.price || 1,
        MFCurrencyISO.SAUDIARABIA_SAR
      );
      paymentRequest.CustomerName = customerName;
      paymentRequest.CustomerMobile = customerPhone;
      paymentRequest.NotificationOption = 'SMS';
      if (paymentMethodId) paymentRequest.PaymentMethodId = paymentMethodId;
      const result = await MFSDK.sendPayment(paymentRequest, MFLanguage.ENGLISH);
      if (result?.InvoiceURL) await Linking.openURL(result.InvoiceURL);
    } catch (error: any) {
      console.log('🔴 Full error object:', JSON.stringify(error));
      console.log('🔴 Error message:', error?.message);
      console.log('🔴 Error string:', String(error));
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error?.message || JSON.stringify(error) || 'Unknown error',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePay = async () => {
    if (isCardMethod) await handleCardPayment();
    else await handleWalletPayment();
  };

  useEffect(() => {
    initiateSession();
  }, [initiateSession]);

  return {
    isLoading,
    isProcessingPayment,
    isSaving,
    cardLoading: isLoading || isProcessingPayment || isSaving,
    paymentMethodName,
    paymentMethodType,
    isCardMethod,
    cardPaymentView,
    googlePayRef,
    sessionId,
    getCardViewStyle,
    handlePay,
    retrySession: initiateSession,
  };
}