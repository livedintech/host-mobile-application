import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

// Your Components
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack } from '@/services/navigationService';
import CheckoutInstructionContainer from './CheckoutInstructionContainer';
import { useTranslation } from 'react-i18next';

const CheckoutInstructionScreen = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      towels: '',
      trash: '',
      turnOff: '',
      lockUp: '',
      keys: '',
      additional: '',
    },
  });

  const { onNext, onSaveExit } = CheckoutInstructionContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View
          style={[
            styles.header,
            { flexDirection: isAr ? 'row-reverse' : 'row' },
          ]}
        >
          <TouchableOpacity style={styles.backButton}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
          </TouchableOpacity>
          <CircularProgress percentage={45} size={45} strokeWidth={4} />
        </View>

        {/* Title and Skip */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <AppText
              text={t('app.checkoutInstruction.title')}
              fontSize={32}
              type="Bold"
              mb={10}
              textAlign={isAr ? 'right' : 'left'}
            />
            <AppText
              text={t('app.checkoutInstruction.subtitle')}
              fontSize={14}
              color={Colors.DARK_CHARCOAL_OPACITY}
              opacity={0.7}
              textAlign={isAr ? 'right' : 'left'}
            />
          </View>
        </View>

        <View style={styles.skipWrapper}>
          <TouchableOpacity
            style={styles.skipBtn}
            // onPress={() => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES)}
          >
            <AppText
              text={t('app.checkoutInstruction.skip')}
              color={Colors.WHITE}
              fontSize={14}
              type="Medium"
            />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <TextareaField
            label={t('app.checkoutInstruction.towelsLabel')}
            placeholder={t('app.checkoutInstruction.towelsPlaceholder')}
            name="towels"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />

          <TextareaField
            label={t('app.checkoutInstruction.trashLabel')}
            placeholder={t('app.checkoutInstruction.trashPlaceholder')}
            name="trash"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />

          <TextareaField
            label={t('app.checkoutInstruction.turnOffLabel')}
            placeholder={t('app.checkoutInstruction.turnOffPlaceholder')}
            name="turnOff"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />

          <TextareaField
            label={t('app.checkoutInstruction.lockUpLabel')}
            placeholder={t('app.checkoutInstruction.lockUpPlaceholder')}
            name="lockUp"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />

          <TextareaField
            label={t('app.checkoutInstruction.keysLabel')}
            placeholder={t('app.checkoutInstruction.keysPlaceholder')}
            name="keys"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />

          <TextareaField
            label={t('app.checkoutInstruction.additionalLabel')}
            placeholder={t('app.checkoutInstruction.additionalPlaceholder')}
            name="additional"
            control={control as any}
            errors={errors}
            multiline
            textAlign={isAr ? 'right' : 'left'}
            height={Metrics.verticalScale(200)}
          />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.footer}>
          <AppButton
            title={t('app.checkoutInstruction.next')}
            variant="secondary"
            mb={15}
            onPress={onNext}
          />
          <AppButton
            title={t('app.checkoutInstruction.saveExit')}
            variant="primary"
            backgroundColor={Colors.PRIMARY_TEAL}
            onPress={onSaveExit}
          />
        </View>
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: Metrics.scale(20),
    paddingBottom: Metrics.verticalScale(40),
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(10),
    marginBottom: Metrics.verticalScale(20),
  },
  backButton: {
    padding: 5,
  },
  titleRow: {
    marginBottom: Metrics.verticalScale(10),
  },
  skipContainer: {
    marginBottom: Metrics.verticalScale(20),
  },
  formContainer: {
    marginTop: Metrics.verticalScale(10),
  },
  footer: {
    marginTop: Metrics.verticalScale(20),
  },
  skipWrapper: { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn: {
    backgroundColor: '#00A88E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
});

export default CheckoutInstructionScreen;
