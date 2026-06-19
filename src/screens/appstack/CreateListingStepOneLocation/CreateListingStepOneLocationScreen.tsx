// CreateListingStepOneLocationScreen.tsx
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useCreateListingStepOneLocationContainer from './CreateListingStepOneLocationContainer';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import CreateListingStepOneLocationSkeleton from '@/components/Skeletons/CreateListingStepOneLocationSkeleton';

const CreateListingStepOneLocationScreen = () => {
  const { t } = useTranslation();
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
    hasUserLocation,
    isInitializing,
    isEdit, // ✅ added
  } = useCreateListingStepOneLocationContainer();

  // ── First-mount full screen loader ─────────────────────────────────────────
  if (isInitializing) {
    return <CreateListingStepOneLocationSkeleton />;
  }

  return (
    <View style={styles.container}>

      {/* ── Google Map ────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
       provider={ Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE }
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onUserLocationChange={() => {}}
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
            placeholder={t('app.location_step.search_placeholder')}
            onPress={(_data, details = null) => {
              if (details) handlePlaceSelect(details);
            }}
            query={{
              key: 'AIzaSyBFLqCFWozTt6lfoGyNGl95OYsceWSo8LE',
              language: 'en',
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
              ? <ActivityIndicator size="small" color={Colors.MEDIUM_JUNGLE_GREEN} />
              : <Svgicons path="locateMeIcon" size={32} color={Colors.BRUNSWICK_GREEN} />
            }
          </ButtonView>

          <View style={styles.footerBtn}>
            <AppButton
              disabled={isGeocoding || isLocating || !hasUserLocation}
              title={t('app.location_step.enter_manually')}
              onPress={handleConfirm}
              mb={12}
              variant={!isEdit ? 'secondary' : 'primary'}
            />

            {/* ✅ Save & Exit sirf create mode mein */}
            {!isEdit && (
              <AppButton
                disabled={isGeocoding || isLocating || !hasUserLocation}
                title={t('app.location_step.save_exit')}
                onPress={handleSetManually}
                mb={18}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 14,
    fontSize: 15,
    color: Colors.BRUNSWICK_GREEN,
    fontWeight: '500',
  },

  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22.5,
    marginTop: -45,
  },

  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },

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

  footer: {},

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

  footerBtn: {
    backgroundColor: '#e2e5e5',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(36),
  },
});

export default CreateListingStepOneLocationScreen;