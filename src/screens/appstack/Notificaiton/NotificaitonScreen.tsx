import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import useNotificationsContainer, {
  FlatItem,
  getIconForType,
  formatTime,
} from './NotificationsContainer';
import { ApiNotificationItem } from '@/services/mobileNotificationsApi';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '../NoListingScreen/NoListingScreen';
import NotificationsSkeleton from '@/components/Skeletons/NotificationsSkeleton';

type NotificationItemProps = {
  item: ApiNotificationItem;
  icon: string;
  time: string;
  onDelete: (id: number) => void;
  onPress: (item: ApiNotificationItem) => void;
};

const DeleteAction = ({
  dragX,
  onDelete,
  id,
}: {
  dragX: Animated.AnimatedInterpolation<number>;
  onDelete: (id: number) => void;
  id: number;
}) => {
  const scale = dragX.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.deleteActionContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.deleteCircle}
          onPress={() => onDelete(id)}
          activeOpacity={0.8}
        >
          <Svgicons path="trashIcon" size={22} color={Colors.BLACK} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const NotificationItem = ({
  item,
  icon,
  time,
  onDelete,
  onPress,
}: NotificationItemProps) => (
  <Swipeable
    renderRightActions={(_progress, dragX) => (
      <DeleteAction
        dragX={dragX}
        onDelete={onDelete}
        id={item.notification_id}
      />
    )}
    friction={2}
    rightThreshold={40}
  >
    <TouchableOpacity
      style={[styles.card, item.status === 'unread' && styles.unreadCard]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.iconBox}>
        <Svgicons path={icon as any} size={28} />
      </View>
      <View style={styles.contentBox}>
        <View style={styles.titleRow}>
          <AppText text={item.title} fontSize={16} type="SemiBold" />
          {item.status === 'unread' && <View style={styles.unreadDot} />}
        </View>
        <AppText
          text={item.message}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          mt={4}
        />
        {/* {item.listing_name ? (
          <AppText
            text={item.listing_name}
            fontSize={12}
            color={Colors.SMOOTH_GREY}
            mt={2}
            numberOfLines={1}
          />
        ) : null} */}
        <AppText
          text={time}
          fontSize={12}
          color={Colors.SMOOTH_GREY}
          mt={6}
          textAlign="right"
        />
      </View>
    </TouchableOpacity>
  </Swipeable>
);

const NotificationsScreen = () => {
  const {
    flatItems,
    isLoading,
    dataQuery,
    handleMarkAllRead,
    handleDeleteNotification,
    handleNotificationPress,
    goBack,
  } = useNotificationsContainer();

  const { user } = useAuthStore();

  if (!user?.has_listing) {
    return <NoListingScreen />;
  }

  const { i18n: localI18n, t } = useTranslation();
  const isArabic = localI18n.language === 'ar';

  const renderItem = ({ item }: { item: FlatItem }) => {
    if (item.type === 'header') {
      return (
        <AppText
          text={item.title}
          fontSize={16}
          type="SemiBold"
          mt={20}
          mb={15}
        />
      );
    }

    const { data } = item;
    return (
      <NotificationItem
        item={data}
        icon={getIconForType(data.payload?.notification_type, data.title)}
        time={formatTime(data.created_at)}
        onPress={handleNotificationPress}
        onDelete={handleDeleteNotification}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => goBack()}
              style={styles.backCircle}
            >
              <Svgicons
                path={isArabic ? 'arrowRightIcon' : 'arrowLeftIcon'}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.markReadBtn}
              onPress={handleMarkAllRead}
            >
              <AppText
                text={t('app.notifications.mark_all_read')}
                fontSize={13}
                type="Medium"
              />
            </TouchableOpacity>
          </View>

          <FlatListHandler
            data={flatItems}
            meta={dataQuery}
            isLoading={isLoading}
            renderSkeleton={() => <NotificationsSkeleton />}
            renderItem={renderItem}
            keyExtractor={(item: FlatItem) => item.key}
            style={styles.flatList}
            contentContainerStyle={styles.scrollBody}
            contentInsetAdjustmentBehavior="never"
            ListHeaderComponent={
              <AppText
                text={t('app.notifications.title')}
                fontSize={24}
                type="Medium"
                mb={5}
                color={Colors.BLACK}
              />
            }
          />
        </SafeAreaView>
      </BGImage>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
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
  flatList: {
    flex: 1,
    backgroundColor: 'transparent',
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
