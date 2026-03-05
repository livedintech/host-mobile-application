import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import GlassCard from './GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const tabs = [
  { id: 'reservation', label: 'Reservation' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'nights', label: 'Nights' },
];

const AnalyticsTabBar = ({
  activeTab,
  onChange,
  ListingOptions,
  control,
  errors,
}: any) => {
  if (!control) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText
          text="Channel Performance"
          fontSize={26}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
        />
      </View>

      <View style={styles.tabRow}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <GlassCard
              key={tab.id}
              width="31%"
              style={[
                styles.tabGlass,
                isActive ? styles.activeTabGlass : styles.inactiveTabShadow,
              ]}
            >
              <ButtonView
                onPress={() => onChange(tab.id)}
                style={styles.tabButton}
              >
                <AppText
                  text={tab.label}
                  color={isActive ? Colors.WHITE : Colors.DARK_CHARCOAL}
                  type="Medium"
                  fontSize={14}
                />
              </ButtonView>
            </GlassCard>
          );
        })}
      </View>

      <View style={styles.dropdownSection}>
        <MultiSelectDropdownField
          name="listings"
          control={control}
          data={ListingOptions || []}
          placeholder="Al Riyadh Apartment"
          errors={errors || {}}
          label="Select Listing"
          labelStyle={{ color: Colors.BLACK, marginBottom: 8 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 15 },
  headerRow: { marginBottom: 35, alignItems: 'center' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  tabGlass: {
    padding: 0,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  inactiveTabShadow: {
    // ...Platform.select({
    //   ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 4 },
    //   android: { elevation: 3 }
    // })
  },
  activeTabGlass: {
    backgroundColor: '#09A389',
    borderColor: '#00A78E',
    ...Platform.select({
      ios: {
        shadowColor: '#00A78E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 6 },
    }),
  },
  tabButton: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownSection: { marginBottom: 20 },
});

export default AnalyticsTabBar;
