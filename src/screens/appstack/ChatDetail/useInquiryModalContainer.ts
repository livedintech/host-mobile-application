import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// Yup Validation Schema for Special Offer
const offerSchema = yup.object().shape({
    offerAmount: yup.string().required('Please enter an offer amount'),
});

interface InquiryModalProps {
    onClose: () => void;
    inquiryId: string; // Dynamic ID for API calls
}

export default function useInquiryModalContainer({ onClose, inquiryId }: InquiryModalProps) {
    // State to toggle between 'actions' (buttons) and 'form' (Make Offer input)
    const [viewState, setViewState] = useState<'actions' | 'form'>('actions');

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(offerSchema),
        defaultValues: { offerAmount: '' },
    });

    // --- Mutation 1: Pre-Approve API ---
    const { mutate: preApprove, isPending: isApproving } = useMutation({
        mutationFn: async () => {
            // Placeholder API Call: e.g., preApproveApi({ id: inquiryId })
            return new Promise(resolve => setTimeout(resolve, 1500)); 
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Inquiry Pre-approved successfully' });
            onClose(); // Close modal on success
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: error?.message || 'Failed to pre-approve' });
        }
    });

    // --- Mutation 2: Special Offer API ---
    const { mutate: sendOffer, isPending: isSendingOffer } = useMutation({
        mutationFn: async (data: any) => {
            // Placeholder API Call: e.g., sendOfferApi({ id: inquiryId, amount: data.offerAmount })
            return new Promise(resolve => setTimeout(resolve, 1500));
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Special offer sent successfully' });
            reset();
            setViewState('actions');
            onClose();
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: error?.message || 'Failed to send offer' });
        }
    });

    const onSubmitOffer = (data: any) => {
        sendOffer(data);
    };

    const handleSpecialOfferClick = () => {
        setViewState('form');
    };

    const handleBackToActions = () => {
        setViewState('actions');
        reset(); // Clear form when going back
    };

    return {
        viewState,
        control,
        errors,
        isApproving,
        isSendingOffer,
        handlePreApprove: () => preApprove(),
        handleSpecialOfferClick,
        handleBackToActions,
        handleSubmitOffer: handleSubmit(onSubmitOffer),
    };
}