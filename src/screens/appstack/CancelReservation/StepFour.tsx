import i18n from '@/locales/i18n/i18n';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vs, s } from 'react-native-size-matters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { cancelOtaBookingApi } from '@/services/calendarBookingManagement';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';

const StepFour = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  
  const { 
    bookingData, 
    parentReason, 
    subReasonValue, 
    messageToAirbnb 
  } = route.params || {};

  const [guestMessage, setGuestMessage] = useState('');

  const deductionAmount = Number(bookingData?.guest_paid_amount || 0).toFixed(2);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      cancelOtaBookingApi(bookingData?.booking_id, {
        reason: parentReason,
        sub_reason: subReasonValue || '',
        message_to_guest: guestMessage,
        message_to_airbnb: messageToAirbnb,
      }),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: i18n.t('common.toast.reservation_cancelled') });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.CALENDAR_DATA] });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.RESERVATIONS_LIST] });
      // navigation.navigate(NavigationRoutes.APP_STACK.ROOT_STACK, {
      //   screen: NavigationRoutes.APP_STACK.LISTING,
      // });
      navigation.popToTop();
    },
    onError: (error: any) => {
      Toast.show({ 
        type: 'error', 
        text1: i18n.t('common.toast.cancellation_failed'), 
        text2: error?.message || i18n.t('common.toast.something_went_wrong') 
      });
    },
  });

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <AppText text={t('app.shared.step4_deduction', { amount: deductionAmount })} type="Bold" fontSize={24} mb={vs(10)} />
          <AppText
            text={t('app.cancel_reservation.step4_fee_description')}
            fontSize={13} 
            color={Colors.DARK_CHARCOAL_OPACITY_74} 
            mb={vs(30)} 
          />

          <AppText text={t('app.cancel_reservation.step4_message_label', { name: bookingData?.guest_name || t('app.cancel_reservation.guest_fallback') })} type="Medium" fontSize={18} mb={vs(15)} />
          
          <GlassCard style={styles.inputCard}>
            <TextInput
              multiline
              placeholder={t('app.cancel_reservation.step4_placeholder')}
              style={styles.textInput}
              value={guestMessage}
              onChangeText={setGuestMessage}
              maxLength={240}
            />
          </GlassCard>
          <AppText text={t('app.cancel_reservation.chars_counter', { count: guestMessage.length })} fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY_74} mt={vs(5)} />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title={t('app.cancel_reservation.keep_btn')}
            variant="secondary" 
            onPress={() => navigation.popToTop()} 
            mb={vs(10)}
          />
          <AppButton 
            title={t('app.cancel_reservation.cancel_btn')}
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