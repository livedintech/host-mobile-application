import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vs, s } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { Colors } from '@/theme/colors';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

// The reasons array provided in your previous context
// const reasons = [
//   {
//     id: '1',
//     title: "My place isn't available",
//     value: 'DECLINE_REASON_HOST_DOUBLE',
//     subreasons: [
//       { value: 'DECLINE_REASON_HOST_EMERGENCY', label: 'I have an emergency' },
//       { value: 'DECLINE_REASON_HOST_HOST_UNAVAILABLE', label: 'I cannot host on these dates anymore' },
//       { value: 'DECLINE_REASON_HOST_DOUBLE_BOOKED', label: 'Another guest has already reserved these dates' },
//     ],
//   },
//   {
//     id: '2',
//     title: 'I am looking for a different price or trip length',
//     value: 'DECLINE_REASON_HOST_CHANGE',
//     subreasons: [
//       { value: 'DECLINE_REASON_HOST_RESERVATION_LENGTH', label: 'I want a different trip length.' },
//       { value: 'DECLINE_REASON_HOST_DIFFERENT_PRICE', label: 'I want a different price' },
//     ],
//   },
//   {
//     id: '3',
//     title: "I'm worried the guest will have an unauthorized party",
//     value: 'DECLINE_REASON_HOST_UNAUTHORIZED_PARTY',
//     subreasons: [
//       { value: 'DECLINE_REASON_HOST_PARTY_REVIEWS', label: 'Guests have negative reviews that indicate party ban violations' },
//       { value: 'DECLINE_REASON_HOST_PARTY_INDICATION', label: 'Guests indicated they are going to host a party' },
//     ],
//   },
//   {
//     id: '4',
//     title: 'Guest behavior is not good',
//     value: 'DECLINE_REASON_HOST_BEHAVIOR',
//     subreasons: [
//       { value: 'DECLINE_REASON_HOST_BEHAVIOR_REVIEWS', label: 'Guests have negative reviews indicating broken house rules' },
//       { value: 'DECLINE_REASON_HOST_BEHAVIOR_INDICATION', label: 'Guests indicated they will break house rules' },
//       { value: 'DECLINE_REASON_HOST_BEHAVIOR_OTHER', label: "Host has other concerns about this guest's behavior" },
//       { value: 'DECLINE_REASON_HOST_GUEST_PROFILE', label: 'Guests have bad reviews or insufficient profile info' },
//     ],
//   },
//   {
//     id: '5',
//     title: 'The guest wants to cancel',
//     value: 'DECLINE_REASON_HOST_ASKED',
//     subreasons: [],
//   },
//   {
//     id: '6',
//     title: 'Other reasons',
//     value: 'DECLINE_REASON_HOST_OTHER',
//     subreasons: [],
//   },
// ];


const reasons = [
  {
    id: '1',
    title: "My place isn't available",
    value: 'DECLINE_REASON_HOST_DOUBLE',
    subreasons: [
      {
        value: 'DECLINE_REASON_HOST_EMERGENCY',
        label: 'I have an emergency',
      },
      {
        value: 'DECLINE_REASON_HOST_HOST_UNAVAILABLE',
        label: 'I cannot host on these dates anymore',
      },
      {
        value: 'DECLINE_REASON_HOST_DOUBLE_BOOKED',
        label: 'Another guest is already coming on these dates',
      },
    ],
  },
  {
    id: '2',
    title: 'I am looking for a different price or trip length',
    value: 'DECLINE_REASON_HOST_CHANGE',
    subreasons: [
      {
        value: 'DECLINE_REASON_HOST_RESERVATION_LENGTH',
        label: 'I want a different trip length.',
      },
      {
        value: 'DECLINE_REASON_HOST_DIFFERENT_PRICE',
        label: 'I want a different price',
      },
    ],
  },
  {
    id: '3',
    title: "I'm worried the guest will have an unauthorized party",
    value: 'DECLINE_REASON_HOST_UNAUTHORIZED_PARTY',
    subreasons: [
      {
        value: 'DECLINE_REASON_HOST_PARTY_REVIEWS',
        label:
          "The guest has negative reviews indicating they've thrown an unauthorized party in the past",
      },
      {
        value: 'DECLINE_REASON_HOST_PARTY_INDICATION',
        label:
          "The guest has indicated they're going to throw a party in our message thread",
      },
    ],
  },
  {
    id: '4',
    title: 'The guest wants to cancel',
    value: 'DECLINE_REASON_HOST_ASKED',
    subreasons: [],
  },
  {
    id: '5',
    title: 'Other reasons',
    value: 'DECLINE_REASON_HOST_OTHER',
    subreasons: [],
  },
];

const StepOne = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingData } = route.params;

  const handleSelectReason = (reason: any) => {
    if (reason.subreasons && reason.subreasons.length > 0) {
      // Navigate to Step Two: Pass the whole selectedReason object + parentReason value
      navigation.navigate(NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP2_SCREEN, {
        bookingData,
        selectedReason: reason,
        parentReason: reason.value, // This is key for your API payload
      });
    } else {
      // Directly to Step Three if no sub-reasons exist (like for "Other")
      navigation.navigate(NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP3_SCREEN, { 
        bookingData, 
        parentReason: reason.value,
        subReasonValue: '', // Empty because none exist for this selection
      });
    }
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppText text={t('app.cancel_reservation.step1_title')} type="Bold" fontSize={24} mb={vs(10)} />
        <AppText
          text={t('app.cancel_reservation.step1_description')}
          fontSize={13} 
          lineHeight={18}
          color={Colors.DARK_CHARCOAL_OPACITY_74} 
          mb={vs(30)} 
        />

        <AppText text={t('app.shared.step1_cant_host', { name: bookingData?.guest_name || t('app.shared.this_guest') })} type="Bold" fontSize={22} mb={vs(20)} />

        {reasons.map((item) => (
          <ButtonView key={item.id} onPress={() => handleSelectReason(item)}>
            <GlassCard style={styles.card}>
              <AppText text={item.title} fontSize={14} type="Medium" color={Colors.BLACK} />
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
    borderColor: 'rgba(255,255,255,0.3)',
    width: '100%'
  },
});

export default StepOne;