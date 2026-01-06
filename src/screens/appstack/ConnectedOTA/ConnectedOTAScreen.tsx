import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useConnectedOTAContainer from './ConnectedOTAContainer';

const ConnectedOTAScreen = () => {
  const { platforms, handlePlatformPress } = useConnectedOTAContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Title */}
        <AppText 
          text="Connected OTA Platform" 
          fontSize={32} 
          type="Bold" 
          color={Colors.BRUNSWICK_GREEN} 
          mb={30} 
        />

        {platforms.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.platformCard}
            onPress={() => handlePlatformPress(item.id)}
            activeOpacity={0.7}
          >
            {/* Platform Name */}
            <AppText 
              text={item.name} 
              fontSize={20} 
              type="Bold" 
              color={Colors.BRUNSWICK_GREEN} 
              mb={5}
            />
            
            {/* Connection Status Row */}
            <View style={styles.statusRow}>
              <AppText 
                text="Connection Status: " 
                fontSize={16} 
                color={Colors.BLACK} 
              />
              <AppText 
                text={item.status} 
                fontSize={16} 
                color={item.status === 'Active' ? '#59B09F' : Colors.INDIAN_RED} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    padding: 24,
  },
  platformCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
    // Soft shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ConnectedOTAScreen;