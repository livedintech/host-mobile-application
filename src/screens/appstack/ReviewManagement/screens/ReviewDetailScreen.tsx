import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import i18n from '@/locales/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useTranslation } from 'react-i18next';
import {
  cancelDirectBookingApi,
  getBookingDetailsApi,
} from '@/services/calendarBookingManagement';
import { formatTimeWithPeriod } from '@/utility/formatTime';
import { formatDateDisplay } from '@/utility/formatDate';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useTaskStore } from '@/store/taskStore';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import DirectCancelModal from '@/components/molecules/DirectCancelModal/DirectCancelModal';
const FIGMA_TEAL = '#21AA8F';

const MENU_OPTION_KEYS = {
  CHANGE: 'change_reservation',
  CANCEL: 'cancel_reservation',
} as const;

const MENU_OPTIONS = [
  { key: MENU_OPTION_KEYS.CHANGE, icon: 'pencil' },
  { key: MENU_OPTION_KEYS.CANCEL, icon: 'crossIcon2' },
];

const ReviewDetailScreen = ({ route }: any) => {
  const { t } = useTranslation();

  const initialBookingData = route?.params?.bookingData || {};
  const booking_id = route?.params?.booking_id;
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDirectCancelModal, setShowDirectCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { setTaskInfo } = useTaskStore();
  console.log('booking_iddd', booking_id);

  const handlePress = (item: any) => {
    // Navigate on every status
    setTaskInfo(
      item.id,
      item.task_type_key || item.task_type,
      item.status,
      item.description || item.title,
    );

    navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
      taskId: item.id,
      taskType: item.task_type_key || item.type,
    });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      if (booking_id) {
        await fetchBookingDetails();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (Object.keys(initialBookingData).length === 0 && booking_id) {
      fetchBookingDetails();
    }
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);

      const response = await getBookingDetailsApi(booking_id);

      setApiData(response?.data || response);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const bookingData =
    apiData && Object.keys(apiData).length > 0
      ? apiData
      : initialBookingData || {};
  const {
    guest,
    property,
    guest_property_ratings,
    payment_breakdown,
    tasks,
    ai_chat_summary,
    cancellation_policy,
  } = bookingData;

  console.log('property', property);

  if (isLoading || !bookingData.property) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
      </View>
    );
  }
  const cleanliness = Number(guest_property_ratings?.cleanliness) || 0;
  const accuracy = Number(guest_property_ratings?.accuracy) || 0;
  const communication = Number(guest_property_ratings?.communication) || 0;
  const location = Number(guest_property_ratings?.location) || 0;
  const checkin = Number(guest_property_ratings?.checkin) || 0;
  const value = Number(guest_property_ratings?.value) || 0;

  const ratingValues = [
    cleanliness,
    accuracy,
    communication,
    location,
    checkin,
    value,
  ].filter(val => val > 0);

  const overallRating =
    ratingValues.length > 0
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(
          1,
        )
      : '0.0';

  const ratingItems = [
    { label: t('app.review_detail.overall_rating'), value: overallRating, icon: 'overallRating', isOverall: true },
    { label: t('app.review_detail.cleanliness'), value: cleanliness, icon: 'starIcon' },
    { label: t('app.review_detail.accuracy'), value: accuracy, icon: 'starIcon' },
    { label: t('app.review_detail.communication'), value: communication, icon: 'starIcon' },
    { label: t('app.review_detail.location_rating'), value: location, icon: 'starIcon' },
    { label: t('app.review_detail.checkin_rating'), value: checkin, icon: 'starIcon' },
    { label: t('app.review_detail.value'), value: value, icon: 'starIcon' },
  ];

  const isCheckedOut = property?.status === 'checkedout';

  const handlePopupMenu = (key: string) => {
    const platform = property?.booking_platform;
    const isDirect =
      platform === 'host' ||
      platform === 'host_booking' ||
      platform === 'direct';

    const commonData = {
      booking_id: property?.booking_id,
      guest_name: guest?.full_name || 'the guest',
      listing_id: guest?.listing_id,
      platform: platform,
    };

    if (key === MENU_OPTION_KEYS.CHANGE) {
      navigate(NavigationRoutes.APP_STACK.CHANGE_RESERVATION_SCREEN, {
        bookingData: {
          ...commonData,
          check_in: property?.booking_dates?.from,
          check_out: property?.booking_dates?.to,
          guests: property?.number_of_guests,
          basePrice: payment_breakdown?.booking_cost,
        },
      });
    } else if (key === MENU_OPTION_KEYS.CANCEL) {
      if (isDirect) {
        setShowDirectCancelModal(true);
      } else {
        navigate(NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP1_SCREEN, {
          bookingData: commonData,
        });
      }
    }
  };

  const handleConfirmDirectCancel = async () => {
    setIsCancelling(true);
    try {
      // Calling the API method defined above
      await cancelDirectBookingApi(property?.booking_id, {
        reason: 'HOST_CANCELLED_DIRECT',
      });

      Toast.show({
        type: 'success',
        text1: i18n.t('app.review_detail.booking_cancelled'),
      });
      setShowDirectCancelModal(false);
      goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: i18n.t('app.review_detail.cancel_failed'),
        text2: error?.message || i18n.t('common.toast.something_went_wrong'),
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getPlatformLabel = (platform?: string) => {
    switch (platform) {
      case 'host_booking':
        return 'Livedin';
      case 'bookingcom':
        return 'Booking.com';
      case 'gathern':
        return 'Gathern';
      default:
        return platform
          ? platform.charAt(0).toUpperCase() + platform.slice(1)
          : '';
    }
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <RefreshableScrollView
        contentContainerStyle={styles.scrollContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isLoading={isLoading}
      >
        <View style={styles.styleRow}>
          <View style={styles.arrowCircleInner}>
            <AppPressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </AppPressable>
          </View>
          {/* 1. Calculate filtered options before rendering */}
          {(() => {
            const platform = property?.booking_platform;
            const checkInDateStr = property?.booking_dates?.from;

            // Helper to get normalized dates (midnight) for accurate comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const checkInDate = checkInDateStr
              ? new Date(checkInDateStr)
              : null;
            if (checkInDate) checkInDate.setHours(0, 0, 0, 0);

            const isPreviousDate = checkInDate && checkInDate < today;
            const isToday =
              checkInDate && checkInDate.getTime() === today.getTime();
            const isDirectBooking = ['host', 'host_booking', 'direct'].includes(
              platform,
            );
            const isOTABooking = !isDirectBooking;

            // --- Logic for filtering menu options ---
            const filteredOptions = MENU_OPTIONS.filter(item => {
              if (isDirectBooking && isPreviousDate) {
                return false;
              }

              if (isOTABooking && (isPreviousDate || isToday)) {
                return false;
              }

              if (item.key === MENU_OPTION_KEYS.CHANGE) {
                return isDirectBooking;
              }

              if (item.key === MENU_OPTION_KEYS.CANCEL) {
                return platform !== 'bookingcom';
              }

              return true;
            });

            // If no options remain after filtering, the whole dot icon modal (Menu) returns null
            if (filteredOptions.length === 0) return null;

            return (
              <Menu>
                <MenuTrigger
                  customStyles={{ triggerWrapper: styles.menuTrigger }}
                >
                  <View style={styles.threeDotsContainer}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </MenuTrigger>

                <MenuOptions
                  customStyles={{ optionsContainer: styles.popupMenu }}
                >
                  {filteredOptions.map(item => (
                    <MenuOption
                      key={item.key}
                      style={styles.menuItem}
                      onSelect={() => handlePopupMenu(item.key)}
                    >
                      <AppText
                        text={t(`app.review_detail.${item.key}`)}
                        fontSize={14}
                        color={Colors.CHARCOAL}
                      />
                      <Svgicons path={item.icon as any} size={20} />
                    </MenuOption>
                  ))}
                </MenuOptions>
              </Menu>
            );
          })()}
        </View>

        <AppText
          text={guest?.name || 'Guest Details'}
          type="Medium"
          fontSize={28}
          mb={vs(20)}
          color={Colors.BLACK}
          style={{ paddingHorizontal: s(20) }}
        />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText
              text={t('app.review_detail.guest_details')}
              type="Medium"
              fontSize={18}
              color={Colors.BLACK}
            />
            <View style={styles.iconCircle}>
              <Svgicons path="userIcon2" size={24} />
            </View>
          </View>

          {guest?.email?.trim() ? (
            <View style={styles.guestInfoRow}>
              <View style={styles.rowIconContainer}>
                <Svgicons path="guestEmail" size={50} />
              </View>
              <View style={styles.infoContent}>
                <AppText
                  text={t('app.review_detail.guest_email')}
                  fontSize={13}
                  color={Colors.BLACK}
                  type="Medium"
                />
                <AppText
                  text={guest.email}
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                />
              </View>
            </View>
          ) : null}

          {guest?.contact ? (
            <View style={styles.guestInfoRow}>
              <View style={styles.rowIconContainer}>
                <Svgicons path="guestContact" size={50} />
              </View>

              <View style={styles.infoContent}>
                <AppText
                  text={t('app.review_detail.guest_contact')}
                  fontSize={13}
                  color={Colors.BLACK}
                  type="Medium"
                />

                <AppText
                  text={
                    property?.booking_platform === 'bookingcom'
                      ? guest.contact
                      : `+${guest.contact}`
                  }
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                />
              </View>
            </View>
          ) : null}

          {property?.booking_platform !== 'host_booking' && guest?.rating ? (
            <View style={styles.guestInfoRow}>
              <View style={styles.rowIconContainer}>
                <Svgicons path="guestRating" size={50} />
              </View>

              <View style={styles.infoContent}>
                <AppText
                  text={t('app.review_detail.guest_rating')}
                  fontSize={13}
                  color={Colors.BLACK}
                  type="Medium"
                  mb={2}
                />

                <View style={styles.starRow}>
                  <AppText
                    text={`${guest.rating}/10`}
                    fontSize={13}
                    type="Bold"
                    mr={8}
                    color={Colors.DARK_CHARCOAL}
                  />

                  {[1, 2, 3, 4, 5].map(s => (
                    <Svgicons
                      key={s}
                      path={
                        s <= Number(guest.rating)
                          ? 'reviewStarIcon'
                          : 'reviewStartUnfilledIcon'
                      }
                      size={14}
                      fill={
                        s <= Number(guest.rating)
                          ? Colors.BOTTLE_GREEN
                          : Colors.ARGENT
                      }
                      mr={4}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.gridRow}>
            {/* LEFT SIDE */}
            <View style={styles.gridItem}>
              {/* Check-in Time */}
              {formatTimeWithPeriod(property?.check_in_time) ? (
                <>
                  <AppText
                    text={t('app.review_detail.checkin_time')}
                    fontSize={12}
                    type="Bold"
                    color={Colors.BLACK}
                    mb={2}
                  />
                  <AppText
                    text={formatTimeWithPeriod(property?.check_in_time)}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                  />
                  <View style={styles.hSpacer} />
                </>
              ) : null}

              {/* Check-in Date */}
              {formatDateDisplay(property?.booking_dates?.from) ? (
                <>
                  <AppText
                    text={t('app.review_detail.checkin_date')}
                    fontSize={12}
                    type="Bold"
                    color={Colors.BLACK}
                    mb={2}
                  />
                  <AppText
                    text={formatDateDisplay(property?.booking_dates?.from)}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                  />
                </>
              ) : null}
            </View>

            {/* Divider ONLY if both sides have some data */}
            {(formatTimeWithPeriod(property?.check_in_time) ||
              formatDateDisplay(property?.booking_dates?.from)) &&
              (formatTimeWithPeriod(property?.check_out_time) ||
                formatDateDisplay(property?.booking_dates?.to)) && (
                <View style={styles.vDivider} />
              )}

            {/* RIGHT SIDE */}
            <View style={styles.gridItem}>
              {/* Check-out Time */}
              {formatTimeWithPeriod(property?.check_out_time) ? (
                <>
                  <AppText
                    text={t('app.review_detail.checkout_time')}
                    fontSize={12}
                    type="Bold"
                    color={Colors.BLACK}
                    mb={2}
                  />
                  <AppText
                    text={formatTimeWithPeriod(property?.check_out_time)}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                  />
                  <View style={styles.hSpacer} />
                </>
              ) : null}

              {/* Check-out Date */}
              {formatDateDisplay(property?.booking_dates?.to) ? (
                <>
                  <AppText
                    text={t('app.review_detail.checkout_date')}
                    fontSize={12}
                    type="Bold"
                    color={Colors.BLACK}
                    mb={2}
                  />
                  <AppText
                    text={formatDateDisplay(property?.booking_dates?.to)}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                  />
                </>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.flexRowTwo}>
                <AppText
                  text={t('app.review_detail.property_details')}
                  type="Medium"
                  fontSize={18}
                  mb={6}
                />
                <View style={styles.iconCircle}>
                  <Svgicons path="homeIcon2" size={24} />
                </View>
              </View>
              <AppText
                text={property?.name}
                type="Regular"
                color={Colors.BLACK}
                fontSize={14}
              />
              <AppText
                text={property?.address}
                type="Regular"
                fontSize={12}
                color={Colors.DARK_1C}
                mt={8}
              />
            </View>
          </View>
        </View>

        {property?.booking_platform !== 'host_booking' &&
        property?.confirmation_code ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <AppText
                  text={`${getPlatformLabel(property?.booking_platform)} ${t('app.shared.booking_code')}`}
                  type="Medium"
                  fontSize={18}
                  mb={4}
                />

                <AppText
                  text={property.confirmation_code}
                  fontSize={14}
                  color={Colors.BLACK}
                />
              </View>

              <View style={styles.iconCircle}>
                <Svgicons path="bookingCode" size={24} />
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText
              text={t('app.review_detail.booking_details')}
              type="Medium"
              fontSize={18}
              color={Colors.BLACK}
            />
            <View style={styles.iconCircle}>
              <Svgicons
                path={
                  property?.booking_platform === 'host_booking'
                    ? 'livedinLogo'
                    : property?.booking_platform === 'airbnb'
                    ? 'airbnb'
                    : property?.booking_platform === 'gathern'
                    ? 'gathern'
                    : 'homeIcon'
                }
                size={24}
              />
            </View>
          </View>

          <View style={styles.bookingInfoContainer}>
            <View style={styles.bookingRow}>
              <AppText
                text={t('app.review_detail.date_of_reservation')}
                fontSize={14}
                color={Colors.BLACK}
              />
              <AppText
                text={formatDateDisplay(property?.created_at)}
                fontSize={13}
                color={Colors.DARK_CHARCOAL}
                mt={2}
              />
            </View>
            {property?.booking_platform ? (
              <View style={styles.bookingRow}>
                <AppText
                  text={t('app.review_detail.booking_platform')}
                  fontSize={14}
                  color={Colors.BLACK}
                />
                <AppText
                  text={
                    property.booking_platform === 'host_booking'
                      ? 'Livedin'
                      : property.booking_platform.charAt(0).toUpperCase() +
                        property.booking_platform.slice(1)
                  }
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                  mt={2}
                />
              </View>
            ) : null}

            {property?.number_of_nights ? (
              <View style={styles.bookingRow}>
                <AppText
                  text={t('app.review_detail.num_nights')}
                  fontSize={14}
                  color={Colors.BLACK}
                />
                <AppText
                  text={`${property.number_of_nights} ${t('app.shared.nights')}`}
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                  mt={2}
                />
              </View>
            ) : null}

            {property?.booking_platform !== 'host_booking' &&
            property?.number_of_guests ? (
              <View style={styles.bookingRow}>
                <AppText
                  text={t('app.review_detail.num_guests')}
                  fontSize={14}
                  color={Colors.BLACK}
                />
                <AppText
                  text={`${property.number_of_guests} ${t('app.shared.guests')}`}
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                  mt={2}
                />
              </View>
            ) : null}

            {property?.door_code ? (
              <View style={styles.bookingRow}>
                <AppText
                  text={t('app.review_detail.door_code')}
                  fontSize={14}
                  color={Colors.BLACK}
                />
                <AppText
                  text={property.door_code}
                  fontSize={13}
                  color={Colors.DARK_CHARCOAL}
                  mt={2}
                />
              </View>
            ) : null}
          </View>
        </View>

        {property?.booking_platform !== 'host_booking' && (
          <View style={[styles.card, { display: 'none' }]}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.review_detail.ai_chat_summary')}
                type="Bold"
                fontSize={18}
              />
              <View style={[styles.iconCircle, { backgroundColor: '#F0F7F6' }]}>
                <Svgicons path="aiChat" size={20} />
              </View>
            </View>
            <AppText
              text={ai_chat_summary || 'No chat summary available.'}
              fontSize={13}
              color={Colors.BLACK}
              lineHeight={20}
              mt={10}
              opacity={0.7}
            />
            <ButtonView
              disabled={!guest?.conversation_id}
              style={styles.continueChatBtn}
              onPress={() =>
                navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
                  conversation_id: guest?.conversation_id,
                  listing_id: guest?.listing_id,
                })
              }
            >
              <AppText
                text={t('app.review_detail.continue_chat')}
                type="Bold"
                fontSize={14}
                color={Colors.BLACK}
              />
            </ButtonView>
          </View>
        )}

        {property?.booking_platform !== 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.review_detail.guest_property_ratings')}
                type="Medium"
                fontSize={18}
                color={Colors.BLACK}
              />
              <View style={styles.iconCircle}>
                <Svgicons path="identityCard" size={24} />
              </View>
            </View>
            <View style={styles.ratingContent}>
              <View style={styles.ratingRow}>
                <View style={styles.rowIconContainer}>
                  <Svgicons path="overallRating" size={30} />
                </View>
                <View style={styles.progressContainer}>
                  <AppText
                    text={t('app.review_detail.overall_rating')}
                    fontSize={14}
                    color={Colors.BLACK}
                    type="Medium"
                    mb={vs(5)}
                  />
                  <View style={styles.barWrapper}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            // Universal logic: (Current / Max) * 100
                            width: `${
                              (Number(guest?.rating) /
                                Number(guest?.total_rating)) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <AppText
                      text={guest.rating}
                      fontSize={14}
                      type="Bold"
                      color={Colors.BLACK}
                      ml={s(10)}
                    />
                  </View>
                </View>
              </View>
              {showDetails && (
                <View style={{ marginTop: vs(10) }}>
                  {ratingItems
                    .filter(item => !item.isOverall)
                    .map((item, index) => (
                      <View
                        key={index}
                        style={[styles.ratingRow, { marginTop: vs(12) }]}
                      >
                        <View style={styles.rowIconContainer}>
                          <Svgicons path={item.icon as any} size={18} />
                        </View>
                        <View style={styles.progressContainer}>
                          <AppText
                            text={item.label}
                            fontSize={14}
                            color={Colors.BLACK}
                            type="Medium"
                            mb={vs(5)}
                          />
                          <View style={styles.barWrapper}>
                            <View style={styles.progressBarBg}>
                              <View
                                style={[
                                  styles.progressBarFill,
                                  {
                                    width: `${(Number(item.value) / 5) * 100}%`,
                                  },
                                ]}
                              />
                            </View>
                            <AppText
                              text={item.value.toString()}
                              fontSize={14}
                              type="Bold"
                              color={Colors.BLACK}
                              ml={s(10)}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              )}
              <View style={styles.buttonRow}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    // disabled={guest?.rating == 0}
                    disabled={!isCheckedOut}
                    title={t('app.review_detail.view_details')}
                    fontSize={14}
                    onPress={() =>
                      navigate(
                        NavigationRoutes.APP_STACK
                          .REVIEW_MANAGEMENT_VIEW_SCREEN,
                        {
                          id: guest.review_id,
                        },
                      )
                    }
                    backgroundColor={isCheckedOut ? Colors.PRIMARY_TEAL : ''}
                    color={isCheckedOut ? Colors.WHITE : ''}
                    style={[
                      styles.rateGuestBtn,
                      !isCheckedOut && styles.disabledBtn,
                    ]}
                    borderRadius={100}
                  />
                </View>
                {property.booking_platform !== 'bookingcom' &&
                  guest?.host_review?.total_rating == 0 && (
                    <AppButton
                      disabled={!isCheckedOut}
                      fontSize={14}
                      title={t('app.review_detail.rate_guest_btn')}
                      backgroundColor={isCheckedOut ? Colors.PRIMARY_TEAL : ''}
                      color={isCheckedOut ? Colors.WHITE : ''}
                      style={[
                        styles.rateGuestBtn,
                        !isCheckedOut && styles.disabledBtn,
                      ]}
                      borderRadius={100}
                      onPress={() =>
                        navigate(
                          NavigationRoutes.APP_STACK
                            .REVIEW_MANAGEMENT_GUEST_RATE_SCREEN,
                        )
                      }
                    />
                  )}
              </View>
            </View>
          </View>
        )}

        {property?.booking_platform === 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.review_detail.base_price')}
                type="Bold"
                fontSize={18}
                color={Colors.BLACK}
              />
              <View style={styles.iconCircle}>
                <Svgicons path="baseprice" size={20} />
              </View>
            </View>
            <AppText
              text={'SAR' + payment_breakdown?.booking_cost}
              fontSize={14}
              color={Colors.DARK_CHARCOAL}
            />
          </View>
        )}

        {property?.booking_platform !== 'host_booking' && (
          <View style={[styles.card, { paddingBottom: vs(10) }]}>
            <View style={styles.cardHeader}>
              <AppText
                text={t('app.review_detail.payment_breakdown')}
                type="Medium"
                fontSize={18}
              />
              <View style={styles.iconCircle}>
                <Svgicons path="paymentIconNew2" size={24} />
              </View>
            </View>
            <View style={styles.paymentGrid}>
              {[
                {
                  label: t('app.review_detail.booking_cost'),
                  value: payment_breakdown?.booking_cost,
                },
                {
                  label: t('app.review_detail.discount'),
                  value: payment_breakdown?.discount,
                },
                {
                  label: t('app.review_detail.guest_paid_amount'),
                  value: payment_breakdown?.guest_paid_amount,
                },
                {
                  label: t('app.review_detail.cleaning_fee'),
                  value: payment_breakdown?.cleaning_fee,
                },
                { label: t('app.review_detail.host_share'), value: payment_breakdown?.host_share },
                {
                  label: t('app.review_detail.ota_share'),
                  value: payment_breakdown?.ota_share,
                },
                {
                  label: t('app.review_detail.tax'),
                  value: payment_breakdown?.tax,
                },
              ].map((item, index) => (
                <View key={index} style={styles.paymentItem}>
                  <AppText
                    text={item.label}
                    fontSize={12}
                    color={Colors.BLACK}
                    mb={2}
                  />
                  <AppText
                    text={`SAR ${Number(item.value || 0).toFixed(2)}`}
                    fontSize={14}
                    type="Bold"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText
              text={t('app.review_detail.assigned_task')}
              type="Medium"
              fontSize={18}
              color={Colors.BLACK}
            />
          </View>
          <View style={styles.taskContent}>
            {tasks && tasks.length > 0 ? (
              tasks.map((item: any, index: number) => (
                <View
                  key={item.id || index}
                  style={[
                    styles.taskItemWrapper,
                    index !== 0 && {
                      marginTop: vs(20),
                      borderTopWidth: 1,
                      borderTopColor: '#EEE',
                      paddingTop: vs(15),
                    },
                  ]}
                >
                  <View style={styles.flexRow}>
                    <AppText
                      text={item.title}
                      type="Bold"
                      fontSize={15}
                      color={Colors.BLACK}
                      mb={vs(8)}
                    />
                    <ButtonView
                      onPress={() => handlePress(item)}
                      style={styles.iconCircle}
                    >
                      <Svgicons path="assignTaskNew" size={80} />
                    </ButtonView>
                  </View>
                  <AppText
                    text={item.property_address || item.listing_title}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                    lineHeight={20}
                    mb={vs(15)}
                  />
                  <View style={styles.taskMetaRow}>
                    <Svgicons
                      path="userIcon"
                      size={16}
                      mr={s(8)}
                      fill={Colors.DARK_CHARCOAL}
                    />
                    <AppText
                      text={t('app.shared.assigned_to', { name: item.assigned_user_name || t('app.shared.unassigned') })}
                      fontSize={13}
                      color={Colors.DARK_CHARCOAL}
                    />
                  </View>
                  <View style={styles.taskMetaRow}>
                    <Svgicons
                      path="calendar"
                      size={16}
                      mr={s(8)}
                      fill={Colors.DARK_CHARCOAL}
                    />
                    <AppText
                      text={`Date: ${formatDateDisplay(item.assign_datetime)}`}
                      fontSize={13}
                      color={Colors.DARK_CHARCOAL}
                    />
                  </View>

                  <AppButton
                    title={t('app.review_detail.create_task')}
                    backgroundColor="transparent"
                    variant="secondary"
                    borderColor={Colors.SMOOTH_GREY}
                    mt={30}
                    borderRadius={25}
                    textStyle={{ color: Colors.BLACK }}
                    onPress={() =>
                      navigate(
                        NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING,
                      )
                    }
                  />
                </View>
              ))
            ) : (
              // <AppText
              //   text="No tasks assigned"
              //   fontSize={14}
              //   color={Colors.DARK_CHARCOAL}
              //   textAlign="center"
              //   my={vs(10)}
              // />

              <AppButton
                title={t('app.review_detail.create_new_task')}
                fontSize={14}
                backgroundColor={'rgba(255, 255, 255, 0.6)'}
                color={Colors.BLACK}
                style={[
                  styles.rateGuestBtn,
                  {
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    marginBottom: 30,
                  },
                ]}
                borderRadius={100}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING)
                }
              />
            )}
          </View>
        </View>

        {property?.booking_platform !== 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.headerTextContainer}>
                <AppText
                  text={t('app.review_detail.cancellation_policy')}
                  type="Medium"
                  fontSize={18}
                  color={Colors.BLACK}
                />
                <AppText
                  text={
                    cancellation_policy
                      ? cancellation_policy.charAt(0).toUpperCase() +
                        cancellation_policy.slice(1)
                      : 'Flexible'
                  }
                  fontSize={14}
                  color={Colors.DARK_CHARCOAL}
                />
              </View>
              <View style={styles.iconCircle}>
                <Svgicons path="infoIcon" size={24} />
              </View>
            </View>
          </View>
        )}
      </RefreshableScrollView>

      <DirectCancelModal
        visible={showDirectCancelModal}
        onClose={() => setShowDirectCancelModal(false)}
        onConfirm={handleConfirmDirectCancel}
        isLoading={isCancelling}
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  scrollContent: { paddingHorizontal: s(20), paddingTop: vs(20) },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  menuPopup: {
    position: 'absolute',
    top: vs(60),
    right: s(20),
    backgroundColor: Colors.WHITE,
    borderRadius: ms(12),
    padding: ms(10),
    width: s(180),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: vs(2),
  },
  // EXISTING STYLES
  card: {
    borderRadius: ms(24),
    padding: ms(20),
    marginBottom: vs(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  iconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(16),
    backgroundColor: '#E8F3F1',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  headerTextContainer: { flex: 1, justifyContent: 'center' },
  infoContent: { flex: 1 },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  gridRow: { flexDirection: 'row' },
  gridItem: { flex: 1 },
  vDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: s(15) },
  hSpacer: { height: vs(15) },
  continueChatBtn: {
    marginTop: vs(20),
    height: vs(48),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentItem: { width: '48%', marginBottom: vs(15) },
  bookingInfoContainer: { marginTop: vs(5) },
  bookingRow: { marginBottom: vs(15) },
  taskContent: { marginTop: vs(5) },
  taskItemWrapper: { width: '100%' },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  guestInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(15),
  },
  rowIconContainer: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(5),
  },
  ratingContent: { marginTop: vs(5) },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  progressContainer: { flex: 1, justifyContent: 'center' },
  barWrapper: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: {
    flex: 1,
    height: vs(6),
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#21AA8F',
    borderRadius: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
    gap: 10,
  },
  halfBtn: {
    borderRadius: ms(22.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
  },
  viewDetailsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: '#E0E0E0',
  },
  rateGuestBtn: {
    padding: ms(12),
    flex: 1,
  },
  disabledBtn: {
    backgroundColor: Colors.DISABLED_BG,
    borderColor: Colors.SMOOTH_GREY,
    opacity: 0.8,
  },
  flexRow: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexRowTwo: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  threeDotsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.BLACK,
    marginHorizontal: 2,
  },
  popupMenu: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 220,
    marginTop: 35, // Adjust based on your header height
    // Shadow for the card effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: Colors.WHITE,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuTrigger: {
    padding: 5,
  },
  styleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default ReviewDetailScreen;
