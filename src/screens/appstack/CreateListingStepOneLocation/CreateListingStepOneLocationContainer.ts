import { useState, useRef, useEffect } from 'react';
import { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import Toast from 'react-native-toast-message';

interface GooglePlaceDetail {
  geometry: { location: { lat: number; lng: number } };
  formatted_address: string;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyBFLqCFWozTt6lfoGyNGl95OYsceWSo8LE';

let geocodeTimer: ReturnType<typeof setTimeout> | null = null;

export default function useCreateListingStepOneLocationContainer() {

  // ── All hooks at top — never conditional ──────────────────────────────────
  const { updateListing } = useCreateListingStore();

  const mapRef        = useRef<any>(null);
  const placesRef     = useRef<any>(null);
  const isPlaceSelected = useRef(false);

  const [region, setRegion] = useState<Region>({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [currentAddress, setCurrentAddress] = useState('');
  const [isGeocoding, setIsGeocoding]       = useState(false);
  const [isLocating, setIsLocating]         = useState(false);

  useEffect(() => {
    getAddressFromCoordinates(24.7136, 46.6753);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Plain functions ───────────────────────────────────────────────────────

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      const res  = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results?.length > 0) {
        const address: string = data.results[0].formatted_address;
        setCurrentAddress(address);
        placesRef.current?.setAddressText(address);
        return address;
      }
    } catch (e) {
      console.error('Geocoding error:', e);
    } finally {
      setIsGeocoding(false);
    }
    return '';
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs your location to set the listing address.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleLocateMe = async () => {
    const ok = await requestPermission();
    if (!ok) {
      Alert.alert('Permission Denied', 'Enable location permission in Settings.');
      return;
    }
    setIsLocating(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion: Region = { latitude, longitude, latitudeDelta: 0.015, longitudeDelta: 0.0121 };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        getAddressFromCoordinates(latitude, longitude);
        setIsLocating(false);
      },
      error => {
        console.error('GPS error:', error);
        setIsLocating(false);
        Alert.alert('Error', 'Unable to get current location. Check GPS settings.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handlePlaceSelect = (details: GooglePlaceDetail) => {
    isPlaceSelected.current = true;
    const { lat, lng } = details.geometry.location;
    const newRegion: Region = { latitude: lat, longitude: lng, latitudeDelta: 0.015, longitudeDelta: 0.0121 };
    setRegion(newRegion);
    setCurrentAddress(details.formatted_address);
    placesRef.current?.setAddressText(details.formatted_address);
    mapRef.current?.animateToRegion(newRegion, 1000);
    setTimeout(() => { isPlaceSelected.current = false; }, 1500);
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    if (isPlaceSelected.current) return;
    if (geocodeTimer) clearTimeout(geocodeTimer);
    geocodeTimer = setTimeout(() => {
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }, 600);
  };

  /**
   * CONFIRM BUTTON
   * - Saves lat/lng to store
   * - Navigates to ConfirmAddress screen
   * - API call happens on ConfirmAddress screen (createListingDetailsApi)
   */
  const handleConfirm = () => {
    if (!currentAddress) {
      Toast.show({ type: 'error', text1: 'Please wait for address to resolve.' });
      return;
    }
    updateListing({
      lat: region.latitude,
      lng: region.longitude,
    });
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS);
  };

  /**
   * SET MANUALLY BUTTON
   * - Saves current lat/lng to store (best guess from current map center)
   * - Navigates to ConfirmAddress screen where user fills form fields manually
   * - API call happens on ConfirmAddress screen (createListingDetailsApi)
   */
  const handleSetManually = () => {
    updateListing({
      lat: region.latitude,
      lng: region.longitude,
    });
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS);
  };

  return {
    region,
    mapRef,
    placesRef,
    currentAddress,
    isGeocoding,
    isLocating,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe,
    handlePlaceSelect,
  };
}