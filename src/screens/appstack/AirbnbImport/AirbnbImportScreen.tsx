// AirbnbImportScreen.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAirbnbImportContainer from './AirbnbImportContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import AirbnbImportSkeleton from '@/components/Skeletons/AirbnbImportSkeleton';

const PropertyCard = ({
  id,
  name,
  listingRelations,
  isMap,
  control,
  errors,
  listingOptions,
  handleIndividualImport,
  watch,
}: any) => {
  const { t } = useTranslation();
  const fieldName = `${id}`;
  const selectedLivedinId = watch(fieldName);

  // isMap airbnb property ka field hai — isi se sab decide hoga
  // Livedin ID sirf tab display hogi jab isMap: true ho
  // const displaySelectedId = isMap && selectedLivedinId ? String(selectedLivedinId) : '-';
  const displaySelectedId = selectedLivedinId ? String(selectedLivedinId) : '-';


  // Re-import sirf tab jab listing_relations ho YA isMap: true ho
  const isMatch =
    (Array.isArray(listingRelations) && listingRelations.length > 0) ||
    Boolean(isMap);

  return (
    <GlassCard width="100%" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <AppText
            text={name}
            type="Bold"
            color={Colors.BLACK}
            fontSize={18}
            style={styles.titleText}
          />
        </View>
        <GlassCard style={styles.iconBox}>
          <Svgicons path="airbnb" size={24} />
        </GlassCard>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <AppText
            text={t('app.airbnb_import.airbnb_id')}
            type="Regular"
            color={Colors.BLACK}
            fontSize={14}
          />
          <AppText
            text={String(id)}
            type="Bold"
            color={Colors.BLACK}
            fontSize={14}
          />
        </View>

        <View style={styles.infoRow}>
          <AppText
            text={t('app.airbnb_import.livedin_id')}
            type="Regular"
            color={Colors.BLACK}
            fontSize={14}
          />
          <AppText
            text={displaySelectedId}
            type="Bold"
            color={Colors.BLACK}
            fontSize={14}
          />
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <DropdownField
          disabled={isMatch}
          name={fieldName}
          control={control}
          errors={errors}
          label={t('app.airbnb_import.existing_listing')}
          data={listingOptions}
          placeholder={t('app.airbnb_import.none')}
        />
      </View>

      <View style={styles.btnStyle}>
        <AppButton
        title={!isMatch ? t('app.airbnb_import.import_btn') : t('app.airbnb_import.reimport_btn')}
        onPress={() => handleIndividualImport(fieldName, id, isMatch)}
        color={Colors.BLACK}
        fontSize={14}
        variant='secondary'
      />
      </View>
    </GlassCard>
  );
};

const AirbnbImportScreen = () => {
  const { t } = useTranslation();
  const {
    control,
    errors,
    properties,
    handleSubmit,
    onNext,
    handleIndividualImport,
    refetch,
    watch,
    isLoading,
    isMutating,
    isRefreshing,
    listingOptions,
  } = useAirbnbImportContainer();

  const renderItem = ({ item }: any) => (
    <PropertyCard
      id={item.id}
      name={item.title}
      listingRelations={item.listing_relations}
      isMap={item.isMap}
      control={control}
      errors={errors}
      listingOptions={listingOptions}
      handleIndividualImport={handleIndividualImport}
      watch={watch}
    />
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          <AppButton
            title={t('app.airbnb_import.refresh')}
            onPress={refetch}
            variant='secondary'
            type='Regular'
            borderRadius={100}
            style={{
              paddingHorizontal: Metrics.scale(35),
              paddingVertical: Metrics.verticalScale(8),
            }}
          />
        </View>

        <View style={styles.header}>
          <AppText
            text={t('app.airbnb_import.title')}
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
            mt={20}
            mb={10}
          />
        </View>

        {isMutating || isRefreshing ? (
          <AirbnbImportSkeleton />
        ) : (
          <FlatListSimpleHandler
            onRefresh={refetch}
            isLoading={isLoading}
            renderSkeleton={() => <AirbnbImportSkeleton />}
            data={properties}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* <View style={styles.footer}>
          <AppButton
            title={t('app.airbnb_import.next')}
            onPress={handleSubmit(onNext)}
            color={Colors.WHITE}
            fontSize={16}
          />
        </View> */}
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 15,
  },
  titleText: {
    lineHeight: 24,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.baseMargin,
  },
  btnStyle:{
    width: Metrics.scale(219),
    alignSelf:'center',
  }
});

export default AirbnbImportScreen;