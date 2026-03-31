import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import usePropertyTourContainer from './PropertyTourContainer';
import Metrics from '@/utility/Metrics';

const PropertyTourScreen = () => {
  const { 
    tourData, 
    handleGoBack, 
    handleExport, 
    handleCardPress 
  } = usePropertyTourContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>
        
        <View style={styles.titleSection}>
          <AppText 
            text="Property Tour" 
            fontSize={32} 
            type="Bold" 
            color={Colors.BLACK} 
          />
          <AppText 
            text="Manage your listing photos here. Upload, organize, and update the images that will be showcased to guests on your listing." 
            fontSize={14} 
            color="#6B6B6B" 
            lineHeight={22}
            mt={12}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.gridContainer}>
            {tourData.map((item) => (
              <GlassCard key={item.id} width="48%" style={styles.cardWrapper}>
                <ButtonView onPress={() => handleCardPress(item.title)}>
                  <Image 
                    // Yahan high res filter add kar diya agar URL me query params hon
                    source={{ uri: item.image?.split('?')[0] }} 
                    style={styles.cardImage} 
                  />
                  <View style={styles.cardTextContainer}>
                    <AppText 
                      text={item.title} 
                      fontSize={16} 
                      type="SemiBold" 
                      color={Colors.BLACK} 
                    />
                    <AppText 
                      text={`${item.count} photos`} 
                      fontSize={12} 
                      color="#6B6B6B" 
                      mt={4}
                    />
                  </View>
                </ButtonView>
              </GlassCard>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Export" 
            onPress={handleExport} 
            backgroundColor="#00A68A" 
            borderColor="transparent"
            color={Colors.WHITE}
            fontSize={16}
          />
        </View>

      </View>
    </BGImage>
  );
};

export default PropertyTourScreen;

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Metrics.verticalScale(34)
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    padding: 14,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: Colors.TRANSPARENT,
    borderWidth:4
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
});