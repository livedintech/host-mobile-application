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
  maxLength

}: Props) => {
  // Animated value
  const animation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // colors cannot use native driver
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  // Interpolate animated values
  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.SMOOTH_GREY, Colors.BLACK], // grey → coral
  });

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.WHITE, Colors.WHITE], // cultured → white
  });

  return (
    <View style={styles.wrapper}>
      {label && <AppText text={label} mb={8} color={Colors.BLACK} fontSize={14} type='Medium'/>}

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
              : { textAlignVertical: "center" }
          ]}

          placeholder={placeholder}
          placeholderTextColor={Colors.SUPER_GREY}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? verticalAlign : 'center'}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: Metrics.verticalScale(48),
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: Colors.BLACK,
    fontSize: Metrics.generatedFontSize(14),
    paddingVertical: 0,
  },
  iconWrapper: {
    marginRight: 10,
  },
  errorText: {
    color: Colors.INDIAN_RED,
    fontSize: 13,
    marginTop: 5,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
});
