import i18n from '@/locales/i18n/i18n';
// useAIDynamicPricingContainer.ts
import { useState } from 'react';
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

// ── Container ─────────────────────────────────────────────────────────────────
export default function useAIDynamicPricingContainer() {
  const { params } = useRoute<any>();
  const { listing_id, channel_id, listing: propertyDetail, updateListing } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent

  // ── States ────────────────────────────────────────────────────────────────
  const [selectedMode, setSelectedMode] = useState<'conservative' | 'aggressive'>(
    listing?.ai_pricing_mode ?? propertyDetail?.ai_pricing_mode ?? 'conservative',
  );

  const [manualOverride, setManualOverride] = useState<boolean>(
    listing?.manual_price_override === 1 ||
    listing?.manual_price_override === true ||
    propertyDetail?.manual_price_override === true ||
    false,
  );

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                  propertyDetail?.name || 'New Listing',
      ai_pricing_mode:       selectedMode,       // 🆕 NEW
      manual_price_override: manualOverride,     // 🆕 NEW (boolean)
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
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.updated') });
      goBack();
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const onSave = (isSaveAndExit: boolean = false) => {
    updateListing({
      ai_pricing_mode:       selectedMode,
      manual_price_override: manualOverride,
    });

    if (isEdit) {
      updateDetails(buildPayload(isSaveAndExit) as any);
    } else {
      createDetails(buildPayload(isSaveAndExit) as any, {
        onSuccess: (res: any) => {
          queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
          Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.saved') });

          if (isSaveAndExit) {
            resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
          } else {
            navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD);
          }
        },
      });
    }
  };

  return {
    selectedMode,
    setSelectedMode,
    manualOverride,
    setManualOverride,
    onSave,
    isLoading: isCreating || isUpdating,
    isEdit
  };
}