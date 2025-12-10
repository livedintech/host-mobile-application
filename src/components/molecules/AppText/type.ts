import { TextStyle } from 'react-native';

export interface SpacingProps {
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

export interface AppTextProps extends SpacingProps {
  onPress?: ()=> void, 
  text: string;
  color?: string;
  fontSize?: number;
  type?: 'Regular'| 'Medium' | 'Bold' | 'SemiBold' | 'Light';  // New prop for font weight style
  textAlign?: TextStyle['textAlign'];
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
  textDecorationLine?: TextStyle['textDecorationLine'];
  opacity?: number;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}
