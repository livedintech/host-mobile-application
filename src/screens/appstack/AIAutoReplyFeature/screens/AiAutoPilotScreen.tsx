import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Checkbox from '@/components/molecules/Input/CheckBox';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const AiAutoPilotScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isAutopilotActive, setIsAutopilotActive] = useState(true);
  const [autoCreateAll, setAutoCreateAll] = useState(false);

  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      properties: [],
      waitTrigger: '1 minute',
    },
  });

  // Mock Data
  const propertyData = [
    { label: 'Beachfront Villa', value: '1' },
    { label: 'Downtown Apartment', value: '2' },
    { label: 'Mountain Cabin', value: '3' },
  ];

  const waitTriggerData = [
    { label: 'Instant', value: '0' },
    { label: '1 minute', value: '1' },
    { label: '5 minutes', value: '5' },
    { label: '10 minutes', value: '10' },
  ];

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText text="AI Autopilot" fontSize={32} type="Bold" mb={16} />

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

        {/* State Toggle Card */}
        <GlassCard style={styles.stateCard}>
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <AppText
                text={
                  isAutopilotActive
                    ? 'Autopilot Active'
                    : 'Autopilot Not Active'
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
                lineHeight={18}
              />
            </View>
            <CustomSwitch
              value={isAutopilotActive}
              onToggle={val => setIsAutopilotActive(val)}
            />
          </View>
        </GlassCard>

        {/* Inputs Section */}
        <View style={styles.inputSection}>
          <MultiSelectDropdownField
            name="properties"
            control={control as any}
            errors={errors}
            label="Select Property"
            data={propertyData}
            placeholder="Select Multiple Options"
          />

          <ButtonView
            style={styles.checkboxContainer}
            activeOpacity={0.7}
            onPress={() => setAutoCreateAll(!autoCreateAll)}
          >
            <Checkbox
              isChecked={autoCreateAll}
              onPress={() => setAutoCreateAll(!autoCreateAll)}
            />
            <AppText
              text="Auto-create for all new listings"
              ml={10}
              fontSize={14}
              type="Medium"
            />
          </ButtonView>

          <View style={{ marginTop: Metrics.verticalScale(20) }}>
            <DropdownField
              name="waitTrigger"
              control={control as any}
              errors={errors}
              label="Wait Trigger"
              data={waitTriggerData}
              placeholder="1 minute"
              dropdownPosition="top"
            />
            <AppText
              text="Use the wait trigger to delay automatic replies so you can review them before sending. Set an appropriate delay to catch and fix any issues in time."
              fontSize={13}
              color={Colors.DARK_CHARCOAL_OPACITY}
              lineHeight={18}
            />
          </View>
        </View>
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(40),
  },
  header: {
    paddingTop: Metrics.verticalScale(50),
    paddingHorizontal: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(10),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
});

export default AiAutoPilotScreen;
