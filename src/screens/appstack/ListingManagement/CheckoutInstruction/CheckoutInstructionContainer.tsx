import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

const checkoutSchema = yup.object().shape({
  towels: yup.string().required(i18n.t('app.validation.towels_required')),
  trash: yup.string().required(i18n.t('app.validation.trash_required')),
  turnOff: yup.string().required(i18n.t('app.validation.turn_off_required')),
  lockUp: yup.string().required(i18n.t('app.validation.lock_up_required')),
  keys: yup.string().required(i18n.t('app.validation.keys_required')),
  additional: yup.string().required(i18n.t('app.validation.additional_required')),
});

type CheckoutFormValues = yup.InferType<typeof checkoutSchema>;

const buildCheckoutInstructions = (data: CheckoutFormValues) =>
  [data.towels, data.trash, data.turnOff, data.lockUp, data.keys, data.additional]
    .filter(Boolean)
    .join('\n');

export default function useCheckoutInstructionContainer() {
  const { params } = useRoute<any>();
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const { control, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: yupResolver(checkoutSchema) as any,
    defaultValues: {
      towels: '',
      trash: '',
      turnOff: '',
      lockUp: '',
      keys: '',
      additional: listing?.cleaning_instructions ?? '',
    },
  });

  const buildPayload = (data: CheckoutFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      cleaning_instructions: buildCheckoutInstructions(data),
    },
  });

  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: message || i18n.t('common.toast.updated') });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const onNext = (data: CheckoutFormValues) => {
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES),
    });
  };

  const onSaveExit = (data: CheckoutFormValues) => {
    if (isEdit) {
      updateDetails(buildPayload(data, true) as any);
    } else {
      createDetails(buildPayload(data, true) as any, {
        onSuccess: () =>
          resetToRoutes([
            { name: NavigationRoutes.APP_STACK.ROOT_STACK },
            { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS },
          ] as any),
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    isEdit,
  };
}
