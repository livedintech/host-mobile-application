import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MeetingDetailsFormValues,
  meetingDetailsSchema,
} from '@/validation/hubspot/hubspotSchemas';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';

export const COUNTRIES = [
  'Saudi Arabia',
  'UAE',
  'Pakistan',
  'India',
  'United Kingdom',
  'United States',
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  Kuwait: ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi'],
  Qatar: ['Doha', 'Al Wakrah', 'Al Khor'],
  Bahrain: ['Manama', 'Muharraq', 'Riffa'],
  Oman: ['Muscat', 'Salalah', 'Sohar'],
  Pakistan: [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
  ],
  India: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'],
  Egypt: ['Cairo', 'Alexandria', 'Giza'],
  Jordan: ['Amman', 'Zarqa', 'Irbid'],
  Lebanon: ['Beirut', 'Tripoli', 'Sidon'],
  Turkey: ['Istanbul', 'Ankara', 'Izmir'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
};

export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Riyadh: ['Olaya', 'Malaz', 'Diplomatic Quarter', 'Other'],
  Dubai: ['Marina', 'Downtown', 'Jumeirah', 'Other'],
  Karachi: ['DHA', 'Gulshan', 'Clifton', 'Other'],
};

export const COUNTRY_FLAGS: Record<string, string> = {
  'Saudi Arabia': '🇸🇦',
  UAE: '🇦🇪',
  Kuwait: '🇰🇼',
  Qatar: '🇶🇦',
  Bahrain: '🇧🇭',
  Oman: '🇴🇲',
  Pakistan: '🇵🇰',
  India: '🇮🇳',
  Egypt: '🇪🇬',
  Jordan: '🇯🇴',
  Lebanon: '🇱🇧',
  Turkey: '🇹🇷',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
};

export default function useHubspotDetailFormContainer() {
  const route = useRoute<any>();
  const payload = route.params?.payload || {};
  const incomingPhone =
    payload?.phone?.actualPhone || payload?.phone?.phone || '';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    // Changed to any to allow dynamic 'other' fields if not in schema
    resolver: yupResolver(meetingDetailsSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      country: '',
      city: '',
      district: '',
      otherCity: '',
      otherDistrict: '',
      phone: { phone: incomingPhone, actualPhone: incomingPhone },
    },
  });

  const selectedCountry = watch('country');
  const selectedCity = watch('city');
  const selectedDistrict = watch('district');

  const cities = selectedCountry
    ? CITIES_BY_COUNTRY[selectedCountry] || ['Other']
    : [];
  const districts = selectedCity
    ? DISTRICTS_BY_CITY[selectedCity] || ['Other']
    : [];

  const onCountrySelect = (country: string) => {
    setValue('country', country, { shouldValidate: true });
    setValue('city', '');
    setValue('district', '');
  };

  const onCitySelect = (city: string) => {
    setValue('city', city, { shouldValidate: true });
    setValue('district', '');
  };

  const onDistrictSelect = (district: string) => {
    setValue('district', district, { shouldValidate: true });
  };

  const onSubmit = (data: any) => {
    // Determine final values
    const finalCity = data.city === 'Other' ? data.otherCity : data.city;
    const finalDistrict =
      data.district === 'Other' ? data.otherDistrict : data.district;

    const formattedUserInfo = {
      ...payload,
      ...data,
      city: finalCity,
      district: finalDistrict,
      // Map manual district to city_if_other as requested
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
    onDistrictSelect,
  };
}
