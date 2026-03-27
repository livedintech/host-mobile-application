import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '../AppButton/AppButton';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ConfirmActionRef {
  open: () => void;
  close: () => void;
}

interface IConfirmAction {
  onConfirm: () => void | Promise<void>;
  onClose?: () => void | Promise<void>; // optional cancel handler
  isLoading?: boolean;                 // confirm button loading
  isCancelLoading?: boolean;          // cancel button loading
  title?: string;
  content?: string;
  confirmText?: string;
  closeText?: string;
}

const ConfirmAction = forwardRef<ConfirmActionRef, IConfirmAction>(
  (
    {
      onConfirm,
      onClose,
      isLoading = false,
      isCancelLoading = false,
      title,
      content,
      confirmText = 'Yes',
      closeText = 'No',
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['40%'], []);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.present(),
      close: () => bottomSheetRef.current?.dismiss(),
    }));

    const handleOnConfirm = async () => {
      try {
        await onConfirm?.();
      } finally {
        bottomSheetRef.current?.dismiss();
      }
    };

    const handleOnClose = async () => {
      try {
        await onClose?.();
      } finally {
        bottomSheetRef.current?.dismiss();
      }
    };

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={!isLoading && !isCancelLoading}
        bottomInset={insets.bottom}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior={isLoading || isCancelLoading ? 'none' : 'close'}
          />
        )}
      >
        <BottomSheetView style={styles.container}>
          {title && <AppText text={title} fontSize={18} type="SemiBold" />}
          {content && (
            <AppText text={content} fontSize={16} mb={20} />
          )}
          <View style={styles.row}>
            <AppButton
              title={confirmText}
              onPress={handleOnConfirm}
              backgroundColor={Colors.TEAL_PRIMARY_ALT}
              color={Colors.WHITE}
              borderColor={Colors.TEAL_PRIMARY_ALT}
              style={styles.btn}
              loading={isLoading}
              disabled={isLoading || isCancelLoading}
            />
            <AppButton
              title={closeText}
              onPress={handleOnClose}
              backgroundColor={Colors.WHITE}
              borderColor={Colors.BLACK}
              color={Colors.BLACK}
              style={styles.btn}
              loading={isCancelLoading}
              disabled={isLoading || isCancelLoading}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ConfirmAction;

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(30),
    paddingHorizontal: Metrics.scale(20),
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    gap: Metrics.scale(20),
  },
  btn: {
    flex: 1,
  },
});
