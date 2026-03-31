import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useHomeContainer from './HomeContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useAuthStore } from '@/store/useAuthStore';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';

// ==========================================
// Reusable Components
// ==========================================

interface PendingActionCardProps {
  iconPath: string;
  text: string;
  onPress: () => void;
  showDot?: boolean;
}

const PendingActionCard = ({ iconPath, text, onPress, showDot = true }: PendingActionCardProps) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <GlassCard width="100%" style={styles.glassWrapper}>
      <View style={styles.iconContainerView}>
        <Svgicons path={iconPath} />
      </View>
      <View style={styles.messageWrapper}>
        <AppText text={text} fontSize={14} type="Medium" color={Colors.BLACK} />
      </View>
      {showDot && <View style={styles.notificationIndicator} />}
    </GlassCard>
  </TouchableOpacity>
);

// ==========================================
// Layout Components
// ==========================================

const OldLayout = ({
  user,
  cardsData,
  getCardContent,
  iconMap,
  onConnect,
  isSupervisor,
  incomplete_listings,
  unexported_listings,
  handleListingNavigation
}: any) => (
  <View>
    <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>
        Hi <Text style={styles.greetingName}>{user?.name},</Text> let’s begin setting up everything you need!
      </Text>
    </View>

    <View style={styles.gridContainer}>
      {cardsData.map(({ key }: any) => {
        const content = getCardContent(key);
        return (
          <GlassCard key={key} width="49%" style={styles.cardStyle}>
            <ButtonView style={{ flex: 1 }} onPress={() => onConnect(key)} disabled={isSupervisor}>
              <View style={styles.cardHeader}>
                <GlassCard style={styles.iconBox}>
                  <Svgicons path={iconMap[key]} />
                </GlassCard>
                <AppText ml={6} text={content.title} fontSize={10} type="Medium" color={Colors.BLACK} />
              </View>
              <View style={styles.cardFooter}>
                <AppText text={content.desc} fontSize={11} type="Medium" color={Colors.BLACK} style={{ flex: 1, marginRight: 10 }} />
                <GlassCard style={styles.arrowBtn}>
                  <Svgicons path="arrowRightIcon" stroke={Colors.BLACK} width={14} height={14} />
                </GlassCard>
              </View>
            </ButtonView>
          </GlassCard>
        );
      })}
    </View>

    {/* Pending Actions moved to Old Layout */}
    {incomplete_listings?.length > 0 && (
      <PendingActionCard
        iconPath='airbnb'
        onPress={() => handleListingNavigation(incomplete_listings, 'incomplete')}
        text='Complete your pending listing form'
      />
    )}

    {unexported_listings?.length > 0 && (
      <PendingActionCard
        iconPath='airbnb'
        onPress={() => handleListingNavigation(unexported_listings, 'unexported')}
        text='Export your pending listing'
      />
    )}
  </View>
);

const NewLayout = ({ user, recommendedNextItems, updatesItems }: any) => (
  <View>
    <View style={styles.newGreetingContainer}>
      <Text style={styles.newGreetingText}>
        Hi <Text style={styles.newGreetingName}>{user?.name || 'Tooba'},</Text> here's what needs your attention today!
      </Text>
    </View>

    <GlassCard width="100%" style={styles.sectionCard}>
      <AppText text="Recommended Next" fontSize={18} type="Bold" color={Colors.BLACK} mb={15} />
      {recommendedNextItems.map((item: any, index: number) => (
        <TouchableOpacity key={item.id} style={[styles.listItem, index !== recommendedNextItems.length - 1 && styles.borderBottom]}>
          <View style={styles.listItemIcon}>
            <Svgicons path={item.icon} size={22} />
          </View>
          <View style={styles.listItemContent}>
            <AppText text={item.title} fontSize={14} type="Medium" color={Colors.BLACK} />
            <AppText text={item.subtitle} fontSize={12} color={Colors.BLACK} mt={2} />
          </View>
          <Svgicons path="chevronRight" size={16} />
        </TouchableOpacity>
      ))}
    </GlassCard>

    <GlassCard width="100%" style={styles.sectionCard}>
      <AppText text="Your Updates" fontSize={18} type="Bold" color={Colors.BLACK} mb={15} />
      {updatesItems.map((item: any, index: number) => (
        <TouchableOpacity key={item.id} style={[styles.listItem, index !== updatesItems.length - 1 && styles.borderBottom]}>
          <View style={styles.listItemIcon}>
            <Svgicons path={item.icon} size={22} />
          </View>
          <View style={styles.listItemContent}>
            <AppText text={item.title} fontSize={14} type="Medium" color={Colors.BLACK} />
            <AppText text={item.subtitle} fontSize={12} color={Colors.BLACK} mt={2} />
          </View>
          <Svgicons path="chevronRight" size={16} />
        </TouchableOpacity>
      ))}
    </GlassCard>
  </View>
);

// ==========================================
// Main Screen Component
// ==========================================

