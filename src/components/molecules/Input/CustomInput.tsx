import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
  TextStyle,
  KeyboardTypeOptions,
  Animated,
  Platform,
} from 'react-native';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';

type Props = {
  multiline?: boolean;
  value: string;
  style?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  label?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  numberOfLines?: number;
  verticalAlign?: "auto" | "top" | "bottom" | "center";
  maxLength?: number;
  placeholderTextColor?: string
};

const CustomInput = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  wrapperStyle,
  multiline,
  editable = true,
  label,
  autoCapitalize = 'none',
  numberOfLines,
  verticalAlign,
  maxLength,
  placeholderTextColor = '#7B8D88'
}: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  // Matching your Dropdown styling exactly
  const GLASS_BASE = 'rgba(255, 255, 255, 0.25)';
  const GLASS_RIM = 'rgba(255, 255, 255, 0.6)';
  const FOCUS_COLOR = Colors.PINE_FOREST || '#1A332C';

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
    onBlur?.();
  };

  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [GLASS_RIM, FOCUS_COLOR],
  });

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText
          text={label}
          mb={8}
          color={Colors.BLACK} // Matches Dropdown label color
          fontSize={14}
          type="Medium"
        />
      )}

      <Animated.View
        style={[
          styles.glassContainer,
          {
            borderColor: error ? Colors.INDIAN_RED : animatedBorderColor,
            backgroundColor: editable ? GLASS_BASE : 'rgba(255, 255, 255, 0.1)',
          },
          wrapperStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}

        <TextInput
          multiline={multiline}
          selectionColor={FOCUS_COLOR}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            style,
            multiline && verticalAlign
              ? { textAlignVertical: verticalAlign }
              : { textAlignVertical: 'center' },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />

        {rightIcon && (
          <ButtonView style={styles.iconWrapper} onPress={onRightIconPress}>
            {rightIcon}
          </ButtonView>
        )}
      </Animated.View>

      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} fontSize={12} mt={5} ml={4} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  glassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12, // Matches dropdown's slightly rounded aesthetic
    paddingHorizontal: 16,
    height: Metrics.verticalScale(54), // Matches dropdown height
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    color: '#1A332C', // Matches dropdown selectedTextStyle
    fontSize: Metrics.generatedFontSize(14),
    fontWeight: '600',
    paddingVertical: 0,
  },
  iconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default CustomInput;