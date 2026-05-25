import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { updateAIEscalationSettings, getAIEscalationSettings } from '@/services/AiAutoFeatureApi';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from 'react-i18next';

const EscalationSettingContainer = () => {
  const { t } = useTranslation();
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
        text1: t('app.escalation.toast_success_title'),
        text2: t('app.escalation.toast_success_desc'),
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: t('app.escalation.toast_error_title'),
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
      // If frustration detection is toggled off, pass back fallback value or zero out
      sentiment_level: frustrationEnabled ? parseInt(formData.sentimentInput) : 0,
      escalate_when_sentiment_below: frustrationEnabled ? parseInt(formData.sentimentInput) : 0,
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