import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft } from 'lucide-react-native';
import RateGuestCard from '@/components/molecules/RateGuestCard/RateGuestCard';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';


const RatingManagementScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <RateGuestCard />

        {/* Optional "Skip" Link */}
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
    paddingHorizontal: s(24),
    paddingVertical: vs(15),
  },
  backButtonBorder: {
    width: ms(42),
    height: ms(42),
  },
  backButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#1A332C',
    letterSpacing: -0.5,
  },
  spacer: {
    width: ms(42),
  },
  scrollContent: {
    paddingBottom: vs(50),
    alignItems: 'center',
  },
  contextContainer: {
    width: '100%',
    paddingHorizontal: s(35),
    marginTop: vs(30),
    marginBottom: vs(10),
  },
  contextTitle: {
    fontSize: ms(28),
    fontWeight: '800',
    color: '#1A332C',
    marginBottom: vs(8),
  },
  contextSubtitle: {
    fontSize: ms(15),
    color: '#7B8D88',
    lineHeight: ms(22),
  },
  skipButton: {
    marginTop: vs(20),
    padding: s(10),
  },
  skipText: {
    color: '#7B8D88',
    fontSize: ms(14),
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default RatingManagementScreen;