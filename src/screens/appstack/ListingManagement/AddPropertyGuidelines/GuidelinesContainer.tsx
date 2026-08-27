import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, getTTLOCKSApi, getTTLOCKSListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import useListingExport from '@/hooks/useListingExport';

export default function useGuidelinesContainer() {
  const { params } = useRoute<any>();
  const hideWifiFields = params?.hideWifiFields;
  const guidelinesSection: 'arrival' | 'guidelines' | undefined = params?.guidelinesSection;
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isPendingExporting,
  } = useListingExport();

  // ── Schema ────────────────────────────────────────────────────────────────
  const guidelinesSchema = yup.object().shape({
    arrival_guide: guidelinesSection === 'guidelines'
      ? yup.string()
      : yup.string().required(i18n.t('app.validation.arrival_guide_required')),
    property_rules: guidelinesSection === 'arrival'
      ? yup.string()
      : yup.string().required(i18n.t('app.validation.property_rules_required')),
    wifi_username: hideWifiFields ? yup.string() : yup.string().required(i18n.t('app.validation.wifi_username_required')),
    wifi_password: hideWifiFields ? yup.string() : yup.string().required(i18n.t('app.validation.wifi_password_required')),
    door_lock_code: hideWifiFields ? yup.string() : yup.string().optional()
  });

  type GuidelinesFormValues = yup.InferType<typeof guidelinesSchema>;  

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<GuidelinesFormValues>({
      resolver: yupResolver(guidelinesSchema) as any,
      defaultValues: {
        arrival_guide: listing?.arrival_guide ?? '',
        property_rules: listing?.house_manual || listing?.house_manul || listing?.house_rule || '',
        wifi_username: listing?.wifi_network ?? '',
        wifi_password: listing?.wifi_password ?? '',
        door_lock_code: listing?.door_lock_code ?? '',
      },
    });

  const arrivalGuideLength = (watch('arrival_guide') || '').length;
  const houseRulesLength = (watch('property_rules') || '').length;
  // ── Lock Options ──────────────────────────────────────────────────────────
  const { data: rawTTLocks = [], isLoading: isLoadingTTLocks } = useQuery({
    queryKey: [STORAGE_CONST.TT_LOCKS],
    queryFn: getTTLOCKSListingApi,
  });

  const lockOptions = rawTTLocks.map((lock: any) => ({
    label: lock.alias,
    value: String(lock.lock_id),
  }));

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: GuidelinesFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    channel_id,
    listing_id: String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || 'New Property',
      arrival_guide: data.arrival_guide,
      house_rule: data.property_rules,
      wifi_network: data.wifi_username,
      wifi_password: data.wifi_password,
      door_lock_code: String(data.door_lock_code),
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide: data.arrival_guide,
      house_rule: data.property_rules,
      wifi_network: data.wifi_username,
      wifi_password: data.wifi_password,
      door_lock_code: data.door_lock_code,
    });
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.CHECKOUT_INSTRUCTION),
    });
  };

  const onSaveExit = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide: data.arrival_guide,
      house_rule: data.property_rules,
      wifi_network: data.wifi_username,
      wifi_password: data.wifi_password,
      door_lock_code: data.door_lock_code,
    });
    if (isEdit) {
      updateDetails(buildPayload(data, true) as any);
    } else {
      createDetails(buildPayload(data, true) as any, {
        onSuccess: () => resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any),
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
    arrivalGuideLength,
    houseRulesLength,
    isEdit,
    hideWifiFields,
    guidelinesSection,
    lockOptions,
    // ✅ Export
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  };
}