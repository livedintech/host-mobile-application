import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useForm } from 'react-hook-form';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';

const tabs = ['reservation', 'revenue', 'nights'];

const AnalyticsTabBar = ({ activeTab, onChange, ListingOptions, onListingChange, initialListings }: any) => {
  const { control, watch, setValue , formState: {errors}} = useForm({
    defaultValues: { listings: initialListings }
  });

  const selectedListings = watch('listings');
  
  // Ref to track content change and avoid infinite loops
  const prevSelectionRef = useRef(JSON.stringify(initialListings));

  // Sync with container state changes (e.g., reset)
  useEffect(() => {
    const currentInit = JSON.stringify(initialListings);
    if (prevSelectionRef.current !== currentInit) {
      setValue('listings', initialListings);
      prevSelectionRef.current = currentInit;
    }
  }, [initialListings, setValue]);

  // Handle Dropdown changes safely
  useEffect(() => {
    const currentSelection = JSON.stringify(selectedListings || []);
    if (prevSelectionRef.current !== currentSelection) {
      prevSelectionRef.current = currentSelection;
      if (onListingChange) {
        onListingChange(selectedListings || []);
      }
    }
  }, [selectedListings, onListingChange]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText text="Channel Performance" fontSize={20} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        <Svgicons path="graphAnalyticIcon" ml={8} size={22} />
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return isActive ? (
            <View key={tab} style={styles.activeShadow}>
              <ButtonView onPress={() => onChange(tab)} style={styles.activeTab}>
                <AppText text={label} color={Colors.WHITE} type="Medium" fontSize={14} />
              </ButtonView>
            </View>
          ) : (
            <View key={tab} style={styles.inactiveShadow}>
              <GradientBorder borderRadius={25} borderWidth={1.2} colors={['#D1D1D1', '#FFFFFF', '#D1D1D1']}>
                <ButtonView onPress={() => onChange(tab)} style={styles.tabInner}>
                  <AppText text={label} color={Colors.BRUNSWICK_GREEN} type="Medium" fontSize={14} />
                </ButtonView>
              </GradientBorder>
            </View>
          );
        })}
      </View>

      <View style={styles.dropdownWrapper}>
        <MultiSelectDropdownField
          label="Listings"
          name="listings"
          control={control}
          data={ListingOptions}
          placeholder="Select Listings"
          errors={errors}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 16 },
  tabContainer: { flexDirection: 'row', marginBottom: 24, alignItems: 'center' },
  activeShadow: { marginRight: 10, ...Platform.select({ ios: { shadowOpacity: 0.25 }, android: { elevation: 6 } }) },
  activeTab: { width: 105, paddingVertical: 10, borderRadius: 25, backgroundColor: Colors.BRUNSWICK_GREEN, alignItems: 'center' },
  inactiveShadow: { marginRight: 10, width: 105, borderRadius: 25, backgroundColor: '#F8F9F9', elevation: 3 },
  tabInner: { paddingVertical: 10, backgroundColor: '#F8F9F9', alignItems: 'center', borderRadius: 25 },
  dropdownWrapper: { marginTop: 5, marginBottom: 35 },
});

export default AnalyticsTabBar;