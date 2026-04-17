import React from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAmenitiesContainer from './AmenitiesContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';

// ✅ API key → available SVG icon mapping
const AMENITY_ICON_MAP: Record<string, string> = {
  // Direct matches
  ac: 'airConditioner',
  pool: 'pool',
  tv: 'tv',
  oven: 'oven',
  gym: 'gymEquipment',
  washer: 'washingMachine',
  wireless_internet: 'wifi',
  fire_extinguisher: 'fireExtinguisher',
  smoke_detector: 'smokeDetector',
  first_aid_kit: 'medicalBag',

  // Close matches / grouped
  free_parking: 'parkingSign',
  paid_parking: 'parkingSign',
  laptop_friendly_workspace: 'workspace',
  alfresco_dining: 'outdoorDining',
  outdoor_seating: 'outdoorDining',
  patio_or_belcony: 'outdoorDining',
  dining_table: 'outdoorDining',
  breakfast: 'chickenGrilledStream',
  cooking_basics: 'chickenGrilledStream',
  kitchen: 'chickenGrilledStream',
  kitchenette: 'chickenGrilledStream',
  coffee_maker: 'chickenGrilledStream',
  coffee: 'chickenGrilledStream',
  hot_water_kettle: 'chickenGrilledStream',
  microwave: 'chickenGrilledStream',
  stove: 'chickenGrilledStream',
  blender: 'chickenGrilledStream',
  bread_maker: 'chickenGrilledStream',
  refrigerator: 'chickenGrilledStream',
  dishes_and_silverware: 'chickenGrilledStream',
  wine_glasses: 'chickenGrilledStream',
  hot_water: 'hotTub',
};

// ✅ Fallback icon (jab koi mapping na mile)
const DEFAULT_ICON = 'heartIcon';

const AmenitiesScreen = () => {
  const {
    amenitiesList,
    selectedAmenities,
    toggleAmenity,
    onNext,
    isLoading,
    onSaveExit,
    isEdit,
  } = useAmenitiesContainer();

  const renderAmenity = ({ item }: any) => {
    const isSelected = selectedAmenities.includes(item.key);
    const iconPath = AMENITY_ICON_MAP[item.key] || DEFAULT_ICON; // ✅ mapping ya default

    return (
      <Pressable
        onPress={() => toggleAmenity(item.key)}
        style={[styles.card, isSelected && styles.selectedCard]}
      >
        <View style={styles.iconContainer}>
          <Svgicons
            path={iconPath}
            size={30}
            color={isSelected ? Colors.EMERALD_TEAL : Colors.BLACK}
          />
        </View>
        <AppText
          text={item.label || 'Name Here'}
          fontSize={12}
          type="Medium"
          textAlign="center"
          mt={8}
        />
      </Pressable>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtn}>
            <Pressable style={styles.backBtn} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          {!isEdit && <CircularProgress percentage={30} size={48} strokeWidth={4} />}
        </View>

        <View style={styles.content}>
          <AppText
            text="Tell guest what your property has to offer"
            fontSize={26}
            type="Bold"
          />
          <AppText
            text="You can add/remove amenities after you publish your listing."
            fontSize={14}
            color="#6B6B6B"
            mt={10}
            mb={20}
          />

          <FlatList
            data={amenitiesList}
            renderItem={renderAmenity}
            keyExtractor={(item) => item.key}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 160 }}
          />
        </View>


        <View style={styles.footer}>
          {!isEdit && (
            <AppButton
              title="Next"
              onPress={onNext}
              loading={isLoading}
              disabled={isLoading || selectedAmenities.length === 0}
              variant="secondary"
              backgroundColor={Colors.WHITE}
            />
          )}
          <AppButton
            title="Save & Exit"
            mt={!isEdit ? 15 : 0}
            onPress={onSaveExit}
            loading={false}
            disabled={isLoading || selectedAmenities.length === 0}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 10,
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, paddingHorizontal: 25, marginTop: 20 },
  row: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectedCard: {
    borderColor: Colors.WHITE,
    backgroundColor: Colors.WHITE,
  },
  iconContainer: { height: 40, justifyContent: 'center' },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    paddingBottom: 35,
  },
});

export default AmenitiesScreen;