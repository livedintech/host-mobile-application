import React from 'react';
import { StyleSheet, View } from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';
import BGImage from '@/components/molecules/BGImage/BGImage';

interface NoUserScreenProps {
  onCreateUser: () => void;
}

const NoUserScreen = ({ onCreateUser }: NoUserScreenProps) => {
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Svgicons path="noUserFound" size={320} />
        </View>

        <AppText
          text={t('app.no_user.title')}
          fontSize={28}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
          mb={vs(10)}
        />

        <AppText
          text={t('app.no_user.description')}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          textAlign="center"
          lineHeight={18}
        />
      </View>

      <AppButton
        title={t('app.no_user.create_user')}
        backgroundColor={Colors.PRIMARY_TEAL}
        borderColor={Colors.PRIMARY_TEAL}
        color={Colors.WHITE}
        borderRadius={ms(25)}
        onPress={onCreateUser}
      />
    </View>
    </BGImage>
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

export default NoUserScreen;