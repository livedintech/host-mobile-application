import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppImage from '@/components/atoms/AppImage/AppImage';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import usePropertyTourContainer from './PropertyTourContainer';
import Metrics from '@/utility/Metrics';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';
import PropertyTourSkeleton from '@/components/Skeletons/PropertyTourSkeleton';

const PropertyTourScreen = () => {
  const {
    tourData,
    handleExport,
    handleExportSubmit,
    handleCardPress,
    isFetching,
    refetch,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  } = usePropertyTourContainer();
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        <View style={styles.titleSection}>
          <AppText text={t('app.property_tour.title')} fontSize={28} type="Bold" color={Colors.BLACK} />
          <AppText
            text={t('app.property_tour.description')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={12}
          />
        </View>

        <FlatListSimpleHandler
          data={tourData}
          isLoading={isFetching}
          renderSkeleton={() => <PropertyTourSkeleton />}
          onRefresh={refetch}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.scrollContent}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <GlassCard width="48%" style={styles.cardWrapper}>
              <ButtonView onPress={() => handleCardPress(item.title)}>
                <AppImage
                  source={
                    item.image
                      ? { uri: item.image?.split('?')[0] }
                      : require('@/assets/img/background/linearBG.png')
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardTextContainer}>
                  <AppText text={item.title} fontSize={16} type="SemiBold" color={Colors.BLACK} />
                  <AppText text={`${item.count} photos`} fontSize={12} color="#6B6B6B" mt={4} />
                </View>
              </ButtonView>
            </GlassCard>
          )}
        />

        <View style={styles.footer}>
          <AppButton
            title={t('app.property_tour.export')}
            onPress={handleExport}
            backgroundColor="#00A68A"
            borderColor="transparent"
            color={Colors.WHITE}
            fontSize={16}
          />
        </View>

        {/* ✅ Export Modal — same as PropertyDetailScreen */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.property_tour.select_ota')}
          placeholder={t('app.property_tour.select_account')}
          buttonText={t('app.property_tour.export')}
          otaControl={otaControl}
          otaErrors={otaErrors}
          handleOtaSubmit={handleOtaSubmit}
          handleExportSubmit={handleExportSubmit}
          listingOptions={listingOptions}
          isPending={isPendingExporting}
        />

      </View>
    </BGImage>
  );
};

export default PropertyTourScreen;

const styles = StyleSheet.create({
  bgContainer:   { flex: 1 },
  container:     { flex: 1, marginTop: Metrics.verticalScale(34) },
  titleSection:  { paddingHorizontal: 20, marginBottom: 25 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  cardWrapper: {
    padding:         14,
    borderRadius:    24,
    marginBottom:    16,
    backgroundColor: Colors.TRANSPARENT,
    borderWidth:     1,
  },
  cardImage: {
    width:        '100%',
    height:       130,
    borderRadius: 16,
  },
  cardTextContainer: {
    marginTop:      12,
    marginBottom:   4,
    paddingHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom:     30,
    paddingTop:        10,
  },
});