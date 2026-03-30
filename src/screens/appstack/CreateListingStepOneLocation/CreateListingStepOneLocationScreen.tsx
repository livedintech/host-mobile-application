import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useCreateListingStepOneLocationContainer from './CreateListingStepOneLocationContainer';
import Metrics from '@/utility/Metrics';

const CreateListingStepOneLocationScreen = () => {
  const {
    region,
    mapRef,
    placesRef,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe,
    handlePlaceSelect,
    currentAddress,
    isGeocoding,
    isLocating,
  } = useCreateListingStepOneLocationContainer();

  return (
    <View style={styles.container}>

      {/* ── Google Map ────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      {/* ── Fixed Center Pin ──────────────────────────────────────────── */}
      <View style={styles.markerFixed} pointerEvents="none">
        <Svgicons path="pinLocationFillIcon" size={45} color={Colors.BRUNSWICK_GREEN} />
      </View>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <View style={styles.overlay}>

        {/* ── Search Bar (top) ──────────────────────────────────────── */}
        <View style={styles.header}>
          <GooglePlacesAutocomplete
            ref={placesRef}
            placeholder="Search Location"
            onPress={(_data, details = null) => {
              if (details) handlePlaceSelect(details);
            }}
            query={{
              key: 'AIzaSyBFLqCFWozTt6lfoGyNGl95OYsceWSo8LE',
              language: 'en',
              components: 'country:sa',
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            keyboardShouldPersistTaps="handled"
            textInputProps={{ placeholderTextColor: '#999' }}
            styles={{
              container: styles.autocompleteContainer,
              textInputContainer: styles.searchBar,
              textInput: styles.input,
              listView: styles.listView,
              row: styles.row,
              description: styles.description,
            }}
            renderLeftButton={() => (
              <Svgicons path="pinLocationIcon" size={24} style={styles.searchIcon} />
            )}
          />
        </View>

        {/* ── Footer (bottom) ───────────────────────────────────────── */}
        <View style={styles.footer}>

          {/* Locate Me FAB */}
          <ButtonView
            style={[styles.locateMeBtn, isLocating && styles.btnDisabled]}
            onPress={handleLocateMe}
            disabled={isLocating}
            mb={25}
          >
            {isLocating
              ? <ActivityIndicator size="small" color={Colors.BRUNSWICK_GREEN} />
              : <Svgicons path="locateMeIcon" size={32} color={Colors.BRUNSWICK_GREEN} />
            }
          </ButtonView>
          <View style={styles.footerBtn}>
            <AppButton
              variant='secondary'
              disabled={isGeocoding || isLocating}
              title="Enter Manually"
              onPress={handleConfirm}
              mb={12}
            />

            <AppButton
              disabled={isLocating}
              title="Save & Exit"
              onPress={handleSetManually}
              mb={18}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  // Pin tip points exactly at coordinate
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22.5,
    marginTop: -45,
  },

  // Transparent overlay — search bar top, footer bottom
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ── Search bar ─────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 999,
    elevation: 999,
  },
  autocompleteContainer: { flex: 0, zIndex: 1000 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_OPACITY_60,
    borderRadius: 28,
    paddingHorizontal: 14,
    height: 52,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    color: '#1a1a1a',
    fontSize: 15,
    height: 52,
    backgroundColor: 'transparent',
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 6,
    elevation: 8,
    zIndex: 1001,
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
  },
  row: { padding: 13, flexDirection: 'row', alignItems: 'center' },
  description: { fontSize: 14, color: '#333' },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    // paddingHorizontal: 20,
    // bottom: Metrics.verticalScale(150),
    // right: 0,
    // position:'absolute',
  },

  // Locate Me FAB — bottom right
  locateMeBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.PRIMARY_TEAL,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    marginRight: 20,
  },
  btnDisabled: { opacity: 0.5 },

  // Address banner — shows resolved address of current pin position
  addressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },

  // Confirm — solid primary
  confirmBtn: {
    backgroundColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 14,
    height: 52,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Set Manually — outlined secondary
  manualBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 52,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
  },
  manualBtnText: {
    color: '#444',
    fontWeight: '500',
    fontSize: 15,
  },
  footerBtn: {
    backgroundColor: '#e2e5e5',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(36)
  }
});

export default CreateListingStepOneLocationScreen;