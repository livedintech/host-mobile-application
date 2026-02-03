import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAutomationTemplateCreateEditContainer from './AutomationTemplateCreateEditContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import InputField from '@/components/molecules/Input/InputField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AppButton from '@/components/molecules/AppButton/AppButton';

const TRIGGER_DATA = [
    { label: 'Check-in', value: 'checkin' },
    { label: 'Check-out', value: 'checkout' },
];

const LISTING_DATA = [
    { label: 'Al Hammd Villa', value: '1' },
    { label: 'Downtown Apartment', value: '2' },
    { label: 'Ocean View Suite', value: '3' },
];

const CreateAutomationTemplateScreen = ({ route }: any) => {
    const { control, errors, handleSubmit, isLoading, isEditMode } = useAutomationTemplateCreateEditContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* Header */}
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

                {/* Form Fields */}
                <View style={styles.form}>
                    <InputField
                        label="Message Name:"
                        name="messageName"
                        control={control}
                        errors={errors}
                        placeholder="Check-in Reminder"
                    />

                    <TextareaField
                        label="Message Content"
                        name="messageContent"
                        control={control}
                        errors={errors}
                        placeholder="Hi {{Guest First Name}}, welcome to..."
                        multiline
                    />

                    {/* Single Dropdown for Event Trigger */}
                    <DropdownField
                        label="Event Trigger"
                        name="eventTrigger"
                        control={control}
                        errors={errors}
                        data={TRIGGER_DATA}
                        placeholder="Select Trigger"
                    />

                    {/* MultiSelect Dropdown for Listing Selection */}
                    <MultiSelectDropdownField
                        label="Listing Selection"
                        name="listings"
                        control={control}
                        errors={errors}
                        data={LISTING_DATA}
                        placeholder="Select Multiple Options"
                    />

                    {/* Checkbox for Auto-Create */}
                    <Controller
                        control={control}
                        name="autoCreate"
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