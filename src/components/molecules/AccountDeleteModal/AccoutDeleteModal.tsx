import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const AccountDeleteModal = ({ isVisible, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.modalContent}>
        <AppText text={title} style={styles.title} type="Bold" />
        <AppText text={description} style={styles.description} />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <AppText text="Cancel" color={Colors.WHITE} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <AppText text="Confirm" color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#333333', // Dark background as per your image
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  title: {
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});

export default AccountDeleteModal;