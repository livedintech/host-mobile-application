import React from 'react';
import { StyleSheet, View, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { vs } from 'react-native-size-matters';

const ConnectCalendarsIntroScreen = () => {
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: 'transparent' }]} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Card Area */}
          <View style={styles.cardContainer}>
              <Image 
                source={require('@/assets/img/calendar_view.png')} 
                style={styles.img} 
                resizeMode="contain" 
              />
          </View>

          <View style={styles.titleSection}>
            <AppText 
              text="Airbnb. Gathern." 
              fontSize={32} 
              type="Medium" 
              textAlign="center"
              color="#1A332C" 
            />
            <AppText 
              text="Booking.com. Or just" 
              fontSize={32} 
              type="Medium" 
              textAlign="center"
              color="#1A332C" 
              mt={-5}
            />
            <AppText 
              text="getting started." 
              fontSize={32} 
              type="Bold" 
              color="#21AA8F" 
              textAlign="center"
              mt={-5}
            />
            
            <AppText 
              text="Connect your calendars in 1 click. Prevent double bookings and sync your rates instantly."
              textAlign="center"
              color="#5A716A" 
              mt={25} 
              fontSize={15}
              lineHeight={22}
            />
          </View>

          {/* Button - Using the color prop fix */}
          <AppButton 
            title="Connect Account" 
            onPress={() => console.log("Navigate to Sync logic")}
            style={styles.connectBtn}
            color="#FFFFFF" 
            type="Bold"
          />
        </ScrollView>

        <Pagination activeIndex={1} />
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingBottom: 100,
    paddingTop: vs(20) 
  },
  cardContainer: { 
    marginTop: vs(10), 
    alignItems: 'center',
  },
  img: { width: '100%', height: '100%' },
 
  titleSection: { 
    marginTop: vs(20), 
    alignItems: 'center',
    width: '100%',
  },
  connectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    height: vs(52),
    width: '100%',
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
});

export default ConnectCalendarsIntroScreen;