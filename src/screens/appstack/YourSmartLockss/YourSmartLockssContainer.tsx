import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getDropdownListingApi, GetSmartLockListApi } from '@/services/smartLockApi';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';

export default function useYourSmartLockssContainer() {

    const { control, formState: { errors } } = useForm({
        defaultValues: {
            lock_1_listing: '2',
            lock_2_listing: '',
        },
    });

    const LISTING_OPTIONS = [
        { label: 'Al Riyadh Apartment', value: '2' },
        { label: 'Al Hammd Villa', value: '3' },
    ];

    const getBatteryColor = (level: number) => {
        if (level > 80) return '#00A699';
        if (level > 20) return '#FBC02D';
        return '#FF5252';
    };

    // Dropdown Listing
    const { data: dropdownOption = [], isLoading: isLoadingDropdownOption } = useQuery({
        queryKey: [STORAGE_CONST.GET_SMARTLOCK_DROPDOWN_LIST],
        queryFn: getDropdownListingApi,
    });

    console.log('dropdownOption', dropdownOption);

    // Listing
    const { data: citiesgetSmartlockListData = [], isLoading: isLoading, refetch } = useQuery({
        queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
        queryFn: GetSmartLockListApi,
    });
    const handleViewLogs = () => {
        navigate(NavigationRoutes.APP_STACK.SMART_LOCK_ACTIVITY_LOG)
    }
    const goToScreen = (lock_id: number) =>{
        navigate(NavigationRoutes.APP_STACK.ACTIVE_CODES,{lock_id})
    }

    return {
        locksData: citiesgetSmartlockListData,
        LISTING_OPTIONS,
        control,
        errors,
        getBatteryColor,
        handleConnectNewAccount: () => navigate('TTLockCredentials'),
        handleViewLogs,
        isLoading,
        refetch,
        goToScreen
    };
}