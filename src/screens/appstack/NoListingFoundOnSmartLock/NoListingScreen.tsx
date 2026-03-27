import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';

const NoListingScreen = () => {
  
  const handleAddListing = () => {
    // Navigate to your Add Listing flow
    // navigate(NavigationRoutes.APP_STACK.ADD_LISTING); 
  };

  const handleCreateListing = () => {
    // Navigate to your Create Listing flow
    // navigate(NavigationRoutes.APP_STACK.CREATE_LISTING);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        {/* <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => goBack()}>
            <Svgicons path="backIcon" size={20} color={Colors.BLACK} />
          </Pressable>
        </View> */}

        <View style={styles.content}>
          {/* Central Illustration */}
          <View style={styles.svgContainer}>
            <Svgicons path="noListingOnTTLock" size={Metrics.scale(260)} />
          </View>

          {/* Title */}
          <AppText
            text="No Property Found"
            fontSize={32}
            type="Bold"
            color={Colors.BLACK}
            textAlign="center"
            mb={15}
          />

          {/* Subtitle/Description */}
          <AppText
            text="Create a new listing or import one from your OTA platform to get started."
            fontSize={16}
            color={Colors.SUPER_GREY}
            textAlign="center"
            lineHeight={24}
            style={styles.subtitle}
          />
        </View>

        {/* Footer with Dual Buttons */}
        <View style={styles.footer}>
          {/* Glassy Secondary Button */}
          <ButtonView style={styles.glassButton} onPress={handleAddListing}>
            <AppText 
                text="Add New Listing" 
                fontSize={16} 
                type="Medium" 
                color={Colors.BLACK} 
            />
          </ButtonView>

          {/* Solid Teal Primary Button */}
          <AppButton
            title="Create New Listing"
            onPress={handleCreateListing}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            borderRadius={25}
            mt={Metrics.verticalScale(15)}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(10),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(60),
  },
  svgContainer: {
    marginBottom: Metrics.verticalScale(30),
  },
  subtitle: {
    paddingHorizontal: Metrics.scale(20),
  },
  footer: {
    paddingHorizontal: Metrics.scale(25),
    marginBottom: Metrics.verticalScale(40),
  },
  glassButton: {
    height: 55,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(220, 217, 217, 0.8)',
    // Subtle shadow for depth
    shadowColor: "#ededed",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  }
});

export default NoListingScreen;