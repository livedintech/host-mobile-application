import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BGImage from '@/components/molecules/BGImage/BGImage';
import InputField from '@/components/molecules/Input/InputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import useAirbnbAccountNameContainer from './AirbnbAccountNameContainer';

const AirbnbAccountNameScreen = () => {
  const { t } = useTranslation();
  const { control, errors, onNext, isPending } = useAirbnbAccountNameContainer();

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.bg}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>
                {t('app.airbnb_account_name.title_prefix') + '\nfor your '}
                <Text style={styles.titleTeal}>{'Airbnb'}</Text>
                {'\n' + t('app.airbnb_account_name.title_suffix')}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <InputField
                label={t('app.airbnb_account_name.label')}
                name="channelName"
                control={control}
                errors={errors}
                placeholder={t('app.airbnb_account_name.placeholder')}
                rules={{ required: t('app.airbnb_account_name.label') }}
              />
              <Text style={styles.hintText}>
                {t('app.airbnb_account_name.hint')}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <AppButton
                loading={isPending}
                onPress={onNext}
                title={t('app.airbnb_account_name.next_btn')}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BGImage>
  );
};

export default AirbnbAccountNameScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginTop: 48,
    marginBottom: 44,
  },
  titleText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.BLACK,
    lineHeight: 42,
  },
  titleTeal: {
    color: Colors.PRIMARY_TEAL,
  },
  formSection: {
    flex: 1,
  },
  hintText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(51,51,51,0.55)',
    marginTop: 12,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 24,
  },
});
