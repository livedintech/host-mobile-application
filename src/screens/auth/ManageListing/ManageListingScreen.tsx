import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import useManageListingContainer, { listingData } from './ManageListingContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';

const FIGMA_TEAL = '#20957B';

const ManageListingScreen = () => {
  const { onSelect, isLoading } = useManageListingContainer();
  
  // 1. Initialize as string | null to match listingData and container types
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

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

            {/* Selection Grid */}
            <View style={styles.grid}>
              {listingData.map((item) => {
                // 3. Types match: string | null === string
                const isSelected = localSelectedId === item.id;
                
                return (
                  <ButtonView 
                    key={item.id}
                    activeOpacity={0.9}
                    // 4. Passing string to string state - No more ts(2345)
                    onPress={() => setLocalSelectedId(item.id)}
                    style={[styles.card, isSelected && styles.cardActive]}
                    disabled={!item?.isEnable}
                  >
                    <Svgicons 
                      path='property' 
                      size={40} 
                      color={isSelected ? FIGMA_TEAL : Colors.BLACK}
                    />
                    <AppText 
                      text={item.label} 
                      fontSize={16} 
                      type={isSelected ? "Bold" : "Medium"} 
                      color={isSelected ? FIGMA_TEAL : Colors.BLACK}
                      style={styles.cardLabel}
                    />
                  </ButtonView>
                );
              })}
            </View>

            {/* Bottom Action Button - Now handles navigation only */}
            <View style={styles.bottomSec}>
              <AppButton
                title="Next"
                onPress={handleNextPress}
                disabled={localSelectedId === null || isLoading}
                backgroundColor={FIGMA_TEAL}
                color={Colors.WHITE}
                borderRadius={100}
                type="Bold"
                fontSize={18}
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