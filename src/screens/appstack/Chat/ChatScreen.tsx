import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { useChatContainer } from './ChatContainer';
import { ChatMessage, ChatStatus } from '@/types/chat';

const ChatScreen = () => {
  const { activeTab, setActiveTab, filteredChats, handleAction } = useChatContainer();

  const renderItem = ({ item }: ListRenderItemInfo<ChatMessage>) => {
    const renderRightActions = (_prog: SharedValue<number>, drag: SharedValue<number>) => {
      const style = useAnimatedStyle(() => ({
        transform: [{ translateX: drag.value + 160 }],
      }));

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
                <View style={styles.unreadBadge}>
                  <AppText text={String(item.unreadCount)} color={Colors.WHITE} fontSize={11} type="Bold" />
                </View>
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
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput placeholder="Search Guest" style={styles.searchInput} placeholderTextColor={Colors.GREY_SHADOW} />
          <Svgicons path="searchIcon" size={18} />
        </View>
        <Svgicons path="filterIcon" size={22} color={Colors.BRUNSWICK_GREEN} ml={15} />
        <Svgicons path="sortIcon" size={22} color={Colors.BLACK} ml={15} />
      </View>

      <View style={{ marginBottom: 20 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Archived', 'Snoozed', 'Unread', 'Marketplace'] as ChatStatus[]}
          contentContainerStyle={{ paddingLeft: 20 }}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 5 }}>
              {activeTab === item ? (
                <Pressable style={[styles.tab, styles.activeTab]} onPress={() => setActiveTab(item)}>
                  <AppText text={item} color={Colors.WHITE} fontSize={14} />
                </Pressable>
              ) : (
                <GradientBorder borderRadius={20} borderWidth={1} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }}>
                  <Pressable style={styles.tab} onPress={() => setActiveTab(item)}>
                    <AppText text={item} color={Colors.BRUNSWICK_GREEN} fontSize={14} />
                  </Pressable>
                </GradientBorder>
              )}
            </View>
          )}
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: Metrics.scale(40),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.BLACK,
  },
  tab: {
    paddingHorizontal: 20,
    height: 38,
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  activeTab: {
    backgroundColor: '#1A3D32',
    borderColor: '#1A3D32',
  },
  chatRow: {
    flexDirection: 'row',
    padding: 18,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BEAUTY_SILVER,
  },
  avatar: {
    width: Metrics.scale(52),
    height: Metrics.scale(52),
    borderRadius: 26,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#1A3D32',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Swipe Actions
  swipeContainer: {
    flexDirection: 'row',
    width: 160,
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
});

export default ChatScreen;
