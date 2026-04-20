import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    pick,
    keepLocalCopy,
    types,
    errorCodes,
    isErrorWithCode,
} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { BASE_URL_DEV } from '@env';
import {
    documentUploadSchema,
    DocumentFormValues,
    DocumentPickerResult,
} from '@/validation/auth/createListingSchemas';

const BASE_URL = BASE_URL_DEV;

interface ApiDocument {
    url: string;
    type: string;
}

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
            propertyOwnership: null,
            authorityLicense: null,
            nationalId: null,
        } as any,
    });

    const files = watch();

    // ─────────────────────────────────────────────────────────────
    // ✅ getBase64
    //    Android: content:// ya file:// donu handle karta hai
    //    iOS:     local cached file:// path handle karta hai
    // ─────────────────────────────────────────────────────────────
    const getBase64 = async (uri: string): Promise<string | null> => {
        try {
            if (Platform.OS === 'ios') {
                // iOS: file:// strip + decode
                const filePath = decodeURIComponent(uri.replace('file://', ''));
                return await RNFS.readFile(filePath, 'base64');
            }

            // Android: content:// URI
            if (uri.startsWith('content://')) {
                const destPath = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.pdf`;
                await RNFS.copyFile(uri, destPath);
                const base64 = await RNFS.readFile(destPath, 'base64');
                await RNFS.unlink(destPath).catch(() => {});
                return base64;
            }

            // Android: normal file:// URI
            const filePath = uri.replace('file://', '');
            return await RNFS.readFile(filePath, 'base64');
        } catch (error) {
            console.log('getBase64 error:', error);
            return null;
        }
    };

    // ─────────────────────────────────────────────────────────────
    // ✅ handleDocumentPick
    //    - isCancel fix: isErrorWithCode + errorCodes.OPERATION_CANCELED
    //    - fileCopyUri fix: keepLocalCopy() use karke local copy banao
    // ─────────────────────────────────────────────────────────────
    const handleDocumentPick = async (fieldName: keyof DocumentFormValues) => {
        try {
            const res = await pick({
                type: [types.pdf],
                // iOS presentation options
                presentationStyle: 'fullScreen',
                transitionStyle: 'coverVertical',
            });

            const file = res[0];
            if (!file) return;

            // File size check — 10MB limit
            if ((file.size || 0) / (1024 * 1024) > 10) {
                Alert.alert('File Too Large', 'File size 10 MB se kam honi chahiye.');
                return;
            }

            // ✅ iOS: iCloud / Files app se pick karne par uri directly
            //    readable nahi hoti — keepLocalCopy() se local cache mein copy karo
            let safeUri = file.uri;

            if (Platform.OS === 'ios') {
                const copyResult = await keepLocalCopy({
                    files: [
                        {
                            uri: file.uri,
                            fileName: file.name || 'document.pdf',
                        },
                    ],
                    destination: 'cachesDirectory',
                });

                const copied = copyResult[0];
                if (copied.status === 'error') {
                    Alert.alert('Error', `File copy nahi ho saki: ${copied.copyError}`);
                    return;
                }
                // localUri ab cached file:// path hai — readable hai
                safeUri = copied.localUri;
            }

            const mappedFile: DocumentPickerResult = {
                uri: safeUri,
                name: file.name || 'document.pdf',
                type: file.type || 'application/pdf',
                size: file.size || 0,
            };

            setValue(fieldName, mappedFile);

        } catch (err: unknown) {
            // ✅ v12 cancel check: isErrorWithCode + OPERATION_CANCELED
            if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
                return; // User ne cancel kiya — kuch mat karo
            }
            console.log('Picker Error:', err);
            Alert.alert('Error', 'Document pick karne mein masla aaya. Dobara try karein.');
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Remove file
    // ─────────────────────────────────────────────────────────────
    const removeFile = (fieldName: keyof DocumentFormValues) => {
        setValue(fieldName, null as any);
    };

    // ─────────────────────────────────────────────────────────────
    // Submit / Upload
    // ─────────────────────────────────────────────────────────────
    const onSubmit = async (data: DocumentFormValues) => {
        setLoading(true);
        try {
            const documentsArray: ApiDocument[] = [];

            const processFile = async (
                file: DocumentPickerResult | null | undefined,
                slug: string,
            ) => {
                if (!file?.uri) return;
                const b64 = await getBase64(file.uri);
                if (b64) {
                    documentsArray.push({
                        url: `data:application/pdf;base64,${b64}`,
                        type: slug,
                    });
                }
            };

            await processFile(data.propertyOwnership, 'ownership');
            await processFile(data.authorityLicense, 'license');
            await processFile(data.nationalId, 'national_id');

            if (documentsArray.length < 3) {
                Alert.alert('Error', 'Teenon documents required hain.');
                setLoading(false);
                return;
            }

            const body = {
                listing_id: 123,
                documents: documentsArray,
            };

            const response = await fetch(
                `${BASE_URL}api/v2/channelmanagement/create-listing/documents`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                },
            );

            const result = await response.json();

            if (response.ok) {
                Toast.show({ type: 'success', text1: result?.message });
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error: any) {
            Alert.alert('Upload Error', error.message || 'Kuch masla aa gaya, dobara try karein.');
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
    };
}