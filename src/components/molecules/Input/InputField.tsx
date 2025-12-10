import { Controller, Control, FieldErrors } from 'react-hook-form';
import CustomInput from './CustomInput';
import { KeyboardTypeOptions } from 'react-native';

type Props = {
    name: string;
    control: Control<any>;
    errors: FieldErrors<any>;
    placeholder: string;
    rules?: object;
    leftIcon?: React.ReactNode;
    label?: string;
    keyboardType?: KeyboardTypeOptions;
    editable?: boolean;
    maxLength?: number
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
    maxLength
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
                    onChangeText={onChange}
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
