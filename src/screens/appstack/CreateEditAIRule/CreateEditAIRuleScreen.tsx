import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
                            text={isEditMode ? t('app.create_ai_rule.title_edit') : t('app.create_ai_rule.title_create')}
                            fontSize={28}
                            type="Bold"
                            color={Colors.BLACK}
                            mb={10}
                        />
                        <AppText
                            text={isEditMode ? t('app.create_ai_rule.desc_edit') : t('app.create_ai_rule.desc_create')}
                            fontSize={14}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            lineHeight={20}
                        />
                    </View>

                    {/* Form Fields Section */}
                    <View style={styles.form}>
                        <InputField
                            label={t('app.create_ai_rule.name_label')}
                            name="name"
                            control={control}
                            errors={errors}
                            placeholder={t('app.create_ai_rule.name_placeholder')}
                        />
                        
                        <TextareaField
                            label={t('app.create_ai_rule.instructions_label')}
                            name="template"
                            control={control}
                            errors={errors}
                            placeholder={t('app.create_ai_rule.instructions_placeholder')}
                            multiline
                        />

                        <MultiSelectDropdownField
                            label={t('app.create_ai_rule.property_label')}
                            name="listing_ids"
                            control={control}
                            errors={errors}
                            data={transformedListing || []}
                            placeholder={t('app.create_ai_rule.property_placeholder')}
                            dropdownPosition='top'
                        />

                        {/* Auto-Create Toggle */}
                        <Controller
                            control={control}
                            name="auto_send"
                            render={({ field: { onChange, value } }) => (
                                <AppPressable
                                    style={styles.autoCreateRow}
                                    onPress={() => onChange(!value)}
                                >
                                    <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                    <AppText
                                        text={t('app.create_ai_rule.auto_create')}
                                        ml={Metrics.scale(10)}
                                        color={Colors.BLACK}
                                        fontSize={14}
                                    />
                                </AppPressable>
                            )}
                        />
                    </View>

                    {/* Submit Button - Styled as Teal Primary */}
                    <AppButton
                        title={isEditMode ? t('app.create_ai_rule.save_btn') : t('app.create_ai_rule.create_btn')}
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