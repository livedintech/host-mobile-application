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

const BASE_URL = BASE_URL_DEV;

interface ApiDocument {
    url: string;
    type: string;
}

export default function useDocumentUploadContainer() {
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<DocumentFormValues>({
        resolver: yupResolver(documentUploadSchema),
        defaultValues: {
            propertyOwnership: null,
            authorityLicense: null,
            nationalId: null,
        } as any,
    });

    const files = watch();

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
                console.log('Picker Error');
        }
    };

    const removeFile = (fieldName: keyof DocumentFormValues) => {
        // ✅ Fix: 'as any' use karne se null assignability error khatam ho jayega
        setValue(fieldName, null as any);
    };

    const onSubmit = async (data: DocumentFormValues) => {
        setLoading(true);
        try {
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

            // Teeno files mandatory processing
            await processFile(data.propertyOwnership, "ownership");
            await processFile(data.authorityLicense, "license");
            await processFile(data.nationalId, "national_id");

            // Final safety check (validation already ensures this)
            if (documentsArray.length < 3) {
                Alert.alert("Error", "All three documents are required.");
                setLoading(false);
                return;
            }

            const body = {
                listing_id: 123, 
                documents: documentsArray,
            };

            const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({ type: 'success', text1: result?.message });
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (error: any) {
            Alert.alert("Upload Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { control, errors, handleSubmit, onSubmit, handleDocumentPick, removeFile, files, loading };
}