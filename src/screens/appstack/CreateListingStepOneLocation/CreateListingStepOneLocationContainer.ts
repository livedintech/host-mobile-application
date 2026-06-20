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
  countryCode: string;
  postalCode: string;
}

// ── Parse Google geocode address_components into our address fields ────────
const parseAddressComponents = (components: AddressComponent[] = []): ParsedAddress => {
  const findByType = (type: string) =>
    components.find(c => c.types.includes(type))?.long_name || '';
  const findShortByType = (type: string) =>
    components.find(c => c.types.includes(type))?.short_name || '';

  const streetNumber = findByType('street_number');
  const route = findByType('route');
  const street = [streetNumber, route].filter(Boolean).join(' ');

  return {
    street,
    district: findByType('sublocality_level_1') || findByType('neighborhood') || findByType('administrative_area_level_2'),
    city: findByType('locality') || findByType('administrative_area_level_2'),
    state: findByType('administrative_area_level_1'),
    country: findByType('country'),
    // ISO country code (e.g. "SA") — far more reliable to match against the
    // backend's country list than fuzzy-matching localized country names.
    countryCode: findShortByType('country'),
    postalCode: findByType('postal_code'),
  };
};

// fetch() has no built-in timeout — on a stalled connection it can hang
// forever, leaving isGeocoding stuck true and the Next button permanently
// disabled. Force it to fail fast so the UI always recovers.
const fetchWithTimeout = (url: string, timeoutMs = 10000, signal?: AbortSignal) => {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  });
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

// Hard fallback so a stuck permission prompt / GPS call can never leave the
// user staring at the full-screen loader forever.
const INITIALIZING_SAFETY_TIMEOUT_MS = 15000;

// iOS's requestAuthorization() callback is only ever invoked via the native
// "authorization status changed" delegate event (see RNCGeolocation.mm:
// locationManagerDidChangeAuthorization). iOS does NOT re-fire that delegate
// once status is already determined and unchanged — so calling
// requestAuthorization() a *second* time in the same session (e.g. leaving
// this screen and coming back) never resolves at all and hangs forever.
// Permission status is genuinely global for the app session, so caching the
// first definitive answer — and never asking again — is what fixes this
// (as opposed to timing out and guessing "denied", which would be wrong).
const PERMISSION_SAFETY_TIMEOUT_MS = 12000;
let cachedIOSLocationPermission: boolean | null = null;
const TIMED_OUT = Symbol('timed-out');

