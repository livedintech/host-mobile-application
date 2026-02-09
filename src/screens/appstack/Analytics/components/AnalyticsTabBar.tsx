import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useForm } from 'react-hook-form';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const tabs = ['reservation', 'revenue', 'nights'];

const AnalyticsTabBar = ({ activeTab, onChange }: any) => {
  const {
    control,
    formState: { errors },
  } = useForm();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText
          text="Channel Performance"
          fontSize={20}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
        />
        <Svgicons path="graphAnalyticIcon" ml={8} size={22} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);

          if (isActive) {
            // Active Tab: Solid Dark Green with Elevation
            return (
              <View key={tab} style={styles.activeShadow}>
                <ButtonView
                  onPress={() => onChange(tab)}
                  style={styles.activeTab}
                >
                  <AppText
                    text={label}
                    color={Colors.WHITE}
                    type="Medium"
                    fontSize={14}
                  />
                </ButtonView>
              </View>
            );
          }

          // Inactive Tab: Gradient Border + Light Shadow + Grey Background
          return (
            <View key={tab} style={styles.inactiveShadow}>
              <GradientBorder
                borderRadius={25}
                borderWidth={1.2}
                colors={['#D1D1D1', '#FFFFFF', '#D1D1D1']} // Silver metallic look
              >
                <ButtonView
                  onPress={() => onChange(tab)}
                  style={styles.tabInner}
                >
                  <AppText
                    text={label}
                    color={Colors.BRUNSWICK_GREEN}
                    type="Medium"
                    fontSize={14}
                  />
                </ButtonView>
              </GradientBorder>
            </View>
          );
        })}
      </View>

      {/* Listing Dropdown */}
      <View style={styles.dropdownWrapper}>
        <DropdownField
          name="listings"
          control={control}
          errors={errors}
          data={[{ label: 'Al Riyadh Apartments', value: 'all' }]}
          placeholder="Select Listings"
          label="Listings"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  activeShadow: {
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  activeTab: {
    width: 105,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: Colors.BRUNSWICK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveShadow: {
    marginRight: 10,
    width: 105,
    borderRadius: 25,
    backgroundColor: '#F8F9F9', // Subtle background color
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabInner: {
    paddingVertical: 10,
    backgroundColor: '#F8F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  dropdownWrapper: {
    marginTop: 5,
    marginBottom: 35,
  },
});

export default AnalyticsTabBar;
