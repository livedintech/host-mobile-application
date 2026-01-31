import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useCreateListingStepOneLocationContainer from './CreateListingStepOneLocationContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const CreateListingStepOneLocationScreen = () => {
  const {
    region,
    mapRef,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe,
    handlePlaceSelect,
    currentAddress,
    placesRef,
    isLoading
  } = useCreateListingStepOneLocationContainer();

  return (
    <View style={styles.container}>
      {/* Real Google Map Integration */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      {/* Static Center Marker */}
      <View style={styles.markerFixed} pointerEvents="none">
        <Svgicons path="pinLocationFillIcon" size={45} color={Colors.BRUNSWICK_GREEN} />
      </View>

      <View style={styles.overlay}>
        {/* Google Places Autocomplete Search Bar */}
        <View style={styles.header}>
          <GooglePlacesAutocomplete
            placeholder="Search Location"
            onPress={(data, details = null) => {
              if (details) {
                handlePlaceSelect(details);
              }
            }}
            query={{
              key: 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao', 
              language: 'en',
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            styles={{
              container: styles.autocompleteContainer,
              textInputContainer: styles.searchBar,
              textInput: styles.input,
              listView: styles.listView,
              row: styles.row,
              description: styles.description,
            }}
            renderLeftButton={() => (
              <Svgicons
                path="pinLocationIcon"
                size={18}
                style={styles.searchIcon}
              />
            )}
            textInputProps={{
              placeholderTextColor: '#999',
            }}
          />
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <ButtonView style={styles.locateMeBtn} onPress={handleLocateMe}>
            <Svgicons path="locateMeIcon" size={32} color={Colors.BRUNSWICK_GREEN} />
          </ButtonView>

          <AppButton
            loading={isLoading}
            title="Confirm"
            onPress={handleConfirm}
            style={styles.actionBtn}
          />
          <AppButton
            disabled={isLoading}
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
  header: {
    padding: 20,
    zIndex: 999,
    elevation: 999,
  },
  autocompleteContainer: {
    flex: 0,
    zIndex: 1000,
  },
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
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.BLACK,
    fontSize: 16,
    height: 50,
  },
  listView: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
    zIndex: 1001,
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  description: {
    fontSize: 14,
    color: Colors.BLACK,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
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