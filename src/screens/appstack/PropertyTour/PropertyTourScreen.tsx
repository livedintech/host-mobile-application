import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Image, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import usePropertyTourContainer from './PropertyTourContainer';
import Metrics from '@/utility/Metrics';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useTranslation } from 'react-i18next';

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
          onRefresh={refetch}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.scrollContent}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <GlassCard width="48%" style={styles.cardWrapper}>
              <ButtonView onPress={() => handleCardPress(item.title)}>
                <Image
                  source={
                    item.image
                      ? { uri: item.image?.split('?')[0] }
                      : require('@/assets/img/background/linearBG.png')
                  }
                  style={styles.cardImage}
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
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <AppPressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText
                text={t('app.property_tour.select_ota')}
                fontSize={20}
                type="SemiBold"
                color={Colors.PINE_FOREST}
                mb={20}
              />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.property_tour.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.property_tour.export')}
                onPress={handleOtaSubmit(handleExportSubmit)}
                mt={20}
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </AppPressable>
          </AppPressable>
        </Modal>

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
    resizeMode:   'cover',
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
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent:  'flex-end',
  },
  bottomSheet: {
    backgroundColor:     Colors.WHITE,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal:    24,
    paddingTop:           12,
    paddingBottom:        40,
  },
  handleBar: {
    width:        40,
    height:       5,
    backgroundColor: '#D4D4D4',
    borderRadius: 3,
    alignSelf:    'center',
    marginBottom: 25,
  },
});