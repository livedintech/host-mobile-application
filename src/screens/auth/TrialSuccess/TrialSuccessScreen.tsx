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

const TrialSuccessScreen = () => {
    const { params } = useRoute();
    const plan = params?.plan == "annual" ? "14-day" : "7-day"

    return (
         <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AppText
                    text={`Your 14-day trial has started successfully. You’ll be charged once the trial period ends.`}
                    textAlign="center"
                    fontSize={30}
                />
                <AppButton
                    title="Next"
                    onPress={() => navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)}
                    mt={80}
                    backgroundColor={Colors.MEDIUM_JUNGLE_GREEN}
                    color={Colors.WHITE}
                />
            </View>

        </SafeAreaView>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30
    }
});

export default TrialSuccessScreen;