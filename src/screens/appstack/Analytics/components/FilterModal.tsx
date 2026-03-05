import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';

const FilterModal = ({
  isVisible,
  onClose,
  listingOptions,
  channelOptions,
  dateOptions,
  applyFilters,
  resetFilters,
  filters,
}: any) => {

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: filters,
  });

  // Sync internal form state whenever filters change or modal opens
  useEffect(() => {
    if (isVisible) {
      reset(filters);
    }
  }, [filters, isVisible, reset]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.4}
      useNativeDriver
      style={styles.centeredModal}
    >
      <View style={styles.modalContent}>
        <AppText text="Apply Filter" fontSize={22} type="Bold" textAlign="center" mb={20} color={Colors.PINE_FOREST} />

        <MultiSelectDropdownField
          label="Listings"
          name="listings"
          control={control}
          errors={errors}
          data={listingOptions}
          placeholder="Select Listings"
        />

        <View style={{ height: 15 }} />

        <MultiSelectDropdownField
          label="Channel"
          name="channel"
          control={control}
          errors={errors}
          data={channelOptions}
          placeholder="Select Channels"
        />

        <View style={{ height: 15 }} />

        <MultiSelectDropdownField
          label="Date Range"
          name="date"
          control={control}
          errors={errors}
          data={dateOptions}
          placeholder="Select Date"
        />

        <View style={styles.buttonRow}>
          <AppButton
            title="Reset"
            onPress={() => {
              resetFilters();
              onClose();
            }}
            style={{ flex: 1, marginRight: 10 }}
            backgroundColor={Colors.WHITE}
            color={Colors.PINE_FOREST}
            // borderWidth={1}
            borderColor={Colors.PINE_FOREST}
          />

          <AppButton
            title="Apply Filter"
            onPress={handleSubmit(values => {
              applyFilters(values);
              onClose();
            })}
            style={{ flex: 1, borderWidth:1 }}
            backgroundColor={Colors.PINE_FOREST}
            color={Colors.WHITE}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredModal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: { 
    backgroundColor: 'white', 
    padding: 24, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  buttonRow: { flexDirection: 'row', marginTop: 30 },
});

export default FilterModal;