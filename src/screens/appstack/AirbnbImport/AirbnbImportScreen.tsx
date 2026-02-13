import React from 'react';
import { StyleSheet, View, Pressable, FlatList } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAirbnbImportContainer from './AirbnbImportContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';
import { shortId } from '@/utility/Utils';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

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

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.infoRow}>
            <AppText text="Airbnb Property ID: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText text={shortId(id)} color={Colors.PINE_FOREST} />
          </View>

          <View style={styles.infoRow}>
            <AppText text="Airbnb Listing: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText text={name} color={Colors.PINE_FOREST} />
          </View>

          <View style={styles.infoRow}>
            <AppText text="Livedin ID: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText
              text={selectedLivedinId ? String(selectedLivedinId) : '-'}
              color={Colors.PINE_FOREST}
            />
          </View>
        </View>
        <Svgicons path="houseLineIcon" />
      </View>

      <DropdownField
        name={fieldName}
        control={control}
        errors={errors}
        label="Existing Listing:"
        data={listingOptions}
        placeholder="Select.."
      />

      <AppButton
        title="Import Listing"
        onPress={() => handleIndividualImport(fieldName)}
        mt={12}
      />
    </View>
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <GradientBorder style={styles.arrowCircleInner} borderRadius={16} borderWidth={1}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={28} />
            </Pressable>
          </GradientBorder>

          <AppButton title="Refresh" onPress={refetch} px={30} />
        </View>

        <AppText
          text="Airbnb Properties"
          fontSize={30}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          mt={20}
        />
      </View>

      {/* FlatList */}
      <FlatListSimpleHandler
        onRefresh={refetch}
        isLoading={isLoading}
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <AppButton title="Next" onPress={handleSubmit(onNext)} mt={10} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  fixedHeader: { paddingHorizontal: 22, paddingTop: 15 },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    paddingTop: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  arrowCircleInner: {
    width: Metrics.scale(36),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});

export default AirbnbImportScreen;
