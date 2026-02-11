import React from 'react';
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

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: filters,
  });

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

        <MultiSelectDropdownField
          label="Channel"
          name="channel"
          control={control}
          errors={errors}
          data={channelOptions}
          placeholder="Select Channels"
        />

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
          />

          <AppButton
            title="Apply Filter"
            onPress={handleSubmit(values => {
              applyFilters(values);
              onClose();
            })}
            style={{ flex: 1 }}
            backgroundColor={Colors.WHITE}
            color={Colors.PINE_FOREST}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  centeredModal: { justifyContent: 'center', alignItems: 'center', margin: 20 },
  modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 24, width: '100%' },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
});
