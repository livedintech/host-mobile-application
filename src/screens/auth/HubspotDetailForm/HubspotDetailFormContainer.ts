// screens/HubspotMeeting/DetailsScreen/DetailsScreenContainer.ts

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
  'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
  'Pakistan', 'India', 'Egypt', 'Jordan', 'Lebanon', 'Turkey',
  'United Kingdom', 'United States', 'Canada', 'Australia',
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'],
  'UAE':          ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Kuwait':       ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi'],
  'Qatar':        ['Doha', 'Al Wakrah', 'Al Khor'],
  'Bahrain':      ['Manama', 'Muharraq', 'Riffa'],
  'Oman':         ['Muscat', 'Salalah', 'Sohar'],
  'Pakistan':     ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
  'India':        ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'],
  'Egypt':        ['Cairo', 'Alexandria', 'Giza'],
  'Jordan':       ['Amman', 'Zarqa', 'Irbid'],
  'Lebanon':      ['Beirut', 'Tripoli', 'Sidon'],
  'Turkey':       ['Istanbul', 'Ankara', 'Izmir'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds'],
  'United States':  ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  'Canada':       ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
  'Australia':    ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
};

export const COUNTRY_FLAGS: Record<string, string> = {
  'Saudi Arabia': '🇸🇦',
  'UAE': '🇦🇪',
  'Kuwait': '🇰🇼',
  'Qatar': '🇶🇦',
  'Bahrain': '🇧🇭',
  'Oman': '🇴🇲',
  'Pakistan': '🇵🇰',
  'India': '🇮🇳',
  'Egypt': '🇪🇬',
  'Jordan': '🇯🇴',
  'Lebanon': '🇱🇧',
  'Turkey': '🇹🇷',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
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
    formState: { errors },
  } = useForm<MeetingDetailsFormValues>({
    resolver: yupResolver(meetingDetailsSchema) as any,
    defaultValues: {
      fullName: '',
      phone: { 
        phone: incomingPhone,
        actualPhone: incomingPhone,
      },
      email: '',
      country: '',
      city: '',
      countryCode: {
        cca2: 'SA',     
        callingCode: '966',
      },
    },
  });

  const selectedCountry = watch('country');
  const cities = selectedCountry
    ? (CITIES_BY_COUNTRY[selectedCountry] || ['Other'])
    : [];

  const onCountrySelect = (country: string) => {
    setValue('country', country, { shouldValidate: true });
    setValue('city', '', { shouldValidate: false }); // Reset city on country change
  };

  const onCitySelect = (city: string) => {
    setValue('city', city, { shouldValidate: true });
  };

  const onSubmit = (data: MeetingDetailsFormValues) => {
    // 1. Flatten the phone AND merge the payload
    const formattedUserInfo = {
      ...data,
      ...payload, 
      phone: data.phone.phone,
      email: data.email.toLowerCase(),
    };
    // 2. Navigate with the combined clean object
    navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_CALENDAR, { 
      userInfo: formattedUserInfo 
    });
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    selectedCountry,
    cities,
    onCountrySelect,
    onCitySelect,
  };
}