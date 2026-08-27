import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useSmartLockActivityLogContainer from './SmartLockActivityLogContainer';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';
import SmartLockActivityLogSkeleton from '@/components/Skeletons/SmartLockActivityLogSkeleton';

const SmartLockActivityLogScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { logs, handleRefresh, isLoading } = useSmartLockActivityLogContainer();

  const renderLogItem = ({ item }: { item: any }) => (
    <GlassCard width="100%" style={styles.logCard}>
      <AppText
        text={item.lockName}
        fontSize={18}
        type="Bold"
        color={Colors.BLACK}
      />
      <AppText
        text={item.action}
        fontSize={14}
        color={Colors.BLACK}
        mt={4}
        style={styles.actionText}
      />
    </GlassCard>
  );

  const renderEmptyContainer = () => (
    <View style={styles.emptyContainer}>
      <Svgicons path="logIcon" size={50} color={Colors.SMOOTH_GREY} />
      <AppText
        text={t('app.smart_lock_activity.empty')}
        fontSize={18}
        type="Medium"
        color={Colors.BLACK}
        mt={15}
      />
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <AppPressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Svgicons path="arrowLeftIcon" size={20} color={Colors.BLACK} />
          </AppPressable>

          <View style={styles.headerRight}>
            <ButtonView
              style={styles.refreshBtn}
              onPress={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.MEDIUM_JUNGLE_GREEN} />
              ) : (
                <AppText text={t('app.smart_lock_activity.refresh')} fontSize={12} color={Colors.BLACK} />
              )}
            </ButtonView>
            
            {/* Filter Icon as seen in Activity Log.jpg */}
            {/* <ButtonView style={styles.filterIcon}>
               <Svgicons path="filterIcon" size={20} color={Colors.BLACK} />
            </ButtonView> */}
          </View>
        </View>

        {/* Screen Title */}
        <View style={styles.titleContainer}>
          <AppText
            text={t('app.smart_lock_activity.title')}
            fontSize={30}
            type="Bold"
            color={Colors.BLACK}
          />
        </View>

        {isLoading && logs.length === 0 ? (
          <SmartLockActivityLogSkeleton />
        ) : (
          <FlatList
            data={logs}
            renderItem={renderLogItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isLoading}
            ListEmptyComponent={renderEmptyContainer}
          />
        )}
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(20),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  refreshBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  filterIcon: {
    padding: 5,
  },
  titleContainer: {
    paddingHorizontal: Metrics.scale(25),
    marginTop: Metrics.verticalScale(20),
    marginBottom: Metrics.verticalScale(30),
  },
  listContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(20),
  },
  logCard: {
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(15),
  },
  actionText: {
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrics.verticalScale(100),
  },
});

export default SmartLockActivityLogScreen;