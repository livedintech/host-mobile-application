import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Metrics from '@/utility/Metrics';
import { icons } from '@/assets/icons'; // <- yahan import

type IconProps = {
  path: keyof typeof icons; 

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

  size?: number;
  width?: number;
  height?: number;
} & SvgProps;

export default function Svgicons({
  path,
  size,
  width = 20,
  height = 20,

  m, mt, mb, ml, mr, mx, my,
  p, pt, pb, pl, pr, px, py,

  ...rest
}: IconProps) {
  const IconComponent = useMemo(() => {
    const component = icons[path];
    if (!component) {
      console.error(`Icon not found: ${path}`);
      return () => null;
    }
    return component;
  }, [path]);

  const style: ViewStyle = {
    margin: m,
    marginTop: mt ?? my,
    marginBottom: mb ?? my,
    marginLeft: ml ?? mx,
    marginRight: mr ?? mx,

    padding: p,
    paddingTop: pt ?? py,
    paddingBottom: pb ?? py,
    paddingLeft: pl ?? px,
    paddingRight: pr ?? px,
  };

  return (
    <View style={style}>
      <IconComponent
        width={size ? Metrics.scale(size) : Metrics.scale(width)}
        height={size ? Metrics.scale(size) : Metrics.verticalScale(height)}
        {...rest}
      />
    </View>
  );
}