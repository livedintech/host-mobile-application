import React, { useCallback, memo, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import { FormatCurrency } from '@/utility/FormatUtils';

const resolveDayPrice = (
  marking: any,
  dateString: string,
  dailyPriceByDate?: Record<string, number>,
  defaultPrice?: number,
) => {
  const candidates = [
    marking?.price,
    marking?.rate,
    dailyPriceByDate?.[dateString],
    defaultPrice,
  ];
  return candidates.find(
    (value) => value != null && value !== '' && Number(value) > 0,
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALENDAR_PADDING = 0;
const COLUMN_WIDTH = (SCREEN_WIDTH - CALENDAR_PADDING) / 7;
const SELECTION_HEIGHT = vs(46);

// Brand Colors
const COLORS = {
  LIVEDIN_DARK: '#479682',
  LIVEDIN_LIGHT: '#C6E2D9',
  AIRBNB_DARK: '#FF5A5F',
  AIRBNB_LIGHT: 'rgba(255, 90, 95, 0.12)',
  BOOKING_DARK: '#16AEDD',
  BOOKING_LIGHT: 'rgba(0, 53, 128, 0.1)',
  GATHERN_DARK: '#CE92F3',
  GATHERN_LIGHT: '#E4D1F5',
  DEFAULT_BLUE: '#49A6E9',
  DEFAULT_LIGHT: '#E1F1FD',
};

const getOTASource = (source?: string) => {
  const name = source?.toLowerCase() || '';
  if (name.includes('airbnb'))
    return {
      icon: 'airbnbWhite',
      color: COLORS.AIRBNB_DARK,
      light: COLORS.AIRBNB_LIGHT,
    };
  if (name.includes('booking'))
    return {
      icon: 'bookingComWhite',
      color: COLORS.BOOKING_DARK,
      light: COLORS.BOOKING_LIGHT,
    };
  if (name.includes('gathern'))
    return {
      icon: 'gathernWhite',
      color: COLORS.GATHERN_DARK,
      light: COLORS.GATHERN_LIGHT,
    };

  return {
    icon: '',
    color: COLORS.LIVEDIN_DARK,
    light: COLORS.LIVEDIN_LIGHT,
  };
};

const CustomDay = memo(({ date, marking, onPress, defaultPrice, dailyPriceByDate }: any) => {
  const {
    type,
    guest,
    price,
    rate,
    showLabel,
    ota,
    bookingData,
    color: markingColor,
    isArabic,
  } = marking || {};
  const isActive = !!type && type !== 'none';
  // ─── LOGIC: Disable available past dates ───
  const today = new Date().setHours(0, 0, 0, 0);
  const isPast = date.timestamp < today;
  // Disable ONLY if it's in the past AND has no active booking
  const shouldDisable = isPast && !isActive;
  // ───────────────────────────────────────────

  const brand = getOTASource(ota);
  const themeColor = brand.color || markingColor || COLORS.DEFAULT_BLUE;
  const solidLight = brand.light || COLORS.DEFAULT_LIGHT;

  const dateString = date.dateString;
  const arrival = bookingData?.arrival_date || bookingData?.start_date;
  const departure =
    bookingData?.departure_date ||
    bookingData?.calendar_end_date ||
    bookingData?.end_date;

  const isArrival = isActive && dateString === arrival;
  const isDeparture = isActive && dateString === departure;
  const isSingleDay = isActive && isArrival && isDeparture;
  const isStart = isActive && isArrival && !isDeparture;
  const isEnd = isActive && isDeparture && !isArrival;
  const isMid = isActive && !isArrival && !isDeparture;

  const RADIUS = ms(12);

  const truncateName = (name: string, limit: number) => {
    if (!name || typeof name !== 'string') return '';
    return name.length > limit ? `${name.substring(0, limit)}..` : name;
  };

  const isSolidIndicator = isStart || isEnd || isSingleDay;
  const displayName = isSolidIndicator
    ? truncateName(guest, 6)
    : truncateName(guest, 12);
  const iconColor = isMid ? themeColor : '#FFFFFF';
  const displayPrice = resolveDayPrice(
    marking,
    dateString,
    dailyPriceByDate,
    defaultPrice,
  );

  return (
    <View style={[styles.dayCell, shouldDisable && { opacity: 0.3 }]}>
      {isActive && !isSingleDay && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            {
              backgroundColor: solidLight,
              width: '100%',
              left: 0,
              borderTopLeftRadius: isStart ? RADIUS : 0,
              borderBottomLeftRadius: isStart ? RADIUS : 0,
              borderTopRightRadius: isEnd ? RADIUS : 0,
              borderBottomRightRadius: isEnd ? RADIUS : 0,
              zIndex: 1,
            },
          ]}
        />
      )}

      {isSolidIndicator && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            {
              backgroundColor: themeColor,
              width: isSingleDay ? SELECTION_HEIGHT : '100%',
              left: isSingleDay ? (COLUMN_WIDTH - SELECTION_HEIGHT) / 2 : 0,
              borderRadius: RADIUS,
              zIndex: 2,
            },
          ]}
        />
      )}

      <ButtonView
        style={styles.dayContainer}
        onPress={() => !shouldDisable && onPress(date)}
        disabled={shouldDisable}
        activeOpacity={shouldDisable ? 1 : 0.8}
      >
        <View style={styles.contentWrapper}>
          {showLabel && isActive && (
            <View style={styles.labelPositioner} pointerEvents="none">
              <View
                style={[
                  styles.labelRow,
                  isSingleDay && { maxWidth: SELECTION_HEIGHT * 0.9 },
                ]}
              >
                {brand.icon ? (
                  <Svgicons
                    path={brand.icon as any}
                    size={ms(9)}
                    color={iconColor}
                  />
                ) : null}
                {/* <AppText
                  text={displayName}
                  style={[
                    styles.guestTextInside,
                    { color: isMid ? themeColor : '#FFF' } as TextStyle,
                  ]}
                  numberOfLines={1}
                /> */}
              </View>
            </View>
          )}

          <View
            style={[
              styles.textGroup,
              showLabel && isActive && { marginTop: vs(0) },
            ]}
          >
            <Text
              style={[
                styles.dayNumber,
                {
                  color: isActive ? (isMid ? '#000000' : '#FFF') : '#000000',
                  fontSize: isActive ? 14 : 14,
                  fontWeight: isActive ? '600' : '400',
                } as TextStyle,
              ]}
            >
              {date.day}
            </Text>
            {!isActive && displayPrice != null && (
              <Text style={styles.priceText}>
                {FormatCurrency(displayPrice)}
              </Text>
            )}
          </View>
        </View>
      </ButtonView>
    </View>
  );
});

