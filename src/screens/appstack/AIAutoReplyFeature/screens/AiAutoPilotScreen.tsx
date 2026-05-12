// AiAutoPilotScreen.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';

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

const AiAutoPilotScreen = ({ navigation }: any) => {
  const {
    isAutopilotActive,
    setIsAutopilotActive,
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
  } = AiAutoPilotContainer();

  const waitTriggerData = [
    { label: 'Instant', value: '0' },
    { label: '1 minute', value: '1' },
    { label: '5 minutes', value: '5' },
    { label: '10 minutes', value: '10' },
    { label: '15 minutes', value: '15' },
  ];

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
        <AppText text="AI Autopilot" fontSize={32} type="Bold" mb={16} />

        {/* Description */}
        <View style={styles.descriptionRow}>
          <AppText
            fontSize={15}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={22}
            style={{ flex: 1 }}
          >
            Set up your AI Autopilot to handle replies intelligently and
            consistently.{' '}
            <AppText
              text="How Autopilot works?"
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
                  isAutopilotActive ? 'Autopilot Active' : 'Autopilot Disabled'
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
                text="AI will send replies automatically when confident"
                fontSize={14}
                color={Colors.BLACK_60_PERCENT}
              />
            </View>

            <CustomSwitch
              value={isAutopilotActive}
              onToggle={setIsAutopilotActive}
            />
          </View>
        </GlassCard>

        {/* Form */}
        <View style={styles.inputSection}>
          <MultiSelectDropdownField
            name="properties"
            control={control as any}
            errors={errors}
            label="Select Property"
            data={listingOptions}
            placeholder="Select Properties"
            rules={{
              required: 'Please select at least one property',
            }}
            dropdownPosition="top"
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
              text="Auto-create for new listings"
              ml={10}
              fontSize={14}
            />
          </ButtonView>

          <DropdownField
            name="waitTrigger"
            control={control as any}
            errors={errors}
            label="Wait Trigger"
            data={waitTriggerData}
            placeholder="Select delay"
            dropdownPosition="top"
          />

          <AppButton
            title="Save Settings"
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
