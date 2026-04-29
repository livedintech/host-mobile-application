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
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';

const CreateSavedReplyScreen = () => {
    const { 
        control, 
        errors, 
        handleSubmit, 
        isLoading, 
        isEditMode, 
        transformedListing
    } = useSavedRepliesCreateEditContainer();
    const { t } = useTranslation();

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
                            text={isEditMode ? t('app.saved_replies_create_edit.title_edit') : t('app.saved_replies_create_edit.title_create')}
                            fontSize={28} 
                            type="Bold" 
                            color={Colors.BLACK} 
                            mb={10} 
                        />
                        <AppText 
                            text={isEditMode ? t('app.saved_replies_create_edit.desc_edit') : t('app.saved_replies_create_edit.desc_create')}
                            fontSize={14} 
                            color={Colors.DARK_CHARCOAL_OPACITY} 
                            lineHeight={20}
                        />
                    </View>

                    {/* ── Form Fields ── */}
                    <View style={styles.form}>
                        <InputField
                            label={t('app.saved_replies_create_edit.name_label')}
                            name="title"
                            control={control}
                            errors={errors}
                            placeholder={t('app.saved_replies_create_edit.name_placeholder')}
                            // Adding specific styles to match glass design if your InputField supports it
                        />

                        <TextareaField
                            label={t('app.saved_replies_create_edit.content_label')}
                            name="body"
                            control={control}
                            errors={errors}
                            placeholder={t('app.saved_replies_create_edit.content_placeholder')}
                            multiline
                        />

                        <MultiSelectDropdownField
                            label={t('app.saved_replies_create_edit.property_label')}
                            name="listing_ids"
                            control={control}
                            errors={errors}
                            data={transformedListing || []}
                            placeholder={t('app.saved_replies_create_edit.property_placeholder')}
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
                                            text={t('app.saved_replies_create_edit.auto_create')}
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
                            title={isEditMode ? t('app.saved_replies_create_edit.save_btn') : t('app.saved_replies_create_edit.create_btn')}
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