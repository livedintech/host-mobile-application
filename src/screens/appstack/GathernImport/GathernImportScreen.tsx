import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';
import useGathernImportContainer from './GathernImportContainer';

const GathernImportScreen = () => {
  const {
    control,
    errors,
    listingOptions,
    properties,
    handleSubmit,
    onNext,
    watch,
    handleIndividualImport
  } = useGathernImportContainer();

  const PropertyCard = ({ property }: any) => {
    const listingFieldName = `${property.fieldBase}_listing`;
    const icalFieldName = `${property.fieldBase}_ical`;
    const selectedListing = listingOptions.find(item => item.value === watch(listingFieldName as any));

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.infoRow}>
              <AppText text="Gathern Property ID: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <AppText text={property.id} color={Colors.PINE_FOREST} />
            </View>
            <View style={styles.infoRow}>
              <AppText text="Gathern Listing: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <AppText text={property.title} color={Colors.PINE_FOREST} />
            </View>
            <View style={styles.infoRow}>
              <AppText text="Livedin ID: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <AppText text={selectedListing?.livedinId || '-'} color={Colors.PINE_FOREST} />
            </View>
          </View>
          <Svgicons path="houseLineIcon" />
        </View>

        <DropdownField
          name={listingFieldName}
          control={control}
          errors={errors}
          label="Existing Listing:"
          data={listingOptions}
        />

        <View style={styles.inputSection}>
          <AppText text="iCal Link:" type="Bold" color={Colors.BRUNSWICK_GREEN} mb={8} />
          <Controller
            control={control}
            name={icalFieldName as any}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                placeholder="Enter link..."
                placeholderTextColor={Colors.MIDNIGHT}
              />
            )}
          />
        </View>

        <AppButton
          title={selectedListing ? "Re-import Listing" : "Import Listing"}
          onPress={() => handleIndividualImport(property.fieldBase)}
          mt={20}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <GradientBorder style={styles.arrowCircleInner} borderRadius={16} borderWidth={1}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={28} />
            </Pressable>
          </GradientBorder>
          <AppButton title="Refresh" onPress={() => null} px={30} />
        </View>
        <AppText text="Gathern Properties" fontSize={30} type="Bold" color={Colors.BRUNSWICK_GREEN} mt={20} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {properties.map(item => <PropertyCard key={item.fieldBase} property={item} />)}
        <AppButton title="Next" onPress={handleSubmit(onNext)} mt={10} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  fixedHeader: { paddingHorizontal: 22, paddingTop: 15 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrowCircleInner: { width: Metrics.scale(36), height: Metrics.scale(36), borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EBEBEB', marginBottom: 20, backgroundColor: Colors.WHITE },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  infoRow: { flexDirection: 'row', marginBottom: 8 },
  inputSection: { marginTop: 10 },
  textInput: { height: 52, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 12, paddingHorizontal: 15, color: Colors.PINE_FOREST, fontSize: 14 }
});

export default GathernImportScreen;