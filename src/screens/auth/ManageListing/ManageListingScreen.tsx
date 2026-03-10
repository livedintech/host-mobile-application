import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';

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
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  const handleNextPress = () => {
    if (localSelectedId !== null) {
      onSelect(localSelectedId);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={FIGMA_TEAL} />
      </SafeAreaView>
    );
  }

  // Define button style dynamically to avoid the 'false | Style' type error
  const getNextButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle = styles.nextBtn;
    if (!localSelectedId) {
      return [baseStyle, styles.nextBtnDisabled];
    }
    return [baseStyle];
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.mainContent}>
            
            {/* Title Section */}
            <View style={styles.headerSection}>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                How many&nbsp;
                <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>listings</AppText> do you manage?
              </AppText>
            </View>

            {/* Glassmorphism Selection Card */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <AppText text="Listing Selection" type="Bold" fontSize={22} color={Colors.BLACK} />
                <View style={styles.iconCircle}>
                  <Svgicons path="home" size={24} color={Colors.BLACK} />
                </View>
              </View>

              <View style={styles.listWrapper}>
                {listingData.map((item) => {
                  const isSelected = localSelectedId === item.id;
                  
                  return (
                    <ButtonView 
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setLocalSelectedId(item.id)}
                      style={[
                        styles.listItem, 
                        isSelected ? styles.listItemActive : {}
                      ]}
                    >
                      <View style={styles.itemContent}>
                        <View style={styles.iconWrapper}>
                          <Svgicons 
                            path={item.icon as any} 
                            size={30} 
                            color={Colors.BLACK}
                          />
                        </View>
                        <AppText 
                          text={item.label} 
                          fontSize={18} 
                          type={isSelected ? "Bold" : "Medium"} 
                          color={Colors.BLACK}
                          style={styles.itemLabel}
                        />
                      </View>
                    </ButtonView>
                  );
                })}
              </View>
            </View>

            {/* Bottom Button Section */}
            <View style={styles.bottomSec}>
              <AppButton
                title="Next"
                onPress={handleNextPress}
                disabled={localSelectedId === null || isLoading}
                backgroundColor={localSelectedId ? FIGMA_TEAL : 'rgba(255, 255, 255, 0.4)'}
                color={localSelectedId ? Colors.WHITE : 'rgba(0, 0, 0, 0.3)'}
                borderRadius={100}
                type="Bold"
                fontSize={18}
                style={getNextButtonStyle()}
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
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(30),
  },
  headerSection: {
    marginBottom: vs(35),
  },
  glassCard: {
    // backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(212, 223, 221, 0.5)',
    borderRadius: ms(32),
    padding: s(24),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(25),
  },
  iconCircle: {
    width: s(44),
    height: s(44),
    borderRadius: ms(14),
    backgroundColor: 'rgba(218, 234, 231, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,  
    
    // For Android
    elevation: 4, 

    // Subtle border to define the shape on the glass background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)', 
  },
  listWrapper: {
    gap: vs(14),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(64),
    paddingHorizontal: s(20),
    borderRadius: ms(16),
    backgroundColor: 'rgba(218, 234, 231, 0.8)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  listItemActive: {
    backgroundColor: '#FFFFFF',
    borderColor: FIGMA_TEAL,
    borderWidth: 1.8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: s(30),
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: s(12),
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(40),
  },
  nextBtn: {
    width: '100%',
    height: vs(56),
    justifyContent: 'center',
    alignItems: 'center',     
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingTop: 0,
    paddingBottom: 0,
  },
  nextBtnDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default ManageListingScreen;