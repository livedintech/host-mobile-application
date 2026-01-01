import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAirbnbImportContainer from './AirbnbImportContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';

const AirbnbImportScreen = () => {
  const {
    control,
    errors,
    listingOptions,
    properties,
    handleSubmit,
    onNext,
    watch,
    handleIndividualImport
  } = useAirbnbImportContainer();

  const PropertyCard = ({ name, property }: any) => {
    const selectedValue = watch(name);

    // Sirf livedin id dropdown se aaye gi
    const selectedListing = listingOptions.find(
      item => item.value === selectedValue
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.infoRow}>
              <AppText text="Airbnb Property ID: " type="Bold" />
              <AppText text={property.id} />
            </View>

            <View style={styles.infoRow}>
              <AppText text="Airbnb Listing: " type="Bold" />
              <AppText text={property.title} />
            </View>

            <View style={styles.infoRow}>
              <AppText text="Livedin ID: " type="Bold" />
              <AppText text={selectedListing?.livedinId || '-'} />
            </View>
          </View>

          <Svgicons path="houseLineIcon" />
        </View>

        <DropdownField
          name={name}
          control={control}
          errors={errors}
          label="Existing Listing:"
          data={listingOptions}
          placeholder="Select.."
        />

        <AppButton
          title="Import Listing"
          onPress={() => handleIndividualImport(name)}
          mt={12}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <GradientBorder style={styles.arrowCircleInner} borderRadius={16} borderWidth={1}>
            <Pressable style={styles.arrowCircleInner} onPress={()=>goBack()}>
              <Svgicons path="arrowLeftIcon" size={28} />
            </Pressable>
          </GradientBorder>

          <AppButton title="Refresh" onPress={() => null} px={30} />
        </View>

        <AppText
          text="Airbnb Properties"
          fontSize={30}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          mt={20}
        />
      </View>

      {/* Cards */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {properties.map(item => (
          <PropertyCard
            key={item.fieldName}
            name={item.fieldName}
            property={item}
          />
        ))}

        <AppButton
          title="Next"
          onPress={handleSubmit(onNext)}
          mt={10}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  fixedHeader: { paddingHorizontal: 22, paddingTop: 15 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 20 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  arrowCircleInner: {
    width: Metrics.scale(36),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },

  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
    backgroundColor: Colors.WHITE
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  }
});

export default AirbnbImportScreen;
