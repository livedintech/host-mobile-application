import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Toast from 'react-native-toast-message';
import { submitBookingRequestApi } from '@/services/calendarBookingManagement';
import TextareaField from '@/components/molecules/Input/TextareaField';

const StepThree = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id, reason, guestName } = route.params || {};
  const [loading, setLoading] = useState(false);

  // Initialize React Hook Form
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      msgAirbnb: '',
      msgGuest: '',
    }
  });

  // Watch values for character count validation (optional UI display)
  const airbnbText = watch('msgAirbnb');
  const guestText = watch('msgGuest');

  const onDeclineSubmit = async (data: any) => {
    try {
      setLoading(true);
      const payload = {
        thread_id: id,
        accept: false,
        reason: reason,
        decline_message_to_guest: data.msgGuest,
        decline_message_to_airbnb: data.msgAirbnb,
      };

      await submitBookingRequestApi(payload);
      
      Toast.show({ type: 'success', text1: 'Trip Declined Successfully' });
      navigation.popToTop(); 
    } catch (error: any) {
      Toast.show({ 
        type: 'error', 
        text1: 'Error declining trip', 
        text2: error?.message || 'Something went wrong' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Private message to Airbnb */}
          <AppText text="What else would you like us to know?*" fontSize={28} type="Bold" mb={4} />
          
          <TextareaField
            name="msgAirbnb"
            control={control as any}
            errors={errors}
            multiline
            placeholder="I'm declining this reservation because..."
            rules={{ 
              required: 'This field is required',
              minLength: { value: 20, message: 'Minimum 20 characters required' }
            }}
          />

          {/* Section 2: Public message to Guest */}
          <AppText 
            text={`Let ${guestName || 'Mohammed'} know why you're unable to host`} 
            fontSize={28} 
            type="Bold" 
            mt={24} 
            mb={4} 
          />

          <TextareaField
            name="msgGuest"
            control={control as any}
            errors={errors}
            multiline
            placeholder="I'm declining this reservation because..."
            rules={{ 
              required: 'This field is required',
              minLength: { value: 20, message: 'Minimum 20 characters required' }
            }}
          />
        </ScrollView>

        {/* Footer: Fixed at the bottom */}
        <View style={styles.footer}>
          <AppButton 
            title="Cancel" 
            variant="secondary" 
            onPress={() => navigation.goBack()} 
            mb={12} 
          />
          <AppButton 
            title="Send and decline trip" 
            loading={loading}
            backgroundColor="#21AA8F"
            onPress={handleSubmit(onDeclineSubmit)} 
          />
        </View>
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: Metrics.scale(24), 
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(120), // Extra space for footer
  },
  footer: { 
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(Platform.OS === 'ios' ? 34 : 24),
    backgroundColor: 'transparent', // Keeps the BG image visible
  }
});

export default StepThree;