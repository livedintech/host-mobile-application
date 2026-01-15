import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { TextInputMask } from 'react-native-masked-text';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

interface MaskedInputFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  name: string;
  placeholder?: string;
}

const MaskedInputField: React.FC<MaskedInputFieldProps> = ({
  control,
  errors,
  label,
  name,
  placeholder = ''
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <AppText text={label} mb={8} color={Colors.PINE_FOREST} fontSize={14} type='Medium' />}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (

          <TextInputMask
            type={'custom'}
            options={{
              mask: '99:99'
            }}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            style={[
              styles.input,
              errors[name] ? { borderColor: Colors.INDIAN_RED } : { borderColor: Colors.SMOOTH_GREY },
            ]}
            keyboardType="numeric"
          />
        )}
      />
      {errors[name] && <AppText text={errors[name].message as string} color="red" style={styles.errorText} />}

    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: Metrics.generatedFontSize(14), marginBottom: 5, color: Colors.BLACK },
  wrapper: {
          marginBottom: Metrics.verticalScale(18),
          zIndex: 9999,
          overflow: 'visible', 
      },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.BLACK,
    marginBottom: 5,
  },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 13,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default MaskedInputField;