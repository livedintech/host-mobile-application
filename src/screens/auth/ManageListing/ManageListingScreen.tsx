import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import useManageListingContainer from './ManageListingContainer';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';

const FIGMA_TEAL = '#20957B';

const ManageListingScreen = () => {
  const { onSelect, isLoading, listingData } = useManageListingContainer();
  
  // 1. Initialize as string | null to match listingData and container types
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
            <GlassCard style={styles.glassCard}>
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
            </GlassCard>

            {/* Bottom Button Section */}
            <View style={styles.bottomSec}>
              <AppButton
                title="Next"
                disabled={localSelectedId === null || isLoading}
                backgroundColor={localSelectedId !== null ? Colors.MEDIUM_JUNGLE_GREEN : 'rgba(32, 149, 123, 0.5)'}
                color={Colors.WHITE}
                borderRadius={100}
                fontSize={16}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: vs(10),
    paddingBottom: vs(15),
  },
  iconBtn: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  langBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { flexGrow: 1 },
  mainContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(20),
  },
  titleSection: {
    marginBottom: vs(40),
  },
  glassCard: {
    backgroundColor: 'rgba(212, 223, 221, 0.4)',
    borderRadius: ms(24),
    padding: s(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(24),
  },
  iconCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(12),
    backgroundColor: 'rgba(225, 235, 233, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  listWrapper: {
    gap: vs(12),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(56),
    paddingHorizontal: s(16),
    borderRadius: ms(16),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  listItemActive: {
    borderColor: FIGMA_TEAL,
    borderWidth: 1.5,
  },
  itemIconWrapper: {
    width: s(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    marginLeft: s(10),
  },
  bottomSec: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: vs(20),
    paddingTop: vs(40),
  },
});

export default ManageListingScreen;