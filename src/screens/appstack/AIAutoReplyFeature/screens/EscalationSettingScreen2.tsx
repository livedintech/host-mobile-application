import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { useForm } from 'react-hook-form';

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import InputField from '@/components/molecules/Input/InputField';

const EscalationSettingsScreen = () => {
  const navigation = useNavigation();
  const [frustrationEnabled, setFrustrationEnabled] = useState(true);

  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      confidenceInput: '80%',
      sentimentInput: '50%',
    },
  });

  // Graph Data
  const commonXLabels = ['0', '30', '50', '70', '90', '100'];
  const confRed = [
    { value: 5 },
    { value: 12 },
    { value: 25 },
    { value: 35 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ];
  const confGreen = [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 45 },
    { value: 30 },
    { value: 15 },
  ];
  const sentRed = [
    { value: 8 },
    { value: 18 },
    { value: 28 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ];
  const sentGreen = [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 40 },
    { value: 35 },
    { value: 20 },
    { value: 10 },
  ];

  const graphConfigs = {
    areaChart: true,
    curved: true,
    height: Metrics.verticalScale(140),
    spacing: Metrics.scale(45),
    initialSpacing: 10,
    noOfSections: 3,
    yAxisColor: 'transparent',
    xAxisColor: 'rgba(0,0,0,0.1)',
    yAxisTextStyle: { color: Colors.BLACK_35_PERCENT, fontSize: 10 },
    xAxisLabelTextStyle: { color: Colors.BLACK_35_PERCENT, fontSize: 10 },
    hideDataPoints: true,
    pointerConfig: {
      showPointerStrip: false,
    },
  };

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            text="Escalation Settings"
            fontSize={28}
            type="Bold"
            mt={20}
            mb={12}
          />
          <AppText
            text="Define thresholds for automation. If the AI confidence or sentiment falls below these levels, messages are escalated to you."
            fontSize={14}
            color={Colors.BLACK_60_PERCENT}
            lineHeight={18}
            mb={24}
          />

          {/* --- CONFIDENCE LEVEL CARD --- */}
          <GlassCard style={styles.graphCard}>
            <AppText text="Confidence Level" fontSize={16} type="Bold" mb={8} />
            <AppText
              text="Choose how confident the AI should be before sending a reply automatically. If confidence is low, the message will be sent to you for review."
              fontSize={13}
              color={Colors.BLACK_60_PERCENT}
              mb={20}
            />

            <View style={styles.chartContainer}>
              <LineChart
                {...graphConfigs}
                data={confRed}
                color={Colors.INDIAN_RED}
                startFillColor={Colors.INDIAN_RED}
                startOpacity={0.2}
                endOpacity={0.05}
              />
              <View style={styles.overlayChart}>
                <LineChart
                  {...graphConfigs}
                  data={confGreen}
                  color={Colors.MEDIUM_SEA_GREEN}
                  startFillColor={Colors.MEDIUM_SEA_GREEN}
                  startOpacity={0.2}
                  endOpacity={0.05}
                  xAxisLabelTexts={commonXLabels}
                  showVerticalLines
                  verticalLinesColor={Colors.BLACK}
                  verticalLinesThickness={2}
                  verticalLinesDataPointsIndices={[4]}
                />
                <View
                  style={[
                    styles.statusBubble,
                    { left: '62%', borderColor: Colors.MEDIUM_SEA_GREEN },
                  ]}
                >
                  <AppText
                    text="80% Automated"
                    fontSize={10}
                    color={Colors.MEDIUM_SEA_GREEN}
                    type="Bold"
                  />
                </View>
              </View>
            </View>
          </GlassCard>

          <InputField
            name="confidenceInput"
            label="Send Automatically When Confident"
            placeholder="80%"
            control={control as any}
            errors={errors}
            containerStyle={{ marginBottom: 10 }}
          />
          <AppText
            text="Set the minimum confidence (e.g., 90%) required for the AI to reply on its own."
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mb={24}
          />

          <GlassCard style={styles.frustrationCard}>
            <View style={styles.row}>
              <AppText text="Frustration Detection" fontSize={15} type="Bold" />
              <CustomSwitch
                value={frustrationEnabled}
                onToggle={setFrustrationEnabled}
              />
            </View>
            <View>
            <AppText
              text="Choose how positive or negative a message can be before the AI responds automatically. If the sentiment is too negative, the message will be sent to you for review."
              fontSize={13}
              color={Colors.BLACK_60_PERCENT}
              mb={20}
            />
            </View>
          </GlassCard>

          {/* --- SENTIMENT LEVEL CARD --- */}
          <GlassCard style={styles.graphCard}>
            <AppText text="Sentiment Level" fontSize={16} type="Bold" mb={8} />
            <AppText
              text="Choose how positive or negative a message can be before the AI responds automatically. If the sentiment is too negative, the message will be sent to you for review."
              fontSize={13}
              color={Colors.BLACK_60_PERCENT}
              mb={20}
            />

            <View style={styles.chartContainer}>
              <LineChart
                {...graphConfigs}
                data={sentRed}
                color={Colors.INDIAN_RED}
                startFillColor={Colors.INDIAN_RED}
                startOpacity={0.2}
                endOpacity={0.05}
              />
              <View style={styles.overlayChart}>
                <LineChart
                  {...graphConfigs}
                  data={sentGreen}
                  color={Colors.MEDIUM_SEA_GREEN}
                  startFillColor={Colors.MEDIUM_SEA_GREEN}
                  startOpacity={0.2}
                  endOpacity={0.05}
                  xAxisLabelTexts={commonXLabels}
                  showVerticalLines
                  verticalLinesColor={Colors.BLACK}
                  verticalLinesThickness={2}
                  verticalLinesDataPointsIndices={[3]}
                />
                <View
                  style={[
                    styles.statusBubble,
                    { left: '48%', borderColor: Colors.INDIAN_RED },
                  ]}
                >
                  <AppText
                    text="52% Escalated"
                    fontSize={10}
                    color={Colors.INDIAN_RED}
                    type="Bold"
                  />
                </View>
              </View>
            </View>
          </GlassCard>

          <InputField
            name="sentimentInput"
            label="Escalate When Sentiment Is Below"
            placeholder="50%"
            control={control as any}
            errors={errors}
            containerStyle={{ marginBottom: 10 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <AppButton
          title="Save Settings"
          onPress={() => navigation.goBack()}
          variant="primary"
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.verticalScale(40) },

  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(140),
  },
  graphCard: {
    padding: Metrics.scale(16),
    borderRadius: 20,
    marginBottom: Metrics.verticalScale(24),
    width: '100%',
  },
  chartContainer: {
    height: Metrics.verticalScale(160),
    position: 'relative',
    marginLeft: -20,
  },
  overlayChart: { ...StyleSheet.absoluteFillObject },
  statusBubble: {
    position: 'absolute',
    top: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  frustrationCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Metrics.scale(16),
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(20),
    width: '100%',
  },
    row: {
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      paddingBottom : 10
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    backgroundColor: 'transparent',
  },

});

export default EscalationSettingsScreen;
