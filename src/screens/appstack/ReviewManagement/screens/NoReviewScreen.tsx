import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface NoReviewScreenProps {
  onManageListing?: () => void;
}

const NoReviewScreen = ({
  onManageListing = () => {},
}: NoReviewScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Using the noReview icon/image path as requested */}
        <View style={styles.imageContainer}>
          <Svgicons path="noReview" size={250} />
        </View>

        <AppText
          text="No Reviews Yet"
          fontSize={28}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
          mb={vs(10)}
        />

        <AppText
          text="Reviews will appear here once you start receiving bookings and hosting guests."
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          textAlign="center"
          lineHeight={18}
        />
      </View>

      <AppButton
        title="Manage your listing"
        backgroundColor={Colors.PRIMARY_TEAL}
        color={Colors.WHITE}
        borderRadius={ms(25)}
        onPress={onManageListing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: s(30),
    paddingBottom: vs(40),
    paddingTop: vs(40),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: vs(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoReviewScreen;
