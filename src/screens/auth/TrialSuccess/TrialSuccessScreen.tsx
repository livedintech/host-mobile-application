import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';

const TrialSuccessScreen = () => {
    const { params } = useRoute();
    const plan = params?.plan == "annual" ? "14-day" : "7-day"

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AppText
                    text={`Your ${plan} trial has started successfully. You’ll be charged once the trial period ends.`}
                    textAlign="center"
                    fontSize={30}
                />
                <AppButton
                    title="Continue"
                    onPress={() => navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)}
                    mt={80}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
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