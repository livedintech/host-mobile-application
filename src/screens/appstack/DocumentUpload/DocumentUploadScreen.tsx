import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useDocumentUploadContainer from './DocumentUploadContainer';

const DocumentUploadScreen = ({ navigation }: any) => {
    const { control, errors, handleSubmit, onSubmit, handleDocumentPick, removeFile, files, loading } = useDocumentUploadContainer();

    const renderUploadField = (label: string, fieldName: any, isRequired = false) => {
        const file = (files as any)[fieldName];

        return (
            <View style={styles.fieldWrapper}>
                <AppText text={`${label}${isRequired ? '*' : ''}`} fontSize={16} type="SemiBold" color={Colors.BRUNSWICK_GREEN} mb={8} />
                
                <Pressable style={styles.uploadBox} onPress={() => handleDocumentPick(fieldName)}>
                    <AppText text="Upload Pdf" color={Colors.SLATE_GRAY} />
                    <Svgicons path="attachmentIcon" size={20} color={Colors.BRUNSWICK_GREEN} />
                </Pressable>

                {/* Uploaded File Status */}
                {file && (
                    <View style={styles.fileStatusRow}>
                        <View style={styles.fileInfo}>
                            <Svgicons path="checkCircleIcon" size={18} color={Colors.BRUNSWICK_GREEN} />
                            <AppText text={file.name} ml={10} fontSize={14} color={Colors.MIDNIGHT} numberOfLines={1} />
                        </View>
                        <Pressable onPress={() => removeFile(fieldName)}>
                            <Svgicons path="closeIcon" size={18} color={Colors.BLACK} />
                        </Pressable>
                    </View>
                )}
                {errors[fieldName] && <AppText text={errors[fieldName]?.message} color={Colors.INDIAN_RED} fontSize={12} mt={5} />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppText text="Upload Ownership Licence Documents" fontSize={24} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mt={20} />
                
                <View style={styles.infoSection}>
                    <AppText text="• Accepted formats: PDF." fontSize={12} color={Colors.SLATE_GRAY} />
                    <AppText text="• File size ≤ 10 MB per document." fontSize={12} color={Colors.SLATE_GRAY} />
                </View>

                {renderUploadField("Property Ownership / Rental Documents", "propertyOwnership", true)}
                {renderUploadField("Authority license", "authorityLicense")}
                {renderUploadField("Aqama / National ID", "nationalId")}

                <View style={styles.footer}>
                    <AppButton title="Export" onPress={handleSubmit(onSubmit)} loading={loading} />
                    <AppButton title="Save & Exit" onPress={() => navigation.goBack()} mt={15} variant="outline" />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    infoSection: { marginVertical: 30, paddingHorizontal: 10 },
    fieldWrapper: { marginBottom: 25 },
    uploadBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 56,
        backgroundColor: '#FAFAFA'
    },
    fileStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 5
    },
    fileInfo: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
    footer: { marginTop: 40 }
});

export default DocumentUploadScreen;