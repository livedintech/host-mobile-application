import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import useManageBookingContainer from '../ManageBooking/ManageBookingContainer';
import Metrics from '@/utility/Metrics';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const PLATFORMS = [
  { key: 'Airbnb', icon: 'airbnb', labelKey: 'connect_airbnb' },
  { key: 'Gathern', icon: 'gathern', labelKey: 'connect_gathern' },
  { key: 'Booking.com', icon: 'bookingCom', labelKey: 'connect_bookingcom' },
] as const;

const ConnectOTAPlatformsScreen = () => {
  const { t } = useTranslation();
  const { handleConnect, refetch, connectedAccounts } =
    useManageBookingContainer();

  // ✅ Screen focus hone par refetch — agar connect ho gaya to wapas jao
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  // ✅ Account connect ho gaya — wapas ManageBooking par jao
  useFocusEffect(
    useCallback(() => {
      const totalAccounts = connectedAccounts?.length ?? 0;
      if (totalAccounts > 0) {
        goBack();
      }
    }, [connectedAccounts]),
  );

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.bgContainer}
    >
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleSection}>
          <AppText
            text={t('app.shared.connect_ota_title')}
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
          />
          <AppText
            text={t('app.shared.connect_ota_desc')}
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={12}
            lineHeight={22}
          />
        </View>

        {/* Platform List */}
        <View style={styles.platformList}>
          {PLATFORMS.map(platform => (
            <TouchableOpacity
              key={platform.key}
              activeOpacity={0.8}
              onPress={() => handleConnect(platform.key)}
              disabled={false}
            >
              <GlassCard width="100%" style={styles.platformCard}>
                <Svgicons path={platform.icon} size={28} />
                <AppText
                  text={t(`app.connect_ota.${platform.labelKey}`)}
                  fontSize={16}
                  type="Medium"
                  color={Colors.BLACK}
                  ml={15}
                />
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BGImage>
  );
};

export default ConnectOTAPlatformsScreen;

const styles = StyleSheet.create({
  bgContainer: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  backBtnWrapper: {
    width: 44,
    height: 44,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  platformList: {
    paddingHorizontal: 20,
    gap: Metrics.verticalScale(16),
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
