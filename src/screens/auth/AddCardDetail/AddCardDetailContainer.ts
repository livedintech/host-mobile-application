import { useEffect, useRef, useState, useCallback } from 'react';
import { processColor } from 'react-native';
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
} from 'myfatoorah-reactnative';

import { savePaymentIdentifierApi } from '@/services/paymentService';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { reset } from '@/services/navigationService';
import { usePhoneStore } from '@/store/usePhoneStore';
import NavigationRoutes from '@/navigation/NavigationRoutes';

// Types
interface RouteParams {
  plan?: {
    price: number;
    country?: string;
    name?: string;
  };
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

export default function useAddCardDetailContainer() {
  const { params } = useRoute<any>();
  const plan = (params as RouteParams)?.plan;
  const { phoneNumber } = usePhoneStore();
  
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const cardPaymentView = useRef<any>(null);

  // Save Payment Mutation
  const { mutate: saveIdentifier, isPending: isSaving } = useMutation({
    mutationFn: savePaymentIdentifierApi,
    onSuccess: () => {
      Toast.show({ 
        type: 'success', 
        text1: 'Payment Successful',
        text2: 'Your payment has been processed successfully'
      });
      reset(NavigationRoutes.AUTH_STACK.TRIAL_SUCCESS, { plan });
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
    // Box Shadow configuration
    const boxShadow = new MFBoxShadow(
      0,  // HOffset
      2,  // VOffset
      4,  // Blur
      0,  // Spread
      processColor('#00000010') // Color with transparency
    );

    // Placeholder configuration
    const placeholder = new MFCardViewPlaceHolder(
      'Name on Card', 
      'Card Number', 
      'MM / YY', 
      'CVV'
    );

    // Input style configuration
    const cardViewInput = new MFCardViewInput(
      processColor(Colors.BLACK),        // Text color
      16,                                 // Font size
      MFFontFamily.Helvetica,            // Font family
      40,                                 // Input height
      Metrics.verticalScale(20),         // Padding
      processColor(Colors.BLACK),        // Border color
      1,                                  // Border width
      12,                                 // Border radius
      boxShadow                          // Box shadow
    );
    
    // Set placeholder separately
    cardViewInput.PlaceHolder = placeholder;

    // Label configuration
    const cardViewLabel = new MFCardViewLabel(
      true,                              // Show labels
      processColor(Colors.SUPER_GREY),   // Label color
      14,                                 // Label font size
      MFFontFamily.Helvetica,            // Label font family
      MFFontWeight.Medium,               // Label font weight
      new MFCardViewText(
        'Card Holder Name', 
        'Card Number', 
        'Expiry Date', 
        'Security Code'
      )
    );

    // Error style configuration
    const cardViewError = new MFCardViewError(
      processColor(Colors.INDIAN_RED),   // Error color
      8                                   // Error font size
    );

    // Return complete style
    return new MFCardViewStyle(
      false,           // Hide card image
      'initial',       // Initial state
      340,             // Card view height
      cardViewInput,   // Input style
      cardViewLabel,   // Label style
      cardViewError    // Error style
    );
  }, []);

  // Initialize Payment Session
  const initiateSession = useCallback(async () => {
    setIsLoading(true);

    try {
      // Create request with customerIdentifier as constructor parameter
      const customerIdentifier = phoneNumber || `user_${Date.now()}`;
      const request = new MFInitiateSessionRequest(customerIdentifier);
      request.SaveToken = true;

      // Initiate session
      const response = await MFSDK.initiateSession(request);
      
      if (!response?.SessionId) {
        throw new Error('Invalid session response');
      }

      // Convert String to string for setState
      setSessionId(response.SessionId.toString());

      // Small delay to ensure view is ready
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
  }, [phoneNumber]);

  // Validate Card Before Payment (Basic check only)
  const validateCard = async (): Promise<boolean> => {
    try {
      // Check if card view is loaded and ready
      if (!cardPaymentView.current) {
        Toast.show({
          type: 'error',
          text1: 'Card Form Not Ready',
          text2: 'Please wait for the form to load',
        });
        return false;
      }

      // Note: isValid() function not available in this version
      // Card validation will be done by MyFatoorah SDK during payment
      console.log('✓ Card view is ready, proceeding to payment...');
      return true;
    } catch (error) {
      console.error('Card Validation Check Error:', error);
      // Allow payment to proceed, SDK will validate
      return true;
    }
  };

  // Check if error is session-related
  const isSessionError = (error: any): boolean => {
    const errorMessage = (error?.message || '').toLowerCase();
    const errorString = JSON.stringify(error).toLowerCase();
    
    return (
      errorMessage.includes('invalid data') ||
      errorMessage.includes('session') ||
      errorMessage.includes('expired') ||
      errorString.includes('invalid data') ||
      errorString.includes('session') ||
      errorString.includes('expired')
    );
  };

  // Handle Payment Process
  const handlePay = async () => {
    // Check session
    if (!sessionId) {
      Toast.show({ 
        type: 'error', 
        text1: 'Session Expired',
        text2: 'Reinitializing payment session...'
      });
      await initiateSession();
      return;
    }

    // Basic validation check
    const isCardReady = await validateCard();
    if (!isCardReady) {
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare payment request
      const amount = 1; // Fallback to test amount
      const executeRequest = new MFExecutePaymentRequest(amount);
      executeRequest.SessionId = sessionId;

      console.log('💳 Initiating payment for amount:', amount);

      // Execute payment
      const result: PaymentResult = await cardPaymentView.current?.pay(
        executeRequest,
        MFLanguage.ENGLISH,
        (invoiceId: string) => {
          console.log('📄 Invoice ID:', invoiceId);
        }
      );

      console.log('📊 Payment Result:', result);

      // Check payment status
      if (result?.InvoiceStatus === 'Paid') {
        // Payment successful - extract transaction details
        console.log('✅ Payment successful');
        
        // Get first transaction (usually there's only one)
        const transaction = result.InvoiceTransactions?.[0];
        
        // Extract card details from transaction
        const cardNumber = transaction?.CardNumber || 'N/A';
        const paymentGateway = transaction?.PaymentGateway || 'N/A';
        const transactionId = transaction?.TransactionId || '';
        
        // Save payment information with actual data
        saveIdentifier({
          country: plan?.country || phoneNumber,
          status: result.InvoiceStatus || 'Paid',
          card_token: transactionId || result.SessionId || phoneNumber,
          card_holder_name: result.CustomerName || 'Anonymous',
          zipcode: result.CustomerMobile || phoneNumber,
          customer_identifier:result.CustomerMobile || phoneNumber,
        });
      } else {
        // Payment failed or pending
        console.log('❌ Payment failed:', result?.InvoiceError);
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: result?.InvoiceError || 'Transaction was not successful',
        });
      }
    } catch (error: any) {
      console.error('❌ Payment Error:', error);
      
      // ✅ CHECK IF SESSION EXPIRED ERROR
      if (isSessionError(error)) {
        console.log('🔄 Session expired detected, reinitializing...');
        
        Toast.show({
          type: 'info',
          text1: 'Session Expired',
          text2: 'Please try again after refresh',
        });
        
        // Reset processing state
        setIsProcessingPayment(false);
        
        // Reinitialize session
        await initiateSession();
        return;
      }
      
      // Handle other error types
      const displayMessage = 
        error?.message || 
        error?.error?.Message || 
        'An unexpected error occurred during payment';
      
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: displayMessage,
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Initialize session on component mount
  useEffect(() => {
    initiateSession();
  }, [initiateSession]);

  return {
    // States
    isLoading,
    isProcessingPayment,
    isSaving,
    cardLoading: isLoading || isProcessingPayment || isSaving,
    
    // Refs
    cardPaymentView,
    
    // Functions
    getCardViewStyle,
    handlePay,
    retrySession: initiateSession,
  };
}