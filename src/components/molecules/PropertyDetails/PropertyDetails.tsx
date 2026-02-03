import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Home } from 'lucide-react-native';
import { s, vs, ms } from 'react-native-size-matters';

const PropertyDetails = () => {
  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <Home
          size={ms(28)}
          color="#1A332C"
          strokeWidth={1.5}
        />
        <Text style={styles.headerTitle}>Property Details</Text>
      </View>

      {/* DETAILS GRID */}
      <View style={styles.detailsContent}>
        <View style={styles.infoRow}>
          <Text style={styles.fieldLabel}>Property Name:</Text>
          <Text style={styles.fieldValue}>Alpha House</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.fieldLabel}>Property Address:</Text>
          <Text style={[styles.fieldValue, styles.addressText]}>
            King Fahd Road, Al Madinah Al Munawarah, Al Madinah Province 42311, Saudi Arabia
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(35),
    paddingVertical: vs(25),
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(35),
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: '700',
    color: '#1A332C',
    marginLeft: s(12),
    letterSpacing: -0.5,
  },
  detailsContent: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: vs(22),
    alignItems: 'flex-start',
  },
  fieldLabel: {
    flex: 1.1,
    fontSize: ms(17),
    fontWeight: '700',
    color: '#1A332C',
    letterSpacing: -0.3,
  },
  fieldValue: {
    flex: 2,
    fontSize: ms(16),
    color: '#7B8D88',
    fontWeight: '500',
    lineHeight: ms(22),
  },
  addressText: {
    lineHeight: ms(24),
  },
});

export default PropertyDetails;