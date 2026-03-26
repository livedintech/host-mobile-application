import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useSavedRepliesContainer } from './SavedRepliesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';
import { useNavigation } from '@react-navigation/native';

const SavedRepliesScreen = () => {
  const navigation = useNavigation();
  const {
    toggleSwitch,
    editReply,
    createNewReply,
    data,
    dataQuery,
    isFetching,
    isLoading,
    confirm,
    openRemoveConfirmSheet,
    removeSheetRef,
    isLoadingRemoved,
    Item,
    isLoadingStatus,
  } = useSavedRepliesContainer();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <GlassCard width="100%" style={styles.glassCardOverride}>
        <View style={styles.cardContent}>
          {/* 1. Ensure leftSection is flex: 1 and has a right margin */}
          <View style={[styles.leftSection, { marginRight: 10 }]}>
            <CustomSwitch
              onToggle={() => toggleSwitch(item)}
              value={item.is_active}
              disabled={isLoadingStatus}
              isLoading={item?.id === Item?.id ? isLoadingStatus : false}
            />

            <AppText
              text={item.title}
              fontSize={14}
              type="Medium"
              color={Colors.MIDNIGHT}
              ml={12}
              style={{ flex: 1, flexShrink: 1 }}
            />
          </View>

          <View style={styles.rightSection}>
            <Pressable
              onPress={() => openRemoveConfirmSheet(item)}
              style={styles.iconBtn}
            >
              <Svgicons path="TrashFull" size={20} color={Colors.MIDNIGHT} />
            </Pressable>
            <Pressable onPress={() => editReply(item)} style={styles.iconBtn}>
              <Svgicons
                path="editIconUserManagement"
                size={20}
                color={Colors.MIDNIGHT}
              />
            </Pressable>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        {/* Title & Description Section */}
        <View style={styles.topTextSection}>
          <AppText
            text="Saved Replies"
            fontSize={28}
            type="Bold"
            color={Colors.MIDNIGHT}
            mb={10}
          />
          <AppText
            text="Create saved replies to reuse common messages. Use shortcuts in chats to quickly insert them."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
          />
        </View>

        {/* List using FlatListHandler */}
        <FlatListHandler
          isLoading={isLoading || isFetching}
          data={data}
          meta={dataQuery}
          listEmptyText="No saved replies found"
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
        />

        {/* Footer Fixed Button */}
        <View style={styles.footer}>
          <AppButton
            onPress={createNewReply}
            title="Create New Saved Reply"
            loading={isLoadingRemoved || isLoadingStatus}
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            borderColor={Colors.TEAL_PRIMARY_ALT}
          />
        </View>

        <ConfirmAction
          ref={removeSheetRef}
          title={`${Item?.title}`}
          content="Are you sure you want to delete this reply?"
          confirmText="Confirm"
          closeText="Cancel"
          onConfirm={confirm}
          isLoading={isLoadingRemoved}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.verticalScale(40) },
  header: {
    paddingHorizontal: Metrics.scale(22),
    marginBottom: Metrics.verticalScale(10),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  topTextSection: {
    paddingHorizontal: Metrics.scale(22),
    marginBottom: Metrics.verticalScale(20),
  },
  listContent: {
    paddingHorizontal: Metrics.scale(22),
    paddingTop: 10,
    paddingBottom: Metrics.verticalScale(100), // Space for fixed footer
  },
  glassCardOverride: {
    padding: 0, // Let internal view handle padding for better alignment
    marginBottom: Metrics.verticalScale(12),
    borderRadius: 22,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap:20,
    paddingVertical: Metrics.verticalScale(16),
    paddingHorizontal: Metrics.scale(16),
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 5 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(22),
    paddingBottom: Metrics.verticalScale(40),
    backgroundColor: 'transparent',
  },
});

export default SavedRepliesScreen;
