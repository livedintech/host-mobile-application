import { useForm } from 'react-hook-form'
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


export default function useBookingComContainer() {
    const { user } = useAuthStore();

    const [isTestSuccess, setIsTestSuccess] = useState(false)

    const apartments = [
        { label: 'Apartment 1', value: '1' },
        { label: 'Apartment 2', value: '2' },
        { label: 'Apartment 3', value: '3' },
    ]

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<BookingComFormValues>({
        resolver: yupResolver(bookingComSchema),
        defaultValues: {
            roomId: '',
            hotelId: '',
            apartmentId: '',
        },
    })

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
                text1: 'Connection Successful',
                text2: 'Booking.com connection is valid.',
            })
        },
        onError: (error: any) => {
            setIsTestSuccess(false) // ✅ Fail pe dobara disable
            Toast.show({
                type: 'error',
                text1: 'Connection Failed',
                text2: error?.message || 'Please check your Room ID and Hotel ID.',
            })
        },
    })

    // ----------------- Submit -----------------
    const { mutate: submitPMS, isPending: isSubmitting } = useMutation({
        mutationFn: bookingcomConnectionApi,
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Connected!',
                text2: 'Booking.com has been connected successfully.',
            })
            goBack()
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Submit Failed',
                text2: error?.message || 'Something went wrong. Please try again.',
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
        value: String(item.listing_id), // internal Livedin ID for dropdown
    })) ?? [];


    // ----------------- Handlers -----------------
    const handleTestConnection = () => {
        const { roomId, hotelId } = getValues()
        if (!roomId || !hotelId) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill Room ID and Hotel ID first.',
            })
            return
        }
        setIsTestSuccess(false)
        testConnection({ hotel_id: hotelId })
    }

    const onSubmit = (data: BookingComFormValues) => {
        const payload: bookingcomConnectionPayloadType = {
            title: data.roomId,
            listing_id: data.apartmentId,
            hotel_id: data.hotelId,
        }
        submitPMS(payload) // ✅ typed payload
    }


    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        handleTestConnection,
        isTesting,
        isSubmitting,
        isTestSuccess, // ✅ Return karo
        apartments,
        listingOptions
    }
}