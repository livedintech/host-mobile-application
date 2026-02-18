import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useSmartLockActivityLogContainer from './SmartLockActivityLogContainer';

const SmartLockActivityLogScreen = ({ navigation }: any) => {
  const { logs, handleRefresh, isLoading } = useSmartLockActivityLogContainer();
  console.log('logss', logs);

  const renderLogItem = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <View style={styles.cardHeader}>
        <Svgicons path="unlock" size={18} color={Colors.BRUNSWICK_GREEN} />
        <AppText
          text={item.lockName}
          fontSize={20}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          ml={10}
        />
      </View>
      <AppText
        text={`${item.action}`}
        fontSize={16}
        type="Medium"
        color={Colors.BRUNSWICK_GREEN}
        mt={8}
        style={styles.actionText}
      />
    </View>
  );

  const renderEmptyContainer = () => (
    <View style={styles.emptyContainer}>
      <Svgicons path="logIcon" size={50} color={Colors.SMOOTH_GREY} />
      <AppText
        text="No activity logs found."
        fontSize={18}
        type="Medium"
        color={Colors.SMOOTH_GREY}
        mt={15}
      />
      <AppText
        text="Try refreshing to see recent updates."
        fontSize={14}
        color={Colors.SMOOTH_GREY}
        mt={5}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <ButtonView style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svgicons
            path="arrowLeftIcon"
            size={24}
            color={Colors.BRUNSWICK_GREEN}
          />
        </ButtonView>

        <ButtonView
          style={styles.refreshBtn}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <AppText
            text={isLoading ? 'Updating...' : 'Refresh'}
            fontSize={14}
            color={Colors.BRUNSWICK_GREEN}
            type="Medium"
          />
        </ButtonView>
      </View>

      {/* Screen Title */}
      <View style={styles.titleContainer}>
        <AppText
          text="Activity Log"
          fontSize={32}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
        />
        <Svgicons
          path="logIcon"
          size={28}
          color={Colors.BRUNSWICK_GREEN}
          ml={10}
        />
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
    paddingVertical: Metrics.verticalScale(15),
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrics.verticalScale(10),
    marginBottom: Metrics.verticalScale(30),
  },
  listContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(20),
  },
  logCard: {
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 15,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(15),
    backgroundColor: Colors.WHITE,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrics.verticalScale(50),
  },
});

export default SmartLockActivityLogScreen;
