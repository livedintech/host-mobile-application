import i18n from '@/locales/i18n/i18n';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import { alterationRequestRespondApi } from '@/services/chatApi';
import { useQueryClient } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';

const declineSchema = yup.object().shape({
  reason: yup.string().required(i18n.t('app.validation.field_required')),
  decline_message_to_guest: yup
    .string()
    .required(i18n.t('app.validation.message_required')),
  decline_message_to_airbnb: yup
    .string()
    .required(i18n.t('app.validation.message_required')),
});

export type AlterationViewState =
  | 'actions'
  | 'declineForm'
  | 'confirmAccept'
  | 'declined';

interface Props {
  onClose?: () => void;
  threadId: string | number;
}

export default function useAlterationRequestContainer({
  onClose,
  threadId,
}: Props) {
  const [viewState, setViewState] = useState<AlterationViewState>('actions');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(declineSchema) as any,
    defaultValues: {
      reason: '',
      decline_message_to_guest: '',
      decline_message_to_airbnb: '',
    },
  });

  const resetState = () => {
    reset();
    setViewState('actions');
    onClose?.();
  };

  // Accept pressed → go to confirm screen
  const handleAcceptPress = () => {
    setViewState('confirmAccept');
  };

  // Confirm & Accept → call API
  const handleConfirmAccept = async () => {
    try {
      setIsLoading(true);
      const res = await alterationRequestRespondApi({
        thread_id: threadId,
        accept: true,
        reason: null,
        decline_message_to_guest: null,
        decline_message_to_airbnb: null,
      });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_DETAIL] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_LIST] });
      Toast.show({
        type: 'success',
        text1: res?.message || i18n.t('app.alteration_modal.accepted_success'),
      });
      resetState();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: i18n.t('app.alteration_modal.action_failed'),
        text2: error?.message || i18n.t('common.toast.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Decline pressed → go to form
  const handleDeclineClick = () => {
    setViewState('declineForm');
  };

  const handleBackToActions = () => {
    setViewState('actions');
    reset();
  };

  // Back to chat from declined result screen
  const handleBackToChat = () => {
    resetState();
  };

  const onSubmitDecline = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await alterationRequestRespondApi({
        thread_id: threadId,
        accept: false,
        reason: data.reason,
        decline_message_to_guest: data.decline_message_to_guest,
        decline_message_to_airbnb: data.decline_message_to_airbnb,
      });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_DETAIL] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_LIST] });
      Toast.show({
        type: 'success',
        text1: res?.message || i18n.t('app.alteration_modal.declined_success'),
      });
      setViewState('declined');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: i18n.t('app.alteration_modal.action_failed'),
        text2: error?.message || i18n.t('common.toast.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewState,
    control,
    errors,
    isLoading,
    handleAcceptPress,
    handleConfirmAccept,
    handleDeclineClick,
    handleBackToActions,
    handleBackToChat,
    handleSubmitDecline: handleSubmit(onSubmitDecline),
  };
}
