import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import useCreateAccountContainer from './CreateAccountContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateAccountScreen = () => {
    const { control, errors, handleSubmit, isLoading } = useCreateAccountContainer();

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Circles */}
            <View style={styles.circleBgContainer} pointerEvents="none">
                <View style={styles.circleLarge} />
                <View style={styles.circleMedium} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.innerContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <AppText
                            text="Create your free account"
                            type="Bold"
                            fontSize={28}
                            textAlign="center"
                            color={Colors.BRUNSWICK_GREEN}
                        />
                        <AppText
                            text="Welcome to livedin. Let’s build a brighter hosting journey together."
                            type="Regular"
                            textAlign="center"
                            color={Colors.BLACK}
                            style={styles.subTitle}
                        />
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <InputField
                            label="Full Name *"
                            name="fullName"
                            control={control}
                            errors={errors}
                            placeholder=""
                        />
                        <PasswordField
                            label="Password *"
                            name="password"
                            control={control}
                            errors={errors}
                            placeholder=""
                        />
                        <AppText
                            text="Please choose a stronger password. Try a mix of letters, numbers, and symbols."
                            color={Colors.SUPER_GREY}
                        />
                    </View>

                    {/* Submit Button */}
                    <View style={styles.footer}>
                        <AppButton
                            onPress={handleSubmit}
                            title="Next"
                            loading={isLoading}
                            style={styles.nextBtn}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    innerContainer: { flexGrow: 1, paddingHorizontal: Metrics.scale(25), justifyContent: 'center' },
    titleSection: { marginBottom: Metrics.verticalScale(40) },
    subTitle: { marginTop: 10, lineHeight: 24, paddingHorizontal: 10 },
    form: { width: '100%' },
    footer: { marginTop: Metrics.verticalScale(50) },
    nextBtn: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 100,
    },
    // Background Circles
    circleBgContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
    circleLarge: {
        width: Metrics.screenWidth * 1.5,
        height: Metrics.screenWidth * 1.5,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: '#F9F9F9',
        position: 'absolute'
    },
    circleMedium: {
        width: Metrics.screenWidth * 0.9,
        height: Metrics.screenWidth * 0.9,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        position: 'absolute'
    },
});
