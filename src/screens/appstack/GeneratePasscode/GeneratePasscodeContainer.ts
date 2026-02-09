import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { passcodeGenerateApi } from '@/services/smartLockApi';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { smartLockApiResponseType, smartLockGeneratePasscodePayloadType } from '@/types/api/smartLockTypes';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),

    startDate: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required('Start date required'),
        otherwise: s => s.notRequired()
    }),

    startTime: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required('Start time required'),
        otherwise: s => s.notRequired()
    }),

    endDate: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required('End date required'),
        otherwise: s => s.notRequired()
    }),

    endTime: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required('End time required'),
        otherwise: s => s.notRequired()
    }),
});


export default function useGeneratePasscodeContainer() {
    const route = useRoute();
    const { type, lock_id } = route.params as { type: 'Permanent' | 'One-time' | 'Timed', lock_id: '' };


    const {
        mutate: passcodeGeneratePayload,
        isIdle,
        isPending
    } = useMutation<smartLockApiResponseType, Error, smartLockGeneratePasscodePayloadType>({
        mutationFn: passcodeGenerateApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_ACTIVE_CODES]
            });
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });


    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            type: type // Hidden field for validation logic
        }
    });

const onSubmit = (data: any) => {

    let payload: any = {
        lockId: lock_id,
        keyboardPwdName: data.name,
    };

    if (type === 'Permanent') {
        payload.keyboardPwdType = 1;
    }

    if (type === 'One-time') {
        payload.keyboardPwdType = 2;
    }

    if (type === 'Timed') {
        payload.keyboardPwdType = 3;
        payload.start_date = data.startDate;
        payload.start_time = data.startTime;
        payload.end_date = data.endDate;
        payload.end_time = data.endTime;
    }

    console.log('FINAL PAYLOAD:', payload);

    passcodeGeneratePayload(payload);
};



    const getInstructionText = () => {
        switch (type) {
            case 'Permanent':
                return "This Passcode MUST BE used at least once, within 24 Hours from Current Time, or it will be SUSPENDED for Security Reasons.";
            case 'One-time':
                return "This Passcode MUST BE used within 6 Hours from Current Time, or it will be SUSPENDED for Security Reasons. This Passcode can ONLY be used ONCE.";
            case 'Timed':
                return "This Passcode MUST BE used at least once, within 24 Hours after the Start Date and Time or it will be SUSPENDED for Security Reasons.";
            default:
                return "";
        }
    };

    return {
        type,
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        instructionText: getInstructionText(),
        isLoading: isPending && !isIdle
    };
}