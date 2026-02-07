import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const ReviewDetailScreen = ({ route }: any) => {
  const { reviewData } = route.params;

  // Reusable component for the specific green rating bars in the image
  const RatingBar = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.ratingBarContainer}>
      <AppText text={label} fontSize={14} color={Colors.BLACK} style={{ flex: 1 }} />
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%` }]} />
      </View>
      <AppText text={value.toFixed(1)} fontSize={14} type="Bold" ml={10} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* 1. Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual guest image
            style={styles.profileImage} 
          />
        </View>
        <View style={styles.profileInfo}>
          <AppText text="Guest Name:" fontSize={12} color={Colors.SUPER_GREY} />
          <AppText text={reviewData.guestName} fontSize={16} type="Medium" mb={8} />
          
          <AppText text="Guest Email:" fontSize={12} color={Colors.SUPER_GREY} />
          <AppText text="alimasoodahmed@gmail.com" fontSize={14} type="Medium" mb={8} />
          
          <AppText text="Guest Contact:" fontSize={12} color={Colors.SUPER_GREY} />
          <AppText text="+966 50 123 4567" fontSize={14} type="Medium" mb={8} />

          <AppText text="Guest Rating" fontSize={12} color={Colors.SUPER_GREY} />
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Svgicons key={s} path="StarIcon" size={16} fill={s <= 4 ? Colors.BOTTLE_GREEN : Colors.SMOOTH_GREY} mr={4} />
            ))}
            <AppText text="4/5" fontSize={14} ml={5} color={Colors.SUPER_GREY} />
          </View>
        </View>
      </View>

      {/* 2. AI Chat Summary */}
      <View style={styles.sectionMargin}>
        <View style={styles.iconHeading}>
          <Svgicons path="SparkleIcon" size={20} mr={8} color={Colors.BOTTLE_GREEN} />
          <AppText text="AI Chat Summary" type="Bold" fontSize={18} />
        </View>
        <AppText 
          text="The guest contacted the host to confirm early check-in availability and asked about parking details. The host confirmed that early check-in is possible from 1:00 PM at no extra cost and shared parking instructions."
          fontSize={14}
          color={Colors.SUPER_GREY}
          lineHeight={20}
          mt={10}
        />
        <View style={styles.horizontalActionRow}>
          <View style={styles.line} />
          <ButtonView style={styles.inlineButton}>
            <AppText text="View Full Chat" color={Colors.BLACK} fontSize={14} />
          </ButtonView>
          <View style={styles.line} />
        </View>
      </View>

      {/* 3. Property Details Block */}
      <View style={styles.sectionMargin}>
        <View style={styles.iconHeading}>
          <Svgicons path="HomeIcon" size={20} mr={8} />
          <AppText text="Property Details" type="Bold" fontSize={18} />
        </View>
        <View style={styles.propertyTextRow}>
          <AppText text="Property Name: " type="Bold" />
          <AppText text="Alpha House" />
        </View>
        <View style={styles.propertyTextRow}>
          <AppText text="Property Address: " type="Bold" />
          <AppText text="King Fahd Road, Al Madinah Al Munawarah, Saudi Arabia" flex={1} />
        </View>

        <GradientBorder borderRadius={12} style={styles.infoCard}>
          <View style={styles.innerInfoCard}>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}><AppText text="Booking Platform:" color={Colors.SUPER_GREY}/><AppText text={reviewData.platform} color={Colors.BITTERSWEET} type="Bold"/></View>
              <View style={styles.gridItem}><AppText text="Number of Guests:" color={Colors.SUPER_GREY}/><AppText text="3" type="Bold"/></View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}><AppText text="Number of Nights:" color={Colors.SUPER_GREY}/><AppText text="2" type="Bold"/></View>
              <View style={styles.gridItem}><AppText text="Booking Dates:" color={Colors.SUPER_GREY}/><AppText text={reviewData.date} type="Bold"/></View>
            </View>
            <View style={styles.divider} />
            <View style={styles.gridRow}>
              <View style={styles.gridItem}><AppText text="Confirmation Code:" color={Colors.SUPER_GREY}/><AppText text="001275" type="Bold"/></View>
              <View style={styles.gridItem}><AppText text="Payment Status:" color={Colors.SUPER_GREY}/><AppText text="Paid" color={Colors.BOTTLE_GREEN} type="Bold"/></View>
            </View>
          </View>
        </GradientBorder>
      </View>

      {/* 4. Guest Property Ratings (Progress Bars) */}
      <View style={styles.sectionMargin}>
        <AppText text="Guest Property Ratings" type="Bold" fontSize={18} mb={15} />
        <RatingBar label="Cleanliness" value={5.0} />
        <RatingBar label="Accuracy" value={5.0} />
        <RatingBar label="Communication" value={5.0} />
        <RatingBar label="Location" value={5.0} />
        <RatingBar label="Check-in" value={5.0} />
        <RatingBar label="Value" value={5.0} />
      </View>

      <AppButton title="Rate Your Guest" backgroundColor={Colors.WHITE} color={Colors.BLACK} outline borderColor={Colors.SMOOTH_GREY} mb={25} />

      {/* 5. Payment Breakdown */}
      <View style={styles.sectionMargin}>
        <View style={styles.iconHeading}>
          <Svgicons path="PaymentIcon" size={20} mr={8} />
          <AppText text="Payment Breakdown" type="Bold" fontSize={18} />
        </View>
        <View style={styles.paymentGrid}>
          <View style={styles.paymentBox}><AppText text="Booking Fee" fontSize={12} color={Colors.SUPER_GREY}/><AppText text="SAR 100.00" type="Bold"/></View>
          <View style={styles.paymentBox}><AppText text="Booking Cost" fontSize={12} color={Colors.SUPER_GREY}/><AppText text="SAR 2,500.00" type="Bold"/></View>
          <View style={styles.paymentBox}><AppText text="Host Share" fontSize={12} color={Colors.SUPER_GREY}/><AppText text="SAR 1,800.00" type="Bold"/></View>
          <View style={styles.paymentBox}><AppText text="Remaining Due" fontSize={12} color={Colors.SUPER_GREY}/><AppText text="SAR 0.00" type="Bold"/></View>
        </View>
      </View>

      {/* 6. Assigned Task */}
      <View style={styles.sectionMargin}>
        <View style={styles.iconHeading}>
          <Svgicons path="TaskIcon" size={20} mr={8} />
          <AppText text="Assigned Task" type="Bold" fontSize={18} />
        </View>
        <View style={styles.taskCard}>
          <AppText text="Cleaning Task" type="Bold" fontSize={16} />
          <AppText text="Status: Ongoing" color={Colors.INDIAN_RED} type="Medium" mt={4} />
          <AppText text="Description: Need to clean the apartment property along with pictures." fontSize={14} color={Colors.SUPER_GREY} mt={4} />
        </View>
      </View>

      <AppButton title="Create New Task" outline borderColor={Colors.SMOOTH_GREY} mb={50} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { padding: 20 },
  profileHeader: { flexDirection: 'row', marginBottom: 30, alignItems: 'center' },
  imageContainer: { marginRight: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 1, borderColor: Colors.BOTTLE_GREEN },
  profileInfo: { flex: 1 },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  sectionMargin: { marginBottom: 25 },
  iconHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  horizontalActionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  line: { flex: 1, height: 1, backgroundColor: Colors.ANTI_FLASH_WHITE },
  inlineButton: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: Colors.SMOOTH_GREY },
  propertyTextRow: { flexDirection: 'row', marginBottom: 5 },
  infoCard: { marginTop: 15 },
  innerInfoCard: { padding: 15, backgroundColor: Colors.WHITE },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  gridItem: { width: '48%' },
  divider: { height: 1, backgroundColor: Colors.ANTI_FLASH_WHITE, marginBottom: 15 },
  ratingBarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barBackground: { height: 6, flex: 1.5, backgroundColor: Colors.SMOOTH_GREY, borderRadius: 3, marginHorizontal: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.BOTTLE_GREEN },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  paymentBox: { width: '48%', padding: 12, backgroundColor: Colors.ANTI_FLASH_WHITE, borderRadius: 8, marginBottom: 10 },
  taskCard: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.SMOOTH_GREY, marginTop: 10 }
});

export default ReviewDetailScreen;