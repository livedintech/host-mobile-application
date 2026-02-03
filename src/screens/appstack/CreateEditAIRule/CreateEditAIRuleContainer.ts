import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { navigate } from '@/services/navigationService';

const aiRuleSchema = yup.object().shape({
    ruleName: yup.string().required('Rule Name is required'),
    ruleInstructions: yup.string().required('Instructions are required'),
    listings: yup.array().min(1, 'Select at least one listing').required(),
    autoCreate: yup.boolean().default(false),
});

export default function useCreateEditAIRuleContainer(editData?: any) {
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(aiRuleSchema),
        defaultValues: {
            ruleName: editData?.title || '',
            ruleInstructions: editData?.instructions || '',
            listings: editData?.listings || [],
            autoCreate: editData?.isActive || false,
        },
    });

    const instructionValue = watch('ruleInstructions');

    const { mutate: saveRule, isPending } = useMutation({
        mutationFn: async (data: any) => data, // API Call replace here
        onSuccess: () => {
            Toast.show({ 
                type: 'success', 
                text1: editData ? 'Rule Updated Successfully' : 'Rule Created Successfully' 
            });
            queryClient.invalidateQueries({ queryKey: ['aiRules'] });
            navigate('AIAutoReply');
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: error?.message || 'Failed to save rule' });
        }
    });

    const onSubmit = (data: any) => saveRule(data);

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: isPending,
        isEditMode: !!editData,
        descriptionLength: instructionValue?.length || 0
    };
}