// useGuidelinesContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, getTTLOCKSApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';



// ── Container ─────────────────────────────────────────────────────────────────
export default function useGuidelinesContainer() {
  const { params } = useRoute<any>();
  const hideWifiFields = params?.hideWifiFields; // Flag pakrein
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent


  // ── Schema ────────────────────────────────────────────────────────────────────
 const guidelinesSchema = yup.object().shape({
  arrival_guide:         yup.string().required('Arrival guide is required'),
  property_rules:        yup.string().required('Property rules are required'),
  checkout_instructions: yup.string().required('Check-out instructions are required'),
 wifi_username: hideWifiFields ? yup.string() : yup.string().required('Wifi username is required'),
    wifi_password: hideWifiFields ? yup.string() : yup.string().required('Wifi password is required'),
    door_lock_code: hideWifiFields ? yup.string() : yup.string().required('Please select a door lock'),
});

 type GuidelinesFormValues = yup.InferType<typeof guidelinesSchema>;

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<GuidelinesFormValues>({
      resolver: yupResolver(guidelinesSchema) as any,
      defaultValues: {
        arrival_guide:         listing?.arrival_guide         ?? propertyDetail?.arrival_guide         ?? '',
        // swagger key: house_rule — form field name: property_rules (label match)
        property_rules:        listing?.house_rule            ?? propertyDetail?.house_rule            ?? '',
        // swagger key: cleaning_instructions — form field name: checkout_instructions
        checkout_instructions: listing?.cleaning_instructions ?? propertyDetail?.cleaning_instructions ?? '',
        // swagger key: wifi_network — form field name: wifi_username
        wifi_username:         listing?.wifi_network          ?? propertyDetail?.wifi_network          ?? '',
        wifi_password:         listing?.wifi_password         ?? propertyDetail?.wifi_password         ?? '',
        door_lock_code:        listing?.door_lock_code        ?? propertyDetail?.door_lock_code        ?? '', // 🆕
      },
    });

  const arrivalGuideLength         = (watch('arrival_guide') || '').length;
  const houseRulesLength           = (watch('property_rules') || '').length;
  const checkoutInstructionsLength = (watch('checkout_instructions') || '').length;


   // ── Lock Options ──────────────────────────────────────────────────────────

    const { data: rawTTLocks = [], isLoading: isLoadingTTLocks } = useQuery({
        queryKey: [STORAGE_CONST.TT_LOCKS],
        queryFn: getTTLOCKSApi,
    });
    const lockOptions = rawTTLocks.map((lock: any) => ({
        label: lock.alias,
        value: String(lock.lock_id),
    }));

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: GuidelinesFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                  propertyDetail?.name || 'New Listing',
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,        // ✅ swagger key
      cleaning_instructions: data.checkout_instructions, // ✅ swagger key
      wifi_network:          data.wifi_username,         // ✅ swagger key
      wifi_password:         data.wifi_password,         // ✅ swagger key
      door_lock_code: String(data.door_lock_code),    // 🆕 NEW — backend ko batana hoga
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,
      cleaning_instructions: data.checkout_instructions,
      wifi_network:          data.wifi_username,
      wifi_password:         data.wifi_password,
      door_lock_code:        data.door_lock_code,
    });

    // onNext — always create flow (edit flow mein is screen pe aate hi nahi)
    createDetails(buildPayload(data, false) as any, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES),
    });
  };

  const onSaveExit = (data: GuidelinesFormValues) => {
    updateListing({
      arrival_guide:         data.arrival_guide,
      house_rule:            data.property_rules,
      cleaning_instructions: data.checkout_instructions,
      wifi_network:          data.wifi_username,
      wifi_password:         data.wifi_password,
      door_lock_code:        data.door_lock_code,
    });

    if (isEdit) {
      updateDetails(buildPayload(data, true) as any);
    } else {
      createDetails(buildPayload(data, true) as any, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
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
    checkoutInstructionsLength,
    isEdit,
    hideWifiFields,
    lockOptions
  };
}