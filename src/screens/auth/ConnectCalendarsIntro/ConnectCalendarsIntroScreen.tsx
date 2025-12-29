import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const ConnectCalendarsIntroScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            type="Bold" 
            textAlign="center" 
            color={Colors.PINE_FOREST} 
          />
          <View style={styles.row}>
            <AppText text="Or Just " fontSize={32} color={Colors.PINE_FOREST} />
            <AppText 
              text="Getting " 
              fontSize={32} 
              type="SemiBold" 
              color={Colors.PINE_FOREST} 
              italic
            />
          </View>
          <AppText 
              text="Started." 
              fontSize={32} 
              type="SemiBold" 
              color={Colors.PINE_FOREST} 
              italic
            />
          <AppText 
            text="Connect your calendars in 1 click. Prevent double bookings and sync your rates instantly."
            textAlign="center" 
            color={Colors.PINE_FOREST} 
            mt={15} 
            fontSize={15}
            px={15}
          />
        </View>

        {/* Button */}
        <AppButton 
          title="Connect Account" 
          onPress={() => console.log("Navigate to Sync logic")}
          mt={34}
        />
      </ScrollView>
      <Pagination 
        activeIndex={1} 
      />
    </View>
  );
};

export default ConnectCalendarsIntroScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  cardContainer: { marginTop: 30, alignItems: 'center' },
  img: { width: '100%', height: '100%' },
  titleSection: { marginTop: 30, alignItems: 'center', paddingHorizontal: Metrics.scale(30) },
  row: { flexDirection: 'row', alignItems: 'center' },
 
});