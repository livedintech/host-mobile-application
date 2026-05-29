import React, { useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      confidenceInput: '80',
      sentimentInput: '52',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (settingsData) {
      setValue(
        'confidenceInput',
        String(settingsData.confidence_level || '80'),
        { shouldValidate: true },
      );
      setValue('sentimentInput', String(settingsData.sentiment_level || '52'), {
        shouldValidate: true,
      });
    }
  }, [settingsData, setValue]);

  const confidenceValue = useWatch({ control, name: 'confidenceInput' }) || '0';
  const sentimentValue = useWatch({ control, name: 'sentimentInput' }) || '0';

  const fullBellCurve = [5, 12, 25, 45, 40, 30, 15];
  const commonXLabels = ['0', '30', '50', '70', '90', '100'];

  const getGraphData = (val: string, type: 'red' | 'green') => {
    const numeric = parseInt(val.replace(/[^0-9]/g, '')) || 0;
    const splitIndex = Math.floor((numeric / 100) * (fullBellCurve.length - 1));
    return fullBellCurve.map((item, index) => {
      if (type === 'red')
        return index <= splitIndex ? { value: item } : { value: 0 };
      return index > splitIndex ? { value: item } : { value: 0 };
    });
  };

  const confNum = parseInt(confidenceValue) || 0;
  const sentNum = parseInt(sentimentValue) || 0;

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
        <RefreshableScrollView
          contentContainerStyle={styles.scrollContent}
          isLoading={isLoading}
          refreshing={isFetching}
          onRefresh={refetch}
        >
          <AppText
            text={t('app.escalation.title')}
            fontSize={28}
            type="Bold"
            mt={20}
            mb={12}
          />
          <AppText
            text={t('app.escalation.description')}
            fontSize={14}
            color={Colors.BLACK_60_PERCENT}
            lineHeight={18}
            mb={40}
          />

          {/* CONFIDENCE CARD */}
          <GlassCard style={styles.graphCard}>
            <AppText
              text={t('app.escalation.confidence_title')}
              fontSize={16}
              type="Bold"
              mb={8}
            />

            <AppText
              text={t('app.escalation.graph_description')}
              fontSize={14}
              color={Colors.BLACK_60_PERCENT}
              lineHeight={18}
              mb={40}
            />
            <View style={styles.chartContainer}>
              <LineChart
                {...graphConfigs}
                data={getGraphData(confidenceValue, 'red')}
                color={Colors.INDIAN_RED}
                startFillColor={Colors.INDIAN_RED}
              />
              <View style={styles.overlayChart}>
                <LineChart
                  {...graphConfigs}
                  data={getGraphData(confidenceValue, 'green')}
                  color={Colors.MEDIUM_SEA_GREEN}
                  startFillColor={Colors.MEDIUM_SEA_GREEN}
                  xAxisLabelTexts={commonXLabels}
                  showVerticalLines={false}
                />
                <View
                  style={[
                    styles.statusBubble,
                    confNum > 50
                      ? {
                          right: `${100 - confNum}%`,
                          borderColor: Colors.MEDIUM_SEA_GREEN,
                        }
                      : {
                          left: `${confNum}%`,
                          borderColor: Colors.MEDIUM_SEA_GREEN,
                        },
                  ]}
                >
                  <AppText
                    text={`${confNum}% ${t(
                      'app.escalation.confidence_automated',
                    )}`}
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
            label={t('app.escalation.confidence_label')}
            placeholder=""
            control={control as any}
            errors={errors}
            keyboardType="numeric"
            containerStyle={{ marginBottom: 10 }}
            rules={{
              required: t('app.escalation.error_required'),
              validate: (val: string) => {
                const num = parseInt(val) || 0;
                if (num < 80 || num > 100) {
                  return t('app.escalation.error_confidence_range');
                }
                return true;
              },
            }}
          />
          <AppText
            text={t('app.escalation.confidence_hint')}
            fontSize={12}
            color={Colors.BLACK_35_PERCENT}
            mb={24}
          />

          {/* FRUSTRATION CARD */}
          <GlassCard style={styles.frustrationCard}>
            <View style={styles.row}>
              <AppText
                text={t('app.escalation.frustration_title')}
                fontSize={15}
                type="Bold"
              />
              <CustomSwitch
                value={frustrationEnabled}
                onToggle={setFrustrationEnabled}
              />
            </View>
            <AppText
              text={t('app.escalation.frustration_desc')}
              fontSize={13}
              color={Colors.BLACK_60_PERCENT}
            />
          </GlassCard>

          {/* SENTIMENT CARD - Disabled dynamically based on Frustration Toggle */}
          <View
            style={!frustrationEnabled && styles.disabledContainer}
            pointerEvents={frustrationEnabled ? 'auto' : 'none'}
          >
            <GlassCard style={styles.graphCard}>
              <AppText
                text={t('app.escalation.sentiment_title')}
                fontSize={16}
                type="Bold"
                mb={8}
              />

              <AppText
                text={t('app.escalation.graph_description')}
                fontSize={14}
                color={Colors.BLACK_60_PERCENT}
                lineHeight={18}
                mb={40}
              />
              <View style={styles.chartContainer}>
                <LineChart
                  {...graphConfigs}
                  data={getGraphData(sentimentValue, 'red')}
                  color={Colors.INDIAN_RED}
                  startFillColor={Colors.INDIAN_RED}
                />
                <View style={styles.overlayChart}>
                  <LineChart
                    {...graphConfigs}
                    data={getGraphData(sentimentValue, 'green')}
                    color={Colors.MEDIUM_SEA_GREEN}
                    startFillColor={Colors.MEDIUM_SEA_GREEN}
                    xAxisLabelTexts={commonXLabels}
                    showVerticalLines={false}
                  />
                  <View
                    style={[
                      styles.statusBubble,
                      sentNum > 50
                        ? {
                            right: `${100 - sentNum}%`,
                            borderColor: Colors.INDIAN_RED,
                          }
                        : {
                            left: `${sentNum}%`,
                            borderColor: Colors.INDIAN_RED,
                          },
                    ]}
                  >
                    <AppText
                      text={`${sentNum}% ${t(
                        'app.escalation.sentiment_escalated',
                      )}`}
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
              label={t('app.escalation.sentiment_label')}
              control={control as any}
              errors={errors}
              keyboardType="numeric"
              containerStyle={{ marginBottom: 10 }}
              // disabled={!frustrationEnabled}
              placeholder=""
              rules={
                frustrationEnabled
                  ? {
                      required: t('app.escalation.error_required', {
                        defaultValue: 'Field cannot be empty',
                      }),
                      validate: (val: string) => {
                        const num = parseInt(val) || 0;
                        if (num < 30 || num > 100) {
                          return t('app.escalation.error_sentiment_range', {
                            defaultValue: 'Value must be between 30% and 100%',
                          });
                        }
                        return true;
                      },
                    }
                  : {}
              }
            />
            <AppText
              text={t('app.escalation.sentiment_hint')}
              fontSize={12}
              color={Colors.BLACK_35_PERCENT}
              mb={24}
            />
          </View>
        </RefreshableScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <AppButton
          title={
            isPending
              ? t('app.escalation.saving')
              : t('app.escalation.btn_save')
          }
          onPress={handleSubmit(handleSave)}
          variant="primary"
          disabled={isPending || isLoading}
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
    padding: Metrics.scale(16),
    borderRadius: 16,
    marginBottom: Metrics.verticalScale(20),
    width: '100%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  disabledContainer: {
    opacity: 0.38,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
  },
});

export default EscalationSettingScreen;
