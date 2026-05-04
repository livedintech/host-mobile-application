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
  getListingStateApi,
  getListingCityApi,
  getListingDistrictsApi,
} from '@/services/ createListingService';

export default function useHubspotDetailFormContainer() {
  const route = useRoute<any>();
  const payload = route.params?.payload || {};
  const incomingPhone = payload?.phone?.actualPhone || payload?.phone?.phone || '';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(meetingDetailsSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      country: null,
      state: null,
      city: null,
      district: null,
      phone: { phone: incomingPhone, actualPhone: incomingPhone },
    },
  });

  const selectedCountryId = watch('country');
  const selectedStateId = watch('state');
  const selectedCityId = watch('city');

  const { data: countriesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_COUNTRIES],
    queryFn: getListingCountriesApi,
  });

  const { data: statesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_STATE, selectedCountryId],
    queryFn: () => getListingStateApi({ country_id: Number(selectedCountryId) }),
    enabled: Boolean(selectedCountryId),
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_CITIES, selectedStateId],
    queryFn: () => getListingCityApi({ state_id: Number(selectedStateId) }),
    enabled: Boolean(selectedStateId),
  });

  const { data: districtsData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_DISTRICTS, selectedCityId],
    queryFn: () => getListingDistrictsApi({ city_id: Number(selectedCityId) }),
    enabled: Boolean(selectedCityId),
  });

  const countriesOptions = (countriesData as any[]).map((item) => ({ label: item.name, value: item.id }));
  const statesOptions = (statesData as any[]).map((item) => ({ label: item.name, value: item.id }));
  const citiesOptions = (citiesData as any[]).map((item) => ({ label: item.name, value: item.id }));
  const districtsOptions = (districtsData as any[]).map((item) => ({ label: item.name, value: item.id }));

  const onCountrySelect = () => {
    setValue('state', null);
    setValue('city', null);
    setValue('district', null);
  };

  const onStateSelect = () => {
    setValue('city', null);
    setValue('district', null);
  };

  const onCitySelect = () => {
    setValue('district', null);
  };

  const onSubmit = (data: any) => {
    const countryObj = (countriesData as any[]).find((c) => c.id === data.country);
    const stateObj = (statesData as any[]).find((s) => s.id === data.state);
    const cityObj = (citiesData as any[]).find((c) => c.id === data.city);
    const districtObj = (districtsData as any[]).find((d) => d.id === data.district);

    const formattedUserInfo = {
      ...payload,
      ...data,
      country: countryObj?.name || '',
      country_code: countryObj?.phone_code || '',
      state: stateObj?.name || '',
      city: cityObj?.name || '',
      district: districtObj?.name || '',
      country_id: data.country,
      state_id: data.state,
      city_id: data.city,
      district_id: data.district,
      email: data.email.toLowerCase(),
      phone: data.phone?.phone,
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
    selectedCountryId,
    selectedStateId,
    selectedCityId,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
    onCountrySelect,
    onStateSelect,
    onCitySelect,
  };
}
