import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

interface Props {
  name: string;
  control: any;
  errors: any;
  label?: string;
  variables: { key: string; label: string }[];
  placeholder?: string;
}

export default function MentionTextarea({
  name,
  control,
  errors,
  label,
  variables,
  placeholder,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const [showList, setShowList] = useState(false);
  const [filtered, setFiltered] = useState<{ key: string; label: string }[]>([]);

  // ✅ Track whether the ScrollView is being scrolled
  const isScrolling = useRef(false);

  const error = errors[name]?.message;
  const GLASS_BASE = 'rgba(255,255,255,0.25)';
  const GLASS_RIM = 'rgba(255,255,255,0.6)';
  const FOCUS_COLOR = Colors.PINE_FOREST || '#000000';

  const handleFocus = () => {
    Animated.timing(animation, { toValue: 1, duration: 250, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setTimeout(() => setShowList(false), 150);
    Animated.timing(animation, { toValue: 0, duration: 250, useNativeDriver: false }).start();
  };

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [GLASS_RIM, FOCUS_COLOR],
  });

  const handleChange = (text: string, onChange: (val: string) => void) => {
    onChange(text);
    const lastAt = text.lastIndexOf('@');

    if (lastAt !== -1) {
      const keyword = text.slice(lastAt + 1);
      if (keyword.includes(' ') || keyword.includes('\n')) {
        setShowList(false);
        return;
      }
      const matches = variables.filter(v =>
        v.key.toLowerCase().includes(keyword.toLowerCase()),
      );
      setFiltered(matches);
      setShowList(matches.length > 0);
    } else {
      setShowList(false);
    }
  };

  const insertVariable = (
    item: { key: string; label: string },
    value: string,
    onChange: (val: string) => void,
  ) => {
    const lastAt = value.lastIndexOf('@');
    const newText = value.substring(0, lastAt) + `${item.key}` + ' ';
    onChange(newText);
    setShowList(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText text={label} mb={8} color={Colors.BLACK} fontSize={14} type="Medium" />
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View>
            <Animated.View
              style={[
                styles.glassContainer,
                {
                  borderColor: error ? Colors.INDIAN_RED : animatedBorderColor,
                  backgroundColor: GLASS_BASE,
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                multiline
                value={value}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={'#7B8D88'}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={text => handleChange(text, onChange)}
                scrollEnabled={true}
                textAlignVertical="top"
              />
            </Animated.View>

            {showList && filtered.length > 0 && (
              <View style={styles.dropdown}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  style={styles.scrollView}
                  bounces={false}
                  // ✅ Set isScrolling = true when scroll starts
                  onScrollBeginDrag={() => { isScrolling.current = true; }}
                  // ✅ Reset after scroll ends with small delay
                  onScrollEndDrag={() => {
                    setTimeout(() => { isScrolling.current = false; }, 100);
                  }}
                  onMomentumScrollEnd={() => { isScrolling.current = false; }}
                >
                  {filtered.map((item, index) => (
                    <TouchableOpacity
                      key={item.key}
                      activeOpacity={0.7}
                      style={[
                        styles.item,
                        index === filtered.length - 1 && styles.itemLast,
                      ]}
                      // ✅ Check isScrolling before inserting
                      onPressIn={() => {
                        // Reset scroll flag on each new touch
                        isScrolling.current = false;
                      }}
                      onPress={() => {
                        // ✅ Only insert if user was NOT scrolling
                        if (!isScrolling.current) {
                          insertVariable(item, value, onChange);
                        }
                      }}
                    >
                      <AppText text={item.label || item.key} fontSize={13} color={Colors.MIDNIGHT} />
                      {/* <AppText text={`@${item.key}`} fontSize={11} color={Colors.DARK_CHARCOAL_OPACITY || '#888'} mt={2} /> */}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      />

      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} fontSize={12} mt={5} ml={4} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  glassContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 130,
  },
  input: {
    color: '#000000',
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '400',
    textAlignVertical: 'top',
    minHeight: 110,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollView: {
    maxHeight: 180,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.SMOOTH_GREY,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
});