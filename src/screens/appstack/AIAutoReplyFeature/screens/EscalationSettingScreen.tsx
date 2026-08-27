// ... Keep your structural imports the same
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import Svg, { Path, LinearGradient, Stop, Line, Circle } from 'react-native-svg';

import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import InputField from '@/components/molecules/Input/InputField';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import EscalationSettingContainer from '../containers/EscalationSettingContainer';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '../../NoListingScreen/NoListingScreen';
import EscalationSettingSkeleton from '@/components/Skeletons/EscalationSettingSkeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 120;
const CHART_PADDING_LEFT = 40;
const CHART_PADDING_RIGHT = 20;

interface ApiDataItem {
  value: number;
  label: string;
}

// --- DYNAMIC SMOOTH GRADIENT GRAPH COMPONENT ---
// (FigmaGradientGraph code remains unchanged)
const FigmaGradientGraph = ({
  apiData,
  inputValue,
  type,
}: {
  apiData: ApiDataItem[];
  inputValue: number;
  type: 'confidence' | 'sentiment';
}) => {
  const chartWidth = SCREEN_WIDTH - Metrics.scale(72) - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
  const defaultPoints: ApiDataItem[] =
    type === 'confidence'
      ? [
          { value: 0, label: '0' },
          { value: 28, label: '25' },
          { value: 14, label: '30' },
          { value: 42, label: '70' },
          { value: 0, label: '100' },
        ]
      : [
          { value: 0, label: '0' },
          { value: 28, label: '10' },
          { value: 14, label: '25' },
          { value: 42, label: '70' },
          { value: 14, label: '80' },
          { value: 0, label: '100' },
        ];

  const sourcePoints = apiData && apiData.length > 1 ? apiData : defaultPoints;
  const points = sourcePoints
    .map(item => {
      const numericLabel = Number(item.label) || 0;
      const xPos = (numericLabel / 100) * chartWidth;
      const yPos = CHART_HEIGHT - Math.min(Math.max((item.value / 100) * CHART_HEIGHT, 15), CHART_HEIGHT - 15);
      return { x: xPos, y: yPos, rawLabel: numericLabel };
    })
    .sort((a, b) => a.x - b.x);

  const visualValue = type === 'confidence' ? Math.max(inputValue, 75) : Math.max(inputValue, 40);
  const currentX = (visualValue / 100) * chartWidth;

  let currentY = CHART_HEIGHT - 30;
  if (points.length > 0) {
    if (currentX <= points[0].x) {
      currentY = points[0].y;
    } else if (currentX >= points[points.length - 1].x) {
      currentY = points[points.length - 1].y;
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        if (currentX >= points[i].x && currentX <= points[i + 1].x) {
          const ratio = (currentX - points[i].x) / (points[i + 1].x - points[i].x);
          currentY = points[i].y + ratio * (points[i + 1].y - points[i].y);
          break;
        }
      }
    }
  }

  const linePath = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const cpX1 = a[i - 1].x + (p.x - a[i - 1].x) / 2;
    const cpY1 = a[i - 1].y;
    const cpX2 = a[i - 1].x + (p.x - a[i - 1].x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z` : '';
  const splitPercentage = `${visualValue}%`;
  const badgeText = `${visualValue}% Automated`;

  return (
    <View style={styles.graphContainerWrapper}>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, styles.floatingActiveBadge, { left: Math.min(Math.max(currentX + CHART_PADDING_LEFT - 70, CHART_PADDING_LEFT), chartWidth + 5) }]}>
          <AppText text={badgeText} fontSize={9} type="Bold" color="#0D9488" />
        </View>
      </View>
      <View style={styles.svgRow}>
        <View style={styles.yAxisContainer}>
          <AppText text="100" fontSize={10} color="#94A3B8" />
          <AppText text="50" fontSize={10} color="#94A3B8" />
          <AppText text="0" fontSize={10} color="#94A3B8" />
        </View>
        <View style={{ flex: 1, height: CHART_HEIGHT }}>
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <LinearGradient id={`lineGrad-${type}`} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#EF4444" />
              <Stop offset={splitPercentage} stopColor="#EF4444" />
              <Stop offset={splitPercentage} stopColor="#0D9488" />
              <Stop offset="100%" stopColor="#0D9488" />
            </LinearGradient>
            <LinearGradient id={`areaGrad-${type}`} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
              <Stop offset={splitPercentage} stopColor="#EF4444" stopOpacity="0.12" />
              <Stop offset={splitPercentage} stopColor="#0D9488" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#0D9488" stopOpacity="0.12" />
            </LinearGradient>
            {points.length > 0 && <Path d={areaPath} fill={`url(#areaGrad-${type})`} />}
            {points.length > 0 && <Path d={linePath} fill="none" stroke={`url(#lineGrad-${type})`} strokeWidth="3" />}
            <Line x1={currentX} y1={currentY} x2={currentX} y2={CHART_HEIGHT} stroke="#1E293B" strokeWidth="1.5" />
            <Circle cx={currentX} cy={currentY} r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          </Svg>
          <View style={[styles.xAxisLabels, { width: chartWidth }]}>
            <AppText text="0%" fontSize={10} color="#94A3B8" />
            <AppText text="50%" fontSize={10} color="#94A3B8" />
            <AppText text="100%" fontSize={10} color="#94A3B8" />
          </View>
        </View>
      </View>
    </View>
  );
};

