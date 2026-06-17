import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useGathernImportContainer from './GathernImportContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack } from '@/services/navigationService';
import InputField from '@/components/molecules/Input/InputField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import GathernImportSkeleton from '@/components/Skeletons/GathernImportSkeleton';

const { width } = Dimensions.get('window');

const PropertyCard = ({
  id,
  name,
  control,
  errors,
  listingOptions,
  handleIndividualImport,
  watch,
  isMap,
  rate,
  availability,
  setValue, // ✅ ADDED
}: any) => {
  const { t } = useTranslation();
  const fieldName = `${id}`;
  const selectedLivedinId = watch(fieldName);
  const showRateInput = !selectedLivedinId;
  const rateFieldName = `${fieldName}_rate`;
  const rateValue = watch(rateFieldName);

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
        <View style={styles.iconBox}>
          {/* Using 'gathern' icon to match channel styling, or fallback to 'houseLineIcon' */}
          <Svgicons path="gathern" size={24} />
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <AppText text={t('app.gathern_import.gathern_id')} type="Regular" color={Colors.BLACK} fontSize={14} />
          <AppText text={String(id)} type="Bold" color={Colors.BLACK} fontSize={14} />
        </View>

        <View style={styles.infoRow}>
          <AppText text={t('app.gathern_import.livedin_id')} type="Regular" color={Colors.BLACK} fontSize={14} />
          <AppText
            text={selectedLivedinId ? String(selectedLivedinId) : '-'}
            type="Bold"
            color={Colors.BLACK}
            fontSize={14}
          />
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <DropdownField
          name={fieldName}
          control={control}
          errors={errors}
          label={t('app.gathern_import.existing_listing')}
          data={listingOptions}
          placeholder={t('app.gathern_import.select_placeholder')}
        />
      </View>

      {showRateInput && (
        <View style={styles.dropdownContainer}>
          <InputField
            name={rateFieldName}
            control={control}
            errors={errors}
            label={t('app.gathern_import.rate_label')}
            placeholder={t('app.gathern_import.rate_placeholder')}
            keyboardType="numeric"
          />
        </View>
      )}

      <AppButton
        title={isMap ? t('app.gathern_import.unmap_btn') : t('app.gathern_import.map_btn')}
        onPress={() =>
          handleIndividualImport(
            fieldName,
            name,
            rateValue,
            availability // ✅ FIXED
          )
        }
        backgroundColor="rgba(255, 255, 255, 0.4)"
        borderColor="rgba(255, 255, 255, 0.9)"
        color={Colors.BLACK}
        fontSize={16}
        variant="secondary"
      />
    </GlassCard>
  );
};

const GathernImportScreen = () => {
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
    setValue,
    listingOptions,

  } = useGathernImportContainer();

  const renderItem = ({ item }: any) => (
    <PropertyCard
      id={item.listing_id}
      name={item.title}
      control={control}
      errors={errors}
      listingOptions={listingOptions}
      handleIndividualImport={handleIndividualImport}
      watch={watch}
      isMap={item?.isMap}
      rate={item?.rate}
      availability={item?.availability}
      setValue={setValue} 
    />
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
         <ButtonView onPress={() => goBack()}>
                    <Svgicons path="back" size={40} />
                  </ButtonView>
          <AppButton title='Refresh' onPress={refetch} variant='secondary' type='Regular' borderRadius={100} style={{
            paddingHorizontal: Metrics.scale(35),
            paddingVertical: Metrics.verticalScale(8)
          }}/>
        </View>

        <View style={styles.header}>
          <AppText
            text={t('app.gathern_import.title')}
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
            mt={20}
            mb={10}
          />
        </View>

        {isLoading ? (
          <GathernImportSkeleton />
        ) : (
          <FlatListSimpleHandler
            onRefresh={refetch}
            isLoading={false}
            data={properties}
            keyExtractor={(item: any) => item.listing_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <View style={styles.footer}>
          <AppButton
            title={t('app.gathern_import.next')}
            onPress={handleSubmit(onNext)}
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
      backBtnWrapper: { width: 32, height: 32, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },

});

export default GathernImportScreen;