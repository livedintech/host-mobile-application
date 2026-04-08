import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Pressable,
  ListRenderItemInfo,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';
import { useChatContainer } from './ChatContainer';
import { ChatMessage, ChatStatus } from '@/types/chat';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import NoChatScreen from '../NoChatScreen/NoChatScreen';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '../NoListingScreen/NoListingScreen';

dayjs.extend(utc);
dayjs.extend(timezone);

const ChatScreen = () => {
  const {
    activeTab,
    setActiveTab,
    handleAction,
    setFilterVisible,
    isFilterVisible,
    filterAssigned,
    setFilterAssigned,
    handleResetAll,
    control,
    errors,
    data,
    isLoading,
    dataQuery,
    isFetching,
    transformedCities,
    transformedListings,
    transformedApartmentTypes,
    handlePopupMenu,
    goToChatDetail,
    search,
    setSearch,
    MENU_OPTIONS,
  } = useChatContainer();

  const { user } = useAuthStore();
  console.log('usermnn', user?.has_listing);
  if (!user?.has_listing) {
    return <NoListingScreen />;
  }
  const ACTION_WIDTH = Metrics.scale(80);
  const TOTAL_ACTION_WIDTH = ACTION_WIDTH * 2;

  const TABS: ChatStatus[] = ['All', 'Archived', 'Snoozed', 'Unread'];

  const renderItem = ({ item }: ListRenderItemInfo<ChatMessage>) => {
    const renderRightActions = (
      _prog: SharedValue<number>,
      drag: SharedValue<number>,
    ) => {
      const style = useAnimatedStyle(() => ({
        transform: [{ translateX: drag.value + TOTAL_ACTION_WIDTH }],
      }));

      return (
        <Reanimated.View
          style={[styles.swipeContainer, { width: TOTAL_ACTION_WIDTH }, style]}
        >
          <ButtonView
            style={[styles.snoozeAction, { width: ACTION_WIDTH }]}
            onPress={() => handleAction(item, 'Snoozed')}
          >
            <Svgicons path="snoozeIcon" size={24} color={Colors.WHITE} />
            <AppText
              text={item?.is_mute ? 'Unsnoozed' : 'Snooze'}
              color={Colors.WHITE}
              fontSize={12}
              mt={5}
              type="Medium"
            />
          </ButtonView>
          <ButtonView
            style={[styles.archiveAction, { width: ACTION_WIDTH }]}
            onPress={() => handleAction(item, 'Archived')}
          >
            <Svgicons path="archiveIcon" size={24} color={Colors.WHITE} />
            <AppText
              text={item?.is_archived ? 'Unarchived' : 'Archive'}
              color={Colors.WHITE}
              fontSize={12}
              mt={5}
              type="Medium"
            />
          </ButtonView>
        </Reanimated.View>
      );
    };

    return (
      <Swipeable
        friction={1.5}
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={renderRightActions}
      >
        <View style={styles.chatRow}>
          <Image
            source={
              item.img
                ? { uri: item.img }
                : require('@/assets/img/dummy/airbnb.png')
            }
            style={styles.avatar}
          />
          <Pressable
            style={styles.chatInfo}
            onPress={() => goToChatDetail(item)}
          >
            <View style={styles.infoTop}>
              <View style={{ flex: 1, marginRight: Metrics.scale(10) }}>
                <AppText
                  text={item.name || 'Unknown'}
                  type="SemiBold"
                  fontSize={16}
                  color={Colors.MIDNIGHT}
                  numberOfLines={1}
                />
              </View>
              <AppText
                text={
                  item.last_message_date
                    ? dayjs.utc(item.created_at).local().format('MM/DD/YY')
                    : 'N/A'
                }
                fontSize={12}
                color={Colors.GREY_SHADOW}
              />
            </View>
            <View style={styles.infoBottom}>
              <AppText
                text={item.last_message || 'No message'}
                fontSize={13}
                color={Colors.GREY_SHADOW}
                numberOfLines={1}
                style={{ flex: 0.85 }}
              />
              {item.unread_count ? (
                <View style={styles.unreadBadge}>
                  <AppText
                    text={item?.unread_count}
                    color={Colors.WHITE}
                    fontSize={11}
                    type="Bold"
                  />
                </View>
              ) : (
                <Svgicons
                  path="chevronRight"
                  size={12}
                  color={Colors.GREY_SHADOW}
                />
              )}
            </View>
          </Pressable>
        </View>
      </Swipeable>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          {/* <View style={styles.headerLeft} /> */}
          <AppText
            text="Inbox"
            type="Bold"
            fontSize={28}
            color={Colors.MIDNIGHT}
          />
          <Menu>
            <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
              <View style={styles.hamburgerBtn}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
              {MENU_OPTIONS.map(item => (
                <MenuOption
                  key={item.label}
                  style={styles.menuItem}
                  onSelect={() => handlePopupMenu(item.label)}
                >
                  <AppText
                    text={item.label}
                    fontSize={14}
                    color={Colors.MIDNIGHT}
                  />
                  <Svgicons path={item.icon} size={20} />
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>

        {/* ── Search Row ── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Svgicons path="searchIcon" size={18} color={Colors.GREY_SHADOW} />
            <TextInput
              placeholder="Search Guest"
              style={styles.searchInput}
              placeholderTextColor={Colors.GREY_SHADOW}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <ButtonView
            onPress={() => setFilterVisible(true)}
            style={styles.filterBtn}
          >
            <GlassCard width={40} style={styles.iconCircle}>
              <Svgicons
                path="filterIcon"
                size={20}
                color={Colors.BRUNSWICK_GREEN}
              />
            </GlassCard>
          </ButtonView>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabsWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TABS}
            contentContainerStyle={styles.tabsList}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isActive = activeTab === item;
              return (
                <Pressable
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(item)}
                >
                  <AppText
                    text={item}
                    fontSize={14}
                    type={isActive ? 'SemiBold' : 'Regular'}
                    color={
                      isActive ? Colors.WHITE : Colors.DARK_CHARCOAL_OPACITY_80
                    }
                  />
                </Pressable>
              );
            }}
          />
        </View>

        {/* ── Chat List ── */}
        <FlatListHandler
          isLoading={false}
          data={data}
          meta={dataQuery}
          // listEmptyText="No Chat found"
          ListEmptyComponent={
            <View style={{ flex: 1 }}>
              <NoChatScreen />
            </View>
          }
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        {/* ── Filter Modal ── */}
        <Modal
          visible={isFilterVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setFilterVisible(false)}
            />
            <View style={styles.modalContent}>
              <AppText
                text="Apply Filter"
                fontSize={22}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
                mb={20}
              />
              <Pressable
                style={styles.checkboxRow}
                onPress={() => setFilterAssigned(!filterAssigned)}
              >
                {filterAssigned ? (
                  <Svgicons path="CheckboxCheckedIcon" size={30} />
                ) : (
                  <Svgicons path="CheckboxUncheckedIcon" size={30} />
                )}
                <AppText text="Assigned to me" fontSize={14} type="SemiBold" />
              </Pressable>
              <DropdownField
                name="listings"
                control={control}
                errors={errors}
                label="Listings"
                data={transformedListings}
              />
              <DropdownField
                name="apartmenttype"
                control={control}
                errors={errors}
                label="Apartment Type"
                data={transformedApartmentTypes}
                dropdownPosition="top"
              />
              <View style={styles.modalFooter}>
                <AppButton
                  onPress={handleResetAll}
                  title="Reset"
                  style={styles.flex}
                />
                <AppButton
                  onPress={() => setFilterVisible(false)}
                  title="Apply Filter"
                  style={styles.flex}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(35),
  },
  iconCircle: {
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    padding: 0,
    backgroundColor: '#D9D9D900',
  },
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.scale(22),
    paddingTop: Metrics.verticalScale(16),
    paddingBottom: Metrics.verticalScale(12),
  },
  headerLeft: {
    width: 40,
  },
  menuTrigger: {
    width: 40,
    alignItems: 'flex-end',
  },
  hamburgerBtn: {
    gap: 5,
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: Colors.MIDNIGHT,
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(22),
    marginBottom: Metrics.verticalScale(16),
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Metrics.verticalScale(50),
    paddingHorizontal: Metrics.scale(16),
    height: Metrics.verticalScale(50),
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.WHITE_OPACITY_90,
  },
  searchInput: {
    flex: 1,
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.MIDNIGHT,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  filterBtn: {
    width: Metrics.verticalScale(50),
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Tabs */
  tabsWrapper: {
    marginBottom: Metrics.verticalScale(8),
  },
  tabsList: {
    paddingHorizontal: Metrics.scale(22),
    gap: 8,
  },
  tab: {
    paddingHorizontal: Metrics.scale(22),
    height: Metrics.verticalScale(40),
    borderRadius: Metrics.verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  activeTab: {
    backgroundColor: Colors.TEAL_PRIMARY_ALT,
  },

  /* Chat rows */
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: Metrics.scale(22),
    paddingVertical: Metrics.verticalScale(16),
    borderBottomWidth: Metrics.horizontalLineHeight,
    borderBottomColor: '#E8EAEA',
    alignItems: 'center',
  },
  avatar: {
    width: Metrics.images.large,
    height: Metrics.images.large,
    borderRadius: Metrics.images.large / 2,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Metrics.scale(14),
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(4),
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: Colors.TEAL_PRIMARY_ALT,
    width: Metrics.verticalScale(22),
    height: Metrics.verticalScale(22),
    borderRadius: Metrics.verticalScale(11),
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Swipe actions */
  swipeContainer: { flexDirection: 'row' },
  snoozeAction: {
    backgroundColor: '#C6C6CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveAction: {
    backgroundColor: Colors.TEAL_PRIMARY_ALT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Popup menu */
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
    // borderBottomWidth: Metrics.horizontalLineHeight,
    // borderBottomColor: '#EEE',
  },

  /* Filter Modal */
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
    gap: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(20),
    gap: 5,
  },
  flex: { flex: 1 },
});

export default ChatScreen;
