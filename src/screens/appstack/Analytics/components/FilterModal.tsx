import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';

const FilterModal = ({ isVisible, onClose }: any) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

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
        
        <DropdownField
          label="Listings" 
          name="listings" 
          control={control} 
          errors={errors} 
          data={[{label: 'All Listings', value: 'all'}]} 
          placeholder="Select Multiple Options"
        />

        <DropdownField 
          label="Reservation Channel" 
          name="channel" 
          control={control} 
          errors={errors} 
          data={[{label: 'Airbnb', value: 'air'}]} 
          placeholder="Select Multiple Options"
        />

        <DropdownField 
          label="Date Range" 
          name="date" 
          control={control} 
          errors={errors} 
          data={[{label: 'Today', value: 'today'}]} 
          placeholder="Today"
        />

        <View style={styles.buttonRow}>
          <AppButton
            title="Reset" 
            onPress={onClose} 
            style={{ flex: 1, marginRight: 10 }} 
            backgroundColor={Colors.WHITE}
            color={Colors.PINE_FOREST}
          />
          <AppButton 
            title="Apply Filter" 
            onPress={onClose} 
            style={{ flex: 1 }}
            backgroundColor={Colors.WHITE}
            color={Colors.PINE_FOREST}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredModal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    elevation: 5,
  },
  buttonRow: { flexDirection: 'row', marginTop: 10},
});

export default FilterModal;