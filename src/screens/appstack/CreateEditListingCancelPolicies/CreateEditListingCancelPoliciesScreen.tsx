import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useCreateEditListingCancelPoliciesContainer from './CreateEditListingCancelPoliciesContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';

const CreateEditListingCancelPoliciesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading,
    cancelPolicyOptions,
  } = useCreateEditListingCancelPoliciesContainer();
  const { t } = useTranslation();

  return (
     <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={55} size={48} strokeWidth={4} />
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text={t('app.cancel_policies_edit.title')} fontSize={26} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="clipboardIcon" size={24} />
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Cancel Policy Airbnb */}
          <DropdownField
            name="cancel_policy_airbnb"
            label={t('app.cancel_policies_edit.airbnb_label')}
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder={t('app.cancel_policies_edit.flexible_placeholder')}
          />

          {/* Cancel Policy Gathern */}
          <DropdownField
            name="cancel_policy_gathern"
            label={t('app.cancel_policies_edit.gathern_label')}
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder={t('app.cancel_policies_edit.flexible_placeholder')}
          />

          {/* Cancel Policy Booking.com */}
          <DropdownField
            name="cancel_policy_booking"
            label={t('app.cancel_policies_edit.bookingcom_label')}
            control={control}
            errors={errors}
            data={cancelPolicyOptions}
            placeholder={t('app.cancel_policies_edit.flexible_placeholder')}
          />

        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {!isEdit && (
            <>
              <AppButton
                title={t('app.cancel_policies_edit.next')}
                onPress={handleSubmit(onNext)}
                loading={isLoading}
              />
              <AppButton
                title={t('app.cancel_policies_edit.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                mt={15}
                disabled={isLoading}
              />
            </>
          )}

          {isEdit && (
            <AppButton
              title={t('app.cancel_policies_edit.save_exit')}
              onPress={handleSubmit(onSaveExit)}
              loading={isLoading}
            />
          )}
        </View>

      </ScrollView>
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1},
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  form: { flex: 1 },
  footer: { marginTop: 20 },
});

export default CreateEditListingCancelPoliciesScreen;