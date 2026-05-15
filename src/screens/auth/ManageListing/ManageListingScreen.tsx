import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import useManageListingContainer from './ManageListingContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, s, vs } from 'react-native-size-matters';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AccountDeleteModal from '@/components/molecules/AccountDeleteModal/AccoutDeleteModal';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#333333';

const ManageListingScreen = () => {
  const { t } = useTranslation();
  const { onSelect, isLoading, listingData, localSelectedId, setLocalSelectedId, refetch, showBackModal, confirmGoBack, cancelGoBack } = useManageListingContainer();

  const handleNextPress = () => {
    if (localSelectedId !== null) {
      onSelect(localSelectedId);
    }
  };

  // Helper function to pick correct icon based on label text
  const getIconForListing = (label: string = '') => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('1-3')) return 'onetothree'; // Replace with your exact SVG path name
    if (lowerLabel.includes('30+')) return 'property'; // Replace with your exact SVG path name
    return 'fourtothirty'; // Fallback icon
  };


  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <RefreshableScrollView
          isLoading={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.mainContent}>

            {/* Main Title */}
            <View style={styles.titleSection}>
              <AppText type="Regular" fontSize={32} color={Colors.BLACK} lineHeight={40}>
                {t('auth.manage_listing.title_1')}
                <AppText type="Bold" fontSize={32} color={Colors.PRIMARY_TEAL}>{t('auth.manage_listing.title_2')}</AppText>{t('auth.manage_listing.title_3')}
              </AppText>
            </View>

            {/* Glass Card & Options */}
            <GlassCard width="100%">
              <View style={styles.cardHeader}>
                <AppText text={t('auth.manage_listing.card_header')} fontSize={20} type="Medium" color={Colors.BLACK} />
                <View style={styles.iconCircle}>
                  <Svgicons path="home" size={24} />
                </View>
              </View>
              <View style={styles.listWrapper}>
                {listingData.map((item: { value?: number; label?: string }) => {
                  const isSelected = localSelectedId === item.value;

                  return (
                    <ButtonView
                      key={item.value}
                      activeOpacity={0.9}
                      style={[styles.listItem, isSelected && styles.listItemActive]}
                      onPress={() => setLocalSelectedId(item.value || null)}
                    >
                      <View style={styles.itemIconWrapper}>
                        <Svgicons
                          path={getIconForListing(item.label)}
                          size={24}
                          color={isSelected ? FIGMA_TEAL : Colors.BLACK}
                        />
                      </View>
                      <AppText
                        text={item.label}
                        fontSize={16}
                        type="Regular"
                        color={isSelected ? FIGMA_TEAL : Colors.BLACK}
                        style={styles.itemLabel}
                      />
                    </ButtonView>
                  );
                })}
              </View>
            </GlassCard>

            {/* Bottom Button Section */}
            <View style={styles.bottomSec}>
              <AppButton
                title={t('auth.manage_listing.next')}
                disabled={localSelectedId === null || isLoading}
                borderRadius={100}
                fontSize={16}
                onPress={handleNextPress}
              />
            </View>
          </View>
        </RefreshableScrollView>
      </SafeAreaView>
      <AccountDeleteModal
        isVisible={showBackModal}
        onClose={cancelGoBack}
        onConfirm={confirmGoBack}
        title={t('auth.manage_listing.exit_modal_title')}
        description={t('auth.manage_listing.exit_modal_text')}
      />
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
    borderColor: Colors.WHITE,
    borderWidth: 1.5,
    backgroundColor: Colors.WHITE
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