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
  Modal,
  SafeAreaView,
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
  const [tempDate, setTempDate] = useState(new Date());
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

  return `${year}-${month}-${day}`; // ✅ FIXED
};

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes} ${period}`;
  };

  const handleOpenPicker = (currentValue: string) => {
    handleFocus();
    if (currentValue) {
      const parsed = new Date(currentValue);
      if (!isNaN(parsed.getTime())) {
        setTempDate(parsed);
      }
    } else if (minimumDate && minimumDate > new Date()) {
      setTempDate(minimumDate);
    } else {
      setTempDate(new Date());
    }
    setShowPicker(true);
  };

  const handleCancel = () => {
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
            onPress={() => handleOpenPicker(value)}
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
              {leftIcon && (
                <View style={styles.leftIconWrapper}>{leftIcon}</View>
              )}
              <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#7B8D88"
                value={value}
                editable={false}
                pointerEvents="none"
              />
              {rightIcon && (
                <View style={styles.rightIconWrapper}>{rightIcon}</View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* ─── iOS: Modal bottom sheet ─── */}
          {Platform.OS === 'ios' && (
            <Modal
              visible={showPicker}
              transparent
              animationType="slide"
              onRequestClose={handleCancel}
            >
              <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={handleCancel}
              />
              <SafeAreaView style={styles.modalSheet}>
                <View style={styles.modalHandle} />

                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancel} hitSlop={styles.hitSlop}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const formatted =
                        mode === 'date'
                          ? formatDate(tempDate)
                          : formatTime(tempDate);
                      onChange(formatted);
                      handleBlur();
                      setShowPicker(false);
                    }}
                    hitSlop={styles.hitSlop}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={tempDate}
                  mode={mode}
                  display="spinner"
                  minimumDate={minimumDate}
                  onChange={(_, date) => {
                    if (date) setTempDate(date);
                  }}
                  style={styles.iosPicker}
                />
              </SafeAreaView>
            </Modal>
          )}

          {/* ─── Android: native dialog ─── */}
          {Platform.OS === 'android' && showPicker && (
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="default"
              minimumDate={minimumDate}
              onChange={(event, date) => {
                setShowPicker(false);
                handleBlur();
                if (event.type === 'set' && date) {
                  const formatted =
                    mode === 'date' ? formatDate(date) : formatTime(date);
                  onChange(formatted);
                }
              }}
            />
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
    height: Metrics.verticalScale(54),
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '600',
    paddingVertical: 0,
  },
  leftIconWrapper: { marginRight: 10 },
  rightIconWrapper: { marginLeft: 10 },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },

  // ─── iOS Modal ───
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalSheet: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 8,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  cancelText: {
    fontSize: 15,
    color: Colors.DARK_CHARCOAL_OPACITY ?? '#6B7280',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.BRUNSWICK_GREEN,
  },
  iosPicker: {
    height: 200,
  },
  hitSlop: {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
  },
});

export default DateTimeInputField;