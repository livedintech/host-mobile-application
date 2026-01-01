import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAccountContainer from './AccountContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const AccountScreen = () => {
  const { accountOptions, handlePress, navigation } = useAccountContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account Title with Icon */}
        <View style={styles.titleRow}>
          <AppText text="Account" fontSize={32} type="Bold" color={Colors.PINE_FOREST} />
          <Svgicons path='userIcon'/>
          {/* <Image source={require('@/assets/img/user_profile_icon.png')} style={styles.userIcon} /> */}
        </View>

        {/* Options List */}
        <View style={styles.listContainer}>
          {accountOptions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.optionCard} 
              onPress={() => handlePress(item.route)}
              activeOpacity={0.7}
            >
              <AppText text={item.title} fontSize={20} type="Medium" color={Colors.PINE_FOREST} />
              <View style={styles.arrowCircle}>
                <Image source={require('@/assets/img/arrow_up_right.png')} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' },
  roundBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center' },
  backIcon: { width: 20, height: 20, resizeMode: 'contain' },
  rightHeader: { flexDirection: 'row', alignItems: 'center' },
  langBadge: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  userIcon: { width: 40, height: 40, marginLeft: 15, resizeMode: 'contain', tintColor: Colors.BRUNSWICK_GREEN },
  listContainer: { marginTop: 10 },
  optionCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: Colors.WHITE,
    height: 80, 
    borderRadius: 22, 
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center' },
  arrowIcon: { width: 16, height: 16, tintColor: Colors.PINE_FOREST },
});

export default AccountScreen;