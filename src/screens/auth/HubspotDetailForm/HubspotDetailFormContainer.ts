import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { meetingDetailsSchema } from '@/validation/hubspot/hubspotSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';

// Keys must match exactly what CountryPicker returns
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
};

export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Riyadh: ['Olaya', 'Malaz', 'Diplomatic Quarter', 'Other'],
  Dubai: ['Marina', 'Downtown', 'Jumeirah', 'Other'],
  Karachi: ['DHA', 'Gulshan', 'Clifton', 'Other'],
};

export default function useHubspotDetailFormContainer() {
  const route = useRoute<any>();
  const payload = route.params?.payload || {};
  const incomingPhone = payload?.phone?.actualPhone || payload?.phone?.phone || '';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(meetingDetailsSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      country: null,
      city: '',
      district: '',
      otherCity: '',
      otherDistrict: '',
      phone: { phone: incomingPhone, actualPhone: incomingPhone },
    },
  });

  const selectedCountryObj = watch('country');
  const selectedCountry = selectedCountryObj?.name || '';
  const selectedCity = watch('city');
  const selectedDistrict = watch('district');

  const cities = selectedCountry ? (CITIES_BY_COUNTRY[selectedCountry] || ['Other']) : [];
  const districts = selectedCity ? (DISTRICTS_BY_CITY[selectedCity] || ['Other']) : [];

  const onCountrySelect = (country: any) => {
    console.log('country', country);

  setValue('country', {
  cca2: country.cca2,
  name: country.name,
  callingCode: country.callingCode?.[0] || '',
}, {
  shouldValidate: true,
  shouldDirty: true,
});

clearErrors('country');
    setValue('city', '');
    setValue('district', '');
    setValue('otherCity', '');
    setValue('otherDistrict', '');
  };

  const onCitySelect = (city: string) => {
    setValue('district', '');
    setValue('otherDistrict', '');
  };

  const onSubmit = (data: any) => {
    const finalCountry = data.country?.name || '';
    const countryCode = data.country?.callingCode || '';
    const finalCity = data.city === 'Other' ? data.otherCity : data.city;
    const finalDistrict = data.district === 'Other' ? data.otherDistrict : data.district;

    const formattedUserInfo = {
      ...payload,
      ...data,
      country: finalCountry,
      country_code: countryCode,
      city: finalCity,
      district: finalDistrict,
      city_if_other: data.district === 'Other' ? data.otherDistrict : '',
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
    selectedCountry,
    selectedCity,
    selectedDistrict,
    cities,
    districts,
    onCountrySelect,
    onCitySelect,
  };
}