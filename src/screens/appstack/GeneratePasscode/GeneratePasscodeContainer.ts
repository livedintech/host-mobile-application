import i18n from '@/locales/i18n/i18n';
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
import { goBack } from '@/services/navigationService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const schema = yup.object().shape({
    name: yup.string().required(i18n.t('app.validation.name_required')),

    startDate: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required(i18n.t('app.validation.start_date_required')),
        otherwise: s => s.notRequired()
    }),

    startTime: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required(i18n.t('app.validation.start_time_required')),
        otherwise: s => s.notRequired()
    }),

    endDate: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required(i18n.t('app.validation.end_date_required')),
        otherwise: s => s.notRequired()
    }),

    endTime: yup.string().when('type', {
        is: 'Timed',
        then: s => s.required(i18n.t('app.validation.end_time_required')),
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
            goBack()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || i18n.t('common.toast.something_went_wrong'),
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
        if (type === 'One-time') {
            payload.keyboardPwdType = 1;
        }
        if (type === 'Permanent') {
            payload.keyboardPwdType = 2;
        }
        if (type === 'Timed') {
            payload.keyboardPwdType = 3;
            payload.start_date = data.startDate;
            // payload.start_time = data.startTime;
            payload.end_date = data.endDate;
            // payload.end_time = data.endTime;
            payload.start_time = dayjs(`${data.startDate} ${data.startTime}`, 'YYYY-MM-DD hh:mm a').format('HH:mm');
            payload.end_time = dayjs(`${data.endDate} ${data.endTime}`, 'YYYY-MM-DD hh:mm a').format('HH:mm');


        }

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