const HomeScreen = () => {
  const { user } = useAuthStore();
  const {
    onConnect,
    UserPermission,
    cardsData,
    getCardContent,
    iconMap,
    isLoading,
    refetch,
    goToPropertyDetail,
    incomplete_listings,
    unexported_listings,
    isNewLayout,
    handleListingNavigation
  } = useHomeContainer();

  const [showBanner, setShowBanner] = useState(true);
  const isSupervisor = UserPermission?.role_key === 'supervisor';

  const recommendedNextItems = [
    { id: 1, icon: 'airbnb', title: 'Create Staff User', subtitle: 'Assign staff to cleaning tasks' },
    { id: 2, icon: 'lockIcon', title: 'Connect Smart TT Lock', subtitle: 'Generate codes for staff & guest' },
    { id: 3, icon: 'cleaning_sanitization', title: 'Create Cleaning Schedule', subtitle: 'For property – Al Riyadh' },
    { id: 4, icon: 'direct', title: 'Manage Listings', subtitle: 'Create/Add new listings' },
  ];

  const updatesItems = [
    { id: 1, icon: 'chatBubble', title: 'Inbox', subtitle: `${UserPermission?.dashboard_counts?.unread_messages} messages` },
    { id: 2, icon: 'direct', title: 'Total Check-ins', subtitle: `${UserPermission?.dashboard_counts?.checkins_today} check-ins` },
    { id: 3, icon: 'direct', title: 'Property Tasks', subtitle: `${UserPermission?.dashboard_counts?.tasks} tasks in action` },
    { id: 4, icon: 'direct', title: 'Total Check-outs', subtitle: `${UserPermission?.dashboard_counts?.checkouts_today} check-outs` },
    { id: 5, icon: 'direct', title: 'Booking Requests', subtitle: `${UserPermission?.dashboard_counts?.reservation_requests} Pending Requests` },
    { id: 6, icon: 'direct', title: 'Analytics', subtitle: `${UserPermission?.occupancy?.last_7_days_percentage}% occupancy this week` },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        {/* Banner */}
        {showBanner && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Trial ends in <Text style={styles.bannerBold}>8 days</Text>{' '}
              <Text style={styles.bannerLink}>subscribe now</Text>
            </Text>
            <ButtonView style={styles.closeIcon} onPress={() => setShowBanner(false)}>
              <Svgicons path="cross" stroke={Colors.BLACK} width={7} height={7} />
            </ButtonView>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <GlassCard width="auto" style={styles.profilePill}>
            {user?.profile_picture ? (
              <Image source={{ uri: user.profile_picture }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderIcon}>
                <Svgicons path="imageUploadIcon" size={25} />
              </View>
            )}
            <View>
              <AppText text={`Hello ${user?.name || 'Tooba'}!`} fontSize={12} color={Colors.PINE_FOREST} />
              <AppText text="Good Morning" fontSize={14} type="SemiBold" color={Colors.BLACK} />
            </View>
          </GlassCard>

          <View style={styles.headerRight}>
            <ButtonView>
              <GlassCard width="auto" style={styles.langBtn}>
                <AppText text="العربية" fontSize={12} color={Colors.BLACK} />
              </GlassCard>
            </ButtonView>

            <ButtonView style={styles.bellBtn}>
              <Svgicons path="bell" stroke={Colors.BLACK} size={20} />
            </ButtonView>
          </View>
        </View>

        <RefreshableScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onRefresh={refetch} isLoading={isLoading}>

          {/* Conditional Layout Rendering */}
          {isNewLayout ? (
            <NewLayout
              user={user}
              recommendedNextItems={recommendedNextItems}
              updatesItems={updatesItems}
            />
          ) : (
            <OldLayout
              user={user}
              cardsData={cardsData}
              getCardContent={getCardContent}
              iconMap={iconMap}
              onConnect={onConnect}
              isSupervisor={isSupervisor}
              incomplete_listings={incomplete_listings}
              unexported_listings={unexported_listings}
              handleListingNavigation={handleListingNavigation}

            />
          )}

        </RefreshableScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  bgContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Metrics.baseMargin, paddingBottom: Metrics.verticalScale(50) },

  banner: {
    backgroundColor: '#00A68A',
    paddingVertical: Metrics.verticalScale(18),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerText: { color: 'white', fontSize: 18 },
  bannerBold: { fontWeight: 'bold' },
  bannerLink: { textDecorationLine: 'underline' },
  closeIcon: {
    position: 'absolute',
    right: 15,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: Metrics.baseMargin,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
    borderRadius: 30,
    backgroundColor: Colors.TRANSPARENT
  },
  profileImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  placeholderIcon: { width: 36, height: 36, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT
  },
  bellBtn: { padding: 5 },

  // Old Layout Styles
  greetingContainer: { marginTop: 40, marginBottom: 30 },
  greetingText: { fontSize: 28, color: '#1A1A1A', lineHeight: 38 },
  greetingName: { color: '#00A68A', fontWeight: 'bold' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardStyle: {
    minHeight: Metrics.verticalScale(140),
    justifyContent: 'space-between',
    padding: 16
  },
  cardHeader: { alignItems: 'center', flexDirection: 'row' },
  iconBox: {
    backgroundColor: Colors.TRANSPARENT,
    padding: 10,
    borderRadius: 12,
    width: Metrics.scale(41),
    height: Metrics.scale(41),
    marginBottom: 0
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Metrics.verticalScale(24),
  },
  arrowBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.TRANSPARENT,
    width: Metrics.scale(32),
    height: Metrics.scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 0
  },

  // New Layout Styles
  newGreetingContainer: { marginTop: 30, marginBottom: 25 },
  newGreetingText: { fontSize: 24, color: '#1A1A1A', lineHeight: 32 },
  newGreetingName: { color: '#00A68A', fontWeight: 'bold' },
  sectionCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  listItemIcon: {
    marginRight: 15,
    width: 24,
    alignItems: 'center'
  },
  listItemContent: {
    flex: 1,
  },

  // Common Action Card
  glassWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    position: 'relative',
  },
  iconContainerView: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginRight: 15,
  },
  messageWrapper: {
    flex: 1,
  },
  notificationIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    position: 'absolute',
    top: 14,
    right: 14,
  },
});

export default HomeScreen;