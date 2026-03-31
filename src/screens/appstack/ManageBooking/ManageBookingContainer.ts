import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import {
    createChannelsUserbyId,
    getChannelsUserbyId,
} from '@/services/bookingManagementApi';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { Linking } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'Airbnb' | 'Gathern' | 'Booking.com';

interface ConnectedAccount {
    id: number;
    connection_type: Platform;
    ch_channel_id: string;
    connection_link_url?: string;
}

// ─── Platform → navigation route map ─────────────────────────────────────────

const CONNECT_ROUTE_MAP: Partial<Record<Platform, string>> = {
    Gathern: NavigationRoutes.APP_STACK.GATHREN_PMSID,
    'Booking.com': NavigationRoutes.APP_STACK.BOOKING_COM_PMSID,
};

const EXPORT_ROUTE_MAP: Partial<Record<Platform, string>> = {
    Gathern: NavigationRoutes.APP_STACK.GATHERN_IMPORT,
};

const DEFAULT_EXPORT_ROUTE = NavigationRoutes.APP_STACK.AIRBNB_IMPORT;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useManageBookingContainer() {
    const { user } = useAuthStore();

    // ── Fetch all connected accounts for this user ──
    const {
        data: response,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
        queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
        enabled: !!user?.id,
    });

    const connectedAccounts: ConnectedAccount[] = response?.data ?? [];

    // ── Create / connect a new channex account ──
    const { mutate: createChannexAccount, isPending } = useMutation({
        mutationFn: () => createChannelsUserbyId({ user_id: user!.id }),
        onSuccess: (res) => {
            const airbnbUrl = res?.data?.connection_link_url;
            if (airbnbUrl) Linking.openURL(airbnbUrl);
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_CHANNELS_USER],
            });
        },
        onError: (error: any) => {
            console.error('Create channel error:', error?.message);
            Toast.show({
                type: 'error',
                text1: 'Connection Failed',
                text2: error?.message ?? 'Something went wrong. Please try again.',
            });
        },
    });

    // ── Handle connect button press for any platform ──
    // Multi-account: allows connecting additional accounts even if one already exists.
    const handleConnect = (platform: Platform) => {
        if (platform === 'Airbnb') {
            // Airbnb uses Channex OAuth link — always allow a new connection
            createChannexAccount();
            return;
        }

        const route = CONNECT_ROUTE_MAP[platform];
        if (route) {
            navigate(route);
        }
    };

    // ── Navigate to listing/export screen ──
    const goToListing = (item: ConnectedAccount) => {
        const route = EXPORT_ROUTE_MAP[item.connection_type] ?? DEFAULT_EXPORT_ROUTE;
        navigate(route, { ch_channel_id: item.ch_channel_id });
    };

    return {
        user,
        handleConnect,
        isLoading,
        isPending,
        refetch,
        goToListing,
        connectedAccounts,
    };
}