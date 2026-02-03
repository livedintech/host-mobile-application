import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack } from '@/services/navigationService';
import { createAutomationTemplateApi, editAutomationTemplateApi } from '@/services/automationTemplate';
import { AutomationTemplateTypesApiPayload, AutomationTemplateTypesApiResponse } from '@/types/api/automationTemplateTypes';
import STORAGE_CONST from '@/constants/storage';
import { useRoute } from '@react-navigation/native';

const automationSchema = yup.object().shape({
    event: yup.string().required('Template name is required'),
    messageContent: yup.string().required('Content is required'),
    eventTrigger: yup.string().required('Please select an event trigger'),
    listings: yup.array().min(1, 'Select at least one listing').required(),
    autoCreate: yup.boolean().default(false),
});

export default function useAutomationTemplateCreateEditContainer() {
    const route = useRoute<any>();
    const editData = route?.params?.editData as any;
    const queryClient = useQueryClient();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(automationSchema),
        defaultValues: {
            event: editData?.title || '',
            messageContent: editData?.content || '',
            eventTrigger: editData?.trigger || '',
            listings: editData?.listings || [],
            autoCreate: editData?.isActive || false,
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

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: false,
        isEditMode: !!editData,
    };
}