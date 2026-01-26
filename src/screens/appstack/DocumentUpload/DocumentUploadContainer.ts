import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { BASE_URL_DEV } from '@env';
import {
    documentUploadSchema,
    DocumentFormValues,
    DocumentPickerResult
} from '@/validation/auth/createListingSchemas';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { goBack, reset } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';

const BASE_URL = BASE_URL_DEV;

interface ApiDocument {
    url: string;
    type: string;
}

export default function useDocumentUploadContainer() {
    const { user } = useAuthStore();
    const { params } = useRoute();
    const routeListing = params?.paramData?.payload?.listing;
    const isEdit = Boolean(routeListing?.listing_id);

    const { listing_id, channel_id } = useCreateListingStore();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<DocumentFormValues>({
        resolver: yupResolver(documentUploadSchema),
        defaultValues: {
            propertyOwnership: routeListing?.documents?.ownership || null,
            authorityLicense: routeListing?.documents?.license || null,
            nationalId: routeListing?.documents?.national_id || null,
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
                    size: file.size || 0
                };
                setValue(fieldName, mappedFile);
            }
        } catch (err: any) {
            console.log('Picker Error', err);
        }
    };

    const removeFile = (fieldName: keyof DocumentFormValues) => {
        setValue(fieldName, null as any);
    };

    // DRY helper to process all files
    const processFiles = async (data: DocumentFormValues): Promise<ApiDocument[]> => {
        const documentsArray: ApiDocument[] = [];

        const processFile = async (file: DocumentPickerResult | null | undefined, slug: string) => {
            if (file?.uri) {
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
                listing_id,
                documents: documentsArray,
            };

            const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({ type: 'success', text1: result?.message || 'Documents uploaded successfully' });
                reset(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (error: any) {
            Alert.alert("Upload Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onSaveExit = async (data: DocumentFormValues) => {
        setLoading(true);
        try {
            const documentsArray = await processFiles(data);

            const body = {
                listing_id: routeListing?.listing_id || listing_id,
                documents: documentsArray,
            };

            const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
                method: 'PUT', // edit existing documents
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({ type: 'success', text1: result?.message || 'Documents updated successfully' });
                goBack();
            } else {
                throw new Error(result.message || "Update failed");
            }
        } catch (error: any) {
            Alert.alert("Update Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { control, errors, handleSubmit, onSubmit, onSaveExit, handleDocumentPick, removeFile, files, loading,isEdit };
}
