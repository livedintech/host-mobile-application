import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
import { vs } from 'react-native-size-matters';

import PropertyDetails from '@/components/molecules/PropertyDetails/PropertyDetails';

const PropertyDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wrapper View to control the layout flow */}
        <View style={styles.sectionWrapper}>
          <PropertyDetails />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingVertical: vs(20),
  },
  sectionWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default PropertyDetailsScreen;