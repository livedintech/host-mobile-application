import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack } from '@/services/navigationService';
import { createAutomationTemplateApi, editAutomationTemplateApi, getAutomationTemplateEventsApi, getAutomationTemplateVariablesApi } from '@/services/automationTemplateApi';
import { AutomationTemplateTypesApiPayload, AutomationTemplateTypesApiResponse } from '@/types/api/automationTemplateTypes';
import STORAGE_CONST from '@/constants/storage';
import { useRoute } from '@react-navigation/native';
import { getManageYourListings } from '@/services/ createListingService';
import { ManageListingsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';

const automationSchema = yup.object().shape({
    name: yup.string().required('Template name is required'),
    body: yup.string().required('Content is required'),
    event: yup.string().required('Please select an event trigger'),
    listing_ids: yup
    .array()
    .min(1, 'Please select at least one property')
    .required('Property is required'),
    is_active: yup.boolean().default(false),
    
});

export default function useAutomationTemplateCreateEditContainer() {
    const { user } = useAuthStore();
    const route = useRoute<any>();
    const editData = route?.params?.editData as any;
    const queryClient = useQueryClient();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(automationSchema),
        defaultValues: {
            name: editData?.name || '',
            body: editData?.body || '',
            event: editData?.event || '',
            listing_ids: editData?.listing_ids || [],
            is_active: editData?.is_active || false,
        },
    });

    // Create
    const {
        mutate: createAutomationTemplatePayload,
        isPending,
        isIdle,
    } = useMutation<AutomationTemplateTypesApiResponse, Error, AutomationTemplateTypesApiPayload>({
        mutationFn: createAutomationTemplateApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE]
            });
            goBack()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });


    // Edit
    const {
        mutate: editAutomationTemplatePayload,
        isPending: isPendingEditSaveEdit,
        isIdle: isIdleEditSaveEdit,
    } = useMutation<AutomationTemplateTypesApiResponse, Error, AutomationTemplateTypesApiPayload>({
        mutationFn: editAutomationTemplateApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE]
            });
            goBack()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    const onSubmit = (data: any) => {
        if (editData) {
            const payload = {
                id: editData.id,
                ...data,
            };

            editAutomationTemplatePayload(payload);
        } else {
            const payload = {
                ...data,
            };

            createAutomationTemplatePayload(payload);
        }
    };

    // Listing
    const { data: listing } = useQuery<ManageListingsResponse>({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_LISTING, user?.id],
        queryFn: () =>
            getManageYourListings({
                user: user?.id!,
            }),
        enabled: Boolean(user?.id),
    });

    // Listing
    const transformedListing = listing?.data?.map((item: any) => ({
        label: item.title,
        value: item.id,
    }));

    // Message Variables Api
    const { data: messageVariables } = useQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_MESSAGE_VARIABLES],
        queryFn: getAutomationTemplateVariablesApi,
    });
    console.log("messageVariables",messageVariables)

    const transformedMessageVariables = messageVariables
        ? Object.keys(messageVariables).map(key => ({
            key,
            label: key,
        }))
        : [];

    // Message Events Api
    const { data: events } = useQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_EVENTS],
        queryFn: getAutomationTemplateEventsApi,
    });

    // Transform events from API to dropdown-friendly format
const transformedEvents = events
    ? events.map((item: string) => ({
        label: item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // e.g., "booking_confirmation" -> "Booking Confirmation"
        value: item, // keep original value for API
    }))
    : [];


    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: isPending && !isIdle || isPendingEditSaveEdit && !isIdleEditSaveEdit,
        isEditMode: !!editData,
        transformedListing,
        transformedMessageVariables,
        transformedEvents
    };
}