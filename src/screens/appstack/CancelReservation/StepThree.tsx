import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vs, s } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const StepThree = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingData, parentReason, subReasonValue } = route.params || {};
  
  const [internalNote, setInternalNote] = useState('');

  const handleNext = () => {
    navigation.navigate(NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP4_SCREEN, {
      bookingData,
      parentReason,
      subReasonValue,
      messageToAirbnb: internalNote, // Pass internal note to final step
    });
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <AppText text={t('app.cancel_reservation.step3_title')} type="Bold" fontSize={26} mb={vs(10)} />
          <AppText
            text={t('app.cancel_reservation.step3_description')}
            fontSize={14} 
            lineHeight={20}
            color={Colors.DARK_CHARCOAL_OPACITY_74} 
            mb={vs(30)} 
          />

          <GlassCard style={styles.inputCard}>
            <TextInput
              multiline
              placeholder={t('app.cancel_reservation.step3_placeholder')}
              placeholderTextColor={Colors.DARK_CHARCOAL_OPACITY_74}
              style={styles.textInput}
              value={internalNote}
              onChangeText={setInternalNote}
              maxLength={500}
            />
          </GlassCard>
          <AppText text={`${internalNote.length}/500 characters`} fontSize={12} textAlign="right" color={Colors.DARK_CHARCOAL_OPACITY_74} mt={vs(5)} />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title={t('app.cancel_reservation.step3_next')}
            backgroundColor={Colors.PRIMARY_TEAL} 
            onPress={handleNext}
            disabled={internalNote.length < 5} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { padding: s(20), paddingTop: vs(20) },
  inputCard: { padding: s(15), height: vs(180), borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', width: '100%' },
  textInput: { flex: 1, textAlignVertical: 'top', color: Colors.BLACK, fontSize: 15 },
  footer: { padding: s(20), paddingBottom: vs(30) },
});

export default StepThree;