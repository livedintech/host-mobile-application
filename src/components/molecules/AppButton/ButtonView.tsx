// NOTE
// TouchableHighlight

// • What it does: Darkens or lightens the background of the element when pressed.

// • When to use it: On iOS for touchable elements or buttons that have a solid shape or background, and on ListView items.

// TouchableOpacity

// • What it does: Lightens the opacity of the entire element when pressed.

// • When to use it: On iOS for touchable elements that are standalone text or icons with no background color.

// TouchableNativeFeedback

// • What it does: Adds a ripple effect to the background when pressed.

// • When to use it: On Android for almost all touchable elements.

import Metrics from '@/utility/Metrics';
import Utils from '@/utility/Utils';
import React, { useMemo } from 'react';
import {
  Insets,
  Platform,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
interface IButtonView extends TouchableOpacityProps {
  backgroundColor?:string;
  style?: StyleProp<ViewStyle>;
  hitSlop?: Insets;
  disabled?: boolean;
  disableRipple?: boolean;
  iosSolidShape?: boolean;
  children: React.ReactNode;
  isBackgroundBorderLess?: boolean;
  m?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  px?: number;
  py?: number;
}

export const ButtonView = ({
  style,
  children,
  disabled = false,
  onPress = () => null,
  onLongPress = () => null,
  hitSlop,
  m, mt, mb, ml, mr, mx, my,
  p, pt, pb, pl, pr, px, py,
  backgroundColor
}: IButtonView) => {

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
  const [debounceTime, debounceConfig] = useMemo(
    () => [
      Platform.select({
        ios: 200,
        android: 300,
      }),
      {
        leading: true,
        trailing: false,
      },
    ],
    [],
  );

  const _onPress = Utils.debounce(onPress, debounceTime, debounceConfig);
  const _onLongPress = Utils.debounce(
    onLongPress,
    debounceTime,
    debounceConfig,
  );

  return (
    <TouchableOpacity
      style={[ {backgroundColor, ...spacingStyles },style]}
      onPress={_onPress}
      activeOpacity={0.5}
      disabled={disabled}
      onLongPress={_onLongPress}
      hitSlop={hitSlop}>
      {children}
    </TouchableOpacity>
  );
};

export default ButtonView;
