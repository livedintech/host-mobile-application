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
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
  /** When true (mode="time"), only the hour and AM/PM can be changed, minutes stay locked to 00 */
  hourOnly?: boolean;
};

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const SIDE_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const PERIODS: Array<'AM' | 'PM'> = ['AM', 'PM'];

const WheelColumn = ({
  data,
  selectedValue,
  onChange,
}: {
  data: Array<string | number>;
  selectedValue: string | number;
  onChange: (value: string | number) => void;
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const initialIndex = Math.max(0, data.indexOf(selectedValue));

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(data.length - 1, Math.round(y / ITEM_HEIGHT)));
    onChange(data[index]);
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={styles.wheelColumnWrapper}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
        contentContainerStyle={{ paddingVertical: SIDE_PADDING }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {data.map((item) => (
          <View key={String(item)} style={styles.wheelItem}>
            <Text style={[styles.wheelItemText, item === selectedValue && styles.wheelItemTextSelected]}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.wheelHighlight} pointerEvents="none" />
    </View>
  );
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
  hourOnly,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempHour, setTempHour] = useState<number>(12);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');
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

  const formatHourPeriod = (hour: number, period: 'AM' | 'PM'): string => {
    return `${String(hour).padStart(2, '0')}:00 ${period.toLowerCase()}`;
  };

  const parseTimeToDate = (timeStr: string): Date | null => {
    const h24Match = timeStr.match(/^(\d{1,2}):(\d{2})(:\d{2})?$/);
    if (h24Match) {
      const d = new Date();
      d.setHours(parseInt(h24Match[1], 10), parseInt(h24Match[2], 10), 0, 0);
      return d;
    }
    const h12Match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (h12Match) {
      let hours = parseInt(h12Match[1], 10);
      const minutes = parseInt(h12Match[2], 10);
      const period = h12Match[3].toLowerCase();
      if (period === 'am' && hours === 12) hours = 0;
      if (period === 'pm' && hours !== 12) hours += 12;
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
    return null;
  };

  const dateToHourPeriod = (date: Date): { hour: number; period: 'AM' | 'PM' } => {
    const h = date.getHours();
    const hour = h % 12 === 0 ? 12 : h % 12;
    const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
    return { hour, period };
  };

  const displayValue = (val: string): string => {
    if (mode !== 'time' || !val) return val ?? '';
    const parsed = parseTimeToDate(val);
    if (parsed) return formatTime(parsed);
    return val;
  };

  const handleOpenPicker = (currentValue: string) => {
    handleFocus();
    let baseDate: Date | null = null;
    if (currentValue) {
      const parsed = parseTimeToDate(currentValue) ?? new Date(currentValue);
      if (!isNaN(parsed.getTime())) {
        baseDate = parsed;
      }
    } else if (minimumDate && minimumDate > new Date()) {
      baseDate = minimumDate;
    } else {
      baseDate = new Date();
    }

    if (baseDate) {
      setTempDate(baseDate);
      if (hourOnly) {
        const { hour, period } = dateToHourPeriod(baseDate);
        setTempHour(hour);
        setTempPeriod(period);
      }
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
                value={displayValue(value)}
                editable={false}
                pointerEvents="none"
              />
              {rightIcon && (
                <View style={styles.rightIconWrapper}>{rightIcon}</View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* ─── hour-only picker: custom hour + AM/PM wheel ─── */}
          {hourOnly && mode === 'time' && (
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
                      onChange(formatHourPeriod(tempHour, tempPeriod));
                      handleBlur();
                      setShowPicker(false);
                    }}
                    hitSlop={styles.hitSlop}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.wheelRow}>
                  <WheelColumn
                    data={HOURS}
                    selectedValue={tempHour}
                    onChange={(value) => setTempHour(value as number)}
                  />
                  <Text style={styles.wheelSeparator}>:00</Text>
                  <WheelColumn
                    data={PERIODS}
                    selectedValue={tempPeriod}
                    onChange={(value) => setTempPeriod(value as 'AM' | 'PM')}
                  />
                </View>
              </SafeAreaView>
            </Modal>
          )}

          {/* ─── iOS: Modal bottom sheet ─── */}
          {!hourOnly && Platform.OS === 'ios' && (
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
                  textColor="#000000"
                  themeVariant="light"
                  onChange={(_, date) => {
                    if (date) setTempDate(date);
                  }}
                  style={styles.iosPicker}
                />
              </SafeAreaView>
            </Modal>
          )}

          {/* ─── Android: native dialog ─── */}
          {!hourOnly && Platform.OS === 'android' && showPicker && (
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
    borderRadius: 10,
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

  // ─── Hour-only wheel picker ───
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    paddingBottom: 16,
  },
  wheelColumnWrapper: {
    width: 80,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  wheelItemTextSelected: {
    color: '#000000',
    fontWeight: '700',
  },
  wheelHighlight: {
    position: 'absolute',
    top: SIDE_PADDING,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  wheelSeparator: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 8,
  },
});

export default DateTimeInputField;
