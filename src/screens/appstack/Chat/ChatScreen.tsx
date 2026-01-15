import React from 'react';
import { StyleSheet, View, FlatList, TextInput, Image, Pressable, ListRenderItemInfo, Modal } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { useChatContainer } from './ChatContainer';
import { ChatMessage, ChatStatus } from '@/types/chat';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';

// --- Dummy Data for Dropdowns ---
const STATUS_DATA = [{ label: 'Confirmed', value: 'confirmed' }, { label: 'Pending', value: 'pending' }];
const LISTINGS_DATA = [{ label: 'Luxury Villa', value: '1' }, { label: 'City Flat', value: '2' }];
const CITY_DATA = [{ label: 'Dubai', value: 'dubai' }, { label: 'Sharjah', value: 'sharjah' }];

const ChatScreen = () => {
  const {
    activeTab, setActiveTab, filteredChats, handleAction,
    setFilterVisible, isFilterVisible,
    filterAssigned, setFilterAssigned,
    handleResetAll, control, errors
  } = useChatContainer();

  const renderItem = ({ item }: ListRenderItemInfo<ChatMessage>) => {
    const renderRightActions = (_prog: SharedValue<number>, drag: SharedValue<number>) => {
      const style = useAnimatedStyle(() => ({ transform: [{ translateX: drag.value + 160 }] }));
      return (
        <Reanimated.View style={[styles.swipeContainer, style]}>
          <ButtonView style={styles.snoozeAction} onPress={() => handleAction(item.id, 'Snoozed')}>
            <Svgicons path="snoozeIcon" size={24} color={Colors.WHITE} />
            <AppText text="Snooze" color={Colors.WHITE} fontSize={12} mt={5} type="Medium" />
          </ButtonView>
          <ButtonView style={styles.archiveAction} onPress={() => handleAction(item.id, 'Archived')}>
            <Svgicons path="archiveIcon" size={24} color={Colors.WHITE} />
            <AppText text="Archive" color={Colors.WHITE} fontSize={12} mt={5} type="Medium" />
          </ButtonView>
        </Reanimated.View>
      );
    };

    return (
      <Swipeable friction={2} rightThreshold={40} renderRightActions={renderRightActions}>
        <View style={styles.chatRow}>
          <Image source={item.img} style={styles.avatar} />
          <View style={styles.chatInfo}>
            <View style={styles.infoTop}>
              <AppText text={item.name} type="SemiBold" fontSize={16} color={Colors.MIDNIGHT} />
              <AppText text={item.date} fontSize={12} color={Colors.GREY_SHADOW} />
            </View>
            <View style={styles.infoBottom}>
              <AppText text={item.message} fontSize={13} color={Colors.GREY_SHADOW} numberOfLines={1} style={{ flex: 0.85 }} />
              {item.unreadCount ? (
                <View style={styles.unreadBadge}><AppText text={String(item.unreadCount)} color={Colors.WHITE} fontSize={11} type="Bold" /></View>
              ) : (
                <Svgicons path="chevronRight" size={12} color={Colors.GREY_SHADOW} />
              )}
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput placeholder="Search Guest" style={styles.searchInput} placeholderTextColor={Colors.GREY_SHADOW} />
          <Svgicons path="searchIcon" size={18} />
        </View>
        <ButtonView onPress={() => setFilterVisible(true)}>
          <Svgicons path="filterIcon" size={22} color={Colors.BRUNSWICK_GREEN} ml={15} />
        </ButtonView>
        <Menu>
          <MenuTrigger customStyles={{ triggerWrapper: { marginLeft: 15 } }}>
            <Svgicons path="sortIcon" size={22} color={Colors.BLACK} />
          </MenuTrigger>
          <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
            {['Saved Replies', 'Automation Template', 'AI Auto Reply'].map((opt) => (
              <MenuOption key={opt} style={styles.menuItem}>
                <AppText text={opt} fontSize={14} color={Colors.MIDNIGHT} />
                <Svgicons path="expandIcon" size={18} />
              </MenuOption>
            ))}
          </MenuOptions>
        </Menu>
      </View>

      {/* Tab List */}
      <View style={{ marginBottom: 20 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Archived', 'Snoozed', 'Unread', 'Marketplace'] as ChatStatus[]}
          contentContainerStyle={{ paddingLeft: 20 }}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 5 }}>
              {activeTab === item ? (
                <View style={[styles.tab, styles.activeTab]}><AppText text={item} color={Colors.WHITE} fontSize={14} /></View>
              ) : (
                <GradientBorder borderRadius={20} borderWidth={1} style={styles.flex}>
                  <Pressable style={styles.tab} onPress={() => setActiveTab(item)}>
                    <AppText text={item} color={Colors.BRUNSWICK_GREEN} fontSize={14} />
                  </Pressable>
                </GradientBorder>
              )}
            </View>
          )}
        />
      </View>

      <FlatList data={filteredChats} keyExtractor={item => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setFilterVisible(false)} />
          <View style={styles.modalContent}>
            <AppText text="Apply Filter" fontSize={22} type="Bold" color={Colors.BRUNSWICK_GREEN} mb={20} />
            <Pressable style={styles.checkboxRow} onPress={() => setFilterAssigned(!filterAssigned)}>
              {filterAssigned ? <Svgicons path='CheckboxCheckedIcon' size={30} /> : <Svgicons path='CheckboxUncheckedIcon' size={30} />}
              <AppText text="Assigned to me" fontSize={14} type="SemiBold" />
            </Pressable>
            <DropdownField name="reservationStatus" control={control} errors={errors} label="Reservation Status" data={STATUS_DATA} />
            <DropdownField name="listings" control={control} errors={errors} label="Listings" data={LISTINGS_DATA} />
            <DropdownField name="city" control={control} errors={errors} label="City" data={CITY_DATA} />
            <DropdownField name="Apartment Type" control={control} errors={errors} label="City" data={CITY_DATA} />
            <View style={styles.modalFooter}>
              <AppButton onPress={handleResetAll} title="Reset" style={styles.flex} />
              <AppButton onPress={() => setFilterVisible(false)} title="Apply Filter" style={styles.flex} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: Metrics.verticalScale(40),
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(20),
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: Metrics.verticalScale(25),
    paddingHorizontal: Metrics.scale(15),
    height: Metrics.verticalScale(48),
    borderWidth: Metrics.horizontalLineHeight,
    borderColor: Colors.ARGENT,
  },

  searchInput: {
    flex: 1,
    marginLeft: Metrics.scale(10),
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.BLACK,
  },

  popupMenu: {
    borderRadius: Metrics.verticalScale(12),
    padding: Metrics.scale(10),
    width: Metrics.scale(220),
    marginTop: Metrics.verticalScale(30),
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Metrics.verticalScale(12),
    borderBottomWidth: Metrics.horizontalLineHeight,
    borderBottomColor: '#EEE',
  },

  tab: {
    paddingHorizontal: Metrics.scale(20),
    height: Metrics.verticalScale(38),
    borderRadius: Metrics.verticalScale(20),
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#1A3D32',
  },

  chatRow: {
    flexDirection: 'row',
    padding: Metrics.scale(18),
    borderBottomWidth: Metrics.horizontalLineHeight,
    borderBottomColor: Colors.BEAUTY_SILVER,
  },

  avatar: {
    width: Metrics.images.large,
    height: Metrics.images.large,
    borderRadius: Metrics.images.large / 2,
  },

  chatInfo: {
    flex: 1,
    marginLeft: Metrics.scale(15),
  },

  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(5),
  },

  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  unreadBadge: {
    backgroundColor: '#1A3D32',
    width: Metrics.verticalScale(22),
    height: Metrics.verticalScale(22),
    borderRadius: Metrics.verticalScale(11),
    justifyContent: 'center',
    alignItems: 'center',
  },

  swipeContainer: {
    flexDirection: 'row',
    width: Metrics.scale(160),
  },

  snoozeAction: {
    flex: 1,
    backgroundColor: '#B0B5C1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  archiveAction: {
    flex: 1,
    backgroundColor: '#1A3D32',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: Metrics.verticalScale(30),
    borderTopRightRadius: Metrics.verticalScale(30),
    padding: Metrics.scale(25),
    height: '75%',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(20),
  },

  checkbox: {
    width: Metrics.verticalScale(20),
    height: Metrics.verticalScale(20),
    borderWidth: Metrics.horizontalLineHeight,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: Metrics.verticalScale(4),
  },

  checked: {
    backgroundColor: Colors.BRUNSWICK_GREEN,
    borderColor: Colors.BRUNSWICK_GREEN,
  },

  modalFooter: {
    flexDirection: 'row',
    marginTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(20),
  },

  resetBtn: {
    flex: 1,
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
    borderWidth: Metrics.horizontalLineHeight,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Metrics.scale(10),
  },

  applyBtn: {
    flex: 1.5,
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
    backgroundColor: Colors.BRUNSWICK_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flex: {
    flex: 1,
  },
});


export default ChatScreen;