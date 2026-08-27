import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../AppButton/AppButton';
import AppText from '../AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Utility from '@/utility/Utils';

export interface AirbnbExportPopupRef {
  open: () => void;
  close: () => void;
}

const AIRBNB_HOSTING_URL = 'https://www.airbnb.com/hosting';

const AirbnbExportPopup = forwardRef<AirbnbExportPopupRef>((_, ref) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.present(),
    close: () => bottomSheetRef.current?.dismiss(),
  }));

  const handleOpenAirbnb = async () => {
    await Utility.openURLCall(AIRBNB_HOSTING_URL);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      enableDynamicSizing
      bottomInset={insets.bottom}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      )}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.iconCircle}>
          <Svgicons path="airbnb" size={28} />
        </View>

        <AppText
          text={t('common.airbnb_export_popup.title')}
          fontSize={20}
          type="Bold"
          textAlign="center"
          color={Colors.BLACK}
          mt={20}
          mb={10}
        />

        <AppText
          text={t('common.airbnb_export_popup.description')}
          fontSize={14}
          lineHeight={20}
          textAlign="center"
          color={Colors.DARK_CHARCOAL_OPACITY}
          mb={28}
        />

        <View style={styles.buttonGroup}>
          <AppButton
            title={t('common.airbnb_export_popup.open_airbnb')}
            onPress={handleOpenAirbnb}
            variant="primary"
            style={styles.btn}
          />
          <AppButton
            title={t('common.airbnb_export_popup.do_it_later')}
            onPress={() => bottomSheetRef.current?.dismiss()}
            variant="secondary"
            style={styles.btn}
            mt={12}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default AirbnbExportPopup;

const styles = StyleSheet.create({
  sheetBackground: { backgroundColor: Colors.WHITE },
  handleIndicator: { backgroundColor: Colors.LIGHT_GRAY },
  container: {
    paddingTop: Metrics.verticalScale(12),
    paddingBottom: Metrics.verticalScale(40),
    paddingHorizontal: Metrics.scale(24),
    alignItems: 'center',
  },
  iconCircle: {
    width: Metrics.scale(64),
    height: Metrics.scale(64),
    borderRadius: Metrics.scale(32),
    backgroundColor: Colors.GLOSSY_PLATINUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroup: { width: '100%' },
  btn: { width: '100%' },
});
