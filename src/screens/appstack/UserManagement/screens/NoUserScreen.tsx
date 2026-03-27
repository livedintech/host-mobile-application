import React from 'react';
import { StyleSheet, View } from 'react-native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';

interface NoUserScreenProps {
  onCreateUser: () => void;
}

const NoUserScreen = ({ onCreateUser }: NoUserScreenProps) => {
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Svgicons path="noUserFound" size={280} />
          
          <AppText 
            text="No User Found" 
            fontSize={28} 
            type="Bold" 
            color={Colors.BLACK} 
            style={styles.title}
          />
          
          <AppText 
            text="No users have been created in the app for this account yet. To assign tasks, you'll first need to add a user. Once a user is created, you can easily assign tasks to them."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            style={styles.description}
          />
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Create New User"
            onPress={onCreateUser}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            style={{height:50}}
            textStyle={{lineHeight:25}}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, 
  },
  title: {
    marginTop: 30,
    textAlign: 'center',
  },
  description: {
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    height: 55,
    borderRadius: 28,
  },
});

export default NoUserScreen;