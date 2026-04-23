import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Text } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';

const StarIcon = () => (
    <Svg width={90} height={90} viewBox="0 0 90 90" fill="none">
        {/* Sparkle lines */}
        <Line x1="18" y1="62" x2="28" y2="52" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="24" y1="72" x2="34" y2="62" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="10" y1="70" x2="20" y2="60" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        {/* Star */}
        <Polygon
            points="55,20 61,40 82,40 66,52 72,72 55,60 38,72 44,52 28,40 49,40"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);

const TrialSuccessScreen = () => {
    const { t } = useTranslation();

    const { params } = useRoute();
    const plan = params?.plan === 'annual' ? '14-day' : '7-day';

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
                <View style={styles.iconWrapper}>
                    <Svgicons path='motionStar' size={76} />
                </View>
                <Text style={styles.message}>
                    {t('auth.trial_success.message_1', { plan })}
                    <Text style={styles.highlight}>
                        {t('auth.trial_success.highlight')}
                    </Text>
                    {t('auth.trial_success.message_2')}
                </Text>
                <AppButton
                    title={t('auth.trial_success.next')}
                    onPress={() => navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)}
                    mt={48}
                    backgroundColor={Colors.MEDIUM_JUNGLE_GREEN}
                    color={Colors.WHITE}
                />
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconWrapper: {
        marginBottom: 36,
        alignItems: 'center'
    },
    message: {
        fontSize: 28,
        fontWeight: '400',
        color: '#111111',
        textAlign: 'center',
        lineHeight: 40,
    },
    highlight: {
        color: '#2BAE9F', // teal accent — match Colors.MEDIUM_JUNGLE_GREEN
        fontWeight: '600',
    },
});

export default TrialSuccessScreen;