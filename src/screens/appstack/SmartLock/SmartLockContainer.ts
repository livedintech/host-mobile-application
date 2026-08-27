import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { GetSmartLockListApi } from '@/services/smartLockApi';

export default function useSmartLockContainer() {
    const handleConnectAccount = async () => {
        navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS)
    };

    // Listing
    const { data: citiesgetSmartlockListData = [], isLoading: isLoading, refetch } = useQuery({
        queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
        queryFn: GetSmartLockListApi,
    });

    return {
        handleConnectAccount,
    };
}