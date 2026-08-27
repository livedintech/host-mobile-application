import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const isOnline = (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) =>
  !!state.isConnected && state.isInternetReachable !== false;

// Apple's own captive-portal check endpoint: tiny, always up, and exercises the
// real network stack instead of the OS reachability flag (which can get stuck
// reporting "offline" even after the connection is actually back).
const PROBE_URL = 'https://captive.apple.com/hotspot-detect.html';

const canReachInternet = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(PROBE_URL, { method: 'HEAD', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

const NoInternet = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(isOnline(state));
    });

    return () => unsubscribe();
  }, []);

  // NetInfo's own reachability flag can get stuck reporting "offline" (seen on
  // iOS Simulator after a full host network power-cycle), which would leave
  // this overlay stuck forever. While offline, actually try to reach the
  // internet on an interval — a real request succeeding is ground truth,
  // regardless of what NetInfo's cached state says.
  useEffect(() => {
    if (isConnected) {
      return;
    }

    const interval = setInterval(async () => {
      if (await canReachInternet()) {
        setIsConnected(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (isConnected) {
    return null;
  }

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <WifiOff size={56} color={Colors.PRIMARY_TEAL} strokeWidth={2} />
        </View>
        <AppText
          text={t('app.no_internet.title')}
          fontSize={24}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
          mt={28}
        />
        <AppText
          text={t('app.no_internet.description')}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          textAlign="center"
          mt={12}
          lineHeight={21}
          px={10}
        />
      </View>
    </BGImage>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.WHITE,
    zIndex: 9999,
    elevation: 9999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(30),
  },
  iconCircle: {
    width: Metrics.scale(140),
    height: Metrics.scale(140),
    borderRadius: Metrics.scale(70),
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
  },
});
