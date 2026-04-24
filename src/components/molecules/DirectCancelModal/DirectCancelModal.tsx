import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface ConfirmProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DirectCancelModal = ({
  visible,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmProps) => {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.absoluteBackground} />
        </TouchableWithoutFeedback>

        <View style={styles.whiteCard}>
          <AppText
            text={t('app.direct_cancel_modal.confirm_text')}
            type="Bold"
            fontSize={ms(17)}
            mb={vs(12)}
            textAlign="center"
            color={Colors.BLACK}
          />

          <AppText
            text={t('app.direct_cancel_modal.subtitle')}
            fontSize={ms(14)}
            textAlign="center"
            mb={vs(25)}
            lineHeight={ms(20)}
            color={Colors.DARK_CHARCOAL}
          />

          <View style={styles.buttonRow}>
            <AppButton
              title={t('app.direct_cancel_modal.cancel_btn')}
              // variant="secondary"
              onPress={onClose}
              style={styles.flexButton}
              color={Colors.BLACK}
              backgroundColor={Colors.WHITE}
            />

            <View style={{ width: s(12) }} />

            <AppButton
              title={t('app.direct_cancel_modal.yes_cancel')}
              backgroundColor="#09A289" // Error red
              onPress={onConfirm}
              loading={isLoading}
              style={styles.flexButton}
              color={Colors.WHITE}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  whiteCard: {
    width: width * 0.88,
    backgroundColor: Colors.WHITE,
    paddingVertical: vs(25),
    paddingHorizontal: s(15),
    borderRadius: ms(20),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: s(5),
  },
  flexButton: {
    flex: 1,
    height: vs(46),
    borderRadius: ms(100),
    borderWidth:1,
    borderColor:'#C0C0C0'
  },
});

export default DirectCancelModal;
