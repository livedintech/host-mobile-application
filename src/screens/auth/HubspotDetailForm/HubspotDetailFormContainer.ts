import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { meetingDetailsSchema } from '@/validation/hubspot/hubspotSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import {
  getListingCountriesApi,
  getStatesByCountryNameApi,
  getCitiesByNameApi,
  getDistrictsByCityNameApi,
} from '@/services/ createListingService';

export default function useHubspotDetailFormContainer() {
  const route   = useRoute<any>();
  const payload = route.params?.payload || {};

  const dlName     = route.params?.name     || '';
  const dlEmail    = route.params?.email    || '';
  const dlPhone    = route.params?.phone    || '';
  const dlCountry  = route.params?.country  || '';
  const dlState    = route.params?.state    || '';
  const dlCity     = route.params?.city     || '';
  const dlDistrict = route.params?.district || '';

  const incomingPhone = dlPhone || payload?.phone?.actualPhone || payload?.phone?.phone || '';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(meetingDetailsSchema) as any,
    defaultValues: {
      fullName: dlName,
      email:    dlEmail,
      country:  dlCountry || null,
      state:    null,
      city:     null,
      district: null,
      phone: { phone: incomingPhone, actualPhone: incomingPhone },
    },
  });

  const selectedCountry = watch('country');
  const selectedState   = watch('state');
  const selectedCity    = watch('city');

  const { data: countriesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_COUNTRIES],
    queryFn: getListingCountriesApi,
  });

  const { data: statesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_STATE, selectedCountry],
    queryFn: () => getStatesByCountryNameApi(selectedCountry),
    enabled: Boolean(selectedCountry),
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_CITIES, selectedState],
    queryFn: () => getCitiesByNameApi(selectedCountry, selectedState),
    enabled: Boolean(selectedState),
  });

  const { data: districtsData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_DISTRICTS, selectedCity],
    queryFn: () => getDistrictsByCityNameApi(selectedCity),
    enabled: Boolean(selectedCity),
  });

  const countriesOptions = (countriesData as any[]).map(item => ({ label: item.name, value: item.name }));
  const statesOptions    = (statesData    as any[]).map(item => ({ label: item.name, value: item.name }));
  const citiesOptions    = (citiesData    as any[]).map(item => ({ label: item.name, value: item.name }));
  const districtsOptions = (districtsData as any[]).map(item => ({ label: item.name, value: item.name }));

  const onCountrySelect = () => {
    setValue('state',    null);
    setValue('city',     null);
    setValue('district', null);
  };

  const onStateSelect = () => {
    setValue('city',     null);
    setValue('district', null);
  };

  const onCitySelect = () => {
    setValue('district', null);
  };

  useEffect(() => {
    if (!dlState || (statesData as any[]).length === 0) return;
    const match = (statesData as any[]).find(
      s => s.name.toLowerCase() === dlState.toLowerCase()
    );
    if (match) setValue('state', match.name);
  }, [statesData]);

  useEffect(() => {
    if (!dlCity || (citiesData as any[]).length === 0) return;
    const match = (citiesData as any[]).find(
      c => c.name.toLowerCase() === dlCity.toLowerCase()
    );
    if (match) setValue('city', match.name);
  }, [citiesData]);

  useEffect(() => {
    if (!dlDistrict || (districtsData as any[]).length === 0) return;
    const match = (districtsData as any[]).find(
      d => d.name.toLowerCase() === dlDistrict.toLowerCase()
    );
    if (match) setValue('district', match.name);
  }, [districtsData]);

  const onSubmit = (data: any) => {
    const formattedUserInfo = {
      ...payload,
      ...data,
      country:  data.country  || '',
      state:    data.state    || '',
      city:     data.city     || '',
      district: data.district || '',
      email:    data.email.toLowerCase(),
      phone:    data.phone?.phone,
    };

    navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_CALENDAR, {
      userInfo: formattedUserInfo,
    });
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    selectedCountryId: selectedCountry,
    selectedStateId:   selectedState,
    selectedCityId:    selectedCity,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
    onCountrySelect,
    onStateSelect,
    onCitySelect,
  };
}
