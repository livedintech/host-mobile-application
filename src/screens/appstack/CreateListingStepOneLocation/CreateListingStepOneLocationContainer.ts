import i18n from '@/locales/i18n/i18n';
// useCreateListingStepOneLocationContainer.ts
import { useState, useRef, useEffect } from 'react';
import { Region } from 'react-native-maps';
import Geolocation, { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface GooglePlaceDetail {
  geometry: { location: { lat: number; lng: number } };
  formatted_address: string;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface ParsedAddress {
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// ── Parse Google geocode address_components into our address fields ────────
const parseAddressComponents = (components: AddressComponent[] = []): ParsedAddress => {
  const findByType = (type: string) =>
    components.find(c => c.types.includes(type))?.long_name || '';

  const streetNumber = findByType('street_number');
  const route = findByType('route');
  const street = [streetNumber, route].filter(Boolean).join(' ');

  return {
    street,
    district: findByType('sublocality_level_1') || findByType('neighborhood') || findByType('administrative_area_level_2'),
    city: findByType('locality') || findByType('administrative_area_level_2'),
    state: findByType('administrative_area_level_1'),
    country: findByType('country'),
    postalCode: findByType('postal_code'),
  };
};

// iOS: make sure the system permission prompt is shown via requestAuthorization
// before we ever call getCurrentPosition — otherwise the first call can hang
// until the prompt is dismissed and hit the GPS timeout (error code 3).
if (Platform.OS === 'ios') {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'auto',
  });
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyBFLqCFWozTt6lfoGyNGl95OYsceWSo8LE';

const FALLBACK_REGION: Region = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

let geocodeTimer: ReturnType<typeof setTimeout> | null = null;

export default function useCreateListingStepOneLocationContainer() {
  const { updateListing } = useCreateListingStore();
  const { params } = useRoute<any>();

  // ✅ Edit mode — existing lat/lng se start karo
  const existingLat = parseFloat(params?.paramData?.listing?.lat);
  const existingLng = parseFloat(params?.paramData?.listing?.lng);
  const hasExistingLocation = !isNaN(existingLat) && !isNaN(existingLng);
  const isEdit = hasExistingLocation;

  const INITIAL_REGION: Region = hasExistingLocation
    ? {
      latitude: existingLat,
      longitude: existingLng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }
    : FALLBACK_REGION;

  const mapRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const isPlaceSelected = useRef(false);

  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [currentAddress, setCurrentAddress] = useState('');
  const [parsedAddress, setParsedAddress] = useState<ParsedAddress | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(hasExistingLocation);

  const [isInitializing, setIsInitializing] = useState(!hasExistingLocation);

  // ── Auto-fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (hasExistingLocation) {
      setHasUserLocation(true);
      getAddressFromCoordinates(existingLat, existingLng);
      setTimeout(() => {
        mapRef.current?.animateToRegion(INITIAL_REGION, 500);
      }, 300);
      return;
    }
    fetchCurrentLocationOnMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Geocoding ─────────────────────────────────────────────────────────────
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results?.length > 0) {
        const address: string = data.results[0]?.formatted_address ?? '';
        setCurrentAddress(address);
        setParsedAddress(parseAddressComponents(data.results[0]?.address_components));
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

  // ── Permission ────────────────────────────────────────────────────────────
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
    // iOS: explicitly request authorization and wait for the user's response
    // before attempting to read the location.
    return new Promise<boolean>(resolve => {
      Geolocation.requestAuthorization(
        () => resolve(true),
        () => resolve(false)
      );
    });
  };

  // ── GPS fetch with low-accuracy fallback ────────────────────────────────────
  // High-accuracy GPS fixes often time out indoors / with weak signal.
  // If that happens, retry once with network-based (low-accuracy) location.
  const getCurrentPositionWithFallback = (
    onSuccess: (position: GeolocationResponse) => void,
    onError: (error: GeolocationError) => void
  ) => {
    Geolocation.getCurrentPosition(
      onSuccess,
      error => {
        if (error.code === 1) {
          onError(error);
          return;
        }
        Geolocation.getCurrentPosition(
          onSuccess,
          onError,
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      i18n.t('app.location_step.permission_denied_title'),
      i18n.t('app.location_step.permission_denied_message'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        { text: i18n.t('common.toast.open_settings'), onPress: () => Linking.openSettings() },
      ]
    );
  };

  // ── First mount GPS fetch ─────────────────────────────────────────────────
  const fetchCurrentLocationOnMount = async () => {
    const ok = await requestPermission();
    if (!ok) {
      setIsInitializing(false);
      showPermissionDeniedAlert();
      return;
    }

    getCurrentPositionWithFallback(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };
        setRegion(newRegion);
        setHasUserLocation(true);
        getAddressFromCoordinates(latitude, longitude);
        setIsInitializing(false);
        setTimeout(() => {
          mapRef.current?.animateToRegion(newRegion, 500);
        }, 300);
      },
      error => {
        console.error('GPS error code:', error.code, error.message);
        setIsInitializing(false);
        if (error.code === 1) {
          // PERMISSION_DENIED — don't mark as located, show settings
          showPermissionDeniedAlert();
        } else {
          // Timeout / unavailable — fall back to default region but warn user
          Toast.show({
            type: 'info',
            text1: i18n.t('common.toast.approximate_location'),
            text2: i18n.t('app.location_step.approximate_location_desc'),
          });
        }
      }
    );
  };

  // ── Locate Me ─────────────────────────────────────────────────────────────
  const handleLocateMe = async () => {
    const ok = await requestPermission();
    if (!ok) {
      Alert.alert(
        i18n.t('app.location_step.permission_denied_title'),
        i18n.t('app.location_step.permission_denied_message'),
        [
          { text: i18n.t('common.cancel'), style: 'cancel' },
          { text: i18n.t('common.toast.open_settings'), onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    setIsLocating(true);
    getCurrentPositionWithFallback(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };
        setRegion(newRegion);
        setHasUserLocation(true);
        mapRef.current?.animateToRegion(newRegion, 1000);
        getAddressFromCoordinates(latitude, longitude);
        setIsLocating(false);
      },
      error => {
        console.error('GPS error:', error.code, error.message);
        setIsLocating(false);
        if (error.code === 1) {
          // PERMISSION_DENIED
          showPermissionDeniedAlert();
        } else {
          Alert.alert(i18n.t('common.toast.error'), i18n.t('app.location_step.gps_error'));
        }
      }
    );
  };

  // ── Place Select ──────────────────────────────────────────────────────────
  const handlePlaceSelect = (details: GooglePlaceDetail) => {
    isPlaceSelected.current = true;
    const { lat, lng } = details.geometry.location;
    const newRegion: Region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    setRegion(newRegion);
    setHasUserLocation(true);
    setCurrentAddress(details.formatted_address);
    placesRef.current?.setAddressText(details.formatted_address);
    mapRef.current?.animateToRegion(newRegion, 1000);
    setTimeout(() => { isPlaceSelected.current = false; }, 1500);
  };

  // ── Region Change ─────────────────────────────────────────────────────────
  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    if (isPlaceSelected.current) return;
    if (geocodeTimer) clearTimeout(geocodeTimer);
    geocodeTimer = setTimeout(() => {
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }, 600);
  };

  // ── Map parsed geocode address to listing store fields ───────────────────
  const buildParsedAddressUpdate = () => {
    if (!parsedAddress) return {};
    return {
      ...(parsedAddress.street && { street: parsedAddress.street }),
      ...(parsedAddress.postalCode && { apt: parsedAddress.postalCode }),
      ...(parsedAddress.city && { city: parsedAddress.city }),
      ...(parsedAddress.state && { state: parsedAddress.state }),
      ...(parsedAddress.district && { district: parsedAddress.district }),
      ...(parsedAddress.country && { country_name: parsedAddress.country }),
    };
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!hasUserLocation) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.location_required'),
text2: i18n.t('app.location_step.location_required_desc'),
      });
      return;
    }
    if (!currentAddress) {
      Toast.show({ type: 'error',text1: i18n.t('app.location_step.address_wait') });
      return;
    }
    updateListing({ lat: region.latitude, lng: region.longitude, ...buildParsedAddressUpdate() });

    // ✅ Edit mode mein paramData forward karo
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS, {
      paramData: params?.paramData,
    });
  };

  const handleSetManually = () => {
    if (!hasUserLocation) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.location_required'),
        text2: i18n.t('app.location_step.location_required_desc'),
      });
      return;
    }
    updateListing({ lat: region.latitude, lng: region.longitude, ...buildParsedAddressUpdate() });
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS);
  };

  return {
    region,
    mapRef,
    placesRef,
    currentAddress,
    isGeocoding,
    isLocating,
    hasUserLocation,
    isInitializing,
    isEdit, // ✅ added
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe,
    handlePlaceSelect,
  };
}