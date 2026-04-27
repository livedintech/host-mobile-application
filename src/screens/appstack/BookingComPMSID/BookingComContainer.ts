import { useForm } from 'react-hook-form'
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { goBack } from '@/services/navigationService'
import { useState } from 'react'
import {
    BookingComFormValues,
    bookingComSchema,
} from '@/validation/bookingCom/bookingComSchema'
import { bookingcomConnectionPayloadType, bookingcomTestConnectionPayloadType, bookingcomTestConnectionResponse } from '@/types/api/bookingManagementTypes'
import { bookingcomConnectionApi, bookingcomTestConnectionApi, getUserListingsByUserIDApi } from '@/services/bookingManagementApi'
import STORAGE_CONST from '@/constants/storage'
import { useAuthStore } from '@/store/useAuthStore'
import { queryClient } from '@/services/api'


export default function useBookingComContainer() {
    const { user } = useAuthStore();

    const [isTestSuccess, setIsTestSuccess] = useState(false)

    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm<BookingComFormValues>({
        resolver: yupResolver(bookingComSchema),
        defaultValues: {
            roomId: '',
            hotelId: '',
            apartmentId: null,
            rate: '',
        }
    })

    const selectedApartment = watch('apartmentId')

    const hasApartment =
        selectedApartment !== null &&
        selectedApartment !== undefined &&
        selectedApartment !== ''

    // ----------------- Test Connection -----------------

    const { mutate: testConnection, isPending: isTesting } = useMutation<
        bookingcomTestConnectionResponse,
        Error,
        bookingcomTestConnectionPayloadType
    >({
        mutationFn: bookingcomTestConnectionApi,
        onSuccess: () => {
            setIsTestSuccess(true) // ✅ Success pe enable karo
            Toast.show({
                type: 'success',
                text1: i18n.t('common.toast.connection_successful'),
                text2: 'Booking.com connection is valid.',
            })
        },
        onError: (error: any) => {
            setIsTestSuccess(false) // ✅ Fail pe dobara disable
            Toast.show({
                type: 'error',
                text1: i18n.t('common.toast.connection_failed'),
                text2: error?.message || 'Please check your Room ID and Hotel ID.',
            })
        },
    })

    // ----------------- Submit -----------------
    const { mutate: submitPMS, isPending: isSubmitting } = useMutation({
        mutationFn: bookingcomConnectionApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
            });
            Toast.show({
                type: 'success',
                text1: i18n.t('app.booking_com_pms.connected'),
                text2: i18n.t('app.booking_com_pms.connected_success'),
            })
            goBack()
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: i18n.t('common.toast.submit_failed'),
                text2: error?.message || i18n.t('app.booking_com_pms.try_again'),
            })
        },
    });


    // Fetch user listings (for dropdown options)
    const { data: apiResponse, isLoading: isLoadingDropdown, isFetching: isFetchingDropdown } = useQuery({
        queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
        queryFn: () =>
            getUserListingsByUserIDApi({
                user: user?.id!,
            }),
        enabled: Boolean(user?.id),
    });

    const listingOptions = apiResponse?.data?.map((item: any) => ({
        label: item.name,
        value: String(item.id), // internal Livedin ID for dropdown
    })) ?? [];


    // ----------------- Handlers -----------------
    const handleTestConnection = () => {
        const { roomId, hotelId } = getValues()
        if (!roomId || !hotelId) {
            Toast.show({
                type: 'error',
                text1: i18n.t('common.toast.missing_fields'),
                text2: i18n.t('app.booking_com_pms.fill_room_hotel_id'),
            })
            return
        }
        setIsTestSuccess(false)
        testConnection({ hotel_id: hotelId })
    }

    // BookingComContainer.ts - onSubmit fix

    const onSubmit = (data: BookingComFormValues) => {
        const payload = data.apartmentId
            ? {
                title: data.roomId,
                listing_id: String(data.apartmentId),
                hotel_id: data.hotelId,
            }
            : {
                title: data.roomId,
                hotel_id: data.hotelId,
                rate: Number(data.rate || 0),
                availability: 1,
            }

        submitPMS(payload as bookingcomConnectionPayloadType)
    }
    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        hasApartment,
        handleTestConnection,
        isTesting,
        isSubmitting,
        isTestSuccess,
        listingOptions,
    }
}