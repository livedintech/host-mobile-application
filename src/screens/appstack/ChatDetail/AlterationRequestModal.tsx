import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import Metrics from '@/utility/Metrics';
import useAlterationRequestContainer from './useAlterationRequestContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  onClose?: () => void;
  threadId: string | number;
  description?: string;
  // New (requested alteration) dates — shown in confirm screen
  newStartDate?: string;
  newEndDate?: string;
  newGuests?: number | string;
  newTotal?: string;
  totalDiff?: string;
  // Original booking — shown in declined result
  originalStartDate?: string;
  originalEndDate?: string;
  originalGuests?: number | string;
  originalTotal?: string;
}

const DECLINE_REASONS = [
  { label: 'Dates Not Available', value: 'dates_not_available' },
  { label: 'Not a Good Fit', value: 'not_a_good_fit' },
  {
    label: 'Waiting for Better Reservation',
    value: 'waiting_for_better_reservation',
  },
  { label: 'Not Comfortable', value: 'not_comfortable' },
];

const fmtDate = (d?: string) => (d ? dayjs(d).format('D MMM') : '');
const fmtDateRange = (start?: string, end?: string) =>
  start && end ? `${fmtDate(start)} – ${fmtDate(end)}` : '';

const AlterationRequestModal = ({
  visible,
  onClose,
  threadId,
  description,
  newStartDate,
  newEndDate,
  newGuests,
  newTotal,
  totalDiff,
  originalStartDate,
  originalEndDate,
  originalGuests,
  originalTotal,
}: Props) => {
  const { t } = useTranslation();
  const {
    viewState,
    control,
    errors,
    isLoading,
    handleAcceptPress,
    handleConfirmAccept,
    handleDeclineClick,
    handleBackToActions,
    handleBackToChat,
    handleSubmitDecline,
  } = useAlterationRequestContainer({ onClose, threadId });

  // ── Floating card animation (actions / declineForm) ──────────────────────
  const [cardShouldRender, setCardShouldRender] = useState(visible);
  const cardFade = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const cardSlide = useRef(new Animated.Value(visible ? 0 : -20)).current;

  const isFloating =
    visible && (viewState === 'actions' || viewState === 'declineForm');

  useEffect(() => {
    if (isFloating) {
      setCardShouldRender(true);
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: -20,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setCardShouldRender(false));
    }
  }, [isFloating]);

  // ── Bottom-sheet panel animation (confirmAccept) ──────────────────────────
  const panelSlide = useRef(new Animated.Value(500)).current;
  const overlayFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (viewState === 'confirmAccept') {
      Animated.parallel([
        Animated.timing(overlayFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(panelSlide, {
          toValue: 0,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      overlayFade.setValue(0);
      panelSlide.setValue(500);
    }
  }, [viewState]);

  // ── Declined overlay animation ────────────────────────────────────────────
  const declinedFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (viewState === 'declined') {
      Animated.timing(declinedFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      declinedFade.setValue(0);
    }
  }, [viewState]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          STATE 1 & 2 — Floating top card (actions / declineForm)
      ════════════════════════════════════════════════════════════════════ */}
      {cardShouldRender && (
        <Animated.View
          style={[
            styles.floatingCard,
            {
              opacity: cardFade,
              transform: [{ translateY: cardSlide }],
            },
          ]}
        >
          {/* ── ACTIONS ── */}
          {viewState === 'actions' && (
            <>
              {/* header row: spacer | title | X */}
              <View style={styles.actionsHeaderRow}>
                <View style={{ width: 30 }} />
                <AppText
                  text={t('app.alteration_modal.title')}
                  fontSize={20}
                  type="Bold"
                  color={Colors.BLACK}
                  textAlign="center"
                  style={{ flex: 1 }}
                />
                <ButtonView onPress={onClose} style={styles.closeBtn}>
                  <Svgicons path="crossUnique" size={20} color={Colors.BLACK} />
                </ButtonView>
              </View>

              {description && (
                <AppText
                  text={description}
                  fontSize={14}
                  color={Colors.DARK_CHARCOAL}
                  textAlign="center"
                  mt={6}
                  mb={24}
                />
              )}

              <View style={styles.actionRow}>
                <AppButton
                  title={t('app.alteration_modal.decline_btn')}
                  onPress={handleDeclineClick}
                  backgroundColor={Colors.WHITE}
                  color={Colors.INDIAN_RED}
                  borderColor={Colors.INDIAN_RED}
                  style={styles.flexBtn}
                  variant="secondary"
                  borderRadius={9}
                  fontSize={11}
                  loading={isLoading}
                />

                <View style={{ width: 10 }} />

                <AppButton
                  title={t('app.alteration_modal.accept_btn')}
                  onPress={handleAcceptPress}
                  backgroundColor={Colors.TEAL_PRIMARY_ALT}
                  color={Colors.WHITE}
                  borderColor={Colors.BRUNSWICK_GREEN}
                  style={styles.flexBtn}
                  borderRadius={9}
                  fontSize={11}
                  loading={isLoading}
                />
              </View>
            </>
          )}

          {/* ── DECLINE FORM ── */}
          {viewState === 'declineForm' && (
            <>
              <View style={styles.formHeader}>
                <ButtonView onPress={handleBackToActions} style={styles.backBtn}>
                  <Svgicons path="back" size={28} color={Colors.BLACK} />
                </ButtonView>
                <AppText
                  text={t('app.alteration_modal.decline_title')}
                  fontSize={18}
                  type="Bold"
                  color={Colors.BLACK}
                />
                <View style={{ width: 28 }} />
              </View>

              <DropdownField
                name="reason"
                control={control}
                errors={errors}
                label={t('app.alteration_modal.reason_label')}
                data={DECLINE_REASONS}
                placeholder={t('app.alteration_modal.reason_placeholder')}
                dropdownPosition="bottom"
                maxHeight={220}
                dropdownStyle={{
                  borderColor: Colors.CHARCOAL,
                  borderWidth: 1,
                  backgroundColor: Colors.WHITE,
                }}
              />

              <InputField
                label={t('app.alteration_modal.msg_to_guest_label')}
                name="decline_message_to_guest"
                control={control}
                errors={errors}
                placeholder={t('app.alteration_modal.msg_to_guest_placeholder')}
                containerStyle={{ borderColor: Colors.CHARCOAL, borderWidth: 1, backgroundColor: Colors.WHITE }}
              />

              <InputField
                label={t('app.alteration_modal.msg_to_airbnb_label')}
                name="decline_message_to_airbnb"
                control={control}
                errors={errors}
                placeholder={t(
                  'app.alteration_modal.msg_to_airbnb_placeholder',
                )}
                containerStyle={{ borderColor: Colors.CHARCOAL, borderWidth: 1, backgroundColor: Colors.WHITE }}
              />

              <AppButton
                title={t('app.alteration_modal.submit_btn')}
                onPress={handleSubmitDecline}
                loading={isLoading}
                variant="primary"
                mt={8}
              />
            </>
          )}
        </Animated.View>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          STATE 3 — Confirm Acceptance bottom sheet
      ════════════════════════════════════════════════════════════════════ */}
      {viewState === 'confirmAccept' && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: overlayFade, zIndex: 999999 }]}
          pointerEvents="box-none"
        >
          {/* dim background */}
          <View style={styles.overlayDim} pointerEvents="none" />

          {/* sliding panel */}
          <Animated.View
            style={[
              styles.bottomPanel,
              { transform: [{ translateY: panelSlide }] },
            ]}
          >
            {/* drag handle */}
            <View style={styles.panelHandle} />

            <AppText
              text={t('app.alteration_modal.confirm_title')}
              fontSize={22}
              type="Bold"
              color={Colors.BLACK}
              textAlign="center"
              mt={8}
              mb={6}
            />
            <AppText
              text={t('app.alteration_modal.confirm_subtitle')}
              fontSize={14}
              color={Colors.DARK_CHARCOAL}
              textAlign="center"
              mb={20}
            />

            {/* Booking details card */}
            <View style={styles.detailsCard}>
              {(newStartDate || newEndDate) && (
                <>
                  <View style={styles.detailRow}>
                    <AppText
                      text={t('app.alteration_modal.new_dates_label')}
                      fontSize={14}
                      color={Colors.DARK_CHARCOAL}
                    />
                    <AppText
                      text={fmtDateRange(newStartDate, newEndDate)}
                      fontSize={14}
                      type="Bold"
                      color={Colors.BLACK}
                    />
                  </View>
                  <View style={styles.divider} />
                </>
              )}

              {newGuests !== undefined && (
                <>
                  <View style={styles.detailRow}>
                    <AppText
                      text={t('app.alteration_modal.guests_label')}
                      fontSize={14}
                      color={Colors.DARK_CHARCOAL}
                    />
                    <AppText
                      text={String(newGuests)}
                      fontSize={14}
                      type="Bold"
                      color={Colors.BLACK}
                    />
                  </View>
                  {newTotal && <View style={styles.divider} />}
                </>
              )}

              {newTotal && (
                <View style={styles.detailRow}>
                  <AppText
                    text={t('app.alteration_modal.new_total_label')}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                  />
                  <View style={styles.totalRight}>
                    <AppText
                      text={newTotal}
                      fontSize={14}
                      type="Bold"
                      color={Colors.TEAL_PRIMARY_ALT}
                    />
                    {totalDiff && (
                      <View style={styles.diffBadge}>
                        <AppText
                          text={totalDiff}
                          fontSize={11}
                          type="Medium"
                          color={Colors.TEAL_PRIMARY_ALT}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>

            <AppButton
              title={t('app.alteration_modal.confirm_accept_btn')}
              onPress={handleConfirmAccept}
              loading={isLoading}
              backgroundColor={Colors.TEAL_PRIMARY_ALT}
              color={Colors.WHITE}
              borderRadius={100}
              fontSize={16}
              mt={24}
            />

            <AppButton
              title={t('app.alteration_modal.cancel_btn')}
              onPress={handleBackToActions}
              variant="secondary"
              mt={12}
            />
          </Animated.View>
        </Animated.View>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          STATE 4 — Alteration Declined result
      ════════════════════════════════════════════════════════════════════ */}
      {viewState === 'declined' && (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.declinedOverlay, { opacity: declinedFade }]}
        >
          {/* red top banner */}
          <View style={styles.redBanner}>
            <View style={styles.bannerIconWrap}>
              <Svgicons path="crossUnique" size={14} color={Colors.WHITE} />
            </View>
            <AppText
              text={t('app.alteration_modal.declined_banner')}
              fontSize={13}
              type="Medium"
              color={Colors.WHITE}
              style={{ flex: 1 }}
            />
          </View>

          {/* white result card */}
          <ScrollView
            contentContainerStyle={styles.declinedCardScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.declinedCard}>
              {/* red circle X icon */}
              <View style={styles.declinedIconCircle}>
                <View style={styles.declinedIconInner}>
                  <Svgicons
                    path="crossUnique"
                    size={22}
                    color={Colors.INDIAN_RED}
                  />
                </View>
              </View>

              <AppText
                text={t('app.alteration_modal.declined_title')}
                fontSize={22}
                type="Bold"
                color={Colors.BLACK}
                textAlign="center"
                mt={16}
                mb={8}
              />
              <AppText
                text={t('app.alteration_modal.declined_desc')}
                fontSize={14}
                color={Colors.DARK_CHARCOAL}
                textAlign="center"
                mb={24}
              />

              {/* original booking unchanged card */}
              <View style={styles.originalCard}>
                <AppText
                  text={t('app.alteration_modal.original_booking_label')}
                  fontSize={11}
                  type="Bold"
                  color={Colors.DARK_CHARCOAL}
                  mb={12}
                  style={{ letterSpacing: 0.8 }}
                />

                {(originalStartDate || originalEndDate) && (
                  <>
                    <View style={styles.detailRow}>
                      <AppText
                        text={t('app.alteration_modal.dates_label')}
                        fontSize={14}
                        color={Colors.DARK_CHARCOAL}
                      />
                      <AppText
                        text={fmtDateRange(originalStartDate, originalEndDate)}
                        fontSize={14}
                        type="Bold"
                        color={Colors.BLACK}
                      />
                    </View>
                    <View style={styles.divider} />
                  </>
                )}

                {originalGuests !== undefined && (
                  <>
                    <View style={styles.detailRow}>
                      <AppText
                        text={t('app.alteration_modal.guests_label')}
                        fontSize={14}
                        color={Colors.DARK_CHARCOAL}
                      />
                      <AppText
                        text={String(originalGuests)}
                        fontSize={14}
                        type="Bold"
                        color={Colors.BLACK}
                      />
                    </View>
                    {originalTotal && <View style={styles.divider} />}
                  </>
                )}

                {originalTotal && (
                  <View style={styles.detailRow}>
                    <AppText
                      text={t('app.alteration_modal.total_label')}
                      fontSize={14}
                      color={Colors.DARK_CHARCOAL}
                    />
                    <AppText
                      text={originalTotal}
                      fontSize={14}
                      type="Bold"
                      color={Colors.BLACK}
                    />
                  </View>
                )}
              </View>

              <AppButton
                title={t('app.alteration_modal.back_to_chat_btn')}
                onPress={handleBackToChat}
                backgroundColor={Colors.BLACK}
                color={Colors.WHITE}
                borderRadius={100}
                fontSize={16}
                mt={24}
              />
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // ── Floating card ──────────────────────────────────────────────────────────
  floatingCard: {
    position: 'absolute',
    top:  Metrics.verticalScale(80),
    left: Metrics.scale(16),
    right: Metrics.scale(16),
    zIndex: 99999,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: Metrics.scale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  actionsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    padding: 4,
    width: 30,
    alignItems: 'flex-end',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexBtn: {
    width: Metrics.scale(150),
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(20),
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },

  // ── Overlay shared ─────────────────────────────────────────────────────────
  overlayDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // ── Confirm Acceptance bottom panel ───────────────────────────────────────
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    paddingTop: Metrics.verticalScale(12),
  },
  panelHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    marginBottom: Metrics.verticalScale(8),
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(4),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Metrics.verticalScale(14),
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  totalRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffBadge: {
    backgroundColor: '#E8F7F4',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cancelBtn: {
    marginTop: Metrics.verticalScale(16),
    paddingVertical: 8,
    alignItems: 'center',
  },

  // ── Declined overlay ───────────────────────────────────────────────────────
  declinedOverlay: {
    zIndex: 99999,
    backgroundColor: 'rgba(240,240,240,0.95)',
  },
  redBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.INDIAN_RED,
    paddingHorizontal: Metrics.scale(16),
    paddingVertical: Metrics.verticalScale(12),
    gap: 10,
  },
  bannerIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declinedCardScroll: {
    flexGrow: 1,
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(32),
    paddingBottom: Metrics.verticalScale(40),
  },
  declinedCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: Metrics.scale(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  declinedIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declinedIconInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.INDIAN_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  originalCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: Metrics.scale(16),
    paddingTop: Metrics.verticalScale(14),
    paddingBottom: Metrics.verticalScale(4),
  },
});

export default AlterationRequestModal;
