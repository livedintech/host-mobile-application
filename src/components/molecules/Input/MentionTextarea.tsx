import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
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
  const [filtered, setFiltered] = useState<any[]>([]);
  const [inputAreaHeight, setInputAreaHeight] = useState(0);

  const error = errors[name]?.message;

  const GLASS_BASE = 'rgba(255,255,255,0.25)';
  const GLASS_RIM = 'rgba(255,255,255,0.6)';
  const FOCUS_COLOR = Colors.PINE_FOREST || '#000000';

  const handleFocus = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [GLASS_RIM, FOCUS_COLOR],
  });

  const handleChange = (text: string, onChange: any) => {
    onChange(text);

    // Find the last @ in the entire text and use everything after it as keyword
    const lastAt = text.lastIndexOf('@');

    if (lastAt !== -1) {
      const keyword = text.slice(lastAt + 1);

      // Stop showing dropdown if user typed a space or newline after @
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

  const insertVariable = (item: any, value: string, onChange: any) => {
    const lastAt = value.lastIndexOf('@');

    const newText =
      value.substring(0, lastAt) +
      `${item.key}` +
      ' ';

    onChange(newText);
    setShowList(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View style={[styles.wrapper, showList && styles.wrapperActive]}>
      <View
        onLayout={e => setInputAreaHeight(e.nativeEvent.layout.height)}
      >
        {label && (
          <AppText
            text={label}
            mb={8}
            color={Colors.BLACK}
            fontSize={14}
            type="Medium"
          />
        )}

        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange } }) => (
            <>
              <Animated.View
                style={[
                  styles.glassContainer,
                  {
                    borderColor: error
                      ? Colors.INDIAN_RED
                      : animatedBorderColor,
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
                />
              </Animated.View>

              {showList && (
                <View style={[styles.dropdown, { top: inputAreaHeight + 4 }]}>
                  <FlatList
                    data={filtered}
                    keyExtractor={i => i.key}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => insertVariable(item, value, onChange)}
                      >
                        <AppText text={item.key} />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </>
          )}
        />
      </View>

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

  wrapperActive: {
    zIndex: 999,
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
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    maxHeight: 180,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  item: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: Colors.SMOOTH_GREY,
  },
});