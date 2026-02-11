import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Text
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, MessageCircle, Phone } from 'lucide-react-native';
import GuestProfile from '@/components/molecules/GuestProfile/GuestProfile';

const GuestDetailsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <GuestProfile />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(15),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: s(5),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#1A332C',
  },
  scrollContent: {
    paddingBottom: vs(40),
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(30),
    marginTop: vs(20),
    gap: s(12),
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2D4A41',
    height: vs(50),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(8),
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: ms(15),
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F6F5',
    height: vs(50),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(8),
    borderWidth: 1,
    borderColor: '#E2E8E7',
  },
  secondaryButtonText: {
    color: '#2D4A41',
    fontSize: ms(15),
    fontWeight: '600',
  },
});

export default GuestDetailsScreen;