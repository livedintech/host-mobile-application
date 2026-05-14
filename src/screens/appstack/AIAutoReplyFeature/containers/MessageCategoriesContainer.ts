import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
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
  // Use a Ref to track IDs that have been toggled
  const changedIds = useRef<Set<number>>(new Set());

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['messageCategories', user?.id],
    queryFn: () => getAIMessageCategories(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
      changedIds.current.clear(); // Clear changes when fresh data loads
    }
  }, [data]);

  const toggleSwitch = (id: number) => {
    // Add to changed list
    if (changedIds.current.has(id)) {
      changedIds.current.delete(id); // Toggle back to original state
    } else {
      changedIds.current.add(id);
    }

    setCategories(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: !item.status } : item,
      ),
    );
  };

  const { mutate: updateCategories, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: any[]) => {
      // ONLY update items that were actually changed
      const updatePromises = payload.map(cat => 
        updateAIMessageCategoryStatus({ id: cat.id, status: cat.status })
      );
      return Promise.all(updatePromises);
    },
    onSuccess: (data: any[]) => {
      const backendMessage = data[0]?.message || t('app.categories.toast_success');
      Toast.show({ 
        type: 'success', 
        text1: backendMessage, 
      });
      queryClient.invalidateQueries({ queryKey: ['messageCategories'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Could not update status',
      });
    }
  });

  const handleSave = () => {
    // Filter categories to only include those in the changedIds set
    const itemsToUpdate = categories.filter(cat => changedIds.current.has(cat.id));
    
    if (itemsToUpdate.length === 0) {
      // If nothing changed, just go back
      navigation.goBack();
      return;
    }

    updateCategories(itemsToUpdate);
  };

  return {
    categories,
    toggleSwitch,
    isLoading,
    isFetching,
    refetch,
    handleSave,
    isUpdating,
    navigation,
  };
};

export default MessageCategoriesContainer;