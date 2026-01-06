import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Image, SafeAreaView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useManageListingContainer from './ManageListingContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const ManageListingScreen = () => {
  const { listings, onCreateNew, onCreateNewListing,goToPropertyDetail } = useManageListingContainer();

  const PropertyCard = ({ item }: any) => (
  <GradientBorder borderRadius={16} style={styles.cardWrapper}>
    <View style={styles.cardInner}>
      <Image source={item.image} style={styles.propertyImg} />
      
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <AppText text="Property Name: " type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={14} />
          <AppText text={item.name} color={Colors.PINE_FOREST} fontSize={14} />
        </View>
        
        <View style={styles.infoRow}>
          <AppText text="Property ID: " type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={14} />
          <AppText text={item.id} color={Colors.PINE_FOREST} fontSize={14} />
        </View>

        <View style={styles.addressSection}>
          <AppText text="Address:" type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={14} />
          <AppText text={item.address} color={Colors.PINE_FOREST} fontSize={14} mt={2} />
        </View>
      </View>

      {/* Arrow */}
      <GradientBorder borderRadius={20} borderWidth={1} style={styles.arrowCircle}>
        <Pressable style={styles.arrowCircle} onPress={goToPropertyDetail}>
          <Svgicons path="arrowRightIcon" size={22} />
        </Pressable>
      </GradientBorder>
    </View>
  </GradientBorder>
);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppText 
          text="Manage Your Listings" 
          fontSize={30} 
          type="Bold" 
          color={Colors.BRUNSWICK_GREEN} 
          textAlign="center" 
          mb={30} 
        />

        {listings.map((item) => (
          <PropertyCard key={item.id} item={item} />
        ))}

        <View style={styles.footer}>
          <AppButton 
            title="Create New Listing" 
            onPress={onCreateNew} 
            mt={20} 
          />
          <AppButton 
            title="Add New Listing" 
            onPress={onCreateNewListing} 
            mt={15} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  cardWrapper: {
    marginBottom: 20,
  },
  cardInner: { 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 16, 
    backgroundColor: Colors.WHITE,
    alignItems: 'center'
  },
  propertyImg: { 
    width: 90, 
    height: 90, 
    borderRadius: 12
  },
  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  addressSection: { marginTop: 4 },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },

  footer: { marginTop: 10, paddingBottom: 20 }
});


export default ManageListingScreen;