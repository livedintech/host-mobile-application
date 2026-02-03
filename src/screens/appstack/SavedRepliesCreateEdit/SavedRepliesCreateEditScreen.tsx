import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import useSavedRepliesCreateEditContainer from './SavedRepliesCreateEditContainer';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useRoute } from '@react-navigation/native';

const LISTING_DATA = [
    { label: 'LivedIn_Guest_204', value: '1' },
    { label: 'Ocean View Apartment', value: '2' },
    { label: 'Downtown Studio', value: '3' },
    { label: 'Downtown', value: '4' },

];

const CreateSavedReplyScreen = () => {
    
    const { control, errors, handleSubmit, isLoading, isEditMode } = useSavedRepliesCreateEditContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.titleWrapper}>
                        <AppText text={isEditMode ? "Edit Saved Reply" : "Create Saved Replies"} fontSize={22} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                    </View>
                </View>

                {/* Form Fields Section */}
                <View style={styles.form}>
                    <InputField
                        label="Message Name:"
                        name="title"
                        control={control}
                        errors={errors}
                        placeholder="Wifi Password"
                    />

                    <TextareaField
                        label="Message Content"
                        name="body"
                        control={control}
                        errors={errors}
                        placeholder="Hi Sir, here are your Wi-Fi details..."
                        multiline
                    />

                    <MultiSelectDropdownField
                        label="Listing Selection"
                        name="listing_ids"
                        control={control}
                        errors={errors}
                        data={LISTING_DATA}
                        placeholder="Select Multiple Options"
                    />

                    {/* Integrated Custom Checkbox */}
                    <View style={styles.autoCreateRow}>
                        <Controller
                            control={control}
                            name="auto_apply_new_listings"
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.checkboxWrapper}>
                                    <Checkbox
                                        isChecked={value}
                                        onPress={() => onChange(!value)}
                                    />
                                    <AppText
                                        text="Auto-Create for New Listings"
                                        ml={2}
                                        color={Colors.PINE_FOREST}
                                        fontSize={14}
                                        type="Medium"
                                    />
                                </View>
                            )}
                        />
                    </View>
                </View>

                {/* Action Button */}
                <AppButton onPress={handleSubmit}
                    disabled={isLoading}
                    title={isLoading ? "Processing..." : isEditMode ? "Update Now" : "Create Now"}
                    mt={40}
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        justifyContent: 'center',
        marginBottom: 10
    },
    backBtn: { position: 'absolute', left: 0, padding: 8, borderWidth: 1, borderColor: '#EEE', borderRadius: 25 },
    titleWrapper: { flexDirection: 'row', alignItems: 'center' },
    form: { marginTop: 10 },
    autoCreateRow: {
        marginTop: 5,
        marginLeft: -10 // Checkbox ke internal padding ko adjust karne ke liye
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainBtn: {
        marginTop: 40,
        height: 56,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    }
});

export default CreateSavedReplyScreen;