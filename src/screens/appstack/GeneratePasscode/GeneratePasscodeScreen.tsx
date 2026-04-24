import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useGeneratePasscodeContainer from './GeneratePasscodeContainer';
import InputField from '@/components/molecules/Input/InputField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';

const GeneratePasscodeScreen = () => {
  const { t } = useTranslation();
  const { type, control, errors, handleSubmit, instructionText, isLoading } =
    useGeneratePasscodeContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleWrapper}>
            {type === 'Timed' ? (
              <AppText fontSize={30} type="Medium" color={Colors.BLACK}>
                {t('app.generate_passcode.enter_prefix')}{' '}
                <AppText
                  text={t('app.generate_passcode.passcode')}
                  fontSize={30}
                  type="Medium"
                  color={Colors.PRIMARY_TEAL}
                />{' '}
                {t('app.generate_passcode.details_suffix')}
              </AppText>
            ) : (
              <AppText fontSize={30} type="Medium" color={Colors.BLACK}>
                {t('app.generate_passcode.enter_your')}{' '}
                <AppText
                  text={t('app.generate_passcode.code')}
                  fontSize={30}
                  type="Medium"
                  color={Colors.PRIMARY_TEAL}
                />{' '}
                {t('app.generate_passcode.name_suffix')}
              </AppText>
            )}
          </View>
          <View style={styles.form}>
            <InputField
              label={t('app.generate_passcode.name_label')}
              name="name"
              control={control}
              errors={errors}
              placeholder={t('app.generate_passcode.name_placeholder')}
              // If your InputField supports glassy style, you can pass it here
            />

            {type === 'Timed' && (
              <>
                <DateTimeInputField
                  name="startDate"
                  control={control}
                  errors={errors}
                  label={t('app.generate_passcode.start_date_label')}
                  placeholder={t('app.generate_passcode.date_placeholder')}
                  mode="date"
                  rightIcon={
                    <Svgicons path="calendar" size={20} color={Colors.BLACK} />
                  }
                />

                <DateTimeInputField
                  name="startTime"
                  control={control}
                  errors={errors}
                  label={t('app.generate_passcode.start_time_label')}
                  placeholder={t('app.generate_passcode.time_placeholder')}
                  mode="time"
                  rightIcon={
                    <Svgicons path="Clock" size={20} color={Colors.BLACK} />
                  }
                />

                <DateTimeInputField
                  name="endDate"
                  control={control}
                  errors={errors}
                  label={t('app.generate_passcode.end_date_label')}
                  placeholder={t('app.generate_passcode.date_placeholder')}
                  mode="date"
                  rightIcon={
                    <Svgicons path="calendar" size={20} color={Colors.BLACK} />
                  }
                />

                <DateTimeInputField
                  name="endTime"
                  control={control}
                  errors={errors}
                  label={t('app.generate_passcode.end_time_label')}
                  placeholder={t('app.generate_passcode.time_placeholder')}
                  mode="time"
                  rightIcon={
                    <Svgicons path="Clock" size={20} color={Colors.BLACK} />
                  }
                />
              </>
            )}
          </View>

          <AppText
            text={instructionText}
            fontSize={13}
            color={Colors.BLACK_53_PERCENT}
            style={styles.instruction}
          />

          <View style={styles.footer}>
            <AppButton
              title={t('app.generate_passcode.generate_btn')}
              onPress={handleSubmit}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              loading={isLoading}
              borderRadius={25}
            />
          </View>
        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(10),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(40),
  },
  titleWrapper: {
    marginTop: Metrics.verticalScale(40),
    marginBottom: Metrics.verticalScale(30),
  },
  form: {
    width: '100%',
  },
  instruction: {
    marginTop: Metrics.verticalScale(25),
    lineHeight: 18,
  },
  footer: {
    marginTop: Metrics.verticalScale(40),
  },
});

export default GeneratePasscodeScreen;
