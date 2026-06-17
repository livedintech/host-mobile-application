import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useActiveCodesContainer, { CodeTab } from './ActiveCodesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { goBack } from '@/services/navigationService';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';

const ActiveCodesScreen = () => {
  const {
    activeTab,
    setActiveTab,
    currentData,
    handleGenerateNew,
    isLoading,
    refetch,
    handleViewLogs,
  } = useActiveCodesContainer();
  const { t } = useTranslation();

  const TABS: CodeTab[] = ['Permanent', 'One-time', 'Timed'];

  const renderCodeCard = ({ item }: { item: any }) => {
    // 1. Dynamic Color Logic
    const statusLower = item.status?.toLowerCase();
    const isInvalidOrExpired =
      statusLower === 'expired' || statusLower === 'invalid';

    const statusColor = isInvalidOrExpired
      ? Colors.PRIMARY_RED
      : Colors.TEAL_PRIMARY_ALT;

    return (
      <GlassCard width="100%" style={styles.glassCard}>
        {item.title && (
          <AppText
            text={item.title}
            fontSize={18}
            type="Bold"
            color={Colors.BLACK}
            mb={4}
          />
        )}

        <View style={styles.detailRow}>
          <AppText text={t('app.active_codes.passcode_label')} fontSize={14} color={Colors.BLACK} />
          <AppText text={item.passcode} fontSize={14} color={Colors.BLACK} />
        </View>

        {/* Show Validity Period for Timed or One-time tabs */}
        {(activeTab === 'Timed' || activeTab === 'One-time') && (
          <View style={styles.validityContainer}>
            <AppText
              text={`Validity Period: ${item.validityPeriod}`}
              fontSize={14}
              color={Colors.BLACK}
            />
          </View>
        )}

        <View style={styles.detailRow}>
          <AppText text={t('app.active_codes.status_label')} fontSize={14} color={Colors.BLACK} />
          <AppText
            text={item.status}
            fontSize={14}
            type="Bold"
            color={statusColor}
          />
        </View>
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.headerTop}>
          <ButtonView style={styles.backButton} onPress={() => goBack()}>
            <Svgicons
              path="arrowLeftIcon"
              size={24}
              color={Colors.BRUNSWICK_GREEN}
            />
          </ButtonView>

          <ButtonView style={styles.viewLogsBtn} onPress={handleViewLogs}>
            <AppText text={t('app.active_codes.view_logs')} fontSize={12} color={Colors.BLACK} />
          </ButtonView>
        </View>
        {/* Title */}
        <View style={styles.titleContainer}>
          <AppText
            text={t('app.active_codes.title')}
            fontSize={32}
            type="Bold"
            color={Colors.BLACK}
          />
        </View>

        {/* Tabs Section - Pill Style */}
        <View style={styles.tabWrapper}>
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <ButtonView
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
              >
                <AppText
                  text={tab}
                  fontSize={14}
                  color={isActive ? Colors.WHITE : Colors.BLACK}
                  type={isActive ? 'Bold' : 'Regular'}
                />
              </ButtonView>
            );
          })}
        </View>

        {/* List Section */}
        <FlatListSimpleHandler
          data={currentData}
          renderItem={renderCodeCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          isLoading={isLoading}
          onRefresh={refetch}
        />

        {/* Footer Action */}
        <View style={styles.footer}>
          <AppButton
            title={t('app.active_codes.generate_btn')}
            onPress={handleGenerateNew}
            backgroundColor="#00A68A" // Teal color from design
            color={Colors.WHITE}
            borderRadius={25}
          />
        </View>
      </View>
    </BGImage>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <AppText text={`${label}: `} fontSize={12} color={Colors.BLACK} />
    <AppText text={value} fontSize={12} color={Colors.BLACK} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(10),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(30),
    paddingBottom: Metrics.verticalScale(10),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  viewLogsBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: Metrics.verticalScale(20),
    marginBottom: Metrics.verticalScale(30),
  },
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: Metrics.verticalScale(30),
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 15, // Pill shape
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeTabButton: {
    backgroundColor: '#00A68A',
    borderColor: '#00A68A',
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  glassCard: {
    padding: 20,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2, // Slight spacing between lines
  },
  validityContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensures text wraps if the date string is long
  },
  timedDetails: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
  },
  logsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    paddingBottom: Metrics.verticalScale(40),
  },
});

export default ActiveCodesScreen;
