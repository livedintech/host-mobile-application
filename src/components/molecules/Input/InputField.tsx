import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import CustomInput from './CustomInput';
import { KeyboardTypeOptions } from 'react-native';

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
                />
            )}
        />
    );
};

export default InputField;
