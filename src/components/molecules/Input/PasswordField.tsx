import { useState } from 'react';
import { I18nManager } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import CustomInput from './CustomInput';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

type Props = {
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  placeholder: string;
  rules?: object;
  label?: string;
};

const PasswordField = ({
  name,
  control,
  errors,
  placeholder,
  rules,
  label
}: Props) => {
  const [show, setShow] = useState(false);

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
          secureTextEntry={!show}
          style={I18nManager.isRTL ? { textAlign: 'right' } : undefined}
          rightIcon={show ? <Svgicons path='eye'/> : <Svgicons path='eyeSlash'/>}
          onRightIconPress={() => setShow(prev => !prev)}
        />
      )}
    />
  );
};

export default PasswordField;
