import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Checkbox from '@/components/molecules/Input/CheckBox';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import BGImage from '@/components/molecules/BGImage/BGImage';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

import NavigationRoutes from '@/navigation/NavigationRoutes';
import AiAutoPilotContainer from '../containers/AiAutoPilotContainer';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '../../NoListingScreen/NoListingScreen';

const AiAutoPilotScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const {
    isAutopilotActive,
    handleSwitchToggle, // Use updated switch handler
    isSwitchUpdating,   // Inject the individual switch loader status
    autoCreateAll,
    setAutoCreateAll,
    control,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    listingOptions,
    isRefetching,
    refetchAutopilot,
    waitTriggerData,
  } = AiAutoPilotContainer();

          const { user } = useAuthStore();
  if (!user?.has_listing) {
    return <NoListingScreen />;
  }

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <RefreshableScrollView
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetchAutopilot}
      >
        <AppText
          text={t('app.autopilot.title')}
          fontSize={32}
          type="Bold"
          mb={16}
        />

        {/* Description */}
        <View style={styles.descriptionRow}>
          <AppText
            fontSize={15}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={22}
            style={{ flex: 1 }}
          >
            {t('app.autopilot.description')}{' '}
            <AppText
              text={t('app.autopilot.how_it_works')}
              color={Colors.TEAL_GREEN}
              type="Bold"
              style={styles.link}
              onPress={() =>
                navigation.navigate(
                  NavigationRoutes.APP_STACK.HOW_AUTOPILOT_WORK,
                )
              }
            />
          </AppText>
        </View>

        {/* Status Card */}
        <GlassCard style={styles.stateCard}>
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <AppText
                text={
                  isAutopilotActive
                    ? t('app.autopilot.status_active')
                    : t('app.autopilot.status_disabled')
                }
                fontSize={20}
                type="Bold"
                color={
                  isAutopilotActive
                    ? Colors.TEAL_PRIMARY_ALT
                    : Colors.INDIAN_RED
                }
                mb={8}
              />

              <AppText
                text={t('app.autopilot.status_subtitle')}
                fontSize={14}
                color={Colors.BLACK_60_PERCENT}
              />
            </View>

            <CustomSwitch
              value={isAutopilotActive}
              isLoading={isSwitchUpdating}
              disabled={isSwitchUpdating}
              onToggle={handleSwitchToggle} // Pass value directly back to handler
            />
          </View>
        </GlassCard>

        {/* Form */}
        <View style={styles.inputSection}>
          <MultiSelectDropdownField
            name="properties"
            control={control as any}
            errors={errors}
            label={t('app.autopilot.label_select_property')}
            data={listingOptions}
            placeholder={t('app.autopilot.placeholder_properties')}
            rules={{
              required: t('app.autopilot.error_property_required'),
            }}
            dropdownPosition="top"
            disabled={!listingOptions?.length}
          />

          <ButtonView
            style={styles.checkboxContainer}
            onPress={() => setAutoCreateAll(!autoCreateAll)}
          >
            <Checkbox
              isChecked={autoCreateAll}
              onPress={() => setAutoCreateAll(!autoCreateAll)}
            />
            <AppText
              text={t('app.autopilot.label_auto_create')}
              ml={10}
              fontSize={14}
            />
          </ButtonView>

          <DropdownField
            name="waitTrigger"
            control={control as any}
            errors={errors}
            label={t('app.autopilot.label_wait_trigger')}
            data={waitTriggerData}
            placeholder={t('app.autopilot.placeholder_delay')}
            dropdownPosition="top"
          />

          <AppButton
            title={t('app.autopilot.btn_save')}
            loading={isPending}
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          />
        </View>
      </RefreshableScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(40),
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
  },
  descriptionRow: {
    flexDirection: 'row',
    marginBottom: Metrics.verticalScale(30),
  },
  link: {
    textDecorationLine: 'underline',
  },
  stateCard: {
    borderRadius: 24,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(30),
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: Colors.WHITE,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSection: {
    marginTop: Metrics.verticalScale(10),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(5),
    marginBottom: Metrics.verticalScale(15),
  },
  button: {
    marginTop: Metrics.verticalScale(30),
  },
});

export default AiAutoPilotScreen;