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

const AmenitiesScreen = () => {
  const { amenitiesList, selectedAmenities, toggleAmenity, onNext, isLoading } = useAmenitiesContainer();

  const renderAmenity = ({ item }) => {
    const isSelected = selectedAmenities.includes(item.key);
    return (
      <Pressable 
        onPress={() => toggleAmenity(item.key)}
        style={[styles.card, isSelected && styles.selectedCard]}>
        <View style={styles.iconContainer}>
          {/* <Svgicons path={item.key} size={30} color={isSelected ? Colors.ADRIANA : Colors.BLACK} /> */}
        </View>
        <AppText 
          text={item.name || 'Name Here'} 
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
            <Pressable onPress={() => goBack()}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={30} size={48} strokeWidth={4} />
        </View>

        <View style={styles.content}>
          <AppText text="Tell guest what your property has to offer" fontSize={26} type="Bold" />
          <AppText 
            text="You can add/remove amenities after you publish your listing." 
            fontSize={14} color="#6B6B6B" mt={10} mb={20} 
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

        {/* Fixed Footer Buttons */}
        <View style={styles.footer}>
          <AppButton title="Next" onPress={onNext} loading={isLoading} variant='secondary' />
          <AppButton title="Save & Exit" mt={15} onPress={() => {}} />
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
    alignItems: 'center' 
  },
  backBtn: { 
    width: 32, 
    height: 32, 
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
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
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  iconContainer: { height: 40, justifyContent: 'center' },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingBottom: 35
  },
});

export default AmenitiesScreen;