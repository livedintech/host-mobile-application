import React, { useEffect } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar } from 'react-native';

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('@/assets/img/SplashScreen.png')}
        style={styles.background}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});