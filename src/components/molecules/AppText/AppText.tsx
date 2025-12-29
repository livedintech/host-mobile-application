import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { AppTextProps } from './type';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';


const AppText = ({
  onPress,
  text,
  color = Colors.BLACK,
  fontSize = 14,
  textAlign = 'left',
  type, // New prop for font weight style
    italic = false, // ✅ default
  lineHeight,
  letterSpacing,
  textTransform,
  textDecorationLine,
  opacity = 1,
  style,
  numberOfLines,
  m, mt, mb, ml, mr, mx, my,
  p, pt, pb, pl, pr, px, py,
}: AppTextProps) => {

    const fontFamily = italic
    ? `RethinkSans-${type}Italic`
    : `RethinkSans-${type}`;

  const spacingStyles = {
    margin: m !== undefined ? Metrics.verticalScale(m) : undefined,
    marginTop: mt !== undefined ? Metrics.verticalScale(mt) : my !== undefined ? Metrics.verticalScale(my) : undefined,
    marginBottom: mb !== undefined ? Metrics.verticalScale(mb) : my !== undefined ? Metrics.verticalScale(my) : undefined,
    marginLeft: ml !== undefined ? Metrics.scale(ml) : mx !== undefined ? Metrics.scale(mx) : undefined,
    marginRight: mr !== undefined ? Metrics.scale(mr) : mx !== undefined ? Metrics.scale(mx) : undefined,

    padding: p !== undefined ? Metrics.verticalScale(p) : undefined,
    paddingTop: pt !== undefined ? Metrics.verticalScale(pt) : py !== undefined ? Metrics.verticalScale(py) : undefined,
    paddingBottom: pb !== undefined ? Metrics.verticalScale(pb) : py !== undefined ? Metrics.verticalScale(py) : undefined,
    paddingLeft: pl !== undefined ? Metrics.scale(pl) : px !== undefined ? Metrics.scale(px) : undefined,
    paddingRight: pr !== undefined ? Metrics.scale(pr) : px !== undefined ? Metrics.scale(px) : undefined,
  };

  return (
    <Text
    onPress={onPress}
      style={[
        styles.AppText,
        {
          color,
          fontSize: Metrics.generatedFontSize(fontSize),
          textAlign,
         fontFamily,
          lineHeight: lineHeight && Metrics.generatedFontSize(lineHeight),
          letterSpacing,
          textTransform,
          textDecorationLine,
          opacity,
          ...spacingStyles,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {text}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  AppText: {},
});
