import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useCreateListingStepOneLocationContainer from './CreateListingStepOneLocationContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const CreateListingStepOneLocationScreen = () => {
  const {
    region,
    searchQuery,
    setSearchQuery,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe
  } = useCreateListingStepOneLocationContainer();

  return (
    <View style={styles.container}>
      {/* Real Google Map Integration */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
      />

      {/* Static Center Marker */}
      <View style={styles.markerFixed} pointerEvents="none">
        <Svgicons path="pinLocationFillIcon" size={45} color={Colors.BRUNSWICK_GREEN} />
      </View>

      <View style={styles.overlay}>
        {/* Search Bar */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Svgicons path="pinLocationIcon" size={18} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search Location"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <ButtonView style={styles.locateMeBtn} onPress={handleLocateMe}>
            <Svgicons path="locateMeIcon" size={32} color={Colors.BRUNSWICK_GREEN} />
          </ButtonView>

          <AppButton 
            title="Confirm" 
            onPress={handleConfirm} 
            style={styles.actionBtn}
          />
          <AppButton 
            title="Set Manually" 
            onPress={handleSetManually} 
            style={[styles.actionBtn, { marginTop: 12 }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  markerFixed: {
    left: '50%',
    marginLeft: -22.5,
    marginTop: -45,
    position: 'absolute',
    top: '50%',
  },
  overlay: { flex: 1, justifyContent: 'space-between' },
  header: { padding: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, color: Colors.BLACK, fontSize: 16 },
  footer: { padding: 20, paddingBottom: 30 },
  locateMeBtn: {
    width: 45,
    height: 45,
    backgroundColor: Colors.WHITE,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 20,
    elevation: 3,
  },
  actionBtn: {
    backgroundColor: Colors.WHITE,
    borderColor: '#E0E0E0',
  }
});

export default CreateListingStepOneLocationScreen;