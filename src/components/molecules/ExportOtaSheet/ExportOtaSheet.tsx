import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

interface ExportOtaSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  buttonText: string;
  otaControl: Control<any>;
  otaErrors: FieldErrors<any>;
  handleOtaSubmit: (onValid: (data: any) => void) => () => void;
  handleExportSubmit: (data: any) => void;
  listingOptions: { label: string; value: any }[];
  isPending?: boolean;
}

const ExportOtaSheet = ({
  visible,
  onClose,
  title,
  placeholder,
  buttonText,
  otaControl,
  otaErrors,
  handleOtaSubmit,
  handleExportSubmit,
  listingOptions,
  isPending,
}: ExportOtaSheetProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <AppPressable style={styles.modalOverlay} onPress={onClose}>
        <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handleBar} />
          <AppText text={title} fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
          <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
            <DropdownField
              name="ota_account"
              control={otaControl as any}
              errors={otaErrors as any}
              label=""
              data={listingOptions}
              placeholder={placeholder}
              dropdownPosition="top"
            />
          </View>
          <AppButton
            title={buttonText}
            onPress={handleOtaSubmit(handleExportSubmit)}
            mt={20}
            loading={isPending}
            backgroundColor="#00A68A"
            borderColor="transparent"
            color={Colors.WHITE}
          />
        </AppPressable>
      </AppPressable>
    </Modal>
  );
};

export default ExportOtaSheet;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
});
