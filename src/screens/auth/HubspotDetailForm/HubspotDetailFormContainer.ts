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
  getCitiesByNameApi,
} from '@/services/ createListingService';

export default function useHubspotDetailFormContainer() {
  const route   = useRoute<any>();
  const payload = route.params?.payload || {};

  const dlName    = route.params?.name    || '';
  const dlEmail   = route.params?.email   || '';
  const dlPhone   = route.params?.phone   || '';
  const dlCountry = route.params?.country || '';
  const dlCity    = route.params?.city    || '';

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
      city:     null,
      phone: { phone: incomingPhone, actualPhone: incomingPhone },
    },
  });

  const selectedCountry = watch('country');

  const { data: countriesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_COUNTRIES],
    queryFn: getListingCountriesApi,
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_CITIES, selectedCountry],
    queryFn: () => getCitiesByNameApi(selectedCountry, ''),
    enabled: Boolean(selectedCountry),
  });

  const countriesOptions = (countriesData as any[]).map(item => ({ label: item.name, value: item.name }));
  const citiesOptions    = (citiesData    as any[]).map(item => ({ label: item.name, value: item.name }));

  const onCountrySelect = () => {
    setValue('city', null);
  };

  useEffect(() => {
    if (!dlCity || (citiesData as any[]).length === 0) return;
    const match = (citiesData as any[]).find(
      c => c.name.toLowerCase() === dlCity.toLowerCase()
    );
    if (match) setValue('city', match.name);
  }, [citiesData]);

  const onSubmit = (data: any) => {
    const formattedUserInfo = {
      ...payload,
      ...data,
      country: data.country || '',
      city:    data.city    || '',
      email:   data.email.toLowerCase(),
      phone:   data.phone?.phone,
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
    countriesOptions,
    citiesOptions,
    onCountrySelect,
  };
}
