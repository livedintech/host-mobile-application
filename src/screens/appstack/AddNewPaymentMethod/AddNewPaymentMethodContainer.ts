import { useEffect, useRef, useState, useCallback } from 'react';
import { processColor, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
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
} from 'myfatoorah-reactnative';

import { savePaymentIdentifierApi } from '@/services/paymentService';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { goBack } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';

// Types
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
  const plan = (params as RouteParams)?.plan;
  const paymentMethodType = (params as RouteParams)?.paymentMethodType;
  const paymentMethodId = (params as RouteParams)?.paymentMethodId;
  const paymentMethodName = (params as RouteParams)?.paymentMethodName;
  const isCardMethod = (params as RouteParams)?.isCardMethod ?? true;
  
  const { user } = useAuthStore();
  
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const cardPaymentView = useRef<any>(null);

  // Get customer details from user
  const customerName = user?.name && user?.surname 
    ? `${user.name} ${user.surname}` 
    : user?.name || 'Customer';
  const customerPhone = user?.phone || '';
  const customerEmail = user?.email || '';
  const customerId = user?.id?.toString() || `user_${Date.now()}`;

  console.log('💳 Payment Method Config:', {
    type: paymentMethodType,
    id: paymentMethodId,
    name: paymentMethodName,
    isCardMethod,
    customer: customerName,
  });

  // Save Payment Mutation
  const { mutate: saveIdentifier, isPending: isSaving } = useMutation({
    mutationFn: savePaymentIdentifierApi,
    onSuccess: () => {
      Toast.show({ 
        type: 'success', 
        text1: 'Payment Successful',
        text2: 'Your payment has been processed successfully'
      });
      goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Payment Save Failed',
        text2: error?.message || 'Failed to save payment information',
      });
    },
  });

  // Card View Style Configuration
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

    const cardViewError = new MFCardViewError(
      processColor(Colors.INDIAN_RED),
      8
    );

    return new MFCardViewStyle(
      false,
      'initial',
      340,
      cardViewInput,
      cardViewLabel,
      cardViewError
    );
  }, []);

  // Initialize Card Payment Session (for Mada, Visa/Master)
  const initiateCardSession = useCallback(async () => {
    setIsLoading(true);

    try {
      const request = new MFInitiateSessionRequest(customerId);
      request.SaveToken = true;

      const response = await MFSDK.initiateSession(request);
      
      if (!response?.SessionId) {
        throw new Error('Invalid session response');
      }

      setSessionId(response.SessionId.toString());

      console.log(`💳 Loading ${paymentMethodName} card form...`);

      setTimeout(() => {
        cardPaymentView.current
          ?.load(response, (bin: string) => {
            console.log('Card BIN:', bin);
          })
          .then(() => {
            console.log('✅ Card view loaded successfully');
            setIsLoading(false);
          })
          .catch((error: any) => {
            console.error('❌ Card Load Error:', error);
            Toast.show({
              type: 'error',
              text1: 'Failed to load payment form',
              text2: 'Please try again',
            });
            setIsLoading(false);
          });
      }, 200);
    } catch (error: any) {
      console.error('❌ Session Initiation Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Session Error',
        text2: error?.message || 'Failed to initialize payment session',
      });
      setIsLoading(false);
    }
  }, [customerId, paymentMethodName]);

  // Initialize Wallet Payment (for STC Pay, Apple Pay, Google Pay)
  const initiateWalletPayment = useCallback(async () => {
    setIsLoading(true);
    console.log(`🔄 Preparing ${paymentMethodName} payment...`);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [paymentMethodName]);

  // Handle Card Payment (Mada, Visa/Master)
  const handleCardPayment = async () => {
    if (!sessionId) {
      Toast.show({ 
        type: 'error', 
        text1: 'Session Expired',
        text2: 'Reinitializing payment session...'
      });
      await initiateCardSession();
      return;
    }

    if (!cardPaymentView.current) {
      Toast.show({
        type: 'error',
        text1: 'Card Form Not Ready',
        text2: 'Please wait for the form to load',
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const amount = 0.01; // Test amount
      const executeRequest = new MFExecutePaymentRequest(amount);
      executeRequest.SessionId = sessionId;
      
      if (paymentMethodId) {
        executeRequest.PaymentMethodId = paymentMethodId;
        console.log(`💳 Using ${paymentMethodName} (ID: ${paymentMethodId})`);
      }

      console.log('💳 Processing payment...');

      const result: PaymentResult = await cardPaymentView.current?.pay(
        executeRequest,
        MFLanguage.ENGLISH,
        (invoiceId: string) => {
          console.log('📄 Invoice ID:', invoiceId);
        }
      );

      console.log('📊 Payment Result:', result);

      if (result?.InvoiceStatus === 'Paid') {
        const transaction = result.InvoiceTransactions?.[0];
        
        saveIdentifier({
          country: plan?.country || customerPhone,
          status: result.InvoiceStatus || 'Paid',
          card_token: transaction?.TransactionId || result.SessionId || customerPhone,
          card_holder_name: result.CustomerName || customerName,
          zipcode: result.CustomerMobile || customerPhone,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: result?.InvoiceError || 'Transaction was not successful',
        });
      }
    } catch (error: any) {
      console.error('❌ Payment Error:', error);
      
      const errorMessage = (error?.message || '').toLowerCase();
      if (errorMessage.includes('invalid data') || errorMessage.includes('session')) {
        Toast.show({
          type: 'info',
          text1: 'Session Expired',
          text2: 'Please try again',
        });
        setIsProcessingPayment(false);
        await initiateCardSession();
        return;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error?.message || 'An error occurred',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle Wallet Payment (STC Pay, Apple Pay, Google Pay)
  const handleWalletPayment = async () => {
    setIsProcessingPayment(true);

    try {
      const amount = 0.01; // Test amount
      
      // Create payment request for redirect methods
      const paymentRequest = new MFSendPaymentRequest(amount, MFCurrencyISO.SAUDIARABIA_SAR);
      
      // Required fields - Using actual user data
      paymentRequest.CustomerIdentifier = customerId;
      paymentRequest.CustomerName = customerName; // ✅ Actual user name
      paymentRequest.DisplayCurrencyIso = MFCurrencyISO.SAUDIARABIA_SAR;
      
      // Optional fields
      paymentRequest.CustomerMobile = customerPhone;
      paymentRequest.CustomerEmail = customerEmail || ''; // Empty if no email
      paymentRequest.CallBackUrl = ''; // Add your callback URL if needed
      paymentRequest.ErrorUrl = ''; // Add your error URL if needed
      
      // Set specific payment method
      if (paymentMethodId) {
        paymentRequest.PaymentMethodId = paymentMethodId;
        console.log(`💳 Using ${paymentMethodName} (ID: ${paymentMethodId})`);
      }

      console.log(`💳 Initiating ${paymentMethodName} payment...`);
      console.log('Customer:', customerName, '| Phone:', customerPhone);

      // Execute payment - this will return payment URL for redirect
      const result = await MFSDK.sendPayment(paymentRequest, MFLanguage.ENGLISH);

      console.log('📊 Wallet Payment Result:', result);

      // Handle redirect URL
      if (result?.PaymentURL) {
        console.log('🔗 Opening payment URL:', result.PaymentURL);
        await Linking.openURL(result.PaymentURL);
        
        Toast.show({
          type: 'info',
          text1: `${paymentMethodName} Opened`,
          text2: 'Complete payment and return to app',
        });
      }

      // Check if already paid (rare, but possible)
      if (result?.InvoiceStatus === 'Paid') {
        const transaction = result.InvoiceTransactions?.[0];
        
        saveIdentifier({
          country: plan?.country || customerPhone,
          status: result.InvoiceStatus,
          card_token: transaction?.TransactionId || '',
          card_holder_name: result.CustomerName || customerName,
          zipcode: result.CustomerMobile || customerPhone,
        });
      }
    } catch (error: any) {
      console.error('❌ Wallet Payment Error:', error);
      
      // Show detailed error message
      const errorMessage = error?.message || 'Failed to process payment';
      console.log('Error details:', {
        message: error?.message,
        error: error?.error,
        validationErrors: error?.ValidationErrors,
      });
      
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: errorMessage,
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Main payment handler
  const handlePay = async () => {
    if (isCardMethod) {
      await handleCardPayment();
    } else {
      await handleWalletPayment();
    }
  };

  // Initialize based on method type
  useEffect(() => {
    if (isCardMethod) {
      initiateCardSession();
    } else {
      initiateWalletPayment();
    }
  }, [isCardMethod]);

  return {
    // States
    isLoading,
    isProcessingPayment,
    isSaving,
    cardLoading: isLoading || isProcessingPayment || isSaving,
    
    // Method info
    paymentMethodName,
    isCardMethod,
    
    // Refs
    cardPaymentView,
    
    // Functions
    getCardViewStyle,
    handlePay,
    retrySession: isCardMethod ? initiateCardSession : initiateWalletPayment,
  };
}