import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useHomeContainer from './HomeContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const HomeScreen = () => {
  const { user } = useAuthStore();
  const { onConnect, UserPermission } = useHomeContainer();

  const isSupervisor = UserPermission?.role_key === 'supervisor';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppText
          text={`Hi ${user?.name}, how may I help you today?`}
          fontSize={32}
          type="Medium"
          color={Colors.PINE_FOREST}
        />

        <View style={styles.cardContainer}>
          {['Connect Booking Platform', 'Connect New Listing'].map(item => (
            <ButtonView
              key={item}
              style={[styles.platformBtn, isSupervisor && styles.disabledBtn]}
              disabled={isSupervisor}
              onPress={() => onConnect(item)}
            >
              <AppText
                text={item}
                fontSize={16}
                color={isSupervisor ? Colors.DISABLED_GREY : Colors.PINE_FOREST}
              />
              <View style={isSupervisor && styles.disabledIcon}>
                <Svgicons
                  path="UploadIcon"
                  stroke={isSupervisor ? Colors.DISABLED_GREY : Colors.PINE_FOREST}
                />
              </View>
            </ButtonView>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { flex: 1, paddingHorizontal: 25, marginTop: 40 },
  cardContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  platformBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: Colors.WHITE,
  },
  disabledBtn: {
    backgroundColor: Colors.DISABLED_BG,
    borderColor: '#E8E8E8',
  },
  disabledIcon: {
    opacity: 0.4, 
  },
});

export default HomeScreen;