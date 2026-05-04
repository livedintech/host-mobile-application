import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import useAIPricingContainer from './AIPricingContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const AddAIPricingScreen = () => {
  const { control, errors, handleSubmit, onSave, isLoading } = useAIPricingContainer();
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerRow}>
             <ButtonView onPress={() => goBack()}>
                        <Svgicons path="back" size={40} />
                      </ButtonView>
            <CircularProgress percentage={87} size={48} strokeWidth={4} />
          </View>

          <AppText text={t('app.ai_pricing.title')} fontSize={32} type="Bold" mt={35} />

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <InputField 
                name="maximum_price" 
                label={t('app.ai_pricing.max_price_label')}
                control={control as any}
                errors={errors}
                placeholder={t('app.ai_pricing.price_placeholder')} 
                keyboardType="numeric"
            />
            
            <View style={styles.fieldGap} />
            
            <InputField 
                name="minimum_price" 
                label={t('app.ai_pricing.min_price_label')}
                control={control as any}
                errors={errors}
                placeholder={t('app.ai_pricing.price_placeholder')} 
                keyboardType="numeric"
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <AppButton
            title={t('app.ai_pricing.next')}
            variant="secondary"
            onPress={handleSubmit((d) => onSave(d, false))} 
            loading={isLoading} 
          />
          <AppButton
            title={t('app.ai_pricing.save_exit')}
            mt={12}
            onPress={handleSubmit((d) => onSave(d, true))} 
            disabled={isLoading} 
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 200 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10 
  },
  backBtnWrapper: { 
    width: 35, 
    height: 35, 
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backBtn: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  formGroup: { marginTop: 40 },
  fieldGap: { height: 25 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    paddingBottom: 40 
  },
});

export default AddAIPricingScreen;