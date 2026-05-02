import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
import { useTranslation } from 'react-i18next';

const CreateAutomationTemplateScreen = () => {
    const {
        control,
        errors,
        handleSubmit,
        isLoading,
        isEditMode,
        transformedListing,
        transformedMessageVariables,
        transformedEvents,
        transformedEventTimes,
        selectedEvent,
    } = useAutomationTemplateCreateEditContainer();

    const showEventTime = selectedEvent === 'check_in' || selectedEvent === 'check_out';
    const { t } = useTranslation();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title & Description */}
                    <View style={styles.topTextSection}>
                        <AppText
                            text={isEditMode ? t('app.automation_create_edit.title_edit') : t('app.automation_create_edit.title_create')}
                            fontSize={28}
                            type="Bold"
                            color={Colors.BLACK}
                            mb={10}
                        />
                        <AppText
                            text={isEditMode ? t('app.automation_create_edit.desc_edit') : t('app.automation_create_edit.desc_create')}
                            fontSize={14}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            lineHeight={20}
                        />
                    </View>

                    <View style={styles.form}>
                        <InputField
                            label={t('app.automation_create_edit.name_label')}
                            name="name"
                            control={control}
                            errors={errors}
                            placeholder={t('app.automation_create_edit.name_placeholder')}
                        // labelStyle={styles.labelStyle}
                        />

                        <MentionTextarea
                            label={t('app.automation_create_edit.content_label')}
                            name="body"
                            control={control}
                            errors={errors}
                            variables={transformedMessageVariables}
                            placeholder={t('app.automation_create_edit.content_placeholder')}
                        // labelStyle={styles.labelStyle}
                        />

                        <DropdownField
                            label={t('app.automation_create_edit.event_label')}
                            name="event"
                            control={control}
                            errors={errors}
                            data={transformedEvents}
                            placeholder={t('app.automation_create_edit.event_placeholder')}
                        // labelStyle={styles.labelStyle}
                        />

                        {showEventTime && (
                            <DropdownField
                                label={t('app.automation_create_edit.event_time_label')}
                                name="temp_event_time"
                                control={control}
                                errors={errors}
                                data={transformedEventTimes}
                                placeholder={t('app.automation_create_edit.event_time_placeholder')}
                            />
                        )}

                        <MultiSelectDropdownField
                            label={t('app.automation_create_edit.property_label')}
                            name="listing_ids"
                            control={control}
                            errors={errors}
                            data={transformedListing || []}
                            placeholder={t('app.automation_create_edit.property_placeholder')}
                            labelStyle={styles.labelStyle}
                        />

                        <Controller
                            control={control}
                            name="is_active"
                            render={({ field: { onChange, value } }) => (
                                <AppPressable
                                    style={styles.autoCreateRow}
                                    onPress={() => onChange(!value)}
                                >
                                    <Checkbox isChecked={value} onPress={() => onChange(!value)} />
                                    <AppText
                                        text={t('app.automation_create_edit.auto_create')}
                                        ml={10}
                                        color={Colors.MIDNIGHT}
                                        fontSize={14}
                                        type="Medium"
                                    />
                                </AppPressable>
                            )}
                        />
                    </View>

                    {/* Submit Button */}
                    <AppButton
                        title={isEditMode ? t('app.automation_create_edit.save_btn') : t('app.automation_create_edit.create_btn')}
                        onPress={handleSubmit}
                        loading={isLoading}
                        mt={40}
                        mb={40}
                        backgroundColor={Colors.TEAL_PRIMARY_ALT}
                        borderColor={Colors.TEAL_PRIMARY_ALT}
                    />
                </KeyboardAwareScrollView>
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