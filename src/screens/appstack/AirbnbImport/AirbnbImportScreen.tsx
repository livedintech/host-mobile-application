import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAirbnbImportContainer from './AirbnbImportContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import SpinnerLoader from '@/components/molecules/SmallLoader';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';

const PropertyCard = ({
  id,
  name,
  control,
  errors,
  listingOptions,
  handleIndividualImport,
  watch,
}: any) => {
  const fieldName = `${id}`;
  const selectedLivedinId = watch(fieldName);
  const isMatch = String(selectedLivedinId) === String(id);

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
          <AppText text="Airbnb ID:  " type="Regular" color={Colors.BLACK} fontSize={14} />
          <AppText text={String(id)} type="Bold" color={Colors.BLACK} fontSize={14} />
        </View>

        <View style={styles.infoRow}>
          <AppText text="Livedin ID:  " type="Regular" color={Colors.BLACK} fontSize={14} />
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
          disabled={isMatch}
          name={fieldName}
          control={control}
          errors={errors}
          label="Existing Listing:"
          data={listingOptions}
          placeholder="None"
        />
      </View>

      <AppButton
        title={!isMatch ? 'Import' : 'Re-import'}
        onPress={() => handleIndividualImport(fieldName, id, isMatch)}
        backgroundColor="rgba(255, 255, 255, 0.4)"
        borderColor="rgba(255, 255, 255, 0.9)"
        color={Colors.BLACK}
        fontSize={16}
        variant='secondary'
      />
    </GlassCard>
  );
};

const AirbnbImportScreen = () => {
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
    listingOptions,
  } = useAirbnbImportContainer();

  const renderItem = ({ item }: any) => (
    <PropertyCard
      id={item.id}
      name={item.title}
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
        {isLoading && (
          <View style={styles.loaderContainer}>
            <SpinnerLoader />
          </View>
        )}
        {/* <HeaderApp isGoBack /> */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
            <ButtonView style={styles.backBtnWrapper} onPress={() => goBack()}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </ButtonView>
          </GradientBorder>
          <AppButton title='Refresh' onPress={refetch} variant='secondary' type='Regular' borderRadius={100} style={{
            paddingHorizontal: Metrics.scale(35),
            paddingVertical: Metrics.verticalScale(8)
          }}/>
        </View>

        <View style={styles.header}>
          <AppText
            text="Airbnb Properties"
            fontSize={28}
            type="Bold"
            color={Colors.BLACK}
            mt={20}
            mb={10}
          />
        </View>

        <FlatListSimpleHandler
          onRefresh={refetch}
          isLoading={false}
          data={properties}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.footer}>
          <AppButton
            title="Next"
            onPress={handleSubmit(onNext)}
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
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
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

export default AirbnbImportScreen;