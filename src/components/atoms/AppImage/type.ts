import { StyleProp, ViewStyle } from 'react-native';
import { FastImageProps } from '@d11/react-native-fast-image';

export interface AppImageProps extends Omit<FastImageProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showLoader?: boolean;
  loaderColor?: string;
  loaderSize?: 'small' | 'large';
  fallbackSource?: FastImageProps['source'];
}
