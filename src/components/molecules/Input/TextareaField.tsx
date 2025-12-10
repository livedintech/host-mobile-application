import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

interface TextareaFieldProps extends TextInputProps {
    name: string;
    control: Control<any>;
    errors: FieldErrors;
    label?: string;
    leftIcon?: React.ReactNode;
    wrapperStyle?: object;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
    name,
    control,
    errors,
    label,
    leftIcon,
    wrapperStyle,
    style,
    multiline,
    ...props
}) => {
    const error = errors[name]?.message as string;

    return (
        <View style={[styles.mainWrapper, wrapperStyle]}>
            {label && <AppText text={label} style={styles.label} />}

            <View style={[
                styles.inputContainer,
                !!error && styles.errorBorder,
                multiline && styles.multilineContainer
            ]}>
                {leftIcon && (
                    <View style={[
                        styles.iconWrapper,
                        multiline && styles.multilineIcon
                    ]}>
                        {leftIcon}
                    </View>
                )}
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                style,
                                multiline && styles.multilineInput
                            ]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholderTextColor={Colors.GRAY}
                            multiline={multiline}
                            {...props}
                        />
                    )}
                />
            </View>

            {error && <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />}
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        marginBottom: Metrics.verticalScale(16),
    },
    label: {
        marginBottom: Metrics.verticalScale(8),
        color: Colors.GRAY,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.GAINSBORO,
        minHeight: Metrics.verticalScale(56),
        backgroundColor: Colors.WHITE
    },
    multilineContainer: {
        height: Metrics.verticalScale(140),
        alignItems: 'flex-start',
    },
    iconWrapper: {
        paddingLeft: Metrics.scale(16),
        marginRight: Metrics.scale(8),
    },
    multilineIcon: {
        marginTop: Metrics.verticalScale(16),
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: Metrics.scale(16),
        color: Colors.EERIE_BLACK,
        fontSize: 16,
        paddingVertical: 0,
       
    },
    multilineInput: {
        height: '100%',
        textAlignVertical: 'top',
        paddingTop: Platform.OS === 'ios' ? Metrics.verticalScale(16) : Metrics.verticalScale(12),
        paddingBottom: Metrics.verticalScale(16),
    },
    errorBorder: {
        borderColor: Colors.INDIAN_RED,
    },
    errorText: {
        marginTop: Metrics.verticalScale(4),
        fontSize: 12,
        color: Colors.INDIAN_RED,
    },
});

export default TextareaField;