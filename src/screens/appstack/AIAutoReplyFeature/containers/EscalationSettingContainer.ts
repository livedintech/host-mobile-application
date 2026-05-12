import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { updateAIEscalationSettings, getAIEscalationSettings } from '@/services/AiAutoFeatureApi';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/useAuthStore';

const EscalationSettingContainer = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [frustrationEnabled, setFrustrationEnabled] = useState(true);

  // 1. Fetch existing settings
  const { 
    data: settingsData, 
    isLoading, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['aiEscalationSettings', user?.id],
    queryFn: () => getAIEscalationSettings(user!.id),
    enabled: !!user?.id,
  });

  // 2. Sync switch state when data arrives
  useEffect(() => {
    if (settingsData) {
      setFrustrationEnabled(!!settingsData.frustration_detection);
    }
  }, [settingsData]);

  // 3. Mutation for updating
  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: updateAIEscalationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiEscalationSettings'] });
      Toast.show({
        type: 'success',
        text1: 'Settings Updated',
        text2: 'Your AI escalation rules have been saved.',
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error || 'Something went wrong',
      });
    },
  });

  const handleSave = (formData: any) => {
    const payload = {
      user_id: user!.id,
      confidence_level: parseInt(formData.confidenceInput),
      send_automatically_when_confident: parseInt(formData.confidenceInput),
      frustration_detection: frustrationEnabled,
      sentiment_level: parseInt(formData.sentimentInput),
      escalate_when_sentiment_below: parseInt(formData.sentimentInput),
    };
    saveSettings(payload);
  };

  return {
    frustrationEnabled,
    setFrustrationEnabled,
    handleSave,
    isPending,
    settingsData,
    isLoading,
    isFetching,
    refetch,
  };
};

export default EscalationSettingContainer;