import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useCreateEditAIRuleContainer from './CreateEditAIRuleContainer';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useRoute } from '@react-navigation/native';



const CreateEditAIRuleScreen = () => {
    const { params } = useRoute() as any
    const editData = params?.editData;
    const {
        control,
        errors,
        handleSubmit,
        isLoading,
        isEditMode,
        transformedListing,
    } = useCreateEditAIRuleContainer(editData);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.titleWrapper}>
                        <AppText
                            text={isEditMode ? "Edit AI Auto Reply" : "Create AI Auto Reply"}
                            fontSize={22}
                            type="Bold"
                            color={Colors.BRUNSWICK_GREEN}
                        />
                        <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                    </View>
                </View>

                {/* Form Fields Section */}
                <View style={styles.form}>
                    <InputField
                        label="Rule Name:"
                        name="name"
                        control={control}
                        errors={errors}
                        placeholder="Check-in Reminder"
                    />
                    <TextareaField
                        label="Define Rule Instructions"
                        name="template"
                        control={control}
                        errors={errors}
                        placeholder="Send a polite check-in reminder with guest name, listing info, date/time, Wi-Fi details, and door code."
                        multiline
                    />
                    <MultiSelectDropdownField
                        label="Listing Selection"
                        name="listing_id"
                        control={control}
                        errors={errors}
                        data={transformedListing || []}
                        placeholder="Select Listing"
                    />
                    {/* Auto-Create for New Listings */}
                    <Controller
                        control={control}
                        name="auto_send"
                        render={({ field: { onChange, value } }) => (
                            <ButtonView
                                style={styles.autoCreateRow}
                                onPress={() => onChange(!value)}
                            >
                                <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                <AppText
                                    text="Auto Send Reply"
                                    ml={Metrics.scale(2)}
                                    color={Colors.PINE_FOREST}
                                    fontSize={14}
                                    type="Medium"
                                />
                            </ButtonView>
                        )}
                    />
                </View>

                {/* Shared Submit Button */}
                <AppButton
                    title={isEditMode ? "Save Changes" : "Create Now"}
                    onPress={handleSubmit}
                    loading={isLoading}
                    mt={Metrics.verticalScale(40)}
                    backgroundColor={Colors.WHITE}
                    color={Colors.BRUNSWICK_GREEN}
                    borderColor={Colors.SMOOTH_GREY}
                    type="SemiBold"
                    fontSize={16}
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

export default CreateEditAIRuleScreen;