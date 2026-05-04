import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import Metrics from '@/utility/Metrics';
import useInquiryModalContainer from './useInquiryModalContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import InputField from '@/components/molecules/Input/InputField';

interface Props {
  visible: boolean;
  onClose?: () => void;
  inquiryId: string;
  name?: string;
  description?: string;
  threadType?: string;

  guestName?: string;
  startDate?: string;
  endDate?: string;
}

const InquiryModal = ({
  visible,
  onClose,
  inquiryId,
  name,
  description,
  threadType,
  startDate,
  endDate,
}: Props) => {
  const { t } = useTranslation();
  const {
    viewState,
    control,
    errors,
    isApproving,
    isSendingOffer,
    isBookingLoading,
    handleSpecialOfferClick,
    handlePreApproveClick,
    handleBackToActions,
    handleSubmitForm,
    handleBookingAction,
  } = useInquiryModalContainer({
    onClose,
    inquiryId,
    guestName: name,
    startDate,
    endDate,
  });

  // --- Smooth Animation Logic ---
  const [shouldRender, setShouldRender] = useState(visible);
  const animationValue = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShouldRender(false));
    }
  }, [visible]);

  if (!shouldRender) return null;

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0], // Halka sa upar se neeche slide hoga
  });

  const isLoading = isApproving || isSendingOffer;

  return (
    <Animated.View
      style={[
        styles.absoluteCard,
        { opacity: animationValue, transform: [{ translateY }] },
      ]}
    >
      {/* ---------------- STATE 1: BUTTONS VIEW ---------------- */}
      {viewState === 'actions' && (
        <>
          <View style={styles.headerRow}>
            <View
              style={{
                flex: 1,
              }}
            >
              {name && (
                <AppText
                  text={name}
                  fontSize={18}
                  type="Medium"
                  color={Colors.BLACK}
                  textAlign="center"
                />
              )}
            </View>
            {/* <ButtonView onPress={() => console.log('View Details')}>
                            <AppText text={t('app.inquiry_modal.view_details')} fontSize={14} type="SemiBold" color={Colors.BLACK} style={{ textDecorationLine: 'underline' }} />
                        </ButtonView> */}
          </View>

          <AppText
            text={description}
            fontSize={14}
            color={Colors.DARK_CHARCOAL}
            mt={8}
            mb={20}
            textAlign="center"
          />

          <View style={styles.buttonRow}>
            {threadType === 'reservation_request' ? (
              <>
                <AppButton
                  title={t('app.inquiry_modal.decline_btn')}
                  onPress={() => handleBookingAction('decline_request')}
                  backgroundColor={Colors.WHITE}
                  color={Colors.INDIAN_RED}
                  borderColor={Colors.INDIAN_RED}
                  style={styles.flexBtn}
                  variant="secondary"
                  borderRadius={9}
                  fontSize={11}
                  loading={isBookingLoading}
                />

                <View style={{ width: 10 }} />

                <AppButton
                  title={t('app.inquiry_modal.accept_btn')}
                  onPress={() => handleBookingAction('accept_request')}
                  backgroundColor={Colors.TEAL_PRIMARY_ALT}
                  color={Colors.WHITE}
                  borderColor={Colors.BRUNSWICK_GREEN}
                  style={styles.flexBtn}
                  borderRadius={9}
                  fontSize={11}
                  loading={isBookingLoading}
                />
              </>
            ) : (
              <>
                <AppButton
                  title={t('app.inquiry_modal.special_offer_btn')}
                  onPress={handleSpecialOfferClick}
                  backgroundColor={Colors.WHITE}
                  color={Colors.INDIAN_RED}
                  borderColor={Colors.INDIAN_RED}
                  style={styles.flexBtn}
                  variant="secondary"
                  borderRadius={9}
                  fontSize={11}
                />

                <View style={{ width: 10 }} />

                <AppButton
                  title={t('app.inquiry_modal.pre_approve_btn')}
                  onPress={handlePreApproveClick}
                  backgroundColor={Colors.TEAL_PRIMARY_ALT}
                  color={Colors.WHITE}
                  borderColor={Colors.BRUNSWICK_GREEN}
                  style={styles.flexBtn}
                  borderRadius={9}
                  fontSize={11}
                />
              </>
            )}
          </View>
        </>
      )}

      {/* ---------------- STATE 2: SPECIAL OFFER FORM ---------------- */}
      {viewState === 'specialOffer' && (
        <>
          <View style={styles.headerRowForm}>
            <ButtonView onPress={handleBackToActions} style={styles.backBtn}>
              <Svgicons path="back" size={30} color={Colors.BLACK} />
            </ButtonView>
            <AppText
              text={t('app.inquiry_modal.make_offer_title')}
              fontSize={18}
              type="Bold"
              color={Colors.BLACK}
            />
            <View style={{ width: 20 }} />
          </View>

          <View style={styles.formContent}>
            <InputField
              label={t('app.inquiry_modal.offer_amount_label')}
              name="offerAmount"
              control={control}
              errors={errors}
              placeholder={t('app.inquiry_modal.offer_amount_placeholder')}
              keyboardType="numeric"
              containerStyle={{
                borderColor: Colors.CHARCOAL,
              }}
            />
            <InputField
              label={t('app.inquiry_modal.message_label')}
              name="message"
              control={control}
              errors={errors}
              placeholder={t('app.inquiry_modal.message_placeholder')}
              containerStyle={{
                borderColor: Colors.CHARCOAL,
              }}
            />
            <AppButton
              fontSize={14}
              title={t('app.inquiry_modal.send_offer')}
              onPress={handleSubmitForm}
              loading={isLoading}
              backgroundColor={Colors.BRUNSWICK_GREEN}
              color={Colors.WHITE}
              borderColor={Colors.BRUNSWICK_GREEN}
              mt={20}
            />
          </View>
        </>
      )}

      {/* ---------------- STATE 3: PRE-APPROVE FORM ---------------- */}
      {viewState === 'preApprove' && (
        <>
          <View style={styles.headerRowForm}>
            <ButtonView onPress={handleBackToActions} style={styles.backBtn}>
              <Svgicons path="back" size={30} color={Colors.BLACK} />
            </ButtonView>
            <AppText
              text={t('app.inquiry_modal.pre_approve_title')}
              fontSize={18}
              type="Bold"
              color={Colors.BLACK}
            />
            <View style={{ width: 20 }} />
          </View>

          <View style={styles.formContent}>
            <InputField
              label={t('app.inquiry_modal.message_label')}
              name="message"
              control={control}
              errors={errors}
              placeholder={t('app.inquiry_modal.pre_approve_placeholder')}
              containerStyle={{
                borderColor: Colors.CHARCOAL,
              }}
            />
            <AppButton
              title={t('app.inquiry_modal.send_approval')}
              onPress={handleSubmitForm}
              loading={isLoading}
              backgroundColor={Colors.BRUNSWICK_GREEN}
              color={Colors.WHITE}
              borderColor={Colors.BRUNSWICK_GREEN}
              mt={20}
            />
          </View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteCard: {
    position: 'absolute',
    top: Metrics.verticalScale(80),
    left: Metrics.scale(20),
    right: Metrics.scale(20),
    zIndex: 100,
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    padding: Metrics.scale(29),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 27.8,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexBtn: {
    width: Metrics.scale(150),
  },
  headerRowForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(20),
  },
  backBtn: {
    padding: Metrics.scale(5),
    marginLeft: Metrics.scale(-5),
  },
  formContent: {
    width: '100%',
  },
});

export default InquiryModal;
