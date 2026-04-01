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
  'United Kingdom', 'United States', 'Canada', 'Australia', 'Other',
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Other'],
  'UAE':          ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Other'],
  'Kuwait':       ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi', 'Other'],
  'Qatar':        ['Doha', 'Al Wakrah', 'Al Khor', 'Other'],
  'Bahrain':      ['Manama', 'Muharraq', 'Riffa', 'Other'],
  'Oman':         ['Muscat', 'Salalah', 'Sohar', 'Other'],
  'Pakistan':     ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Other'],
  'India':        ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Other'],
  'Egypt':        ['Cairo', 'Alexandria', 'Giza', 'Other'],
  'Jordan':       ['Amman', 'Zarqa', 'Irbid', 'Other'],
  'Lebanon':      ['Beirut', 'Tripoli', 'Sidon', 'Other'],
  'Turkey':       ['Istanbul', 'Ankara', 'Izmir', 'Other'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Other'],
  'United States':  ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Other'],
  'Canada':       ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Other'],
  'Australia':    ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Other'],
  'Other':        ['Other'],
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
  'Other': '🌍',
};

export default function useHubspotDetailFormContainer() {
  const route = useRoute<any>();
  const payload = route.params?.payload || {};
  const incomingPhone = payload?.phone?.actualPhone || '';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MeetingDetailsFormValues>({
    resolver: yupResolver(meetingDetailsSchema),
    defaultValues: {
      fullName: '',
      // Auto-populating the phone number from params
      phone: incomingPhone, 
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
    // Pass all lead info + existing payload data (pricing/listing_count) to CalendarScreen
    navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_CALENDAR, { 
      userInfo: {
        ...data,
        ...payload // preserving listing_count, pricing, etc.
      } 
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