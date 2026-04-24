import { StyleSheet, View } from 'react-native';
import React from 'react';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import InputField from '@/components/molecules/Input/InputField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import BGImage from '@/components/molecules/BGImage/BGImage';
import useBookingComStep3Container from './BookingComStep3Container';
import { useTranslation } from 'react-i18next';

const BookingComStep3Screen = () => {
    const { t } = useTranslation();
    const { control, errors, handleContinue, hasListing, isSubmitting } = useBookingComStep3Container();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.mainContainer}>
                <RefreshableScrollView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <AppText text={t('app.booking_com_step3.title_prefix')} type="Regular" fontSize={32} color={Colors.BLACK} style={{ lineHeight: 40 }}>
                            <AppText text={t('app.booking_com_step3.title_highlight')} type="Bold" fontSize={32} color={Colors.TEAL_PRIMARY_ALT} />
                        </AppText>

                        <View style={styles.inputWrapper}>
                            <InputField label={t('app.booking_com_step3.name_label')} name="title" control={control} errors={errors} placeholder={t('app.booking_com_step3.name_placeholder')} />

                            {!hasListing && (
                                <View style={{ marginTop: 20 }}>
                                    <InputField label={t('app.booking_com_step3.rate_label')} name="rate" control={control} errors={errors} placeholder={t('app.booking_com_step3.rate_placeholder')} keyboardType="numeric" />
                                </View>
                            )}

                            <AppText text={t('app.booking_com_step3.description')} type="Regular" fontSize={14} color={Colors.DARK_CHARCOAL_OPACITY} mt={15} style={{ lineHeight: 20 }} />
                        </View>
                    </View>
                </RefreshableScrollView>
                <View style={styles.footer}>
                    <AppButton title={t('app.booking_com_step3.continue')} onPress={handleContinue} loading={isSubmitting} />
                </View>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    container: { paddingHorizontal: Metrics.baseMargin },
    contentContainer: { marginTop: 60 },
    inputWrapper: { marginTop: 40 },
    footer: { paddingHorizontal: Metrics.baseMargin, paddingBottom: 40 }
});

export default BookingComStep3Screen;