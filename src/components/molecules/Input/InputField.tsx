import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import CustomInput from './CustomInput';
import { KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from 'react-native';

type Props = {
    name: string;
    control: Control<any>;
    errors: FieldErrors<any>;
    placeholder: string;
    rules?: RegisterOptions;
    leftIcon?: React.ReactNode;
    label?: string;
    keyboardType?: KeyboardTypeOptions;
    editable?: boolean;
    maxLength?: number;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    placeholderTextColor?:string
};

const InputField = ({
    name,
    control,
    errors,
    placeholder,
    rules,
    leftIcon,
    label,
    keyboardType,
    editable,
    maxLength,
    containerStyle,
    inputStyle,
    placeholderTextColor
}: Props) => {

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <CustomInput
                    label={label}
                    value={value}
                    onChangeText={(text) => {
                        const finalValue = name === 'email' ? text.toLowerCase() : text;
                        onChange(finalValue);
                    }}
                    placeholder={placeholder}
                    error={errors?.[name]?.message as string}
                    leftIcon={leftIcon}
                    keyboardType={keyboardType}
                    editable={editable}
                    maxLength={maxLength}
                    wrapperStyle={containerStyle}
                    style={inputStyle}
                    placeholderTextColor={placeholderTextColor}
                />
            )}
        />
    );
};

export default InputField;
