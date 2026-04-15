import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import STORAGE_CONST from '@/constants/storage';
import { getUserListingsByUserIDApi } from '@/services/bookingManagementApi';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useBookingComStep2Container() {
    const route = useRoute<any>();
    const { user } = useAuthStore();
    const hotelId = route.params?.hotelId || '';

    const { control, watch, formState: { errors } } = useForm();

    const { data: apiResponse, isLoading: isLoadingDropdown } = useQuery({
        queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
        queryFn: () => getUserListingsByUserIDApi({ user: user?.id! }),
    });

  const listingOptions = [
        { label: 'None', value: 'none' }, 
        ...(apiResponse?.data?.map((item: any) => ({
            label: item.name,
            value: String(item.id),
        })) ?? [])
    ];

   const handleNext = () => {
        const selectedValue = watch(`listing_${hotelId}`);
        const isNone = !selectedValue || selectedValue === 'none';
        const selectedOption = listingOptions.find(opt => opt.value === selectedValue);

        navigate(NavigationRoutes.APP_STACK.BOOKING_COM_STEP_3, {
            hotelId: hotelId,
            listingId: isNone ? null : selectedValue, 
            selectedTitle: isNone ? '' : (selectedOption ? selectedOption.label : '')
        });
    };
    return {
        control,
        hotelId,
        bookingRooms: [{ id: hotelId }],
        listingOptions,
        handleNext,
        errors,
        isLoadingDropdown
    };
}