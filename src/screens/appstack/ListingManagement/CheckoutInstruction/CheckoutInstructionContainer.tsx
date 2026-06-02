import i18n from '@/locales/i18n/i18n';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, createListingExportApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

export type TaskKey =
  | 'return_keys'
  | 'turn_things_off'
  | 'throw_trash'
  | 'lock_up'
  | 'gather_towels'
  | 'additional_requests';

export type TaskState = {
  checked: boolean;
  detail: string;
};

export type TasksState = Record<TaskKey, TaskState>;

export const TASK_KEYS: TaskKey[] = [
  'return_keys',
  'turn_things_off',
  'throw_trash',
  'lock_up',
  'gather_towels',
  'additional_requests',
];


const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };


export default function useCheckoutInstructionContainer() {
  const { params } = useRoute<any>();
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  const checkoutInstructions = listing?.checkout_instructions;
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [tasks, setTasks] = useState<TasksState>({
    return_keys: {
      checked: checkoutInstructions?.return_keys?.is_present ?? false,
      detail: checkoutInstructions?.return_keys?.task_detail ?? '',
    },
    turn_things_off: {
      checked: checkoutInstructions?.turn_things_off?.is_present ?? false,
      detail: checkoutInstructions?.turn_things_off?.task_detail ?? '',
    },
    throw_trash: {
      checked: checkoutInstructions?.throw_trash?.is_present ?? false,
      detail: checkoutInstructions?.throw_trash?.task_detail ?? '',
    },
    lock_up: {
      checked: checkoutInstructions?.lock_up?.is_present ?? false,
      detail: checkoutInstructions?.lock_up?.task_detail ?? '',
    },
    gather_towels: {
      checked: checkoutInstructions?.gather_towels?.is_present ?? false,
      detail: checkoutInstructions?.gather_towels?.task_detail ?? '',
    },
    additional_requests: {
      checked: checkoutInstructions?.additional_requests?.is_present ?? false,
      detail: checkoutInstructions?.additional_requests?.task_detail ?? '',
    },
  });

  const setTaskChecked = (key: TaskKey, checked: boolean) => {
    setTasks(prev => ({ ...prev, [key]: { ...prev[key], checked } }));
  };

  const setTaskDetail = (key: TaskKey, detail: string) => {
    setTasks(prev => ({ ...prev, [key]: { ...prev[key], detail } }));
  };

  const buildPayload = (isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Listing',
      checkout_instructions: TASK_KEYS.reduce(
        (acc, key) => {
          acc[key] = tasks[key].checked
            ? { is_present: true, task_detail: tasks[key].detail }
            : { is_present: false };
          return acc;
        },
        {} as Record<TaskKey, any>,
      ),
    },
  });

  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({
        type: 'error',
        text1: err.message || i18n.t('common.toast.something_went_wrong'),
      }),
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
      Toast.show({
        type: 'error',
        text1: err.message || i18n.t('common.toast.something_went_wrong'),
      }),
  });

  const onNext = () => {
    createDetails(buildPayload(false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES),
    });
  };

  const onSaveExit = () => {
    if (isEdit) {
      updateDetails(buildPayload(true) as any);
    } else {
      createDetails(buildPayload(true) as any, {
        onSuccess: () =>
          resetToRoutes([
            { name: NavigationRoutes.APP_STACK.ROOT_STACK },
            { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS },
          ] as any),
      });
    }
  };

  // 


    // ── OTA Form ──────────────────────────────────────────────────────────────
  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: otaWatch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = otaWatch('ota_account');

  // ── OTA Accounts ──────────────────────────────────────────────────────────
  const { data: response,isLoading } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn:  () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled:  !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: `Airbnb - ${item?.id} - ${item?.channel_name}`,
      value: item.ch_channel_id,
    }));

  // ── Export Mutation ───────────────────────────────────────────────────────
  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingExportPayloadType>({
      mutationFn: createListingExportApi,
      onSuccess: ({ message }: any) => {
        setBottomSheetVisible(false);
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.exported') });
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const handleExport = () => setBottomSheetVisible(true);

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    });
  };

  return {
    tasks,
    setTaskChecked,
    setTaskDetail,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    isEdit,
     handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting
  };
}
