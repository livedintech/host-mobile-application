import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  getAICategoryInstructions,
  saveAICategoryInstructions,
  getListings,
} from '@/services/AiAutoFeatureApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const CategoryInstructionsContainer = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { category_id, title } = route.params;

  const { data: listings = [] } = useQuery({
    queryKey: ['userListings'],
    queryFn: getListings,
  });

  const listingOptions =
    listings?.map((item: any) => ({
      label: item?.name,
      value: String(item?.id),
    })) || [];

  const { data: existingData, isLoading } = useQuery({
    queryKey: ['categoryInstructions', category_id],
    queryFn: () => getAICategoryInstructions(user!.id, category_id),
    enabled: !!category_id && !!user?.id,
  });

  const { mutate: saveInstructions, isPending: isSaving } = useMutation({
    mutationFn: saveAICategoryInstructions,
    onSuccess: (res: any) => {
      const backendMessage = res?.message || t('app.category_instructions.toast_success');
      Toast.show({
        type: 'success',
      text1: backendMessage,
      });
      queryClient.invalidateQueries({
        queryKey: ['categoryInstructions', category_id],
      });
      // navigation.goBack();
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        // text1: t('app.category_instructions.toast_error'),
        text1: err,
      });
    },
  });

  const onSave = (formData: any) => {
    // Reconstruct fields to perfectly match the specific matrix arrays your backend needs
    const payload = {
      user_id: user!.id,
      category_id: category_id,
      instructions: formData.sections.map((s: any) => s.instruction || ''),
      listing_ids: formData.sections.map((s: any) => s.properties.map(Number)),
      apply_to_all_listings: formData.sections.map((s: any) => !!s.apply_to_all_listings),
    };

    saveInstructions(payload);
  };

  const isAddMoreDisabled = !existingData || existingData.length === 0;

  return {
    title,
    listingOptions,
    existingData,
    isLoading,
    onSave,
    isSaving,
    navigation,
    t,
    isAddMoreDisabled,
  };
};

export default CategoryInstructionsContainer;