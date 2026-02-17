import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { getSmartLockActiveCodesApi } from '@/services/smartLockApi';

export type CodeTab = 'Permanent' | 'One-time' | 'Timed';

type ApiPasscodeItem = {
  keyboard_pwd_id: number;
  name: string | null;
  nick_name: string | null;
  passcode: string;
  start_at: string | null;
  end_at: string | null;
  status:string
};

export default function useActiveCodesContainer() {
  const route = useRoute();
  const params = route?.params as { lock_id?: number };
  const lock_id = params?.lock_id;

  // ======================
  // API CALL
  // ======================
  const { data, isLoading , refetch} = useQuery({
    queryKey: [STORAGE_CONST.GET_ACTIVE_CODES, lock_id],
    queryFn: () =>
      getSmartLockActiveCodesApi({ lockId: lock_id! }),
    enabled: !!lock_id,
  });

  // ======================
  // STATE
  // ======================
  const [activeTab, setActiveTab] = useState<CodeTab>('Permanent');

  // ======================
  // DATA MAPPING
  // ======================
  const apiTabs = data?.data?.tabs;

  const mapItem = (item: ApiPasscodeItem) => ({
    id: String(item.keyboard_pwd_id),
    title: item.name || item.nick_name || 'Passcode',
    passcode: item.passcode,
    date:
      item.start_at && item.end_at
        ? `${item.start_at.split(' ')[0]} - ${item.end_at.split(' ')[0]}`
        : '-',
    startTime: item.start_at?.split(' ')[1] || '-',
    endTime: item.end_at?.split(' ')[1] || '-',
    status: item.status?.split(' ')[1] || '-',

  });

  const codesData: Record<CodeTab, any[]> = {
    Permanent: apiTabs?.permanent?.map(mapItem) || [],
    'One-time': apiTabs?.one_time?.map(mapItem) || [],
    Timed: apiTabs?.timed?.map(mapItem) || [],
  };

  // ======================
  // ACTIONS
  // ======================
  const handleGenerateNew = () => {
    navigate(NavigationRoutes.APP_STACK.GENERATE_PASSCODE, {
      type: activeTab,
      lock_id
    });
  };

  // ======================
  // RETURN
  // ======================

  const handleViewLogs = () => {
    navigate(NavigationRoutes.APP_STACK.SMART_LOCK_ACTIVITY_LOG,{lock_id})

  }
  return {
    activeTab,
    setActiveTab,
    currentData: codesData[activeTab],
    handleGenerateNew,
    isLoading,
    handleViewLogs,
    refetch
  };
}
