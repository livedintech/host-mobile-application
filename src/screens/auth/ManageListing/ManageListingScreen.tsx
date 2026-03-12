import React from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useManageListingContainer from './ManageListingContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';

const FIGMA_TEAL = '#20957B';

const ManageListingScreen = () => {
    const { selectedListing, onSelect, isLoading,listingData, localSelectedId} = useManageListingContainer();

  const handleNextPress = () => {
    if (localSelectedId !== null) {
      // 2. Both are strings now, so this is a direct pass
      onSelect(localSelectedId);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={FIGMA_TEAL} />
        <AppText
          text="Loading listings..."
          fontSize={14}
          color={Colors.SUPER_GREY}
          style={{ marginTop: 10 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            
            {/* Title Section */}
            <View style={styles.headerSection}>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                How many{' '}
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                  listings
                </AppText>
              </AppText>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                you manage?
              </AppText>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <AppText 
                    text="How many listing do you manage?" 
                    textAlign="center" 
                    fontSize={32} 
                    color={Colors.BLACK}
                    style={styles.title}
                />

                <View style={styles.grid}>
                    {listingData.map((item:{value?:number; label?:string}) => {
                        const isSelected = selectedListing === item.value;
                        
                        return (
                            <ButtonView 
                                key={item.value}
                                activeOpacity={0.9}
                                style={[styles.card, isSelected && styles.cardActive]}
                                onPress={() => onSelect(item?.value)}
                            >
                                <Svgicons path='property' size={40}/>
                                <AppText 
                                    text={item.label} 
                                    fontSize={16} 
                                    type="Medium" 
                                    color={isSelected ? Colors.BRUNSWICK_GREEN : Colors.BLACK}
                                    style={styles.cardLabel}
                                />
                            </ButtonView>
                        );
                    })}
                </View>
            </View>

            {/* Bottom Action Button - Now handles navigation only */}
            <View style={styles.bottomSec}>
              <AppButton
                title="Next"
                disabled={localSelectedId === null || isLoading}
                backgroundColor={FIGMA_TEAL}
                color={Colors.WHITE}
                borderRadius={100}
                type="Bold"
                fontSize={18}
                onPress={handleNextPress}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(60),
  },
  headerSection: {
    marginBottom: vs(50),
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  card: {
    width: '30%', 
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: vs(15),
  },
  cardActive: {
    borderColor: FIGMA_TEAL,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  cardLabel: {
    marginTop: vs(10),
    textAlign: 'center',
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(30),
    marginTop: vs(40),
  },
});

export default ManageListingScreen;