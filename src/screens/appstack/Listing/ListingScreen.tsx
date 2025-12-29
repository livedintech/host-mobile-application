import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';

const ListingScreen = ({ title, desc, emoji }: any) => {
  return (
    <View style={styles.container}>
      <AppText text={title} fontSize={28} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mb={40} />
      
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            <Image source={emoji} style={styles.avatar} />
            <View style={styles.activeDot} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={styles.rowBetween}>
              <AppText text="A.LI - Livedin" type="Bold" color={Colors.PINE_FOREST} />
              <AppText text="9:36 AM" color="#999" fontSize={12} />
            </View>
            <AppText text={desc} color={Colors.PINE_FOREST} mt={5} lineHeight={20} />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.connectBtn}>
        <AppText text="Connect Account" color={Colors.BRUNSWICK_GREEN} type="Medium" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  infoCard: { padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: Colors.WHITE },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1A4D2E', position: 'absolute', left: -5, top: '45%' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  connectBtn: { marginTop: 40, height: 55, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }
});
export default ListingScreen;