import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useHomeContainer from './HomeContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useAuthStore } from '@/store/useAuthStore';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const HomeScreen = () => {
  const { user } = useAuthStore();
  const { onConnect, UserPermission } = useHomeContainer();
  const [showBanner, setShowBanner] = useState(true);

  const isSupervisor = UserPermission?.role_key === 'supervisor';

  const cardsData = [
    { id: 'Airbnb', title: 'Connect Airbnb', desc: 'Import listings from Airbnb', icon: 'airbnb' },
    { id: 'Gathern', title: 'Connect Gathern', desc: 'Import listings from Gathern', icon: 'gathern' },
    { id: 'Booking', title: 'Connect Booking.com', desc: 'Import listings from Booking.com', icon: 'bookingCom' },
    { id: 'Manual', title: 'Create Listing', desc: 'Add a new listing manually', icon: 'direct' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container} >
        {/* Top Trial Banner */}
        {showBanner && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Trial ends in <Text style={styles.bannerBold}>8 days</Text> <Text style={styles.bannerLink}>subscribe now</Text>
            </Text>
            <ButtonView style={styles.closeIcon} onPress={() => setShowBanner(false)}>
              <Svgicons path="cross" stroke={Colors.BLACK} width={7} height={7} />
            </ButtonView>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header Section */}
          <View style={styles.header}>

            {/* Profile Pill using GlassCard */}
            <GlassCard width="auto" style={styles.profilePill} >
              {user?.profile_picture ? (
                <Image
                  source={{ uri: user.profile_picture }}
                  style={styles.profileImage}
                />
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

            {/* Right Actions */}
            <View style={styles.headerRight}>

              {/* Language Button using GlassCard */}
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

          {/* Greeting Text */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hi <Text style={styles.greetingName}>{user?.name || 'Tooba'},</Text> let’s begin setting up everything you need!
            </Text>
          </View>

          {/* Cards Grid */}
          <View style={styles.gridContainer}>
            {cardsData.map((card) => (
              <GlassCard key={card.id} width="49%" style={styles.cardStyle}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => onConnect(card.id)}
                  disabled={isSupervisor}
                >
                  <View style={styles.cardHeader}>
                    <GlassCard style={styles.iconBox}>
                      <Svgicons path={card.icon} />
                    </GlassCard>
                    <AppText ml={6} text={card.title} fontSize={10} type="Medium" color={Colors.BLACK} />
                  </View>
                  <View style={styles.cardFooter}>
                    <AppText text={card.desc} fontSize={11} type='Medium' color={Colors.BLACK} style={{ flex: 1, marginRight: 10 }} />
                    <GlassCard style={styles.arrowBtn}>
                      <Svgicons path="arrowRightIcon" stroke={Colors.BLACK} width={14} height={14} />
                    </GlassCard>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>

        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  bgContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // Banner Styles
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

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  // Profile Pill overrides GlassCard defaults
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,        // Override GlassCard padding
    paddingHorizontal: 12,     // Override GlassCard padding
    marginBottom: 0,           // Override GlassCard marginBottom
    borderRadius: 30,          // Complete pill shape
    backgroundColor: Colors.TRANSPARENT
  },
  profileImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  placeholderIcon: { width: 36, height: 36, marginRight: 10, justifyContent: 'center', alignItems: 'center' },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Lang Btn overrides GlassCard defaults
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 0,           // Override GlassCard marginBottom
    borderRadius: 20,          // Pill shape
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT
  },
  bellBtn: { padding: 5 },

  // Greeting Styles
  greetingContainer: { marginTop: 40, marginBottom: 30 },
  greetingText: { fontSize: 28, color: '#1A1A1A', lineHeight: 38 },
  greetingName: { color: '#00A68A', fontWeight: 'bold' },

  // Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  }
});

export default HomeScreen;