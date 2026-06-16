import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronRight } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { getOtaConfig } from '@/constants/ota_config';

const SNAP_POINTS = ['50%', '80%'];

interface BookingItem {
  booking_id?: string;
  id?: string;
  guest?: string;
  guest_name?: string;
  source: string;
  arrival_date?: string;
  start_date?: string;
  departure_date?: string;
  end_date?: string;
}

interface Props {
  bookings: BookingItem[];
  date: string;
  onBookingPress: (bookingId: string) => void;
  onClose: () => void;
}

const MultiBookingSheet = forwardRef<BottomSheetModal, Props>(
  ({ bookings, date, onBookingPress, onClose }, ref) => {
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const handleBookingPress = (bookingId: string) => {
      (ref as any)?.current?.dismiss();
      setTimeout(() => onBookingPress(bookingId), 300);
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <View style={styles.header}>
          <AppText text={date} fontSize={17} type="Bold" color="#000" />
          <AppText
            text={`${bookings.length} bookings on this date`}
            fontSize={12}
            color="#7B8D88"
          />
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {bookings.map((booking, index) => {
            const config = getOtaConfig(booking.source);
            const guestName = booking.guest_name || booking.guest || 'Guest';
            const arrivalDate = booking.arrival_date || booking.start_date || '';
            const departureDate = booking.departure_date || booking.end_date || '';
            const bookingId = booking.booking_id || booking.id || '';

            return (
              <ButtonView
                key={`${bookingId}-${index}`}
                style={styles.row}
                onPress={() => handleBookingPress(bookingId)}
                activeOpacity={0.7}
              >
                <View style={[styles.colorBar, { backgroundColor: config.color }]} />

                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <View style={[styles.otaDot, { backgroundColor: config.color }]} />
                    <AppText
                      text={guestName}
                      fontSize={14}
                      type="SemiBold"
                      color="#000"
                    />
                  </View>

                  <View style={styles.rowMeta}>
                    <AppText
                      text={config.label}
                      fontSize={11}
                      color={config.color}
                      type="SemiBold"
                    />
                    {arrivalDate ? (
                      <AppText
                        text={`  •  ${arrivalDate}${departureDate && departureDate !== arrivalDate ? ` → ${departureDate}` : ''}`}
                        fontSize={11}
                        color="#7B8D88"
                      />
                    ) : null}
                  </View>

                  <AppText text={`#${bookingId}`} fontSize={10} color="#A0ADB8" />
                </View>

                <ChevronRight size={ms(18)} color="#C0CDD5" />
              </ButtonView>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#F7F9FB',
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
  },
  handle: {
    backgroundColor: '#D1D5DB',
    width: s(40),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: vs(4),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  listContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(40),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: ms(14),
    marginVertical: vs(5),
    paddingVertical: vs(12),
    paddingRight: s(12),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  colorBar: {
    width: s(4),
    alignSelf: 'stretch',
    marginRight: s(12),
  },
  rowContent: {
    flex: 1,
    gap: vs(3),
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  otaDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
});

export default MultiBookingSheet;
