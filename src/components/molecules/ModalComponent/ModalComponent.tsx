import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
// Fix: Explicitly import everything needed for animations
import Animated, {
  FadeIn,
  FadeOut,
  ScaleIn,
  Layout
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { s, vs, ms } from 'react-native-size-matters';

interface ModalComponentProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  title = "Apply Filter",
  children,
}) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none" // We handle animations via Reanimated
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        {/* Backdrop Fade */}
        <Animated.View
          entering={FadeIn ? FadeIn.duration(200) : undefined}
          exiting={FadeOut ? FadeOut.duration(200) : undefined}
          style={styles.backdrop}
        />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <Animated.View
          // Fix: Checking if ScaleIn exists to prevent "undefined" error
          entering={ScaleIn ? ScaleIn.duration(300).springify().damping(15) : undefined}
          exiting={FadeOut ? FadeOut.duration(150) : undefined}
          style={styles.modalContent}
        >
          <Text style={styles.titleText}>{title}</Text>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable onPress={onReset} style={styles.flexBtn}>
              <View style={styles.btnBorder}>
                <LinearGradient colors={['#FFFFFF', '#F7F7F7']} style={styles.btnBody}>
                  <Text style={styles.btnLabel}>Reset</Text>
                </LinearGradient>
              </View>
            </Pressable>

            <Pressable onPress={onApply} style={styles.flexBtn}>
              <View style={styles.btnBorder}>
                <LinearGradient colors={['#FFFFFF', '#F7F7F7']} style={styles.btnBody}>
                  <Text style={styles.btnLabel}>Apply Filter</Text>
                </LinearGradient>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20)
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(30),
    padding: s(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  titleText: {
    fontSize: ms(24),
    fontWeight: '700',
    color: '#1A332C',
    marginBottom: vs(15)
  },
  scrollArea: { marginBottom: vs(15) },
  scrollContent: { paddingBottom: vs(5) },
  buttonRow: { flexDirection: 'row', gap: s(12) },
  flexBtn: { flex: 1 },
  btnBorder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: ms(25),
    overflow: 'hidden'
  },
  btnBody: {
    height: vs(48),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnLabel: {
    fontSize: ms(16),
    color: '#2D4A41',
    fontWeight: '600'
  },
});

export default ModalComponent;