import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { Colors } from '@/theme/colors';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: string;
  read: boolean;
}

const PLACEHOLDER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Booking Cancellation',
    body: 'A booking has been cancelled. Please review the details.',
    time: 'Just now',
    type: 'booking_cancellation',
    read: false,
  },
  {
    id: '2',
    title: 'Booking Cancellation',
    body: 'A reservation was cancelled by the guest.',
    time: '2 hours ago',
    type: 'booking_cancellation',
    read: true,
  },
];

const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'booking_cancellation':
      return 'crossIcon2';
    default:
      return 'bellIcon';
  }
};

const NotificationCard = ({ item }: { item: NotificationItem }) => (
  <GlassCard width="100%" style={styles.card}>
    <View style={styles.cardRow}>
      <View style={[styles.iconWrap, !item.read && styles.iconWrapUnread]}>
        <Svgicons path={getTypeIcon(item.type)} size={20} />
      </View>
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <AppText
            text={item.title}
            fontSize={14}
            type="SemiBold"
            color={Colors.MIDNIGHT}
          />
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <AppText
          text={item.body}
          fontSize={12}
          color={Colors.STEEL_GREY}
          numberOfLines={2}
        />
        <AppText
          text={item.time}
          fontSize={11}
          color={Colors.GREY_SHADOW}
        />
      </View>
    </View>
  </GlassCard>
);

const NotificaitonScreen = () => {
  return (
    <BGImage source={require('@/assets/img/background/primaryBG.png')}>
      {/* Header */}
      <View style={styles.header}>
        <GradientBorder
          borderRadius={16}
          borderWidth={1}
          style={styles.backCircle}
        >
          <AppPressable style={styles.backCircle} onPress={()=>goBack()}>
            <Svgicons path="arrowLeftIcon" size={26} />
          </AppPressable>
        </GradientBorder>

        <AppText
          text="Notifications"
          fontSize={18}
          type="Bold"
          color={Colors.MIDNIGHT}
        />

        <View style={styles.headerPlaceholder} />
      </View>

      {/* List */}
      <FlatList
        data={PLACEHOLDER_NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Svgicons path="bellIcon" size={48} color={Colors.SMOOTH_GREY} />
            <AppText
              text="No notifications yet"
              fontSize={16}
              type="SemiBold"
              color={Colors.GREY_SHADOW}
            />
          </View>
        }
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.scale(16),
    paddingTop: Metrics.verticalScale(16),
    paddingBottom: Metrics.verticalScale(12),
  },
  backCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    width: 36,
  },
  listContent: {
    paddingHorizontal: Metrics.scale(16),
    paddingBottom: Metrics.verticalScale(24),
    gap: Metrics.verticalScale(10),
  },
  card: {
    padding: Metrics.scale(12),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Metrics.scale(12),
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.GLOSSY_PLATINUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: Colors.TEAL_20_OPACITY,
  },
  textWrap: {
    flex: 1,
    gap: Metrics.verticalScale(3),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrics.scale(6),
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY_TEAL,
  },
});

export default NotificaitonScreen;
