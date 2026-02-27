// screens/HubspotMeeting/ThankYouScreen/ThankYouScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const ThankYouScreen = () => {
  const handleClose = () => {
    // navigate(NavigationRoutes.MAIN_STACK.HOME);
    // 👆 Replace with your actual home route
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background circles */}
      <View style={styles.circleContainer} pointerEvents="none">
        <View style={styles.circleLarge} />
        <View style={styles.circleMedium} />
        <View style={styles.circleSmall} />
      </View>

      {/* ─── Content ─────────────────────────────────────────────────────────── */}
      <View style={styles.content}>
        <AppText
          text="Thank you! Our agent will contact you soon."
          textAlign="center"
          fontSize={32}
          px={36}
        />
      </View>

      {/* ─── Close Button ────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <AppButton title="Close" onPress={handleClose} />
      </View>
    </SafeAreaView>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  circleLarge: {
    width: Metrics.screenWidth * 1.5,
    height: Metrics.screenWidth * 1.5,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    position: 'absolute',
  },
  circleMedium: {
    width: Metrics.screenWidth * 1.1,
    height: Metrics.screenWidth * 1.1,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F4F4F4',
    position: 'absolute',
  },
  circleSmall: {
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenWidth * 0.7,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'absolute',
  },
});