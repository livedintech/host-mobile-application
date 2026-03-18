import React, { useRef } from 'react';
import { View, StyleSheet, TextInput, Animated } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface PhoneInputFieldProps {
    control: Control<any>;
    errors: FieldErrors;
    label: string;
    countryFieldName: string;
    phoneFieldName: string;
    activeColor?: string;
    inactiveColor?: string;
    disabled?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
    control,
    errors,
    label,
    countryFieldName,
    phoneFieldName,
    activeColor = Colors.BRUNSWICK_GREEN,
    inactiveColor = Colors.HYPER_SILVER, // Default to a light grey
    disabled = false,
}) => {
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        if (disabled) return;
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
        outputRange: [disabled ? Colors.HYPER_SILVER : Colors.BRUNSWICK_GREEN, activeColor],
    });

    const animatedBackgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [disabled ? '#F9F9F9' : 'rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.25)'],
    });

    return (
        <View style={styles.wrapper}>
            <AppText text={label} style={styles.label} type='Medium'/>

            <Animated.View
                style={[
                    styles.container,
                    {
                        borderColor: errors[phoneFieldName] ? Colors.INDIAN_RED : animatedBorderColor,
                        backgroundColor: animatedBackgroundColor,
                    },
                ]}
            >
                {/* Country Picker Section */}
                <Controller
                    control={control}
                    name={countryFieldName}
                    render={({ field: { onChange, value } }) => (
                        <ButtonView 
                            onPress={() => !disabled && setPickerVisible(true)} 
                            style={styles.pickerButton}
                            activeOpacity={disabled ? 1 : 0.7}
                        >
                            <CountryPicker
                                withFlag
                                withFilter
                                withCallingCode
                                countryCode={value?.cca2 as CountryCode}
                                onSelect={(country: Country) => {
                                    onChange({
                                        cca2: country.cca2,
                                        callingCode: country.callingCode[0] || '',
                                    });
                                }}
                                visible={!disabled && pickerVisible}
                                onClose={() => setPickerVisible(false)}
                            />
                            <AppText 
                                text={`+${value?.callingCode || ''}`} 
                                color={disabled ? Colors.SUPER_GREY : Colors.BLACK} 
                            />
                            {!disabled && <Svgicons path='ChevronDownIcon' size={10} pl={5}/>}
                        </ButtonView>
                    )}
                />

                {/* Phone Number Input Section */}
                <Controller
                    control={control}
                    name={phoneFieldName}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input, 
                                disabled && { color: Colors.SUPER_GREY }
                            ]}
                            onFocus={handleFocus}
                            onBlur={() => {
                                handleBlur();
                                onBlur();
                            }}
                            onChangeText={onChange}
                            value={value}
                            editable={!disabled}
                            placeholder=""
                            placeholderTextColor={Colors.SUPER_GREY}
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
        color: Colors.BLACK,
        marginBottom: 8,
        fontSize: Metrics.generatedFontSize(14),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        height: Metrics.verticalScale(57),
        paddingHorizontal: 8, // Increased slightly for better visual balance
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    input: {
        color: Colors.BLACK,
        fontSize: Metrics.generatedFontSize(14),
        paddingVertical: 0,
        flex: 1,
    },
    errorText: {
        marginTop: Metrics.verticalScale(5),
        fontSize: Metrics.generatedFontSize(12),
        marginLeft: Metrics.scale(4),
    },
});

export default PhoneInputField;