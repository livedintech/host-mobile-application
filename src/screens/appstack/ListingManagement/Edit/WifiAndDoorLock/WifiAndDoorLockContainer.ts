import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import { useCallback } from 'react';

import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { editListingApi, getTTLOCKSApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import useListingExport from '@/hooks/useListingExport';

export const wifiAndDoorLockSchema = yup.object().shape({
    wifi_username: yup.string().required(i18n.t('app.validation.wifi_username_required')),
    wifi_password: yup.string().required(i18n.t('app.validation.wifi_password_required')),
    door_lock_code: yup.string().optional(),
});

export type WifiAndDoorLockFormValues = yup.InferType<typeof wifiAndDoorLockSchema>;

export default function useWifiAndDoorLockContainer() {
    const { params } = useRoute<any>();
    const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
    const { user } = useAuthStore();

    const listing = params?.paramData?.listing;

    // ── Export ────────────────────────────────────────────────────────────────
    const {
        bottomSheetVisible,
        setBottomSheetVisible,
        handleExport,
        handleExportSubmit,
        handleOtaSubmit,
        otaControl,
        otaErrors,
        listingOptions,
        isPendingExporting,
        refetchListingOptions: refetchChannelsUser,
    } = useListingExport();

    // ── Main Form ─────────────────────────────────────────────────────────────
    const { control, handleSubmit, formState: { errors } } = useForm<WifiAndDoorLockFormValues>({
        resolver: yupResolver(wifiAndDoorLockSchema) as any,
        defaultValues: {
            wifi_username: listing?.wifi_network ?? '',
            wifi_password: listing?.wifi_password ?? '',
            door_lock_code: listing?.door_lock_code ? String(listing.door_lock_code) : '',
        },
    });

    // ── Lock Options ──────────────────────────────────────────────────────────
    const { data: rawTTLocks = [], refetch: refetchTTLocks, isRefetching: isRefetchingTTLocks } = useQuery({
        queryKey: [STORAGE_CONST.TT_LOCKS],
        queryFn: getTTLOCKSApi,
    });

    const lockOptions = rawTTLocks.map((lock: any) => ({
        label: lock.alias,
        value: String(lock.lock_id),
    }));

    // ── Refetch on screen focus & pull to refresh ───────────────────────────────
    const onRefresh = useCallback(() => {
        refetchTTLocks();
        refetchChannelsUser();
    }, [refetchTTLocks, refetchChannelsUser]);

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [onRefresh]),
    );

    // ── Payload builder ───────────────────────────────────────────────────────
    const buildPayload = (data: WifiAndDoorLockFormValues) => ({
        user_id: String(user?.id),
        channel_id,
        listing_id: String(listing_id),
        save_and_exit: 1,
        listing: {
            name: propertyDetail?.name || i18n.t('common.new_listing'),
            wifi_network: data.wifi_username,
            wifi_password: data.wifi_password,
            door_lock_code: String(data.door_lock_code),
        },
    });

    // ── Mutation ──────────────────────────────────────────────────────────────
    const { mutate: updateDetails, isPending: isUpdating } = useMutation({
        mutationFn: editListingApi,
        onSuccess: ({ message }: any) => {
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
            });
            Toast.show({ type: 'success', text1: message || i18n.t('common.toast.updated') });
            goBack();
        },
        onError: (err: any) =>
            Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

    const onSaveExit = (data: WifiAndDoorLockFormValues) => {
        updateDetails(buildPayload(data) as any);
    };

    const handleSmartLockPress = () => {
        navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS);
    };

    return {
        control,
        errors,
        handleSubmit,
        onSaveExit,
        isLoading: isUpdating,
        lockOptions,
        handleSmartLockPress,
        // ✅ Export
        handleExport,
        handleExportSubmit,
        bottomSheetVisible,
        setBottomSheetVisible,
        otaControl,
        otaErrors,
        handleOtaSubmit,
        listingOptions,
        isPendingExporting,
        // ✅ Refresh
        onRefresh,
        isRefetching: isRefetchingTTLocks,
    };
}