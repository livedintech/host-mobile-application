import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAutomationTemplateCreateEditContainer from './AutomationTemplateCreateEditContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import InputField from '@/components/molecules/Input/InputField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AppButton from '@/components/molecules/AppButton/AppButton';
import MentionTextarea from '@/components/molecules/Input/MentionTextarea';

const TRIGGER_DATA = [
    { label: 'Check-in', value: 'checkin' },
    { label: 'Check-out', value: 'checkout' },
];

const CreateAutomationTemplateScreen = () => {
    const { control, errors, handleSubmit, isLoading, isEditMode, transformedListing, transformedMessageVariables,transformedEvents } = useAutomationTemplateCreateEditContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.titleWrapper}>
                        <AppText
                            text={isEditMode ? "Edit Automation Template" : "Create Automation Template"}
                            fontSize={20}
                            type="Bold"
                            color={Colors.BRUNSWICK_GREEN}
                        />
                        <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                    </View>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Message Name:"
                        name="name"
                        control={control}
                        errors={errors}
                        placeholder="Check-in Reminder"
                    />

                    <MentionTextarea
                        label="Message Content" 
                        name="body"
                        control={control}
                        errors={errors}
                        variables={transformedMessageVariables}
                        placeholder="Hi {guest_first_name}"
                    />

                    <DropdownField
                        label="Event Trigger"
                        name="event"
                        control={control}
                        errors={errors}
                        data={transformedEvents}
                        placeholder="Select Trigger"
                    />

                    <MultiSelectDropdownField
                        label="Listing Selection"
                        name="listing_ids"
                        control={control}
                        errors={errors}
                        data={transformedListing || []}
                        placeholder="Select Multiple Options"
                    />

                    <Controller
                        control={control}
                        name="is_active"
                        render={({ field: { onChange, value } }) => (
                            <ButtonView
                                style={styles.autoCreateRow}
                                onPress={() => onChange(!value)}
                            >
                                <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                <AppText
                                    text="Auto-Create for New Listings"
                                    ml={Metrics.scale(2)}
                                    color={Colors.PINE_FOREST}
                                    fontSize={14}
                                    type="Medium"
                                />
                            </ButtonView>
                        )}
                    />
                </View>

                {/* Submit Button */}
                <AppButton
                    title={isEditMode ? "Update Now" : "Create Now"}
                    onPress={handleSubmit}
                    loading={isLoading}
                    mt={40}
                    mb={20}
                    backgroundColor={Colors.WHITE}
                    color={Colors.BRUNSWICK_GREEN}
                    borderColor={Colors.SMOOTH_GREY}
                    type="SemiBold"
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    scrollContainer: { paddingHorizontal: Metrics.scale(20), paddingBottom: Metrics.verticalScale(20) },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Metrics.verticalScale(20),
        justifyContent: 'center',
    },
    backBtn: {
        position: 'absolute',
        left: 0,
        padding: Metrics.scale(8),
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 100
    },
    titleWrapper: { flexDirection: 'row', alignItems: 'center' },
    form: { marginTop: Metrics.verticalScale(10) },
    autoCreateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Metrics.verticalScale(5),
        marginLeft: Metrics.scale(-10)
    },
});

export default CreateAutomationTemplateScreen;