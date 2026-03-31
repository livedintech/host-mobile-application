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
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';

export default function usePropertyDisclosureContainer() {
    const { user } = useAuthStore();
    const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
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
            securityCameras: isEdit
                ? (routeListing?.exterior_security_camera === 1 ? 'Yes' : 'No')
                : '',
            noiseMonitor: isEdit
                ? (routeListing?.noise_decibel_monitor === 1 ? 'Yes' : 'No')
                : '',
            weaponsOnProperty: isEdit
                ? (routeListing?.weapon_on_property === 1 ? 'Yes' : 'No')
                : '',
        },
    });


    const {
        mutate: createListingDetailsPayload,
        isPending,
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
            queryClient.refetchQueries({
                queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
            });
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

    // ── Build Payload ─────────────────────────────────────────────────────────
    const buildPayload = (data: DisclosureFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
        channel_id,
        listing_id: String(listing_id),
        user_id: String(user?.id),
        // save_and_exit: isSaveAndExit ? 1 : 0,
        save_and_exit: 0,
        listing: {
            name: propertyDetail?.name || 'New Listing',
            exterior_security_camera: data.securityCameras === 'Yes',
            noise_decibel_monitor: data.noiseMonitor === 'Yes',
            weapon_on_property: data.weaponsOnProperty === 'Yes',
        },
    });


    // ── Handlers ──────────────────────────────────────────────────────────────
    const onNext = (data: DisclosureFormValues) => {
        // 1. Store Update (taake data persist rahe)
        updateListing({
            exterior_security_camera: data.securityCameras === 'Yes',
            noise_decibel_monitor: data.noiseMonitor === 'Yes',
            weapon_on_property: data.weaponsOnProperty === 'Yes',
        });

        // 2. API Hit
        createListingDetailsPayload(buildPayload(data, false), {
            onSuccess: () => {
                navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD);
            },
        });
    };

    const onSaveExit = (data: DisclosureFormValues) => {
        updateListing({
            exterior_security_camera: data.securityCameras === 'Yes',

        });

        const payload = buildPayload(data, true); // save_and_exit: 1

        if (isEdit) {
            updateListingDisclosure(payload);
        } else {
            createListingDetailsPayload(payload, {
                onSuccess: () => {
                    navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
                },
            });
        }
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