const CustomCalendar = ({
  markedDates,
  dailyPriceByDate,
  onDayPress,
  currentDate,
  defaultPrice,
}: any) => {
  const initial = currentDate ? new Date(currentDate) : new Date();
  const [visibleMonth, setVisibleMonth] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth() + 1,
  });

  const enrichedMarkedDates = useMemo(() => {
    const hasDefault = defaultPrice != null && Number(defaultPrice) > 0;
    const hasDailyMap =
      dailyPriceByDate != null &&
      Object.keys(dailyPriceByDate).length > 0;

    if (!hasDefault && !hasDailyMap) return markedDates ?? {};

    const result = { ...(markedDates ?? {}) };
    const { year, month } = visibleMonth;
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateKey = `${year}-${mm}-${dd}`;
      const isBooked = result[dateKey]?.type && result[dateKey]?.type !== 'none';
      if (isBooked) continue;

      const rate = dailyPriceByDate?.[dateKey] ?? (hasDefault ? defaultPrice : 0);
      if (!rate || rate <= 0) continue;

      const existingPrice = Number(result[dateKey]?.price ?? result[dateKey]?.rate ?? 0);
      result[dateKey] = {
        ...result[dateKey],
        price: existingPrice > 0 ? existingPrice : rate,
        rate: existingPrice > 0 ? existingPrice : rate,
      };
    }

    return result;
  }, [markedDates, dailyPriceByDate, defaultPrice, visibleMonth]);

  const renderDay = useCallback(
    (props: any) => (
      <CustomDay
        {...props}
        defaultPrice={defaultPrice}
        dailyPriceByDate={dailyPriceByDate}
        onPress={onDayPress}
      />
    ),
    [defaultPrice, dailyPriceByDate, onDayPress],
  );

  return (
    <View style={styles.glassCard}>
      <View style={{ direction: 'ltr' }}>
      <Calendar
        current={currentDate}
        markingType="custom"
        markedDates={enrichedMarkedDates}
        onMonthChange={(month: { year: number; month: number }) => {
          setVisibleMonth({ year: month.year, month: month.month });
        }}
        dayComponent={renderDay}
        renderArrow={(dir: any) =>
          dir === 'left' ? (
            <ChevronLeft size={ms(22)} color="#000000" />
          ) : (
            <ChevronRight size={ms(22)} color="#000000" />
          )
        }
        style={{ backgroundColor: 'transparent' }}
        theme={
          {
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            'stylesheet.calendar.main': {
              container: {
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: 'transparent',
              },
              monthView: {
                backgroundColor: 'transparent',
                marginHorizontal: 0,
              },
            },
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                paddingHorizontal: s(10),
              },
              week: {
                marginTop: 7,
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: 'transparent',
                marginHorizontal: 0,
              },
            },
            monthTextColor: '#000000',
            textMonthFontWeight: '700',
            textMonthFontSize: ms(18),
          } as any
        }
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'transparent',
    width: '100%',
    borderRadius: ms(24),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    paddingVertical: vs(10),
    paddingHorizontal: 0,
  },
  dayCell: {
    width: COLUMN_WIDTH,
    height: vs(45),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  selectionBase: {
    position: 'absolute',
    height: SELECTION_HEIGHT,
  },
  dayContainer: {
    width: '100%',
    height: SELECTION_HEIGHT,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelPositioner: {
    position: 'absolute',
    top: vs(7),
    left: vs(10),
    zIndex: 20,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: s(3),
  },
  textGroup: {
    alignItems: 'center',
    marginTop: vs(8),
  },
  guestTextInside: {
    fontSize: ms(6.5),
    fontWeight: '800',
    textAlign: 'center',
  },
  dayNumber: {
    fontSize: ms(13),
    fontWeight: '700',
    lineHeight: ms(15),
  },
  priceText: {
    fontSize: ms(7),
    fontWeight: '600',
    color: '#7B8D88',
  },
});

export default CustomCalendar;
