import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface TextareaFieldProps extends TextInputProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  leftIcon?: React.ReactNode;
  wrapperStyle?: object;
  descriptionLength?: number;
  wordLimit?: number;
  sparkleIcon?: boolean;
  rules?: RegisterOptions;
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
  descriptionLength,
  wordLimit,
  sparkleIcon,
  rules,
  ...props
}) => {
  const error = errors[name]?.message as string;

  return (
    <View style={[styles.mainWrapper, wrapperStyle]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {label && (
          <AppText text={label} style={styles.label} fontSize={14} type="Medium" />
        )}
        {wordLimit !== undefined && (
          <AppText
            text={`${descriptionLength || 0}/${wordLimit} Words`}
            fontSize={12}
            color={Colors.SUPER_GREY}
          />
        )}
      </View>

      {/* Glassy Input Container */}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          !!error && styles.errorBorder,
        ]}
      >
        {leftIcon && (
          <View style={[styles.iconWrapper, multiline && styles.multilineIcon]}>
            {leftIcon}
          </View>
        )}
        <Controller
          control={control}
          rules={rules}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, style, multiline && styles.multilineInput]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="rgba(0, 0, 0, 0.3)" // Faded placeholder
              multiline={multiline}
              selectionColor={Colors.BOTTLE_GREEN}
              {...props}
            />
          )}
        />
        {sparkleIcon && (
          <View style={styles.sparkleIcon}>
            <Svgicons path="sparkleIcon" size={17} color={Colors.BRUNSWICK_GREEN} />
          </View>
        )}
      </View>

      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    marginBottom: Metrics.verticalScale(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8),
  },
  label: {
    color: Colors.PINE_FOREST,
    fontSize: Metrics.generatedFontSize(14),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, // Match the roundness of the GlassCard
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Light rim border
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Translucent fill
    minHeight: Metrics.verticalScale(56),
    overflow: 'hidden',
  },
  multilineContainer: {
    height: Metrics.verticalScale(160), // Slightly taller for the reply section
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
    color: Colors.PINE_FOREST,
    fontSize: 15,
    paddingVertical: 0,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
    paddingTop: Platform.OS === 'ios' ? Metrics.verticalScale(16) : Metrics.verticalScale(12),
    paddingBottom: Metrics.verticalScale(16),
  },
  errorBorder: {
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    marginTop: Metrics.verticalScale(4),
    fontSize: 12,
    color: Colors.INDIAN_RED,
    paddingLeft: 4,
  },
  sparkleIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});

export default TextareaField;