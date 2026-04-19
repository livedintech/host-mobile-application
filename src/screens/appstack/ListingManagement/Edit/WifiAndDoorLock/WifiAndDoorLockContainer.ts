// useWifiAndDoorLockContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';

import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { editListingApi, getAmenitiesApi, getTTLOCKSApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';

// ── Schema ────────────────────────────────────────────────────────────────────
export const wifiAndDoorLockSchema = yup.object().shape({
    wifi_username: yup.string().required('Wifi username is required'),
    wifi_password: yup.string().required('Wifi password is required'),
    door_lock_code: yup.string().required('Door lock code is required'),
});

export type WifiAndDoorLockFormValues = yup.InferType<typeof wifiAndDoorLockSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function useWifiAndDoorLockContainer() {
    const { params } = useRoute<any>();
    const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
    const { user } = useAuthStore();

    const listing = params?.paramData?.listing;

    // ── Form ──────────────────────────────────────────────────────────────────
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<WifiAndDoorLockFormValues>({
        resolver: yupResolver(wifiAndDoorLockSchema) as any,
        defaultValues: {
            wifi_username: listing?.wifi_network ?? '',
            wifi_password: listing?.wifi_password ?? '',
            door_lock_code: listing?.door_lock_code ? String(listing.door_lock_code) : '',
        },
    });

    // ── Lock Options ──────────────────────────────────────────────────────────

    const { data: rawTTLocks = [], isLoading: isLoadingTTLocks } = useQuery({
        queryKey: [STORAGE_CONST.TT_LOCKS],
        queryFn: getTTLOCKSApi,
    });
    const lockOptions = rawTTLocks.map((lock: any) => ({
        label: lock.alias,
        value: String(lock.lock_id),
    }));



    // ── Payload builder ───────────────────────────────────────────────────────
    const buildPayload = (data: WifiAndDoorLockFormValues) => ({
        user_id: String(user?.id),
        channel_id,
        listing_id: String(listing_id),
        save_and_exit: 1,
        listing: {
            name: propertyDetail?.name || 'New Listing',
            wifi_network: data.wifi_username,   // ✅ swagger key
            wifi_password: data.wifi_password,
            door_lock_code: String(data.door_lock_code),
        },
    });

    // ── Mutation — edit only ──────────────────────────────────────────────────
    const { mutate: updateDetails, isPending: isUpdating } = useMutation({
        mutationFn: editListingApi,
        onSuccess: ({ message }: any) => {
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
            });
            Toast.show({ type: 'success', text1: message || 'Updated successfully' });
            goBack();
        },
        onError: (err: any) =>
            Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
    });

    // ── Handler ───────────────────────────────────────────────────────────────
    const onSaveExit = (data: WifiAndDoorLockFormValues) => {
        updateDetails(buildPayload(data) as any);
    };

    const handleSmartLockPress = () => {
        // TODO: Navigate to Smart Lock / TTLock setup screen
        navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS); // ✅ update route as per your app
    };

    return {
        control,
        errors,
        handleSubmit,
        onSaveExit,
        isLoading: isUpdating,
        lockOptions,
        handleSmartLockPress,
    };
}