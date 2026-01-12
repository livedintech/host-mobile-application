import { useState, useRef, useEffect } from 'react';
import { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';

interface GooglePlaceDetail {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao';

export default function useCreateListingStepOneLocationContainer() {
  const {updateListing}  = useCreateListingStore()
  const mapRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const isManuallySearching = useRef(false);

  const [region, setRegion] = useState<Region>({
    latitude: 24.4672,
    longitude: 39.6111,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [currentAddress, setCurrentAddress] = useState('');

  // 🔹 Reverse Geocoding - Get address from lat/lng
  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setCurrentAddress(address);
        
        // Update GooglePlacesAutocomplete input
        if (placesRef.current) {
          placesRef.current.setAddressText(address);
        }
        
        console.log('Address:', address);
        return address;
      }
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
    }
    return '';
  };

  // 🔹 Permission (Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // 🔹 Get current location and animate map
  const handleLocateMe = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };

        // Update region state
        setRegion(newRegion);

        // Animate map to current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        // Get and update address
        getAddressFromCoordinates(latitude, longitude);

        console.log('Current Location:', { latitude, longitude });
      },
      error => {
        console.log('Location Error:', error);
        Alert.alert('Error', 'Unable to get current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // 🔹 Handle Google Places selection
  const handlePlaceSelect = (details: GooglePlaceDetail) => {
    isManuallySearching.current = true;
    
    const { lat, lng } = details.geometry.location;

    const newRegion: Region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };

    // Update region state
    setRegion(newRegion);
    
    // Update address
    setCurrentAddress(details.formatted_address);

    // Animate map to selected place
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    console.log('Selected Place:', {
      latitude: lat,
      longitude: lng,
      address: details.formatted_address,
    });

    // Reset flag after animation
    setTimeout(() => {
      isManuallySearching.current = false;
    }, 1500);
  };

  const handleConfirm = () => {
    console.log('Final Selected Location:', region);
    console.log('Address:', currentAddress);
    console.log('Coordinates:', {
      latitude: region.latitude,
      longitude: region.longitude,
    });
    updateListing({
      lat: region.latitude,
      lng: region.longitude,
    })
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS);
  };

  const handleSetManually = () => {
    console.log('Manual Entry Mode');
    // You can navigate to manual entry screen or show a modal
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    
    // Only update address if user is not actively searching
    if (!isManuallySearching.current) {
      // Get address for new location with debounce
      getAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }
    
    console.log('Map moved to:', {
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  // 🔹 Initial address load
  useEffect(() => {
    getAddressFromCoordinates(region.latitude, region.longitude);
  }, []);

  return {
    region,
    mapRef,
    placesRef,
    currentAddress,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe,
    handlePlaceSelect,
  };
}