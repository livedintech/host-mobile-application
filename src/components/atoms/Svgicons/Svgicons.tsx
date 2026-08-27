import React, { useMemo } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Metrics from '@/utility/Metrics';
import { icons } from '@/assets/icons';

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
  const icon = useMemo(() => icons[path], [path]);

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

  const resolvedWidth = size ? Metrics.scale(size) : Metrics.scale(width);
  const resolvedHeight = size ? Metrics.scale(size) : Metrics.verticalScale(height);

  if (typeof icon === 'number') {
    return (
      <View style={style}>
        <Image source={icon} style={{ width: resolvedWidth, height: resolvedHeight }} resizeMode="contain" />
      </View>
    );
  }

  if (!icon) {
    console.error(`Icon not found: ${path}`);
    return null;
  }

  const IconComponent = icon as React.ComponentType<SvgProps>;
  return (
    <View style={style}>
      <IconComponent
        width={resolvedWidth}
        height={resolvedHeight}
        {...rest}
      />
    </View>
  );
}