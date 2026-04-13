import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { inquiryPreApproveApi, inquirySpecialOfferApi } from '@/services/chatApi';

// Dynamic Validation Schema
const schema = yup.object().shape({
    formType: yup.string(),
    message: yup.string().required('Message is required'), // Message donu mein zaroori hai
    offerAmount: yup.string().when('formType', {
        is: 'specialOffer',
        then: (s) => s.required('Offer amount is required'), // Amount sirf Special Offer mein zaroori hai
        otherwise: (s) => s.notRequired(),
    }),
});

interface Props {
    onClose: () => void;
    inquiryId: string;
}

export default function useInquiryModalContainer({ onClose, inquiryId }: Props) {
    // viewState ab 3 types ki hogi
    const [viewState, setViewState] = useState<'actions' | 'specialOffer' | 'preApprove'>('actions');

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            formType: 'actions',
            message: '',
            offerAmount: '',
        },
    });

    // --- Mutation 1: Pre-Approve API ---
    const { mutate: preApprove, isPending: isApproving } = useMutation({
        mutationFn: inquiryPreApproveApi,
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Inquiry Pre-approved successfully' });
            resetState();
        },
        onError: (error: any) => Toast.show({ type: 'error', text1: error?.message || 'Error' })
    });

    // --- Mutation 2: Special Offer API ---
    const { mutate: sendOffer, isPending: isSendingOffer } = useMutation({
        mutationFn: inquirySpecialOfferApi,
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Special offer sent successfully' });
            resetState();
        },
        onError: (error: any) => Toast.show({ type: 'error', text1: error?.message || 'Error' })
    });

    const resetState = () => {
        reset({ formType: 'actions', message: '', offerAmount: '' });
        setViewState('actions');
        onClose();
    };

    const handleBackToActions = () => {
        setViewState('actions');
        reset({ formType: 'actions', message: '', offerAmount: '' });
    };

    const handleSpecialOfferClick = () => {
        setValue('formType', 'specialOffer');
        setViewState('specialOffer');
    };

    const handlePreApproveClick = () => {
        setValue('formType', 'preApprove');
        setViewState('preApprove');
    };

    const onSubmit = (data: any) => {
        const payload = {
            thread_id: inquiryId,
            amount: data?.offerAmount,
            message: data?.message
        }
        
        if (data.formType === 'specialOffer') {
            sendOffer(payload);
        } else {
            preApprove(payload);
        }
    };

    return {
        viewState,
        control,
        errors,
        isApproving,
        isSendingOffer,
        handleSpecialOfferClick,
        handlePreApproveClick,
        handleBackToActions,
        handleSubmitForm: handleSubmit(onSubmit),
    };
}