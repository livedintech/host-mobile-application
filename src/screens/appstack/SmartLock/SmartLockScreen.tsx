import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useSmartLockContainer from './SmartLockContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';

const SmartLockScreen = () => {
  const { handleConnectAccount } = useSmartLockContainer()
  return (
    <View style={styles.container}>
      <AppText text={'No Smart Lock Available'} fontSize={28} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mb={40} />
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.activeDot} />
          <View style={styles.avatarContainer}>
            <Image source={require('@/assets/img/img1.png')} style={styles.avatar} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={styles.rowBetween}>
              <AppText text="A.LI - Livedin" type="Bold" color={Colors.PINE_FOREST} />
            </View>
            <AppText text={'You haven’t connected a smart lock yet. Link your TT Smart Lock account to get started.'} color={Colors.PINE_FOREST} mt={5} lineHeight={20} />
          </View>
        </View>
      </View>

      <AppButton
        mt={40}
        title='Connect TT Account'
        onPress={handleConnectAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: Colors.WHITE },
  infoCard: { padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: Colors.WHITE },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', backgroundColor: '#BDF0C5', borderRadius: 100, width: Metrics.scale(72), height: Metrics.scale(72), justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 40 },
  activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1A4D2E', marginRight: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  connectBtn: { marginTop: 40, height: 55, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }
});
export default SmartLockScreen;