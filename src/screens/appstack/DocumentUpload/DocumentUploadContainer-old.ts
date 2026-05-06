import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import {
    documentUploadSchema,
    DocumentFormValues,
    DocumentPickerResult
} from '@/validation/auth/createListingSchemas';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { goBack, navigate, reset } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { BASE_URL } from '@/services/apiService';


interface ApiDocument {
    url: string;
    type: string;
}

interface ExistingDocument {
    type: string;
    file_name: string;
    path: string;
}

export default function useDocumentUploadContainer() {
    const { user, token } = useAuthStore();
    const { params } = useRoute();
    const routeListing = params?.paramData?.listing;
    const isEdit = Boolean(routeListing?.id);

    const { listing_id, channel_id } = useCreateListingStore();
    const [loading, setLoading] = useState(false);

    // Helper to convert existing documents to form format
    const getExistingDocument = (docs: ExistingDocument[] | undefined): DocumentPickerResult | null => {
        if (!docs || !Array.isArray(docs) || docs.length === 0) return null;

        const doc = docs[0]; // Get first document from array
        return {
            uri: doc.path,
            name: doc.file_name,
            type: 'application/pdf',
            size: 0,
            isExisting: true // Flag to identify existing documents
        } as DocumentPickerResult;
    };

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<DocumentFormValues>({
        resolver: yupResolver(documentUploadSchema),
        defaultValues: {
            propertyOwnership: getExistingDocument(routeListing?.documents?.ownership),
            authorityLicense: getExistingDocument(routeListing?.documents?.license),
            nationalId: getExistingDocument(routeListing?.documents?.national_id),
        } as any,
    });

    const files = watch();

    // Convert file to Base64
    const getBase64 = async (uri: string): Promise<string | null> => {
        try {
            let filePath = uri;
            if (Platform.OS === 'android' && uri.startsWith('content://')) {
                const destPath = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.pdf`;
                await RNFS.copyFile(uri, destPath);
                const base64 = await RNFS.readFile(destPath, 'base64');
                await RNFS.unlink(destPath);
                return base64;
            }
            filePath = Platform.OS === 'android' ? uri.replace('file://', '') : decodeURI(uri.replace('file://', ''));
            return await RNFS.readFile(filePath, 'base64');
        } catch (error) {
            console.log('Base64 conversion error:', error);
            return null;
        }
    };

    const handleDocumentPick = async (fieldName: keyof DocumentFormValues) => {
        try {
            const res = await DocumentPicker.pick({ type: [DocumentPicker.types.pdf] });
            const file = res[0];

            if (file) {
                if ((file.size || 0) / (1024 * 1024) > 10) {
                    Alert.alert('Error', 'File size should be less than 10 MB');
                    return;
                }

                const mappedFile: DocumentPickerResult = {
                    uri: file.uri,
                    name: file.name || 'document.pdf',
                    type: file.type || 'application/pdf',
                    size: file.size || 0,
                    isExisting: false
                };
                setValue(fieldName, mappedFile);
            }
        } catch (err: any) {
            if (!DocumentPicker.isCancel(err)) {
                console.log('Picker Error', err);
            }
        }
    };

    const removeFile = (fieldName: keyof DocumentFormValues) => {
        setValue(fieldName, null as any);
    };

    // Process files - handle both new uploads and existing documents
    const processFiles = async (data: DocumentFormValues): Promise<ApiDocument[]> => {
        const documentsArray: ApiDocument[] = [];

        const processFile = async (file: DocumentPickerResult | null | undefined, slug: string) => {
            if (!file) return;

            // If it's an existing document (already uploaded), use the path
            if ((file as any).isExisting) {
                documentsArray.push({
                    url: file.uri, // This is the path from server
                    type: slug
                });
            }
            // If it's a new upload, convert to base64
            else if (file.uri) {
                const b64 = await getBase64(file.uri);
                if (b64) {
                    documentsArray.push({
                        url: `data:application/pdf;base64,${b64}`,
                        type: slug
                    });
                }
            }
        };

        await processFile(data.propertyOwnership, "ownership");
        await processFile(data.authorityLicense, "license");
        await processFile(data.nationalId, "national_id");

        if (documentsArray.length < 3) {
            throw new Error("All three documents are required.");
        }

        return documentsArray;
    };

    const onSubmit = async (data: DocumentFormValues) => {
        setLoading(true);
        try {
            const documentsArray = await processFiles(data);

            const body = {
                listing_id: routeListing?.listing_id || listing_id,
                documents: documentsArray,
            };

            const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
                method: isEdit ? 'POST' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: result?.message || (isEdit ? 'Documents updated successfully' : 'Documents uploaded successfully')
                });
                queryClient.invalidateQueries({
                    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
                });
                queryClient.invalidateQueries({
                    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
                });

                // Navigate based on mode
                if (isEdit) {
                    goBack();
                } else {
                    navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
                }
            } else {
                throw new Error(result.message || (isEdit ? "Update failed" : "Upload failed"));
            }
        } catch (error: any) {
            Alert.alert(isEdit ? "Update Error" : "Upload Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
        isEdit
    };
}
