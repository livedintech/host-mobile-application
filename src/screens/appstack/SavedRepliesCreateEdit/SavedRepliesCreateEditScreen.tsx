import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
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
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';

const CreateSavedReplyScreen = () => {
    const { 
        control, 
        errors, 
        handleSubmit, 
        isLoading, 
        isEditMode, 
        transformedListing 
    } = useSavedRepliesCreateEditContainer();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
            
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Title & Description ── */}
                    <View style={styles.topTextSection}>
                        <AppText 
                            text={isEditMode ? "Edit Saved Replies" : "Create Saved Replies"} 
                            fontSize={28} 
                            type="Bold" 
                            color={Colors.BLACK} 
                            mb={10} 
                        />
                        <AppText 
                            text={isEditMode 
                                ? "Update the name, message content, and assigned listings. Changes will apply wherever this saved reply is used." 
                                : "Create a saved reply by adding a name and message content. Assign it to specific listings, or enable auto-create to make it available for all new listings."
                            } 
                            fontSize={14} 
                            color={Colors.DARK_CHARCOAL_OPACITY} 
                            lineHeight={20}
                        />
                    </View>

                    {/* ── Form Fields ── */}
                    <View style={styles.form}>
                        <InputField
                            label="Message Name"
                            name="title"
                            control={control}
                            errors={errors}
                            placeholder="Wifi Password"
                            // Adding specific styles to match glass design if your InputField supports it
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
                            label="Select Property"
                            name="listing_ids"
                            control={control}
                            errors={errors}
                            data={transformedListing || []}
                            placeholder="Select Multiple Options"
                        />

                        {/* ── Auto-Create Checkbox ── */}
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
                                            text="Auto-create for all new listings"
                                            ml={10}
                                            color={Colors.MIDNIGHT}
                                            fontSize={14}
                                            type="Medium"
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </View>

                    {/* ── Action Button ── */}
                    <View style={styles.footer}>
                        <AppButton 
                            onPress={handleSubmit}
                            loading={isLoading}
                            title={isEditMode ? "Save Changes" : "Create New Saved Reply"}
                            backgroundColor={Colors.TEAL_PRIMARY_ALT}
                            borderColor={Colors.TEAL_PRIMARY_ALT}
                        />
                    </View>
                </ScrollView>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Metrics.verticalScale(40) },
    header: {
        paddingHorizontal: Metrics.scale(22),
        marginBottom: Metrics.verticalScale(10),
    },
    backBtn: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: 'rgba(0,0,0,0.1)', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    topTextSection: {
        paddingHorizontal: Metrics.scale(22),
        marginBottom: Metrics.verticalScale(30),
    },
    scrollContainer: { 
        paddingBottom: Metrics.verticalScale(40) 
    },
    form: { 
        paddingHorizontal: Metrics.scale(22),
        gap: 15 // Spacing between fields
    },
    autoCreateRow: {
        marginTop: Metrics.verticalScale(10),
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: Metrics.scale(22),
        marginTop: Metrics.verticalScale(60),
    }
});

export default CreateSavedReplyScreen;