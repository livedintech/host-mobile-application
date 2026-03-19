import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
  TextStyle,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';

type Props = {
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  label?: string;
  placeholder?: string;
  mode: 'date' | 'time';
  style?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rules?: object;
  editable?: boolean;
  minimumDate?: Date;
};

const DateTimeInputField = ({
  name,
  control,
  errors,
  label,
  placeholder,
  mode,
  style,
  wrapperStyle,
  leftIcon,
  rightIcon,
  rules,
  minimumDate,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const animation = useRef(new Animated.Value(0)).current;
  const error = errors[name]?.message as string;

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

  // --- GLASS ANIMATION LOGIC ---
  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.6)', Colors.BRUNSWICK_GREEN],
  });

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'],
  });

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes} ${period}`;
  };

  const handleDateTimeChange = (
    event: any,
    date: Date | undefined,
    onChange: (value: string) => void
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      handleBlur();
    }

    if (date) {
      setSelectedDateTime(date);
      const formatted = mode === 'date' ? formatDate(date) : formatTime(date);
      onChange(formatted);
    }
  };

  const handleOpenPicker = (onFocus: () => void, currentValue: string) => {
    onFocus();
    if (currentValue) {
      const parsedDate = new Date(currentValue);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDateTime(parsedDate);
      }
    } else if (minimumDate && minimumDate > new Date()) {
      setSelectedDateTime(minimumDate);
    }
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    handleBlur();
    setShowPicker(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <View style={styles.wrapper}>
          {label && (
            <AppText
              text={label}
              mb={8}
              color={Colors.BLACK}
              fontSize={14}
              type="Medium"
            />
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleOpenPicker(handleFocus, value)}
          >
            <Animated.View
              style={[
                styles.container,
                {
                  borderColor: error ? Colors.INDIAN_RED : animatedBorderColor,
                  backgroundColor: animatedBackgroundColor,
                },
                wrapperStyle,
              ]}
            >
              {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

              <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#7B8D88" // Matches your dropdown placeholder
                value={value}
                editable={false}
                pointerEvents="none"
              />

              {rightIcon && (
                <View style={styles.rightIconWrapper}>
                  {rightIcon}
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {showPicker && (
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={selectedDateTime}
                mode={mode}
                minimumDate={minimumDate}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) =>
                  handleDateTimeChange(event, date, onChange)
                }
              />

              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtonContainer}>
                  <TouchableOpacity onPress={handleClosePicker}>
                    <AppText
                      text="Done"
                      fontSize={16}
                      color={Colors.BRUNSWICK_GREEN}
                      type="Medium"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // --- MATCHED GLASS STYLING FROM DROPDOWN ---
    height: Metrics.verticalScale(54), 
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    // --- MATCHED TEXT STYLING ---
    color: '#1A332C', 
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '600',
    paddingVertical: 0,
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconWrapper: {
    marginLeft: 10,
  },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  pickerWrapper: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(16),
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
  },
  pickerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: Metrics.verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: Colors.SMOOTH_GREY,
    marginTop: Metrics.verticalScale(12),
  },
});

export default DateTimeInputField;