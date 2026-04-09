import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAutomationTemplateCreateEditContainer from './AutomationTemplateCreateEditContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import InputField from '@/components/molecules/Input/InputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import MentionTextarea from '@/components/molecules/Input/MentionTextarea';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Checkbox from '@/components/molecules/Input/CheckBox';
import { Controller } from 'react-hook-form';
import { goBack } from '@/services/navigationService';

const CreateAutomationTemplateScreen = () => {
    const {
        control,
        errors,
        handleSubmit,
        isLoading,
        isEditMode,
        transformedListing,
        transformedMessageVariables,
        transformedEvents
    } = useAutomationTemplateCreateEditContainer();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title & Description */}
                    <View style={styles.topTextSection}>
                        <AppText
                            text={isEditMode ? "Edit Automation Template" : "Create Automation Template"}
                            fontSize={28}
                            type="Bold"
                            color={Colors.BLACK}
                            mb={10}
                        />
                        <AppText
                            text={isEditMode
                                ? "Update the trigger, message content, timing, and assigned listings. Changes apply to all future automated messages."
                                : "Set up an automation by defining the trigger, message content, timing, and applicable listings."
                            }
                            fontSize={14}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            lineHeight={20}
                        />
                    </View>

                    <View style={styles.form}>
                        <InputField
                            label="Message Name"
                            name="name"
                            control={control}
                            errors={errors}
                            placeholder="Wifi Password"
                        // labelStyle={styles.labelStyle}
                        />

                        <MentionTextarea
                            label="Message Content"
                            name="body"
                            control={control}
                            errors={errors}
                            variables={transformedMessageVariables}
                            placeholder="Hi Sir, here are your Wi-Fi details..."
                        // labelStyle={styles.labelStyle}
                        />

                        <DropdownField
                            label="Event Trigger"
                            name="event"
                            control={control}
                            errors={errors}
                            data={transformedEvents}
                            placeholder="Check-in"
                        // labelStyle={styles.labelStyle}
                        />

                        <MultiSelectDropdownField
                            label="Select Property"
                            name="listing_ids"
                            control={control}
                            errors={errors}
                            data={transformedListing || []}
                            placeholder="Select Multiple Options"
                            labelStyle={styles.labelStyle}
                        />

                        <Controller
                            control={control}
                            name="is_active"
                            render={({ field: { onChange, value } }) => (
                                <Pressable
                                    style={styles.autoCreateRow}
                                    onPress={() => onChange(!value)}
                                >
                                    <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                    <AppText
                                        text="Auto-create for all new listings"
                                        ml={10}
                                        color={Colors.MIDNIGHT}
                                        fontSize={14}
                                        type="Medium"
                                    />
                                </Pressable>
                            )}
                        />
                    </View>

                    {/* Submit Button */}
                    <AppButton
                        title={isEditMode ? "Save Changes" : "Create New Saved Reply"}
                        onPress={handleSubmit}
                        loading={isLoading}
                        mt={40}
                        mb={40}
                        backgroundColor={Colors.TEAL_PRIMARY_ALT}
                        borderColor={Colors.TEAL_PRIMARY_ALT}
                    />
                </ScrollView>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: {
        paddingHorizontal: Metrics.scale(22),
        paddingTop: Metrics.verticalScale(40)
    },
    header: {
        marginBottom: Metrics.verticalScale(25),
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    topTextSection: {
        marginBottom: Metrics.verticalScale(30),
    },
    form: {
        gap: Metrics.verticalScale(20)
    },
    labelStyle: {
        fontSize: 16,
        // type: 'Bold',
        color: Colors.MIDNIGHT,
        marginBottom: 8,
    },
    autoCreateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Metrics.verticalScale(10),
    },
});

export default CreateAutomationTemplateScreen;