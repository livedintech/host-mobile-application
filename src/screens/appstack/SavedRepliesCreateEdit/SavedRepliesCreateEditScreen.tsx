import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
import Metrics from '@/utility/Metrics';

const CreateSavedReplyScreen = () => {
    const { control, errors, handleSubmit, isLoading, isEditMode, transformedListing } = useSavedRepliesCreateEditContainer();
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
                        data={transformedListing || []}
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
                    loading={isLoading}
                    title={ isEditMode ? "Update Now" : "Create Now"}
                    mt={40}
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    scrollContainer: { paddingHorizontal: Metrics.scale(20), paddingBottom: Metrics.verticalScale(40) },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Metrics.verticalScale(20),
        justifyContent: 'center',
        marginBottom: Metrics.verticalScale(10)
    },
    titleWrapper: { flexDirection: 'row', alignItems: 'center' },
    form: { marginTop: 10 },
    autoCreateRow: {
        marginTop: Metrics.verticalScale(5),
        marginLeft: Metrics.scale(-10)
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainBtn: {
        marginTop: Metrics.verticalScale(40),
        height: Metrics.verticalScale(56),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    }
});

export default CreateSavedReplyScreen;