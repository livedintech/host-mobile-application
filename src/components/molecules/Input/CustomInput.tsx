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
}: Props) => {
  // Animated value for border focus
  const animation = useRef(new Animated.Value(0)).current;

  // Glass Constants from your GlassCard logic
  const GLASS_BASE = 'rgba(217, 217, 217, 0.2)';
  const GLASS_RIM = 'rgba(255, 255, 255, 0.7)';
  const FOCUS_COLOR = Colors.BRUNSWICK_GREEN || '#00443d';

  const handleFocus = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false, // Colors need false
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

  // Interpolate border color from glass rim to focus color
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
          color={Colors.PINE_FOREST}
          fontSize={14}
          type="Medium"
        />
      )}

      <Animated.View
        style={[
          styles.glassContainer,
          {
            borderColor: error ? Colors.INDIAN_RED : animatedBorderColor,
            backgroundColor: GLASS_BASE,
          },
          wrapperStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}

        <TextInput
          multiline={multiline}
          selectionColor={Colors.SUPER_GREY}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            style,
            multiline && verticalAlign
              ? { textAlignVertical: verticalAlign }
              : { textAlignVertical: 'center' },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.BLACK_35_PERCENT} 
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

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Metrics.verticalScale(18),
  },
  glassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28, // High radius for glassy look
    paddingHorizontal: 16,
    height: Metrics.verticalScale(58),
    // borderWidth: 1.5,

    // Platform-specific logic from your GlassCard
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        // Simulating depth on Android
        // borderBottomWidth: 2,
        // borderRightWidth: 1.5,
        // borderBottomColor: 'rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  input: {
    flex: 1,
    color: Colors.BLACK, // Change to Colors.WHITE if your background is very dark
    fontSize: Metrics.generatedFontSize(14),
    paddingVertical: 0,
  },
  iconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 13,
    marginTop: 5,
    marginLeft: 12,
  },
});