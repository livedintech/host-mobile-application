import { useState } from 'react';
import i18n from '@/locales/i18n/i18n';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { getSmartLockActiveCodesApi, getSmartLockActivityLogsApi } from '@/services/smartLockApi';

interface LogEntry {
    id: string;
    lockName: string;
    timestamp: string;
    action: string;
}

export default function useSmartLockActivityLogContainer() {
      const route = useRoute();
      const params = route?.params as { lock_id?: number };
      const lock_id = params?.lock_id;

   // ======================
  // API CALL
  // ======================
  const { data, isLoading,refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_SMARTLOCK_ACTIVITY_LOG, lock_id],
    queryFn: () =>
      getSmartLockActivityLogsApi({ lockId: lock_id! }),
    enabled: !!lock_id,
  });
      const logs = data?.data?.items?.map((item: any) => ({
        id: item.raw.recordId.toString(),        // unique id
        lockName: item.title,                    // lock name
        action: item.subtitle,                   // action description
    })) || [];

    const handleRefresh = async () => {
        await refetch();
        Toast.show({
            type: 'success',
            text1: i18n.t('common.toast.logs_updated'),
            position: 'top'
        });
    };

    return {
        logs,
        handleRefresh,
        isLoading: isLoading
    };
}