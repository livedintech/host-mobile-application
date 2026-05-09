import React from 'react';
import { StyleSheet, View, Modal } from 'react-native'; // Switched to standard Modal to match MoreScreen
import AppText from '../AppText/AppText';
import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const AccountDeleteModal = ({ isVisible, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <AppText 
            text={title}
            type="Bold" 
            fontSize={18} 
            style={styles.modalTitle} 
          />
          
          <AppText 
            text={description}
            fontSize={14} 
            color="grey"
            style={styles.modalSubTitle}
          />

          <View style={styles.modalButtonContainer}>
            <AppPressable style={styles.cancelButton} onPress={onClose}>
              <AppText 
                text={t('app.account_delete_modal.cancel')} 
                type="Medium" 
                fontSize={16} 
                color="black" 
              />
            </AppPressable>

            <AppPressable style={styles.confirmButton} onPress={onConfirm}>
              <AppText 
                text={t('app.account_delete_modal.confirm')} 
                type="Medium" 
                fontSize={16} 
                color="white" 
              />
            </AppPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#F2F2F2', // Match MoreScreen light grey
    borderRadius: 35,
    padding: Metrics.scale(25),
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  modalSubTitle: {
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY_TEAL, // Match MoreScreen teal
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountDeleteModal;