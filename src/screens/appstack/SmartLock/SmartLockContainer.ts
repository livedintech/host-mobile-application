import { useState } from 'react';
import { navigate } from '@/services/navigationService';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useSmartLockContainer() {

    const handleConnectAccount = async () => {
        navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS)
    };

    return {
        handleConnectAccount,
    };
}