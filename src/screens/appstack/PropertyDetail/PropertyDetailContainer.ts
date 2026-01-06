import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function usePropertyDetailContainer() {
  // Mock data as per Step 4, 5, 6 and Manage Listing designs
  const [propertyData] = useState({
    title: "Alpha House",
    address: "King Fahd Road, Al Madinah Al Munawarah, Al Madinah Province 42311, Saudi Arabia",
    placeInfo: {
      size: "500 Sqm",
      bedrooms: 3,
      beds: 5,
      kitchen: "Yes",
      pool: "No",
      longTerm: "Yes",
      minStay: 2,
      features: "Microwave, Kettle"
    },
    houseDetails: {
      description: "Alpha House is located in Madinah, close to the city center. Built in 2012, the property features minimalist and modern architecture, making it a comfortable and suitable choice for families.",
      bookingType: "Instant Booking",
      guestEligibility: "Any Guest",
      checkIn: "09:00",
      checkOut: "22:00"
    },
    pricing: {
      weekday: "SAR 500",
      weekend: "Any Guest",
      discount: "10.5%",
      tax: "2.0%",
      markup: "10.5%",
      cleaning: "2.0%"
    },
    disclosure: {
      cameras: "Yes",
      noiseMonitor: "Yes",
      weapons: "10.5%"
    }
  });

  const handleEditSection = (section: string) => {
    console.log("Navigating to edit section:", section);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'channel':
           navigate(NavigationRoutes.APP_STACK.CONNECTED_OTA)
        break;
      case 'delete':
        Alert.alert("Delete Property", "Are you sure you want to delete this listing?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => console.log("Deleted") }
        ]);
        break;
      default:
        console.log(`Action: ${action} selected`);
        break;
    }
  };
  const goToConnectedOTA = () =>{
    navigate(NavigationRoutes.APP_STACK.CONNECTED_OTA)
  }

  return {
    propertyData,
    handleEditSection,
    handleMenuAction,
    goToConnectedOTA
  };
}