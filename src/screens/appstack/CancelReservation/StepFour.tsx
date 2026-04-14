import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vs, s } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { cancelOtaBookingApi } from '@/services/calendarBookingManagement';

const StepFour = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { 
    bookingData, 
    parentReason, 
    subReasonValue, 
    messageToAirbnb 
  } = route.params || {};

  const [guestMessage, setGuestMessage] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      cancelOtaBookingApi(bookingData?.booking_id, {
        reason: parentReason,
        sub_reason: subReasonValue || '',
        message_to_guest: guestMessage,
        message_to_airbnb: messageToAirbnb,
      }),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Reservation cancelled successfully' });
      navigation.popToTop();
    },
    onError: (error: any) => {
      Toast.show({ 
        type: 'error', 
        text1: 'Cancellation failed', 
        text2: error?.message || 'Something went wrong' 
      });
    },
  });

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <AppText text="SR187.50 will be deducted from your next payout" type="Bold" fontSize={24} mb={vs(10)} />
          <AppText 
            text="The fee is typically 25% of the trip total to cover costs of finding guest another place." 
            fontSize={13} 
            color={Colors.DARK_CHARCOAL_OPACITY_74} 
            mb={vs(30)} 
          />

          <AppText text={`Tell ${bookingData?.guest_name || 'the guest'} why you're cancelling`} type="Medium" fontSize={18} mb={vs(15)} />
          
          <GlassCard style={styles.inputCard}>
            <TextInput
              multiline
              placeholder="I need to cancel your reservation because..."
              style={styles.textInput}
              value={guestMessage}
              onChangeText={setGuestMessage}
              maxLength={240}
            />
          </GlassCard>
          <AppText text={`${guestMessage.length}/240 characters`} fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY_74} mt={vs(5)} />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Keep Reservation" 
            variant="secondary" 
            onPress={() => navigation.popToTop()} 
            mb={vs(10)}
          />
          <AppButton 
            title="Cancel Reservation" 
            backgroundColor={Colors.PRIMARY_TEAL} 
            onPress={() => mutate()}
            loading={isPending}
            disabled={isPending || guestMessage.length < 5} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { padding: s(20), paddingTop: vs(20) },
  inputCard: { padding: s(15), height: vs(150), borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', width: '100%' },
  textInput: { flex: 1, textAlignVertical: 'top', color: Colors.BLACK, fontSize: 14 },
  footer: { padding: s(20), paddingBottom: vs(30) },
});

export default StepFour;