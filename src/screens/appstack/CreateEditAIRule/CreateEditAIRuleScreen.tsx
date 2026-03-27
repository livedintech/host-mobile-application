import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useCreateEditAIRuleContainer from './CreateEditAIRuleContainer';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useRoute } from '@react-navigation/native';
import { goBack } from '@/services/navigationService';

const CreateEditAIRuleScreen = () => {
    const { params } = useRoute() as any;
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
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
             

                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title Section */}
                    <View style={styles.topTextSection}>
                        <AppText
                            text={isEditMode ? "Edit AI Auto Reply" : "Create AI Auto Reply"}
                            fontSize={28}
                            type="Bold"
                            color={Colors.BLACK}
                            mb={10}
                        />
                        <AppText
                            text={isEditMode 
                                ? "Update triggers, tone, and assigned listings. Changes apply to future replies." 
                                : "Create an AI auto reply by defining triggers, tone, and applicable listings."}
                            fontSize={14}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            lineHeight={20}
                        />
                    </View>

                    {/* Form Fields Section */}
                    <View style={styles.form}>
                        <InputField
                            label="Rule Name"
                            name="name"
                            control={control}
                            errors={errors}
                            placeholder="Wifi Password"
                        />
                        
                        <TextareaField
                            label="Define Rule Instructions"
                            name="template"
                            control={control}
                            errors={errors}
                            placeholder="When a guest has an upcoming check-in, send a friendly reminder including..."
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

                        {/* Auto-Create Toggle */}
                        <Controller
                            control={control}
                            name="auto_send"
                            render={({ field: { onChange, value } }) => (
                                <Pressable
                                    style={styles.autoCreateRow}
                                    onPress={() => onChange(!value)}
                                >
                                    <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                    <AppText
                                        text="Auto-create for all new listings"
                                        ml={Metrics.scale(10)}
                                        color={Colors.BLACK}
                                        fontSize={14}
                                    />
                                </Pressable>
                            )}
                        />
                    </View>

                    {/* Submit Button - Styled as Teal Primary */}
                    <AppButton
                        title={isEditMode ? "Save Changes" : "Create Now"}
                        onPress={handleSubmit}
                        loading={isLoading}
                        mt={Metrics.verticalScale(40)}
                        backgroundColor={Colors.TEAL_PRIMARY_ALT}
                        borderColor={Colors.TEAL_PRIMARY_ALT}
                        color={Colors.WHITE}
                    />
                </ScrollView>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: Metrics.verticalScale(40) 
    },
    header: { 
        paddingHorizontal: Metrics.scale(22), 
        marginBottom: Metrics.verticalScale(10) 
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
    scrollContainer: { 
        paddingHorizontal: Metrics.scale(22), 
        paddingBottom: Metrics.verticalScale(40) 
    },
    topTextSection: { 
        marginBottom: Metrics.verticalScale(30) 
    },
    form: { 
        gap: Metrics.verticalScale(15) 
    },
    autoCreateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Metrics.verticalScale(10),
    },
});

export default CreateEditAIRuleScreen;