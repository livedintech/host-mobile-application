import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DisclosureFormValues, disclosureSchema } from '@/validation/auth/createListingSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useRoute } from '@react-navigation/native';

export default function usePropertyDisclosureContainer() {
    const { user } = useAuthStore();
    const { listing_id, channel_id, listing } = useCreateListingStore();
    const { params } = useRoute();
    const routeListing = params?.paramData?.listing;
    const isEdit = Boolean(routeListing?.listing_id);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DisclosureFormValues>({
        resolver: yupResolver(disclosureSchema),
        defaultValues: {
            securityCameras: routeListing?.disclosures?.cameras ? 'Yes' : '',
            noiseMonitor: routeListing?.disclosures?.noise ? 'Yes' : '',
            weaponsOnProperty: routeListing?.disclosures?.weapons ? 'Yes' : '',
        },
    });


    const {
        mutate: createListingDetailsPayload,
        isPending,
        isIdle,
    } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
        mutationFn: createListingDetailsApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message || 'Property disclosure saved successfully',
            });
            navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD);
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    const {
        mutate: updateListingDisclosure,
        isPending: isUpdating,
    } = useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
        mutationFn: editListingApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message || 'Updated successfully',
            });
            navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });


    const onNext = (data: DisclosureFormValues) => {
        navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD);
        return false
        if (!listing_id) {
            Toast.show({ type: 'error', text1: 'Listing ID is missing' });
            return;
        }

        const payload: CreateListingDetailsPayload = {
            channel_id: channel_id,
            listing_id,
            user_id: Number(user?.id),
            listing: {
                name: listing?.name,
                disclosures: {
                    cameras: data.securityCameras === 'Yes',
                    noise: data.noiseMonitor === 'Yes',
                    weapons: data.weaponsOnProperty === 'Yes',
                }
            }
        };

        console.log('Property Disclosure Payload:', payload);
        createListingDetailsPayload(payload);
    };

    const onSaveExit = (data: DisclosureFormValues) => {
        const payload: CreateListingDetailsPayload = {
            channel_id: channel_id!,
            listing_id: routeListing?.listing_id,
            user_id: Number(user?.id),
            listing: {
                name: listing?.name,
                disclosures: {
                    cameras: data.securityCameras === 'Yes',
                    noise: data.noiseMonitor === 'Yes',
                    weapons: data.weaponsOnProperty === 'Yes',
                },
            },
        };

        updateListingDisclosure(payload);
    };


    return {
        isEdit,
        isLoading: isPending || isUpdating,
        control,
        errors,
        handleSubmit,
        onNext,
        onSaveExit,
    };

}
