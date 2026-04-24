import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronRight } from 'lucide-react-native';
import AppText from '@/components/molecules/AppText/AppText';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useTranslation } from 'react-i18next';

interface Props {
  onConnect: () => void;
}

const NoListings = ({ onConnect }: Props) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {/* 1. Title Above */}
      <AppText 
        text={t('app.no_listings.title')}
        type="Bold" 
        fontSize={28} 
        color={Colors.BRUNSWICK_GREEN} 
        textAlign="center"
        mb={vs(20)}
      />

      {/* 2. Info Card (Exact ListingScreen Styles) */}
      <TouchableOpacity activeOpacity={0.9} onPress={onConnect} style={{ width: '100%' }}>
        <GradientBorder borderRadius={35} style={styles.infoCardWrapper}>
          <View style={styles.infoCardInner}>
            <View style={styles.row}>
                {/* Active Dot - Positioned to the left */}
                <View style={styles.activeDot} />
                
                {/* Avatar Container */}
                <View style={styles.avatarContainer}>
                  <Image 
                    source={require('@/assets/img/img1.png')} 
                    style={styles.avatar} 
                    resizeMode="contain" 
                  />
                </View>

                {/* Text Content Area */}
                <View style={styles.contentArea}>
                  <View style={styles.headerRow}>
                    <AppText text={t('app.ali_widget.agent_name')} type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={16} />
                    <View style={styles.timeContainer}>
                        <AppText text="9:36 AM" color={Colors.NIGHT_OPACITY} fontSize={12} />
                        <ChevronRight size={ms(16)} color={Colors.NIGHT_OPACITY} style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                  
                  <AppText
                    text={t('app.ali_widget.connect_prompt')}
                    color={Colors.NIGHT_OPACITY}
                    mt={5}
                    fontSize={14}
                    lineHeight={20}
                  />
                </View>
              </View>
          </View>
       </GradientBorder>
      </TouchableOpacity>

      {/* 3. Button Beneath */}
      <View style={styles.buttonWrapper}>
        <AppButton 
					title={t('app.ali_widget.connect_account')}
					onPress={onConnect}
					backgroundColor={Colors.WHITE}
					color={Colors.BRUNSWICK_GREEN}  
					borderColor={Colors.ARGENT}      
					borderRadius={100}               
					fontSize={16}
					type="Regular"                  
					mt={vs(40)}                       
					px={s(60)}                         
					style={styles.exactButtonWidth}
					/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: s(10)
  },

  infoCardWrapper: {
    marginBottom: 33,
    width: '94%',
    alignSelf: 'center',
    marginTop: 20,
    minHeight: vs(120),
  },
	exactButtonWidth: {
    width: '85%',                   
    borderWidth: 1,             
    alignSelf: 'center',
  },
  infoCardInner: {
    padding: 20,
    borderRadius: 35,
    backgroundColor: Colors.WHITE,
    flex: 1,
    justifyContent: 'center',
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    position: 'relative' 
  },
  contentArea: { 
    flex: 1, 
    marginLeft: 15 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: Colors.BRUNSWICK_GREEN,
    position: 'absolute',
    left: s(-10),
    top: vs(15), 
  },
  avatarContainer: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    overflow: 'hidden',
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center'
  }
});

export default NoListings;