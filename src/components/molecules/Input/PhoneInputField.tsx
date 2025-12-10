import React, { useRef } from 'react';
import { View, StyleSheet, TextInput, Animated } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

import ChevronDownIcon from '@/assets/icons/arrowDown.svg';

interface PhoneInputFieldProps {
    control: Control<any>;
    errors: FieldErrors;
    label: string;
    countryFieldName: string;
    phoneFieldName: string;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
    control,
    errors,
    label,
    countryFieldName,
    phoneFieldName,
}) => {
    const [pickerVisible, setPickerVisible] = React.useState(false);

    const hasError = errors[countryFieldName] || errors[phoneFieldName];

    const animation = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const animatedBorderColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.GAINSBORO, Colors.CORAL_REEF],
    });

    const animatedBackgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.CULTURED, Colors.WHITE],
    });

    return (
        <View style={styles.wrapper}>
            <AppText text={label} style={styles.label} />

            <Animated.View
                style={[
                    styles.container,
                    {
                        borderColor: hasError ? Colors.INDIAN_RED : animatedBorderColor,
                        backgroundColor: animatedBackgroundColor,
                    },
                ]}
            >
                {/* Country Picker */}
                <Controller
                    control={control}
                    name={countryFieldName}
                    render={({ field: { onChange, value } }) => (
                        <ButtonView onPress={() => setPickerVisible(true)} style={styles.pickerButton}>
                            <CountryPicker
                                withFlag
                                withFilter
                                withCallingCode
                                countryCode={value.cca2 as CountryCode}
                                onSelect={(country: Country) => {
                                    onChange({
                                        cca2: country.cca2,
                                        callingCode: country.callingCode[0] || '',
                                    });
                                }}
                                visible={pickerVisible}
                                onClose={() => setPickerVisible(false)}
                            />
                            <AppText text={`+${value.callingCode}`} />
                            <ChevronDownIcon stroke={Colors.GRAY} style={{ marginLeft: 5 }} />
                        </ButtonView>
                    )}
                />

                {/* Phone Number Input */}
                <Controller
                    control={control}
                    name={phoneFieldName}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onFocus={handleFocus}
                            onBlur={() => {
                                handleBlur();
                                onBlur();
                            }}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Your Phone Number"
                            placeholderTextColor={Colors.GRAY}
                            keyboardType="phone-pad"
                        />
                    )}
                />
            </Animated.View>

            {errors[phoneFieldName] && (
                <AppText
                    text={errors[phoneFieldName].message as string}
                    color={Colors.INDIAN_RED}
                    style={styles.errorText}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Metrics.verticalScale(18),
    },
    label: {
        color: Colors.GRAY,
        marginBottom: 8,
        fontSize: Metrics.generatedFontSize(14),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        height: Metrics.verticalScale(48),
        paddingHorizontal: 4,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    callingCodeText: {
        marginHorizontal: 8,
        fontSize: Metrics.generatedFontSize(16),
        color: Colors.EERIE_BLACK,
    },
    input: {
        color: Colors.BLACK,
        fontSize: Metrics.generatedFontSize(14),
        paddingVertical: 0,
        flex:1
    },
    errorText: {
        marginTop: Metrics.verticalScale(5),
        fontSize: Metrics.generatedFontSize(12),
        marginLeft: Metrics.scale(4),
    },
});

export default PhoneInputField;