const requestIOSAuthorization = (): Promise<boolean | typeof TIMED_OUT> =>
  Promise.race([
    new Promise<boolean>(resolve => {
      Geolocation.requestAuthorization(
        () => resolve(true),
        () => resolve(false)
      );
    }),
    new Promise<typeof TIMED_OUT>(resolve => setTimeout(() => resolve(TIMED_OUT), PERMISSION_SAFETY_TIMEOUT_MS)),
  ]);

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

  // Per-instance (not module-level) so two mounted instances of this screen
  // (e.g. one frozen in the stack while another is pushed) never cancel or
  // overwrite each other's pending geocode work.
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const parsedAddressRef = useRef<ParsedAddress | null>(null);
  const lastGeocodedCoordsRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const isMountedRef = useRef(true);
  // Synchronous re-entrancy guard — blocks a rapid double-tap on Next/Save&Exit
  // from racing two ensureFreshAddress() calls (the 2nd would abort the 1st's
  // in-flight request, letting the 1st resolve with stale parsed-address data).
  const isConfirmingRef = useRef(false);

  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(hasExistingLocation);

  const [isInitializing, setIsInitializing] = useState(!hasExistingLocation);

  // ── Auto-fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    if (hasExistingLocation) {
      setHasUserLocation(true);
      getAddressFromCoordinates(existingLat, existingLng);
      setTimeout(() => {
        mapRef.current?.animateToRegion(INITIAL_REGION, 500);
      }, 300);
    } else {
      fetchCurrentLocationOnMount();
    }

    // Defense in depth: no matter what hangs (permission prompt, GPS,
    // bridge), the loader always resolves within this window.
    const safetyTimer = setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsInitializing(prev => {
        if (prev) {
          console.warn('Location: initial fetch timed out, falling back to default region');
        }
        return false;
      });
    }, INITIALIZING_SAFETY_TIMEOUT_MS);

    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimer);
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      geocodeAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Geocoding ─────────────────────────────────────────────────────────────
  // Cancels any in-flight geocode request before starting a new one so a
  // slow/stale response can never overwrite a newer pin position's result.
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    try {
      setIsGeocoding(true);
      const res = await fetchWithTimeout(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`,
        10000,
        controller.signal,
      );
      const data = await res.json();

      // Superseded by a newer request — ignore this result entirely.
      if (controller.signal.aborted || geocodeAbortRef.current !== controller) return '';

      if (data.status === 'OK' && data.results?.length > 0) {
        const address: string = data.results[0]?.formatted_address ?? '';
        const parsed = parseAddressComponents(data.results[0]?.address_components);
        parsedAddressRef.current = parsed;
        lastGeocodedCoordsRef.current = { latitude: lat, longitude: lng };
        if (isMountedRef.current) {
          setCurrentAddress(address);
          placesRef.current?.setAddressText(address);
        }
        return address;
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') {
        console.error('Geocoding error:', e);
      }
    } finally {
      if (isMountedRef.current && geocodeAbortRef.current === controller) {
        setIsGeocoding(false);
      }
    }
    return '';
  };

  // Guarantees the address used at confirm-time always matches the exact
  // current pin position — cancels any pending debounce and re-geocodes
  // on the spot if the last resolved address doesn't match `region` yet.
  const ensureFreshAddress = async (lat: number, lng: number): Promise<ParsedAddress | null> => {
    if (geocodeTimerRef.current) {
      clearTimeout(geocodeTimerRef.current);
      geocodeTimerRef.current = null;
    }
    const last = lastGeocodedCoordsRef.current;
    if (last && last.latitude === lat && last.longitude === lng && parsedAddressRef.current) {
      return parsedAddressRef.current;
    }
    await getAddressFromCoordinates(lat, lng);
    return parsedAddressRef.current;
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
    // iOS: once we have a definitive answer for this session, never call
    // requestAuthorization() again — see comment above on why a repeat call
    // hangs forever instead of resolving.
    if (cachedIOSLocationPermission !== null) {
      return cachedIOSLocationPermission;
    }
    const result = await requestIOSAuthorization();
    if (result === TIMED_OUT) {
      // No definitive answer from the OS — don't report "denied" on a
      // guess. getCurrentPosition() does its own synchronous, reliable
      // permission check and will surface a real denial correctly if so.
      return true;
    }
    cachedIOSLocationPermission = result;
    return result;
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
          // PERMISSION_DENIED — this is getCurrentPosition's own synchronous,
          // always-reliable check, so trust it over any cached optimistic
          // result and let a future request re-check for real.
          cachedIOSLocationPermission = null;
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
          // PERMISSION_DENIED — trust this real, synchronous check over any
          // cached optimistic result.
          cachedIOSLocationPermission = null;
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
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }, 600);
  };

  // ── Map parsed geocode address to listing store fields ───────────────────
  const buildParsedAddressUpdate = (parsed: ParsedAddress | null) => {
    if (!parsed) return {};
    return {
      ...(parsed.street && { street: parsed.street }),
      ...(parsed.postalCode && { apt: parsed.postalCode }),
      ...(parsed.city && { city: parsed.city }),
      ...(parsed.state && { state: parsed.state }),
      ...(parsed.district && { district: parsed.district }),
      ...(parsed.country && { country_name: parsed.country }),
      ...(parsed.countryCode && { country_code: parsed.countryCode }),
    };
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  // Both confirm paths force a fresh, synchronous geocode of the *current*
  // pin position before navigating — this is what guarantees ConfirmAddress
  // never receives a stale country/state/city tied to a previous pin spot.
  const handleConfirm = async () => {
    if (isConfirmingRef.current) return;
    if (!hasUserLocation) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.location_required'),
        text2: i18n.t('app.location_step.location_required_desc'),
      });
      return;
    }
    isConfirmingRef.current = true;
    try {
      const { latitude, longitude } = region;
      const fresh = await ensureFreshAddress(latitude, longitude);
      if (!fresh) {
        Toast.show({ type: 'error', text1: i18n.t('app.location_step.address_wait') });
        return;
      }
      updateListing({ lat: latitude, lng: longitude, ...buildParsedAddressUpdate(fresh) });

      // ✅ Edit mode mein paramData forward karo
      navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS, {
        paramData: params?.paramData,
      });
    } finally {
      isConfirmingRef.current = false;
    }
  };

  const handleSetManually = async () => {
    if (isConfirmingRef.current) return;
    if (!hasUserLocation) {
      Toast.show({
        type: 'error',
        text1: i18n.t('common.toast.location_required'),
        text2: i18n.t('app.location_step.location_required_desc'),
      });
      return;
    }
    isConfirmingRef.current = true;
    try {
      const { latitude, longitude } = region;
      const fresh = await ensureFreshAddress(latitude, longitude);
      if (!fresh) {
        Toast.show({ type: 'error', text1: i18n.t('app.location_step.address_wait') });
        return;
      }
      updateListing({ lat: latitude, lng: longitude, ...buildParsedAddressUpdate(fresh) });
      navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS);
    } finally {
      isConfirmingRef.current = false;
    }
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