import { useState } from 'react';
import { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export default function useCreateListingStepOneLocationContainer() {

  const [region, setRegion] = useState<Region>({
    latitude: 24.4672,
    longitude: 39.6111,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 Permission (Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // 🔹 Get current location
  const handleLocateMe = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };

        setRegion(newRegion);
      },
      error => {
        console.log('Location Error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const handleConfirm = () => {
    console.log('Final Selected Location:', region);
    navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS)
  };

  const handleSetManually = () => {
    console.log('Manual Entry Mode');
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  return {
    region,
    searchQuery,
    setSearchQuery,
    handleConfirm,
    handleSetManually,
    onRegionChangeComplete,
    handleLocateMe, // 👈 expose
  };
}
