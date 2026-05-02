import i18n from '@/locales/i18n/i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack } from '@/services/navigationService';
import {
    createAutomationTemplateApi,
    editAutomationTemplateApi,
    getAutomationTemplateByIdApi,
    getAutomationTemplateEventTimesApi,
    getAutomationTemplateEventsApi,
    getAutomationTemplateVariablesApi,
} from '@/services/automationTemplateApi';
import { AutomationTemplateTypesApiPayload, AutomationTemplateTypesApiResponse } from '@/types/api/automationTemplateTypes';
import STORAGE_CONST from '@/constants/storage';
import { useRoute } from '@react-navigation/native';
import { getManageYourListings } from '@/services/ createListingService';
import { ManageListingsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';

const automationSchema = yup.object().shape({
    name: yup.string().required(i18n.t('app.automation_create_edit.validation_name_required')),
    body: yup.string().required(i18n.t('app.automation_create_edit.validation_body_required')),
    event: yup.string().required(i18n.t('app.automation_create_edit.validation_event_required')),
    temp_event_time: yup.string().when('event', {
        is: (val: string) => val === 'check_in' || val === 'check_out',
        then: schema => schema.required(i18n.t('app.automation_create_edit.validation_event_time_required')),
        otherwise: schema => schema.optional(),
    }),
    listing_ids: yup
        .array()
        .min(1, i18n.t('app.automation_create_edit.validation_property_min'))
        .required(i18n.t('app.automation_create_edit.validation_property_required')),
    is_active: yup.boolean().default(false),
});

export default function useAutomationTemplateCreateEditContainer() {
    const { user } = useAuthStore();
    const route = useRoute<any>();
    const editData = route?.params?.editData as any;
    const editId = editData?.id;
    const queryClient = useQueryClient();

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: yupResolver(automationSchema),
        defaultValues: {
            name: '',
            body: '',
            event: '',
            temp_event_time: '',
            listing_ids: [],
            is_active: false,
        },
    });

    // Fetch full automation data when editing
    const { data: fetchedAutomation } = useQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_BY_ID, editId],
        queryFn: () => getAutomationTemplateByIdApi(editId),
        enabled: Boolean(editId),
    });

    useEffect(() => {
        if (fetchedAutomation) {
            reset({
                name: fetchedAutomation.name || '',
                body: fetchedAutomation.body || '',
                event: fetchedAutomation.event || '',
                temp_event_time: fetchedAutomation.temp_event_time || '',
                listing_ids: [...new Set(fetchedAutomation.listing_ids?.map((id: any) => Number(id)) || [])],
                is_active: fetchedAutomation.is_active ?? false,
            });
        }
    }, [fetchedAutomation]);

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
                text1: error.message || i18n.t('common.toast.something_went_wrong'),
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
                text1: error.message || i18n.t('common.toast.something_went_wrong'),
            });
        },
    });

    const onSubmit = (data: any) => {
        const isTimeEvent = data.event === 'check_in' || data.event === 'check_out';
        const payload = {
            ...data,
            listing_ids: [...new Set(data.listing_ids.map((id: any) => Number(id)))],
            temp_event_time: isTimeEvent ? data.temp_event_time : 'Immediately',
        };
        if (editId) {
            editAutomationTemplatePayload({ id: editId, ...payload });
        } else {
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
        enabled: Boolean(editId),

        staleTime: 0,        // data turant stale ho jaye
        cacheTime: 0,        // cache store hi na ho
        refetchOnMount: true, // component mount pe dobara hit
        refetchOnWindowFocus: true, // focus pe bhi hit
    });

    const transformedListing = listing?.data?.map((item: any) => ({
        label: item.title || item.name || '',
        value: Number(item?.listing_id || item.id),
    }));

    // Message Variables Api
    const { data: messageVariables } = useQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_MESSAGE_VARIABLES],
        queryFn: getAutomationTemplateVariablesApi,
    });

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

    const transformedEvents = events
        ? events.map((item: string) => ({
            label: item.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            value: item,
        }))
        : [];

    // Event Times Api
    const { data: eventTimes } = useQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE_EVENT_TIMES],
        queryFn: getAutomationTemplateEventTimesApi,
    });

    const transformedEventTimes = eventTimes ?? [];

    const selectedEvent = watch('event');

    useEffect(() => {
        if (selectedEvent !== 'check_in' && selectedEvent !== 'check_out') {
            setValue('temp_event_time', '');
        }
    }, [selectedEvent]);

    return {
        control: control as any,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: isPending && !isIdle || isPendingEditSaveEdit && !isIdleEditSaveEdit,
        isEditMode: Boolean(editId),
        transformedListing,
        transformedMessageVariables,
        transformedEvents,
        transformedEventTimes,
        selectedEvent,
    };
}
