import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import useCheckoutInstructionContainer from './CheckoutInstructionContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import TextareaField from '@/components/molecules/Input/TextareaField';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Metrics from '@/utility/Metrics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const CheckoutInstructionScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    isEdit,
  } = useCheckoutInstructionContainer();
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={120}
          scrollIndicatorInsets={{ bottom: 0 }}
          automaticallyAdjustKeyboardInsets={false}
          bounces={false}
        >
          <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && (
              <CircularProgress percentage={47} size={48} strokeWidth={4} />
            )}
          </View>

          <AppText
            text={t('app.checkoutInstruction.title')}
            fontSize={28}
            type="Bold"
            mt={30}
          />
          <AppText
            text={t('app.checkoutInstruction.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={10}
          />

          {!isEdit && (
            <View style={styles.skipWrapper}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES)
                }
              >
                <AppText
                  text={t('app.checkoutInstruction.skip')}
                  color={Colors.WHITE}
                  fontSize={14}
                  type="Medium"
                />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={[
              styles.formGroup,
              isEdit && { marginTop: Metrics.verticalScale(20) },
            ]}
          >
            <TextareaField
              name="towels"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.towelsLabel')}
              placeholder={t('app.checkoutInstruction.towelsPlaceholder')}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="trash"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.trashLabel')}
              placeholder={t('app.checkoutInstruction.trashPlaceholder')}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="turnOff"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.turnOffLabel')}
              placeholder={t('app.checkoutInstruction.turnOffPlaceholder')}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="lockUp"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.lockUpLabel')}
              placeholder={t('app.checkoutInstruction.lockUpPlaceholder')}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="keys"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.keysLabel')}
              placeholder={t('app.checkoutInstruction.keysPlaceholder')}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="additional"
              control={control as any}
              errors={errors}
              label={t('app.checkoutInstruction.additionalLabel')}
              placeholder={t('app.checkoutInstruction.additionalPlaceholder')}
              multiline
            />
          </View>

        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          {!isEdit && (
            <AppButton
              title={t('app.checkoutInstruction.next')}
              variant="secondary"
              backgroundColor={Colors.WHITE}
              onPress={handleSubmit(onNext)}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.checkoutInstruction.saveExit')}
            mt={12}
            onPress={handleSubmit(onSaveExit)}
            disabled={isLoading}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: 10 },
  content: { paddingBottom: Metrics.verticalScale(120) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  skipWrapper: { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn: {
    backgroundColor: '#00A88E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  formGroup: { marginTop: 10 },
  fieldGap: { height: 25 },
  footer: { bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
});

export default CheckoutInstructionScreen;
