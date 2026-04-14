import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Metrics from '@/utility/Metrics';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const StepTwo = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { start_date, end_date } = route.params || {};

  // Helper to format ISO dates (e.g., 2026-04-11 to 11 Apr)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const displayRange = start_date && end_date 
    ? `${formatDate(start_date)} - ${formatDate(end_date)}` 
    : 'Requested dates';

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Dynamically display the date range */}
          <AppText 
            text={`${displayRange} will remain blocked`} 
            fontSize={28} 
            type="Bold" 
            mb={20} 
          />
          <AppText 
            text="Since those dates aren't available, they'll remain blocked. If your availability info isn't correct, please update your calendar after you decline." 
            fontSize={16} 
            color="#333333" 
            lineHeight={22}
          />
        </View>

        <View style={styles.footer}>
          <AppButton 
            title="Cancel" 
            variant="secondary" 
            onPress={() => navigation.goBack()} 
            mb={12}
          />
          <AppButton 
            title="Next" 
            variant="primary" 
            backgroundColor="#21AA8F"
            onPress={() => navigation.navigate(NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP3_SCREEN, route.params)} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Metrics.scale(24) },
  content: { flex: 1, paddingTop: Metrics.verticalScale(0) },
  footer: { marginBottom: Metrics.verticalScale(20) }
});

export default StepTwo;