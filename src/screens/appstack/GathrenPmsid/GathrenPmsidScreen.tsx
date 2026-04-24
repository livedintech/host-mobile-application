import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useGathrenPMSIdContainer from './GathrenPmsidContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useTranslation } from 'react-i18next';

const PMSIdScreen = () => {
  const { t } = useTranslation();
  const { control, errors, handleSubmit, onNext, onCreateAccount,isLoading } = useGathrenPMSIdContainer();

  return (
    <View style={styles.container}>
      {/* Background Decorative Circles */}
      <View style={styles.circleBg} />

      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <AppText text={t('app.gathren_pms.title')} fontSize={32} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />
        </View>

        {/* Input Field Section */}
        <View style={styles.formSection}>
          <AppText text={t('app.gathren_pms.pms_label')} fontSize={16} type="SemiBold" color={Colors.BRUNSWICK_GREEN} mb={8} />

          <Controller
            control={control}
            name="pms_id"
            rules={{ required: 'PMS ID is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.pms_id && styles.errorInput]}
                placeholder=""
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.pms_id && (
            <AppText text={errors.pms_id.message || ''} color={Colors.INDIAN_RED} fontSize={12} mt={5} />
          )}

          {/* Instruction Note */}
          <AppText
            mt={16}
            text={t('app.gathren_pms.description')}
            fontSize={10}
            color={Colors.PINE_FOREST}
          />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.footer}>
<AppButton loading={isLoading} onPress={handleSubmit(onNext)} title={t('app.gathren_pms.next')} mb={10}/>
          <AppButton disabled={isLoading} onPress={onCreateAccount} title={t('app.gathren_pms.create_account')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  circleBg: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 600,
    height: 600,
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    zIndex: -1
  },
  content: { flex: 1, paddingHorizontal: 25 },
  backBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  backIcon: { width: 18, height: 18, resizeMode: 'contain' },
  titleSection: { marginTop: 150, marginBottom: 50 },
  formSection: { flex: 1 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.PINE_FOREST,
    backgroundColor: Colors.WHITE
  },
  errorInput: { borderColor: Colors.INDIAN_RED },
  instructionBox: { marginTop: 25 },
  footer: { paddingBottom: 40 },
  nextBtn: {
    height: 58,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  createBtn: {
    height: 58,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PMSIdScreen;