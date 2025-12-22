import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import PhoneInputField from '@/components/molecules/Input/PhoneInputField';
import useLoginWithPhoneContainer from './LoginWithPhoneContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';

const LoginWithPhoneScreen = () => {
    const { control, errors, handleSubmit, isLoading, onSubmit, watch } = useLoginWithPhoneContainer()
    return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <AppText text="Please enter your phone number to continue." textAlign="center" fontSize={30} />
                <View style={styles.inputContainer}>
                    <PhoneInputField label="Phone Number *" control={control} errors={errors} countryFieldName="country" phoneFieldName="phoneNumber" />
                </View>
            </View>
            <AppButton
                title="Next"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                loading={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerRight: { flexDirection: 'row', gap: 10 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, borderColor: '#D1D1D1', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    backBtn: { paddingHorizontal: 25, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#D1D1D1', justifyContent: 'center' },
    centerContent: { flex: 1, justifyContent: 'center' },
    inputContainer: { marginTop: 40 },
    inputWrapper: { flexDirection: 'row', height: 60, borderWidth: 1, borderColor: '#0D3D39', borderRadius: 8, overflow: 'hidden' },
    countryPicker: { width: 70, backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#D1D1D1' },
    flagPlaceholder: { width: 24, height: 16, backgroundColor: '#006C35' },
    textInput: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#000' },
    nextBtn: { borderWidth: 1, borderColor: '#D1D1D1', borderRadius: 100, height: 56, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }
});

export default LoginWithPhoneScreen;