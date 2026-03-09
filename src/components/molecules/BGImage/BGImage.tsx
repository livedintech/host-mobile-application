import React, { ReactNode } from 'react';
import {
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';

interface BGImageProps {
  source: ImageSourcePropType;
  children: ReactNode;
  style?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const BGImage: React.FC<BGImageProps> = ({
  source,
  children,
  style,
  resizeMode = 'cover',
}) => {
  return (
    <ImageBackground
      source={source}
      style={[styles.container, style]}
      resizeMode={resizeMode}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BGImage;
