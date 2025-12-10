import { TextStyle, ViewStyle } from "react-native";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  textTransform?: TextStyle['textTransform'];
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  disabled?: boolean;
  loading?: boolean;
  type?: 'Regular' | 'Bold' | 'SemiBold' | 'Light';  // New prop for font weight style
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];

  // Spacing Props
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
