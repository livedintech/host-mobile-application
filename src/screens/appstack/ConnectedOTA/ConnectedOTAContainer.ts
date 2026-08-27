import { useState } from 'react';

export default function useConnectedOTAContainer() {
  // Mock data for OTA platforms
  const [platforms] = useState([
    {
      id: '1',
      name: 'Airbnb',
      status: 'Active',
    },
    // {
    //   id: '2',
    //   name: 'Gathern',
    //   status: 'Active',
    // },
  ]);

  const handlePlatformPress = (platformId: string) => {
    console.log(`Platform ${platformId} pressed`);
    // Yahan aap navigation ya status toggle ki logic dal sakte hain
  };

  return {
    platforms,
    handlePlatformPress,
  };
}