import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useTTLockCredentialsContainer from './TTLockCredentialsContainer';
import InputField from '@/components/molecules/Input/InputField';
import PasswordField from '@/components/molecules/Input/PasswordField';
import AppButton from '@/components/molecules/AppButton/AppButton';

const TTLockCredentialsScreen = () => {
    const { control, errors, handleSubmit, isLoading } = useTTLockCredentialsContainer();

    return (
        <View style={styles.container}>
            <ScrollView 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.titleWrapper}>
                    <AppText 
                        text="Enter Your TT Lock" 
                        fontSize={28} 
                        type="Bold" 
                        color={Colors.BRUNSWICK_GREEN} 
                        textAlign="center"
                    />
                    <AppText 
                        text="Account Credentials" 
                        fontSize={28} 
                        type="Bold" 
                        color={Colors.BRUNSWICK_GREEN} 
                        textAlign="center"
                    />
                </View>
                <View style={styles.form}>
                    <InputField
                        label="Username"
                        name="username"
                        control={control}
                        errors={errors}
                        placeholder=""
                        keyboardType="email-address"
                    />

                    <PasswordField
                        label="Password"
                        name="password"
                        control={control}
                        errors={errors}
                        placeholder=""
                    />
                </View>
        
                <AppButton
                    title="Connect"
                    onPress={handleSubmit}
                    loading={isLoading}
                    mt={Metrics.verticalScale(60)}
                    
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.WHITE,
        paddingHorizontal: Metrics.baseMargin
    },
   
    titleWrapper: {
        marginTop: Metrics.verticalScale(60),
        marginBottom: Metrics.verticalScale(50),
    },
    form: {
        width: '100%',
    }
});

export default TTLockCredentialsScreen;