import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';

export default function useAIDynamicPricingContainer() {
  const { params } = useRoute() as any;
  
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // --- States ---
  const [selectedMode, setSelectedMode] = useState<'conservative' | 'aggressive'>(
    listing?.ai_pricing_mode || 'conservative'
  );
  const [manualOverride, setManualOverride] = useState(
    listing?.manual_price_override === 1 || false
  );

  // ---- Mutation ----
  const { mutate: handleApi, isPending } = useMutation({
    mutationFn: isEdit ? editListingApi : createListingDetailsApi,
    onSuccess: (res: any) => {
      Toast.show({ type: 'success', text1: res?.message || 'Pricing mode saved' });
      isEdit ? goBack() : navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD); 
    },
    onError: (error: any) => Toast.show({ type: 'error', text1: error.message }),
  });

  const onSave = (isSaveAndExit: boolean = false) => {
    const payload = {
      channel_id,
      listing_id: String(listing_id || listing?.id),
      user_id: String(user?.id),
      save_and_exit: isSaveAndExit ? 1 : 0,
      listing: {
        name: propertyDetail?.name || listing?.name,
        ai_pricing_mode: selectedMode,
        manual_price_override: manualOverride ? 1 : 0,
      },
    };
    handleApi(payload as any);
  };

  return { 
    selectedMode, 
    setSelectedMode, 
    manualOverride, 
    setManualOverride, 
    onSave, 
    isLoading: isPending 
  };
}