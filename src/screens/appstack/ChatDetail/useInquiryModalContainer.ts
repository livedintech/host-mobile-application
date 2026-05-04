import i18n from '@/locales/i18n/i18n';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  inquiryPreApproveApi,
  inquirySpecialOfferApi,
  submitBookingRequestApi,
} from '@/services/chatApi';
import { useNavigation } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';

// Dynamic Validation Schema
const schema = yup.object().shape({
  formType: yup.string(),
  message: yup.string().required(i18n.t('app.validation.message_required')),
  offerAmount: yup.string().when('formType', {
    is: 'specialOffer',
    then: s => s.required(i18n.t('app.validation.offer_amount_required')),
    otherwise: s => s.notRequired(),
  }),
});

interface Props {
  onClose: () => void;
  inquiryId: string;

  guestName?: string;
  startDate?: string;
  endDate?: string;
}


export type AppStackParamList = {
  DECLINE_INQUIRY_STEP1_SCREEN: {
    id: string;
    type: string;
    guestName?: string;
    start_date?: string;
    end_date?: string;
  };
};


export default function useInquiryModalContainer({
  onClose,
  inquiryId,
   guestName,
  startDate,
  endDate,
}: Props) {
  // viewState ab 3 types ki hogi
  const [viewState, setViewState] = useState<
    'actions' | 'specialOffer' | 'preApprove' | 'approve' | 'decline'
  >('actions');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      formType: 'actions',
      message: '',
      offerAmount: '',
    },
  });

const navigation = useNavigation<any>();
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // --- Mutation 1: Pre-Approve API ---
  const { mutate: preApprove, isPending: isApproving } = useMutation({
    mutationFn: inquiryPreApproveApi,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: i18n.t('app.inquiry_modal.pre_approved_success'),
      });
      resetState();
    },
    onError: (error: any) =>
      Toast.show({
        type: 'error',
        text1: error?.message || i18n.t('common.toast.error'),
      }),
  });

  // --- Mutation 2: Special Offer API ---
  const { mutate: sendOffer, isPending: isSendingOffer } = useMutation({
    mutationFn: inquirySpecialOfferApi,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: i18n.t('common.toast.special_offer_sent'),
      });
      resetState();
    },
    onError: (error: any) =>
      Toast.show({
        type: 'error',
        text1: error?.message || i18n.t('common.toast.error'),
      }),
  });

  const resetState = () => {
    reset({ formType: 'actions', message: '', offerAmount: '' });
    setViewState('actions');
    onClose();
  };

  const handleBackToActions = () => {
    setViewState('actions');
    reset({ formType: 'actions', message: '', offerAmount: '' });
  };

  const handleSpecialOfferClick = () => {
    setValue('formType', 'specialOffer');
    setViewState('specialOffer');
  };

  const handlePreApproveClick = () => {
    setValue('formType', 'preApprove');
    setViewState('preApprove');
  };

  const onSubmit = (data: any) => {
    const payload = {
      thread_id: inquiryId,
      amount: data?.offerAmount,
      message: data?.message,
    };

    if (data.formType === 'specialOffer') {
      sendOffer(payload);
    } else {
      preApprove(payload);
    }
  };

  const handleBookingAction = async (
    action: 'accept_request' | 'decline_request',
  ) => {
    if (action === 'decline_request') {
      navigation.navigate(
        NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP1_SCREEN,
        {
          id: inquiryId,
          type: 'booking_request',
          guestName,
          start_date: startDate,
          end_date: endDate,
        },
      );
      return;
    }

    // ACCEPT FLOW
    try {
      setIsBookingLoading(true);

      const payload = {
        thread_id: inquiryId,
        accept: true,
        reason: null,
        decline_message_to_guest: null,
        decline_message_to_airbnb: null,
      };

      await submitBookingRequestApi(payload);

      Toast.show({
        type: 'success',
        text1: i18n.t('app.listing_screen.booking_accepted'),
        text2: i18n.t('app.listing_screen.booking_accepted_desc', {
          name: guestName,
        }),
      });

      resetState();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        i18n.t('app.listing_screen.accept_request_failed');

      Toast.show({
        type: 'error',
        text1: i18n.t('app.listing_screen.action_failed'),
        text2: message,
      });
    } finally {
      setIsBookingLoading(false);
    }
  };

  return {
    viewState,
    control,
    errors,
    isApproving,
    isSendingOffer,
    isBookingLoading,
    handleSpecialOfferClick,
    handlePreApproveClick,
    handleBackToActions,
    handleSubmitForm: handleSubmit(onSubmit),


    handleBookingAction
  };
}
