import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useSubscriptionHistoryContainer from './SubscriptionHistoryContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import Metrics from '@/utility/Metrics';

const SubscriptionHistoryScreen = () => {
  const { listings, features } = useSubscriptionHistoryContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <AppText text="Listing Cost" fontSize={24} type="Medium" color={Colors.BRUNSWICK_GREEN} mt={45} mb={15} />

        {/* Price Card */}
        <GradientBorder borderRadius={24} style={styles.cardWrapper}>
          <View style={styles.innerCard}>
            <AppText text="Monthly" fontSize={14} color={Colors.BRUNSWICK_GREEN} type="Bold" />
            <View style={styles.row}>
              <AppText text="SAR1,500.00" fontSize={26} type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <AppText text=" /per listing" fontSize={14} color={Colors.BRUNSWICK_GREEN} />
            </View>
          </View>
        </GradientBorder>

        {/* Features Grid */}
        <GradientBorder borderRadius={24} style={styles.cardWrapper}>
          <View style={[styles.innerCard, styles.featuresContainer]}>
            {features.map((item) => (
              <View key={item.id} style={styles.featureItem}>
                <Svgicons path={item.icon} size={45}/>
                <AppText text={item.label} fontSize={6} textAlign="center" color={Colors.PINE_FOREST} mt={8} type='Medium'/>
              </View>
            ))}
          </View>
        </GradientBorder>

        <AppText text="Your Listings" fontSize={24} type="Medium" color={Colors.BRUNSWICK_GREEN} mt={30} mb={15} />

        {/* Horizontal Listings */}
        <FlatList
          horizontal
          data={listings}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GradientBorder borderRadius={24} style={styles.listingItem}>
              <View style={styles.innerCard}>
                <Svgicons path='listingIcon' size={49}/>
                <AppText text={item.title} fontSize={14} color={Colors.PINE_FOREST} mt={10} />
              </View>
            </GradientBorder>
          )}
        />

        {/* Footer Actions */}
        <GradientBorder borderRadius={24} style={styles.cardWrapper}>
          <View style={[styles.innerCard, styles.renewalBox]}>
            <AppText text="Renews 26 January 2026" fontSize={18} type="Medium" color={Colors.BRUNSWICK_GREEN} />
            <AppText text="SAR 6,000" fontSize={14} color={Colors.PINE_FOREST} />
          </View>
        </GradientBorder>

        {/* Cancel Subscription */}
        <TouchableOpacity>
          <GradientBorder borderRadius={24} style={styles.cancelBtnGradient}>
            <View style={[styles.innerCard, styles.cancelBtn]}>
              <AppText text="Cancel Subscription" fontSize={22} type="Medium" color={Colors.BRUNSWICK_GREEN} />
              <GradientBorder borderRadius={16} borderWidth={1}>
                <View style={styles.arrowCircleInner}>
                  <Svgicons path='ArrowUpRightIcon'/>
                </View>
              </GradientBorder>
            </View>
          </GradientBorder>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
  innerCard: {
    borderRadius: 23,
    backgroundColor: Colors.WHITE,
    paddingVertical: Metrics.scale(16),
    justifyContent:'center',
    alignItems:'center'
  },
  featuresContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  featureItem: { alignItems: 'center', flex: 1 },

  renewalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Metrics.scale(10) },
  cancelBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },

  cardWrapper: { marginBottom: 15 },
  cancelBtnGradient: { marginTop: 15 },

  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  listingItem:{
    width: Metrics.scale(105),
    marginRight: Metrics.scale(13),
    marginBottom: Metrics.verticalScale(46)
  }
});

export default SubscriptionHistoryScreen;
