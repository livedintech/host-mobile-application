import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { getChartDataApi, getCitiesApi, getDistrictsApi } from '@/services/authApi';

const homeSchema = yup.object().shape({
  city: yup.string().required('City is required'),
  district: yup.string().required('District is required'),
  bedrooms: yup.string().required('Number of bedrooms is required'),
});

export default function usePropertyCanEarnContainer() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch,reset, formState: { errors } } = useForm({
    resolver: yupResolver(homeSchema),
    defaultValues: { city: '', district: '', bedrooms: '' },
  });

  const selectedcity = watch('city') || '';
  const selecteddistrict = watch('district') || '';
  const selectedbedrooms = watch('bedrooms') || '';

  const isChartQueryEnabled = Boolean(selectedcity) && Boolean(selecteddistrict) && Boolean(selectedbedrooms);

  // Cities
  const { data: cities = [] } = useQuery({
    queryKey: [STORAGE_CONST.CITIES],
    queryFn: getCitiesApi,
  });

  // Districts
  const { data: districts = [] } = useQuery({
    queryKey: [STORAGE_CONST.DISTRICTS, selectedcity],
    queryFn: () => getDistrictsApi(selectedcity),
    enabled: !!selectedcity,
  });

  // Chart Data
  const { data: chartData = { monthly: '0', yearly: '0', months: [] } } = useQuery({
    queryKey: [STORAGE_CONST.CHART_DATA, selectedcity, selecteddistrict, selectedbedrooms],
    queryFn: () => getChartDataApi(selectedcity, selecteddistrict, selectedbedrooms),
    enabled: isChartQueryEnabled,
  });

  const chartPoints = useMemo(() => {
    if (!chartData?.months) return [];
    return chartData.months.map((value:any, index:number) => ({ timestamp: index, value }));
  }, [chartData]);

  const maxValue = Math.max(...(chartData?.months || [0]));
  const roundedMax = Math.ceil(maxValue / 5000) * 5000;

  const yAxisLabels = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const value = roundedMax - i * (roundedMax / 5);
      return value === 0 ? '0' : `SAR ${value / 1000}K`;
    });
  }, [roundedMax]);

  const xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const availableCityItems = useMemo(() => cities.map((city: string) => ({ label: city, value: city })), [cities]);
  const availableDistrictItems = useMemo(() => districts.map((district: string) => ({ label: district, value: district })), [districts]);

  const onNext = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const goTologinWithPhone = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
    setShowResults(false);
    reset()
  }, []);
  const goToConnectAccountIntro = useCallback(() => navigate(NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO), []);

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
    chartData
  };
}
