import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
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
  const containerRef = useRef<View>(null);
  const textRef = useRef('');
  const cursorPosRef = useRef(0);
  const activeAtPosRef = useRef(0);
  const animation = useRef(new Animated.Value(0)).current;

  const [showList, setShowList] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const error = errors[name]?.message;
  const GLASS_BASE = 'rgba(255,255,255,0.25)';
  const GLASS_RIM = 'rgba(255,255,255,0.6)';
  const FOCUS_COLOR = Colors.PINE_FOREST || '#000000';

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [GLASS_RIM, FOCUS_COLOR],
  });

  const handleFocus = () =>
    Animated.timing(animation, { toValue: 1, duration: 250, useNativeDriver: false }).start();

  const handleBlur = () =>
    Animated.timing(animation, { toValue: 0, duration: 250, useNativeDriver: false }).start();

  const openDropdown = (matches: any[]) => {
    containerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ top: y + height + 4, left: x, width });
      setFiltered(matches);
      setShowList(true);
    });
  };

  const closeDropdown = () => setShowList(false);

  const handleChange = (text: string, onChange: any) => {
    textRef.current = text;
    onChange(text);
  };

  // Detect mention based on cursor position — works for @ anywhere in text
  const handleSelectionChange = (event: any) => {
    const cursorPos = event.nativeEvent.selection.end;
    cursorPosRef.current = cursorPos;

    const textBeforeCursor = textRef.current.slice(0, cursorPos);
    const lastAt = textBeforeCursor.lastIndexOf('@');

    if (lastAt !== -1) {
      const keyword = textBeforeCursor.slice(lastAt + 1);
      if (!keyword.includes(' ') && !keyword.includes('\n')) {
        const matches = variables.filter(v =>
          v.key.toLowerCase().includes(keyword.toLowerCase()),
        );
        if (matches.length > 0) {
          activeAtPosRef.current = lastAt;
          openDropdown(matches);
        } else {
          closeDropdown();
        }
      } else {
        closeDropdown();
      }
    } else {
      closeDropdown();
    }
  };

  const insertVariable = (item: any, onChange: any) => {
    const beforeAt = textRef.current.substring(0, activeAtPosRef.current);
    const afterCursor = textRef.current.substring(cursorPosRef.current);
    const newText = beforeAt + item.key + ' ' + afterCursor;
    textRef.current = newText;
    onChange(newText);
    closeDropdown();
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
          <>
            <View ref={containerRef} collapsable={false}>
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
                  placeholderTextColor="#7B8D88"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChangeText={text => handleChange(text, onChange)}
                  onSelectionChange={handleSelectionChange}
                />
              </Animated.View>
            </View>

            <Modal
              visible={showList}
              transparent
              animationType="none"
              onRequestClose={closeDropdown}
            >
              <TouchableWithoutFeedback onPress={closeDropdown}>
                <View style={StyleSheet.absoluteFill}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.dropdown,
                        {
                          top: dropdownPos.top,
                          left: dropdownPos.left,
                          width: dropdownPos.width,
                        },
                      ]}
                    >
                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        bounces={false}
                        style={styles.dropdownList}
                      >
                        {filtered.map(item => (
                          <TouchableOpacity
                            key={item.key}
                            style={styles.item}
                            onPress={() => insertVariable(item, onChange)}
                          >
                            <AppText text={item.key} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </>
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
  },

  dropdown: {
    position: 'absolute',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  dropdownList: {
    maxHeight: 180,
    borderRadius: 12,
  },

  item: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: Colors.SMOOTH_GREY,
  },
});