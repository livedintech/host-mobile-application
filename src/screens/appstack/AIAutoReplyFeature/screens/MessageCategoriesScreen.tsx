import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import MessageCategoriesContainer from '../containers/MessageCategoriesContainer';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import NoListingScreen from '../../NoListingScreen/NoListingScreen';
import { useAuthStore } from '@/store/useAuthStore';
import MessageCategoriesSkeleton from '@/components/Skeletons/MessageCategoriesSkeleton';

const MessageCategoriesScreen = () => {
  const { t } = useTranslation();
  const {
    categories,
    toggleSwitch,
    isLoading,
    isFetching,
    refetch,
    updatingId, // <-- Grab the specific ID being updated
    navigation
  } = MessageCategoriesContainer();

          const { user } = useAuthStore();
  if (!user?.has_listing) {
    return <NoListingScreen />;
  }

  const getConfidenceColor = (value: number) => {
    if (value >= 80) return Colors.MEDIUM_SEA_GREEN;
    if (value >= 50) return Colors.GOLDEN_AMBER;
    return Colors.INDIAN_RED;
  };

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <RefreshableScrollView
        contentContainerStyle={styles.scrollContent}
        isLoading={isLoading}
        skeletonComponent={<MessageCategoriesSkeleton />}
        refreshing={isFetching}
        onRefresh={refetch}
      >
        <AppText text={t('app.categories.title')} fontSize={32} type="Bold" mb={12} />
        <AppText
          text={t('app.categories.description')}
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          lineHeight={18}
          mb={24}
        />

        {categories.map((item) => (
          <GlassCard key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <AppText text={item.category_name} fontSize={17} type="Bold" />

              <GlassCard style={styles.pencilGlassWrapper}>
                <ButtonView
                  style={styles.editIcon}
                  onPress={() =>
                    navigation.navigate(
                      NavigationRoutes.APP_STACK.CATEGORY_CUSTOM_INSTRUCTIONS,
                      { title: item.category_name , category_id: item.id}
                    )
                  }
                >
                  <Svgicons path="pencilEdit" size={18} />
                </ButtonView>
              </GlassCard>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.statsContainer}>
                <AppText
                  text={t('app.categories.confidence')}
                  fontSize={13}
                  color={Colors.BLACK}
                  type="Medium"
                >
                  <AppText
                    text={`${item.confidence}%`}
                    color={getConfidenceColor(item.confidence)}
                    fontSize={13}
                    type="Bold"
                  />
                </AppText>
                <AppText
                  text={t('app.categories.message_percentage', { percentage: item.message_percentage })}
                  fontSize={13}
                  color={Colors.BLACK}
                  mt={2}
                />
              </View>

              {/* Pass isLoading explicitly to this specific switch item */}
              <CustomSwitch
                value={item.status}
                isLoading={updatingId === item.id}
                disabled={updatingId !== null} // Disables other switches while one is updating
                onToggle={(nextValue) => toggleSwitch(item.id, nextValue)}
              />
            </View>
          </GlassCard>
        ))}
      </RefreshableScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.verticalScale(50) },
  scrollContent: { paddingHorizontal: Metrics.scale(24), paddingBottom: Metrics.verticalScale(40) },
  card: { padding: Metrics.scale(16), borderRadius: 24, marginBottom: Metrics.verticalScale(14), width: '100%' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Metrics.verticalScale(8) },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statsContainer: { flex: 1 },
  pencilGlassWrapper: { padding: 0, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.6)', width: Metrics.scale(40) },
  editIcon: { width: Metrics.scale(40), height: Metrics.scale(40), justifyContent: 'center', alignItems: 'center' },
});

export default MessageCategoriesScreen;