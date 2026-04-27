import i18n from '@/locales/i18n/i18n';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { getChartDataApi, getCitiesApi, getDistrictsApi } from '@/services/authApi';

// ✅ Stable default references outside component to prevent infinite re-renders
const DEFAULT_LIST: any[] = [];
const DEFAULT_CHART = { data: { monthly: '0', yearly: '0', months: [] as number[] } };

const homeSchema = yup.object().shape({
  city: yup.string().required(i18n.t('auth.property_can_earn.validation_city_required')),
  district: yup.string().required(i18n.t('auth.property_can_earn.validation_district_required')),
  bedrooms: yup.string().required(i18n.t('auth.property_can_earn.validation_bedrooms_required')),
});
// AuthTack.CONNECT_CALENDARS_INTRO
export default function usePropertyCanEarnContainer() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(homeSchema),
    defaultValues: { city: '', district: '', bedrooms: '' },
  });

  const selectedcity = watch('city') || '';
  const selecteddistrict = watch('district') || '';
  const selectedbedrooms = watch('bedrooms') || '';

  const isChartQueryEnabled =
    Boolean(selectedcity) && Boolean(selecteddistrict) && Boolean(selectedbedrooms);

  // ✅ Cities
  const { data: cities = DEFAULT_LIST } = useQuery({
    queryKey: [STORAGE_CONST.CITIES],
    queryFn: getCitiesApi,
  });

  // ✅ Districts
  const { data: districts = DEFAULT_LIST } = useQuery({
    queryKey: [STORAGE_CONST.DISTRICTS, selectedcity],
    queryFn: () => getDistrictsApi(selectedcity),
    enabled: !!selectedcity,
  });

  // ✅ Chart Data
  const { data: chartData = DEFAULT_CHART } = useQuery({
    queryKey: [STORAGE_CONST.CHART_DATA, selectedcity, selecteddistrict, selectedbedrooms],
    queryFn: () => getChartDataApi(selectedcity, selecteddistrict, selectedbedrooms),
    enabled: isChartQueryEnabled,
  });

  // ✅ chartPoints memoized properly
  // const chartPoints = useMemo(() => {
  //   const months = chartData?.data?.months;
  //   if (!months || months.length === 0) return [];
  //   return months.map((value: number, index: number) => ({ timestamp: index, value }));
  // }, [chartData]);

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


  const chartPoints = chartData?.data?.months.map((value: number, index: number) => ({
  timestamp: Date.now() + index * 1000, // ya koi bhi unique number
  value,
  month: MONTHS[index], // ← yeh add karo
}));

  // ✅ maxValue and roundedMax inside useMemo to prevent recalc on every render
  const { roundedMax } = useMemo(() => {
    const months = chartData?.data?.months ?? [];
    const maxValue = months.length > 0 ? Math.max(...months) : 0;
    const roundedMax = Math.ceil(maxValue / 5000) * 5000 || 5000;
    return { maxValue, roundedMax };
  }, [chartData]);

  // ✅ yAxisLabels depends only on stable roundedMax
  const yAxisLabels = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const value = roundedMax - i * (roundedMax / 5);
      return value === 0 ? '0' : `SAR ${value / 1000}K`;
    });
  }, [roundedMax]);

  const xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // ✅ availableCityItems depends on stable cities reference
  const availableCityItems = useMemo(
    () => cities?.data?.map((city: string) => ({ label: city, value: city })) ?? [],
    [cities],
  );

  // ✅ availableDistrictItems depends on stable districts reference
  const availableDistrictItems = useMemo(
    () => districts?.data?.map((district: string) => ({ label: district, value: district })) ?? [],
    [districts],
  );

  const onNext = (_data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const goTologinWithPhone = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    setShowResults(false);
    reset();
  }, [reset]);

  const goToConnectAccountIntro = useCallback(
    () => navigate(NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO),
    [],
  );

  return {
    control,
    errors,
    showResults,
    isLoading,
    handleSubmit: handleSubmit(onNext),
    resetView: () => setShowResults(false),
    goTologinWithPhone,
    goToConnectAccountIntro,
    availableCityItems,
    availableDistrictItems,
    selectedcity,
    chartPoints,
    roundedMax,
    yAxisLabels,
    xAxisLabels,
    chartData,
  };
}