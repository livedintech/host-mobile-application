import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Pressable, Text } from 'react-native';
import { useForm } from 'react-hook-form'; // Assuming you use react-hook-form based on 'control' prop
import { s, vs, ms } from 'react-native-size-matters';
import ModalComponent from '@/components/molecules/ModalComponent/ModalComponent';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';

const FilterScreen: React.FC = () => {
  // 1. Define the missing state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. Setup form control (React Hook Form)
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      listings: [],
    },
  });

  // Mock data for your dropdown
  const listingOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  const handleFilterApply = (data: any) => {
    console.log('Filters Applied:', data);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    reset();
    console.log('Filters Reset');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Trigger Button to open the Modal */}
      <View style={styles.center}>
        <Pressable
          style={styles.openButton}
          onPress={() => setIsFilterOpen(true)}
        >
          <Text style={styles.buttonText}>Open Filter Modal</Text>
        </Pressable>
      </View>

      {/* 3. The Modal Component Integration */}
      <ModalComponent
        isVisible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleSubmit(handleFilterApply)}
        onReset={handleFilterReset}
        title="Apply Filter"
      >
        <MultiSelectDropdownField
          name="listings"
          label="Property Listing"
          control={control}
          errors={errors}
          data={listingOptions}
          placeholder="Select Multiple Options"
        />
      </ModalComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#2D4A41',
    paddingVertical: vs(12),
    paddingHorizontal: s(24),
    borderRadius: ms(25),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: ms(16),
  },
  placeholderBox: {
    width: '100%',
  },
  label: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#1A332C',
    marginBottom: vs(10),
  },
  dropdownMock: {
    height: vs(45),
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: ms(12),
    justifyContent: 'center',
    paddingHorizontal: s(12),
    backgroundColor: '#FFF',
  },
  mockText: {
    color: '#999',
  }
});

export default FilterScreen;