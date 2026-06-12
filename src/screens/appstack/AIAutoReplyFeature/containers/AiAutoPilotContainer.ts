import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import {
  updateAIAutopilot,
  getListings,
  getAIAutopilotSettings,
} from '@/services/AiAutoFeatureApi';

import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { ListingOption } from '@/types/api/AnalyticsTypes';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

type FormValues = {
  properties: string[];
  waitTrigger: string;
};

const AiAutoPilotContainer = () => {
  const [isAutopilotActive, setIsAutopilotActive] = useState(true);
  const [autoCreateAll, setAutoCreateAll] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { user } = useAuthStore();

  const waitTriggerData = [
    { label: t('app.autopilot.wait_options.instant'), value: '0' },
    { label: t('app.autopilot.wait_options.1min'), value: '1' },
    { label: t('app.autopilot.wait_options.5min'), value: '5' },
    { label: t('app.autopilot.wait_options.10min'), value: '10' },
    { label: t('app.autopilot.wait_options.15min'), value: '15' },
  ];

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      properties: [],
      waitTrigger: '1',
    },
    mode: 'onSubmit',
  });

  // =========================
  // GET LISTINGS
  // =========================
  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getListings,
  });

  const listingOptions =
    listings?.map((item: ListingOption) => ({
      label: item?.name,
      value: String(item?.id),
    })) || [];

  // =========================
  // GET AUTOPILOT SETTINGS
  // =========================
  const {
    data: autopilotData,
    isRefetching,
    refetch: refetchAutopilot,
  } = useQuery({
    queryKey: ['ai-autopilot-settings', user?.id],
    queryFn: () => getAIAutopilotSettings(user!.id),
    enabled: !!user?.id,
  });

  // =========================
  // SYNC API → UI
  // =========================
  useEffect(() => {
    if (autopilotData) {
      setIsAutopilotActive(autopilotData?.status ?? true);
      setAutoCreateAll(autopilotData?.auto_create ?? false);

      reset({
        properties: autopilotData?.listings?.map(String) || [],
        waitTrigger: String(autopilotData?.wait_trigger ?? '1'),
      });
    }
  }, [autopilotData]);

  // =========================
  // UPDATE AUTOPILOT (PRIMARY FORM BUTTON)
  // =========================
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      return await updateAIAutopilot(payload);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ['ai-autopilot-settings', user?.id],
      });
      Toast.show({
        type: 'success',
        text1: response?.message || 'AI Autopilot updated successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Something went wrong',
      });
    },
  });

  // =========================
  // INSTANT MUTATION (FOR INDIVIDUAL SWITCH TOGGLE)
  // =========================
  const { mutate: updateSwitchStatus, isPending: isSwitchUpdating } = useMutation({
    mutationFn: async (payload: any) => {
      return await updateAIAutopilot(payload);
    },
    onMutate: async (variables) => {
      // Optimistically flip the switch status UI immediately
      setIsAutopilotActive(variables.status);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ['ai-autopilot-settings', user?.id],
      });
      Toast.show({
        type: 'success',
        text1: response?.message || 'Status updated successfully',
      });
    },
    onError: (error: any, variables) => {
      // Fallback switch state to original if api request breaks
      setIsAutopilotActive(!variables.status);
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to update status',
      });
    },
  });

  // const handleSwitchToggle = (nextStatus: boolean) => {
  //   const currentFormValues = getValues();
    
  //   const payload = {
  //     user_id: user?.id,
  //     status: nextStatus,
  //     listings: currentFormValues.properties?.map(Number),
  //     auto_create: autoCreateAll,
  //     wait_trigger: Number(currentFormValues.waitTrigger),
  //   };

  //   updateSwitchStatus(payload);
  // };


  const handleSwitchToggle = (nextStatus: boolean) => {
    const currentFormValues = getValues();
    const hasSelectedProperties = currentFormValues.properties && currentFormValues.properties.length > 0;
    console.log("nextStatus",nextStatus);
    console.log("hasSelectedProperties",hasSelectedProperties)

    // VALIDATION: If turning the switch ON, ensure at least one listing is selected
    if (nextStatus && !hasSelectedProperties) {
      Toast.show({
        type: 'error',
        text1: t('app.autopilot.error_property_required') || 'Please select at least one listing first.',
      });
      return; // Stop execution; toggle will not open
    }
    
    const payload = {
      user_id: user?.id,
      status: nextStatus,
      listings: currentFormValues.properties?.map(Number),
      auto_create: autoCreateAll,
      wait_trigger: Number(currentFormValues.waitTrigger),
    };

    updateSwitchStatus(payload);
  };

  // =========================
  // SUBMIT (FORM)
  // =========================
  const onSubmit = (values: FormValues) => {
    const payload = {
      user_id: user?.id,
      status: isAutopilotActive,
      listings: values?.properties?.map(Number),
      auto_create: autoCreateAll,
      wait_trigger: Number(values?.waitTrigger),
    };

    mutate(payload);
  };

  return {
    // state
    isAutopilotActive,
    handleSwitchToggle,
    isSwitchUpdating,
    autoCreateAll,
    setAutoCreateAll,

    // form
    control,
    errors,
    handleSubmit,
    reset,

    // data
    listingOptions,
    waitTriggerData,
    
    // actions
    onSubmit,

    // loading
    isPending,
    isRefetching,
    refetchAutopilot,
  };
};

export default AiAutoPilotContainer;