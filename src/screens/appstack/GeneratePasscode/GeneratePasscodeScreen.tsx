import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useGeneratePasscodeContainer from './GeneratePasscodeContainer';
import InputField from '@/components/molecules/Input/InputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';

const GeneratePasscodeScreen = () => {
    const { type, control, errors, handleSubmit, instructionText, isLoading } = useGeneratePasscodeContainer();

    const timedFields = [
        { label: 'Select Start Date', name: 'startDate', icon: 'calendarIcon', placeholder: 'mm/dd/yy' },
        { label: 'Select Start Time', name: 'startTime', icon: 'clockIcon', placeholder: '-- : --' },
        { label: 'Select End Date', name: 'endDate', icon: 'calendarIcon', placeholder: 'mm/dd/yy' },
        { label: 'Select End Time', name: 'endTime', icon: 'clockIcon', placeholder: '-- : --' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {/* Dynamic Title based on images */}
                <View style={styles.titleWrapper}>
                    <AppText
                        text={type === 'Timed' ? "Enter Passcode Details" : "Enter your Code Name"}
                        fontSize={32}
                        type="Bold"
                        color={Colors.BRUNSWICK_GREEN}
                        textAlign="center"
                    />
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Name*"
                        name="name"
                        control={control}
                        errors={errors}
                        placeholder={type === 'Timed' ? "" : "Check-in Reminder"}
                    />

                    {/* Conditional Rendering for Timed Type */}
                    {/* {type === 'Timed' && timedFields.map((field) => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            control={control}
                            errors={errors}
                            placeholder={field.placeholder}
                            renderRightIcon={() => <Svgicons path={field.icon} size={20} color={Colors.BRUNSWICK_GREEN} />}
                        />
                    ))} */}
                    {type === 'Timed' && (
                        <>
                            <DateTimeInputField
                                name="startDate"
                                control={control}
                                errors={errors}
                                label="Select Start Date"
                                placeholder="mm/dd/yy"
                                mode="date"
                                rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />}
                            />

                            <DateTimeInputField
                                name="startTime"
                                control={control}
                                errors={errors}
                                label="Select Start Time"
                                placeholder="-- : --"
                                mode="time"
                                rightIcon={<Svgicons path="Clock" size={20} color={Colors.BRUNSWICK_GREEN} />}
                            />

                            <DateTimeInputField
                                name="endDate"
                                control={control}
                                errors={errors}
                                label="Select End Date"
                                placeholder="mm/dd/yy"
                                mode="date"
                                rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />}
                            />

                            <DateTimeInputField
                                name="endTime"
                                control={control}
                                errors={errors}
                                label="Select End Time"
                                placeholder="-- : --"
                                mode="time"
                                rightIcon={<Svgicons path="Clock" size={20} color={Colors.BRUNSWICK_GREEN} />}
                            />
                        </>
                    )}

                </View>

                <AppText
                    text={instructionText}
                    fontSize={13}
                    color={Colors.SUPER_GREY}
                    textAlign="center"
                    style={styles.instruction}
                />
                <AppButton
                    title="Generate Passcode"
                    onPress={handleSubmit}
                    mt={Metrics.verticalScale(40)}
                    loading={isLoading}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: Metrics.baseMargin
    },
    backBtn: {
        width: 45, height: 45, borderRadius: 25,
        borderWidth: 1, borderColor: Colors.SMOOTH_GREY,
        justifyContent: 'center', alignItems: 'center'
    },
    titleWrapper: { marginTop: 60, marginBottom: 50 },
    form: { width: '100%' },
    instruction: {
        marginTop: 20,
        lineHeight: 18,
        paddingHorizontal: 10
    }
});

export default GeneratePasscodeScreen;