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

import BookingDetailsCard from '@/components/molecules/BookingDetailsCard/BookingDetailsCard';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';


const BookingDetailsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GradientBorder
          borderRadius={16}
          borderWidth={1}
          style={styles.backButtonGradient}
        >
          <TouchableOpacity
            style={styles.backButtonInner}
            onPress={() => navigation?.goBack()}
          >
            <ChevronLeft size={ms(26)} color="#1A332C" />
          </TouchableOpacity>
        </GradientBorder>

        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.spacer} />
      </View>

      {/* --- CONTENT SECTION --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BookingDetailsCard />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(15),
  },
  backButtonGradient: {
    width: ms(45),
    height: ms(45),
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
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
    width: ms(45),
  },
  scrollContent: {
    paddingTop: vs(10),
    paddingBottom: vs(30),
    alignItems: 'center',
  },
});

export default BookingDetailsScreen;