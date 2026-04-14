import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vs, s } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { Colors } from '@/theme/colors';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const StepTwo = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // parentReason comes from StepOne selection
  const { bookingData, selectedReason, parentReason } = route.params || {};

  const handleSubReasonSelect = (sub: any) => {
    // Navigate to Step Three (The payout/message screen)
    navigation.navigate(NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP3_SCREEN, {
      bookingData,
      parentReason: parentReason,
      subReasonValue: sub.value, // Capture the specific sub-reason
    });
  };

  // Logic to reformat the header title to match the UI screenshot
  const displayTitle = selectedReason?.title?.toLowerCase().includes("isn't available") 
    ? "Why isn't your place available?" 
    : selectedReason?.title;

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppText 
          text={displayTitle} 
          type="Bold" 
          fontSize={26} 
          mb={vs(30)} 
        />

        {selectedReason?.subreasons?.map((sub: any, index: number) => (
          <ButtonView 
            key={index} 
            onPress={() => handleSubReasonSelect(sub)}
            activeOpacity={0.7}
          >
            <GlassCard style={styles.card}>
              <AppText 
                text={sub.label} 
                fontSize={14} 
                type="Medium" 
                color={Colors.BLACK} 
              />
            </GlassCard>
          </ButtonView>
        ))}
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: s(20),
    paddingTop: vs(20),
    paddingBottom: vs(40),
  },
  card: {
    padding: s(20),
    marginBottom: vs(12),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // Subtle frosted border
    width: '100%',
  },
});

export default StepTwo;