// --- CORE SCREEN COMPONENT ---
const EscalationSettingScreen = () => {
  const { t } = useTranslation();
  const {
    frustrationEnabled,
    setFrustrationEnabled,
    handleSave,
    isPending,
    settingsData,
    isLoading,
    isFetching,
    refetch,
  } = EscalationSettingContainer();

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      confidenceInput: '75',
      sentimentInput: '40',
    },
    mode: 'onChange',
  });

          const { user } = useAuthStore();
  if (!user?.has_listing) {
    return <NoListingScreen />;
  }


  const confidenceValue = useWatch({ control, name: 'confidenceInput' });
  const sentimentValue = useWatch({ control, name: 'sentimentInput' });

  const confidenceChartData: ApiDataItem[] =
    settingsData?.analytics?.confidence?.map((item: any) => ({
      value: Number(item.percentage) || 0,
      label: String(item.label),
    })) || [];

  const sentimentChartData: ApiDataItem[] =
    settingsData?.analytics?.sentiments?.map((item: any) => ({
      value: Number(item.percentage) || 0,
      label: String(item.label),
    })) || [];

  // Sync values from API data
  useEffect(() => {
    const configSource = settingsData?.data || settingsData;
    if (configSource) {
      setValue('confidenceInput', String(configSource.confidence_level ?? '75'), { shouldValidate: true });
      
      // If frustration detection is off in the incoming payload, fall back to showing '30' instead of '0'
      const sentimentBackendVal = configSource.sentiment_level;
      const initialSentiment = (sentimentBackendVal === 0 || !configSource.frustration_detection) ? '40' : String(sentimentBackendVal);
      setValue('sentimentInput', initialSentiment, { shouldValidate: frustrationEnabled });
    }
  }, [settingsData, setValue]);

  // FIX: Clear errors and reset the input when Frustration Detection gets toggled off manually by the user
  useEffect(() => {
    if (!frustrationEnabled) {
      clearErrors('sentimentInput');
      setValue('sentimentInput', '40', { shouldValidate: false });
    }
  }, [frustrationEnabled, clearErrors, setValue]);

  const numericConfidence = Math.min(Math.max(Number(confidenceValue) || 0, 0), 100);
  const numericSentiment = Math.min(Math.max(Number(sentimentValue) || 0, 0), 100);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <RefreshableScrollView contentContainerStyle={styles.scrollContent} isLoading={isLoading} skeletonComponent={<EscalationSettingSkeleton />} refreshing={isFetching} onRefresh={refetch}>
          <AppText text={t('app.escalation.title', 'Escalation Settings')} fontSize={26} type="Bold" mt={20} mb={10} />
          <AppText text={t('app.escalation.description', 'Controls when the AI replies automatically vs. when messages are sent to you for review.')} fontSize={13} color={Colors.BLACK_60_PERCENT} lineHeight={18} mb={24} />

          {/* CONFIDENCE GRAPH CARD PANEL */}
          <GlassCard style={styles.graphCard}>
            <AppText text={t('app.escalation.confidence_title', 'Confidence Level')} fontSize={16} type="Bold" mb={6} />
            <AppText text={t('app.escalation.graph_description', 'Choose how confident the AI should be before sending a reply automatically.')} fontSize={13} color={Colors.BLACK_60_PERCENT} mb={20} />
            <FigmaGradientGraph apiData={confidenceChartData} inputValue={numericConfidence} type="confidence" />
          </GlassCard>

          <InputField
            name="confidenceInput"
            label={t('app.escalation.confidence_label', 'Send Automatically When Confident')}
            placeholder="75"
            control={control as any}
            errors={errors}
            keyboardType="numeric"
            containerStyle={{ marginBottom: 24 }}
            rules={{
              required: t('app.escalation.error_required', 'Required field'),
              validate: (val: string) => {
                const num = parseInt(val) || 0;
                if (num < 0 || num > 100) {
                  return t('app.escalation.error_confidence_range', 'Value must be between 0 and 100');
                }
                if (num < 75) {
                  return t('app.escalation.error_confidence_min', 'Confidence level cannot be below 80%');
                }
                return true;
              },
            }}
          />

          <AppText text={t('app.escalation.confidence_hint', 'Set the minimum confidence required for the AI to reply on its own.')} fontSize={12} color={Colors.BLACK_35_PERCENT} mb={24} />

          {/* FRUSTRATION CARD CONTROL PANEL */}
          <GlassCard style={styles.frustrationCard}>
            <View style={styles.row}>
              <AppText text={t('app.escalation.frustration_title', 'Frustration Detection')} fontSize={15} type="Bold" />
              <CustomSwitch value={frustrationEnabled} onToggle={setFrustrationEnabled} />
            </View>
            <AppText text={t('app.escalation.frustration_desc', 'Turn this on to send conversations to you when the guest seems upset.')} fontSize={13} color={Colors.BLACK_60_PERCENT} />
          </GlassCard>

          {/* SENTIMENT GRAPH CARD PANEL */}
          <View style={!frustrationEnabled && styles.disabledContainer} pointerEvents={frustrationEnabled ? 'auto' : 'none'}>
            <GlassCard style={styles.graphCard}>
              <AppText text={t('app.escalation.sentiment_title', 'Sentiment Level')} fontSize={16} type="Bold" mb={6} />
              <AppText text={t('app.escalation.graph_description', 'Choose how positive or negative a message can be before the AI responds automatically.')} fontSize={13} color={Colors.BLACK_60_PERCENT} mb={20} />
              <FigmaGradientGraph apiData={sentimentChartData} inputValue={numericSentiment} type="sentiment" />
            </GlassCard>

            <InputField
              name="sentimentInput"
              label={t('app.escalation.sentiment_label', 'Escalate When Sentiment Is Below')}
              control={control as any}
              errors={errors}
              keyboardType="numeric"
              containerStyle={{ marginBottom: 10 }}
              placeholder="40"
              rules={
                frustrationEnabled
                  ? {
                      required: t('app.escalation.error_required', 'Field cannot be empty'),
                      validate: (val: string) => {
                        const num = parseInt(val) || 0;
                        if (num < 0 || num > 100) {
                          return t('app.escalation.error_sentiment_range', 'Value must be between 0% and 100%');
                        }
                        if (num < 40) {
                          return t('app.escalation.error_sentiment_min', 'Sentiment level cannot be below 30%');
                        }
                        return true;
                      },
                    }
                  : {}
              }
            />
            <AppText text={t('app.escalation.sentiment_hint', 'Set the minimum sentiment level required for the AI to reply on its own.')} fontSize={12} color={Colors.BLACK_35_PERCENT} mb={24} />
          </View>
        </RefreshableScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <AppButton
          title={t('app.escalation.btn_save')}
          onPress={handleSubmit(handleSave)}
          variant="primary"
          loading={isPending || isLoading}
          backgroundColor={Colors.TEAL_PRIMARY_ALT || '#0D9488'}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.verticalScale(20) },
  scrollContent: { paddingHorizontal: Metrics.scale(16), paddingBottom: Metrics.verticalScale(130) },
  graphCard: { padding: Metrics.scale(16), borderRadius: 24, marginBottom: Metrics.verticalScale(20), width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  graphContainerWrapper: { width: '100%', marginTop: 5 },
  badgeRow: { flexDirection: 'row', height: 30, position: 'relative', width: '100%', marginBottom: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, position: 'absolute' },
  redBadge: { backgroundColor: '#d91c1cff', left: CHART_PADDING_LEFT },
  floatingActiveBadge: { backgroundColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  svgRow: { flexDirection: 'row', width: '100%', paddingBottom: 15 },
  yAxisContainer: { width: CHART_PADDING_LEFT, height: CHART_HEIGHT, justifyContent: 'space-between', paddingVertical: 5, alignItems: 'flex-start' },
  xAxisBar: { height: 1, backgroundColor: '#CBD5E1', marginLeft: 0, marginTop: 4 },
  xAxisLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  frustrationCard: { padding: Metrics.scale(16), borderRadius: 16, marginBottom: Metrics.verticalScale(20), width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  row: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 6 },
  disabledContainer: { opacity: 0.35 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Metrics.scale(24), paddingBottom: Metrics.verticalScale(30) },
});

export default EscalationSettingScreen;