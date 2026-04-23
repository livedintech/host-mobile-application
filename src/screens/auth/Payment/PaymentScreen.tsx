import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import usePaymentContainer from './PaymentContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import { useTranslation } from 'react-i18next';

const PaymentScreen = () => {
    const { selectedPlan, onPlanSelect, handleStartTrial, handleSkipThis, addons, base,pricing,isLoading,refetch } = usePaymentContainer();
    const { t } = useTranslation();


    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <SafeAreaView style={styles.container}>
                <RefreshableScrollView isLoading={isLoading} onRefresh={refetch} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Title & Subtitle */}
                    <View style={styles.titleSection}>
                        <AppText text={t('auth.payment.title')} fontSize={36} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                        <AppText
                            text={t('auth.payment.subtitle')}
                            fontSize={15} textAlign="center" mt={15} lineHeight={22}
                        />
                    </View>

                    {/* Card Provider Logos */}
                    <View style={[styles.providerRow, { marginTop: Metrics.verticalScale(46) }]}>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoMasterCardIcon' size={46} />
                        </GlassCard>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoVisaCardIcon' size={46} />
                        </GlassCard>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoMadaCardIcon' size={46} />
                        </GlassCard>
                    </View>
                    <View style={styles.providerRow}>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoStcCardIcon' size={46} />
                        </GlassCard>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoAppleCardICon' size={46} />
                        </GlassCard>
                        <GlassCard width={100} style={styles.iconCard}>
                            <Svgicons path='LogoGooglePayCardIcon' size={46} />
                        </GlassCard>
                    </View>

                    {/* Selection Cards */}
                    <GlassCard style={[styles.planSection, selectedPlan === 'monthly' && styles.activeCard]}>
                        {/* <ButtonView
                        activeOpacity={0.9}
                        onPress={() => onPlanSelect('annual')}
                        style={[styles.planCard, selectedPlan === 'annual' && styles.activeCard]}
                    >
                        <AppText text="Annual" fontSize={20} type="Bold" color={Colors.PINE_FOREST} />
                        <AppText text="First 14 days free – Then SAR 17000/Year" fontSize={14} color={Colors.PINE_FOREST} mt={6} />
                    </ButtonView> */}
                        <Pressable
                            onPress={() => onPlanSelect('monthly')}
                            style={[styles.planCard, selectedPlan === 'monthly' && styles.activeCard, { marginTop: 16 }]}
                        >
                            <AppText text={t('auth.payment.monthly')} fontSize={20} type="Bold" color={Colors.PINE_FOREST} />
                            <AppText text={t('auth.payment.monthly_trial', { price: pricing })} fontSize={13} color={Colors.BLACK} mt={6} />
                        </Pressable>
                    </GlassCard>
                    <GlassCard style={styles.features}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <AppText text={t('auth.payment.what_included')} fontSize={18} type='Medium' mb={13} />
                            <GlassCard width={40} style={styles.iconCircle}>
                                <Svgicons path='giftImg' />
                            </GlassCard>
                        </View>
                        {base.map((e: { id: string; module_name: string; code?: string }) => {
                            return (
                                <View style={styles.itemStyle} key={e?.id}>
                                    {e?.code && (
                                        <GlassCard width={40} style={styles.iconCircle}>
                                        <Svgicons path={e?.code} />
                                    </GlassCard>
                                    )}
                                    
                                    <AppText text={e?.module_name} ml={10} />
                                </View>
                            )
                        })}
                    </GlassCard>
                    <GlassCard style={styles.addons}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <AppText text={t('auth.payment.additional_addons')} fontSize={18} type='Medium' mb={13} />
                            <GlassCard width={40} style={styles.iconCircle}>
                                <Svgicons path='giftImg' />
                            </GlassCard>
                        </View>
                        {addons.map((e: { id: string; module_name: string; code?: string  }) => {
                            return (
                                <View style={styles.itemStyle} key={e?.id}>
                                    {e?.code && (
                                        <GlassCard width={40} style={styles.iconCircle}>
                                        <Svgicons path={e?.code} />
                                    </GlassCard>
                                    )}
                                    <AppText text={e?.module_name} ml={10} />
                                </View>
                            )
                        })}
                    </GlassCard>

                    {/* Action Button */}
                    <AppButton
                        title={t('auth.payment.start_trial')}
                        onPress={handleStartTrial}
                        mt={30}
                        fontSize={16}
                        backgroundColor={Colors.MEDIUM_JUNGLE_GREEN}
                        color={Colors.WHITE}
                    />
                    {/* <AppButton
                        color={Colors.WHITE}
                        backgroundColor={Colors.BRUNSWICK_GREEN}
                        title={`Skip`}
                        onPress={handleSkipThis}
                        mt={10}
                        fontSize={16}
                    /> */}


                    {/* Legal Disclaimer */}
                    <View style={styles.legalContainer}>
                        <Text style={styles.legalText}>
                            {t('auth.payment.legal_1')}{' '}
                            <Text style={styles.boldText}>{t('auth.payment.terms_of_service')}</Text>
                            {' '}{t('auth.payment.legal_2')}{' '}
                            <Text style={styles.boldText}>{t('auth.payment.privacy_policy')}</Text>
                            {t('auth.payment.legal_3')}
                        </Text>
                    </View>
                </RefreshableScrollView>
            </SafeAreaView>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    circleBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    backBtn: { paddingHorizontal: 28, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center' },
    titleSection: { alignItems: 'center' },
    providerRow: { flexDirection: 'row', justifyContent: 'space-evenly', gap: 0 },
    icon: { width: Metrics.scale(72), height: '100%' },
    planSection: { marginTop: 45, flex: 1, width: '100%' },
    features: { marginTop: 25, flex: 1, width: '100%' },
    addons: { marginTop: 5, flex: 1, width: '100%' },
    iconCircle: {
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        padding: 0,
        backgroundColor: '#D9D9D900',
    },
    iconCard: {
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Metrics.verticalScale(10),
        padding: 0,
        backgroundColor: '#D9D9D900',
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Metrics.verticalScale(13)
    },
    planCard: {
        // padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#E0E0E0',
        // backgroundColor: '#F8F9F9'
    },
    activeCard: {
    },
    trialBtn: {
        backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.BRUNSWICK_GREEN,
        borderRadius: 100, height: 58, marginTop: 45
    },
    trialBtnText: { color: Colors.BRUNSWICK_GREEN, fontSize: 16 },
    legalContainer: {
        marginTop: 30,
        paddingHorizontal: 15, // Image ke mutabiq margins
    },
    legalText: {
        fontSize: Metrics.generatedFontSize(11),
        color: Colors.PINE_FOREST,
        textAlign: 'center',
        lineHeight: 14, // Design ki readability ke liye
        fontFamily: 'Your-Regular-Font', // Agar aap custom font use kar rahe hain
    },
    boldText: {
        fontWeight: '700', // Pixel-perfect bold weight
        color: Colors.PINE_FOREST,
    },

});

export default PaymentScreen;