import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { getAIMessageCategories, updateAIMessageCategoryStatus } from '@/services/AiAutoFeatureApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const MessageCategoriesContainer = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null); // Track specific ID loading status

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['messageCategories', user?.id],
    queryFn: () => getAIMessageCategories(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  const { mutate: updateCategoryStatus } = useMutation({
    mutationFn: async (payload: { id: number; status: boolean }) => {
      return updateAIMessageCategoryStatus({ id: payload.id, status: payload.status });
    },
    onMutate: async (variables) => {
      setUpdatingId(variables.id); // Set active loader inside the corresponding switch instance

      // Optimistically switch toggle position instantly on click
      setCategories(prev =>
        prev.map(item =>
          item.id === variables.id ? { ...item, status: variables.status } : item
        )
      );
    },
    onSuccess: (resData: any) => {
      const backendMessage = resData?.message || t('app.categories.toast_success');
      Toast.show({ 
        type: 'success', 
        text1: backendMessage, 
      });
      queryClient.invalidateQueries({ queryKey: ['messageCategories'] });
    },
    onError: (error: any, variables) => {
      // Revert position on api failure
      setCategories(prev =>
        prev.map(item =>
          item.id === variables.id ? { ...item, status: !variables.status } : item
        )
      );
      Toast.show({
        type: 'error',
        text1: error?.message || 'Could not update status',
      });
    },
    onSettled: () => {
      setUpdatingId(null); // Stop internal switch active loader animation state
    }
  });

  const toggleSwitch = (id: number, nextStatus: boolean) => {
    updateCategoryStatus({ id, status: nextStatus });
  };

  return {
    categories,
    toggleSwitch,
    isLoading,
    isFetching,
    refetch,
    updatingId, // Expose to view
    navigation,
  };
};

export default MessageCategoriesContainer;