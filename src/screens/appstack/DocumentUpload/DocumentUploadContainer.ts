import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pick, types } from '@react-native-documents/picker'; 
import { useState } from 'react';
import { Alert } from 'react-native';
import { DocumentFormValues, documentUploadSchema } from '@/validation/auth/createListingSchemas';

export default function useDocumentUploadContainer() {
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<DocumentFormValues>({
        resolver: yupResolver(documentUploadSchema),
        defaultValues: {
            propertyOwnership: undefined,
            authorityLicense: null,
            nationalId: null,
        },
    });

    const files = watch();

    const handleDocumentPick = async (fieldName: keyof DocumentFormValues) => {
        try {
            // Nayi library ka pick method
            const [res] = await pick({
                type: [types.pdf], // PDF format check
            });

            if (res) {
                // File size check (10 MB limit)
                const fileSizeMB = (res.size || 0) / (1024 * 1024);
                if (fileSizeMB > 10) {
                    Alert.alert('Error', 'File size should be less than 10 MB');
                    return;
                }

                setValue(fieldName, res);
            }
        } catch (err) {
            if (!isCancel(err)) {
                console.error('Picker Error: ', err);
            }
        }
    };

    const removeFile = (fieldName: keyof DocumentFormValues) => {
        setValue(fieldName, null);
    };

    const onSubmit = (data: DocumentFormValues) => {
        setLoading(true);
        console.log('Uploading Documents...', data);
        setLoading(false);
    };

    return {
        control,
        errors,
        handleSubmit,
        onSubmit,
        handleDocumentPick,
        removeFile,
        files,
        loading,
    };
}