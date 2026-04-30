import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import useNotificationsContainer, { Notification } from './NotificationsContainer';

type NotificationItemProps = {
  item: Notification;
  onDelete: (id: string) => void;
  onPress: (item: Notification) => void;
};

const DeleteAction = ({ dragX, onDelete, id }: { dragX: Animated.AnimatedInterpolation<number>; onDelete: (id: string) => void; id: string }) => {
  const scale = dragX.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.deleteActionContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity style={styles.deleteCircle} onPress={() => onDelete(id)} activeOpacity={0.8}>
          <Svgicons path="trashIcon" size={22} color={Colors.BLACK} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const NotificationItem = ({ item, onDelete, onPress }: NotificationItemProps) => (
  <Swipeable
    renderRightActions={(_progress, dragX) => <DeleteAction dragX={dragX} onDelete={onDelete} id={item.id} />}
    friction={2}
    rightThreshold={40}
  >
    <TouchableOpacity
      style={[styles.card, item.isUnread && styles.unreadCard]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.iconBox}>
        <Svgicons path={item.icon as any} size={28} />
      </View>
      <View style={styles.contentBox}>
        <View style={styles.titleRow}>
          <AppText text={item.title} fontSize={16} type="SemiBold" />
          {item.isUnread && <View style={styles.unreadDot} />}
        </View>
        <AppText
          text={item.description}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          mt={4}
          numberOfLines={2}
        />
        <AppText text={item.time} fontSize={12} color={Colors.SMOOTH_GREY} mt={8} textAlign="right" />
      </View>
    </TouchableOpacity>
  </Swipeable>
);

const NotificationsScreen = () => {
  const {
    todayData,
    yesterdayData,
    todayLabel,
    yesterdayLabel,
    handleMarkAllRead,
    handleDeleteNotification,
    handleNotificationPress,
    goBack,
  } = useNotificationsContainer();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goBack()} style={styles.backCircle}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllRead}>
              <AppText text="Mark all as read" fontSize={13} type="Medium" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <AppText text="Notifications" fontSize={34} type="Bold" mb={25} />

            {todayData.length > 0 && (
              <>
                <AppText text={todayLabel} fontSize={16} type="SemiBold" mb={15} />
                {todayData.map(item => (
                  <NotificationItem key={item.id} item={item} onPress={handleNotificationPress} onDelete={handleDeleteNotification} />
                ))}
              </>
            )}

            {yesterdayData.length > 0 && (
              <>
                <AppText text={yesterdayLabel} fontSize={16} type="SemiBold" mt={20} mb={15} />
                {yesterdayData.map(item => (
                  <NotificationItem key={item.id} item={item} onPress={handleNotificationPress} onDelete={handleDeleteNotification} />
                ))}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </BGImage>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  markReadBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  iconBox: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  deleteActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
  },
  deleteCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default NotificationsScreen;
