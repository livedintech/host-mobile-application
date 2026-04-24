import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';

interface NoReviewScreenProps {
  onManageListing?: () => void;
}

const NoReviewScreen = ({
  onManageListing = () => {},
}: NoReviewScreenProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Using the noReview icon/image path as requested */}
        <View style={styles.imageContainer}>
          <Svgicons path="noReview" size={250} />
        </View>

        <AppText
          text={t('app.no_review.title')}
          fontSize={28}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
          mb={vs(10)}
        />

        <AppText
          text={t('app.no_review.description')}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          textAlign="center"
          lineHeight={18}
        />
      </View>

      <AppButton
        title={t('app.no_review.manage_listing')}
        backgroundColor={Colors.PRIMARY_TEAL}
        borderColor={Colors.PRIMARY_TEAL}
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
