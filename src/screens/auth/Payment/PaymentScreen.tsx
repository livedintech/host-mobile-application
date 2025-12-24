import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import usePaymentContainer from './PaymentContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const PaymentScreen = () => {
    const { selectedPlan, onPlanSelect, handleStartTrial } = usePaymentContainer();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Title & Subtitle */}
                <View style={styles.titleSection}>
                    <AppText text="Payment" fontSize={36} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <AppText
                        text="Your card is required to start the free trial. No charges during the trial. You can remove your card anytime from your Profile."
                        fontSize={15} textAlign="center" mt={15} lineHeight={22}
                    />
                </View>

                {/* Card Provider Logos */}
                <View style={styles.providerRow}>
                    <View style={styles.providerBox}><Image source={require('@/assets/img/mastercard.png')} style={styles.icon} resizeMode="contain" /></View>
                    <View style={styles.providerBox}><Image source={require('@/assets/img/visa.png')} style={styles.icon} resizeMode="contain" /></View>
                    <View style={styles.providerBox}><Image source={require('@/assets/img/unionpay.png')} style={styles.icon} resizeMode="contain" /></View>
                </View>

                {/* Selection Cards */}
                <View style={styles.planSection}>
                    <ButtonView
                        activeOpacity={0.9}
                        onPress={() => onPlanSelect('annual')}
                        style={[styles.planCard, selectedPlan === 'annual' && styles.activeCard]}
                    >
                        <AppText text="Annual" fontSize={20} type="Bold" color={Colors.PINE_FOREST} />
                        <AppText text="First 14 days free – Then SAR 17000/Year" fontSize={14} color={Colors.PINE_FOREST} mt={6} />
                    </ButtonView>

                    <ButtonView
                        activeOpacity={0.9}
                        onPress={() => onPlanSelect('monthly')}
                        style={[styles.planCard, selectedPlan === 'monthly' && styles.activeCard, { marginTop: 16 }]}
                    >
                        <AppText text="Monthly" fontSize={20} type="Bold" color={Colors.PINE_FOREST} />
                        <AppText text="First 7 days free – Then SAR 1500/Month" fontSize={14} color={Colors.PINE_FOREST} mt={6} />
                    </ButtonView>
                </View>

                {/* Action Button */}
                <AppButton
                    title={`Start ${selectedPlan === 'annual' ? '14' : '7'}-day free trial`}
                    onPress={handleStartTrial}
                    mt={30}
                    fontSize={16}
                />

                {/* Legal Disclaimer */}
                <View style={styles.legalContainer}>
                    <Text style={styles.legalText}>
                        By placing this order, you agree to the{' '}
                        <Text style={styles.boldText}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={styles.boldText}>Privacy Policy</Text>
                        . Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    circleBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    backBtn: { paddingHorizontal: 28, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center' },
    titleSection: {  alignItems: 'center' },
    providerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.verticalScale(51), gap: 35 },
    providerBox: { width: Metrics.scale(72), height: Metrics.verticalScale(48), justifyContent: 'center', alignItems: 'center', },
    icon: { width: Metrics.scale(72), height: '100%' },
    planSection: { marginTop: 45 },
    planCard: {
        padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#E0E0E0',
        backgroundColor: '#F8F9F9' 
    },
    activeCard: {
        borderColor: Colors.BRUNSWICK_GREEN,
        borderWidth: 2,
        backgroundColor: Colors.GLOSSY_PLATINUM
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