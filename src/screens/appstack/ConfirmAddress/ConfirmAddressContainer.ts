import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addressSchema, AddressFormValues, CountryOption } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { 
    createListingDetailsApi,
  editListingApi,
  getListingCityApi,
  getListingCountriesApi,
  getListingDistrictsApi,
  getListingStateApi,
 } from '@/services/ createListingService';

export default function useConfirmAddressContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.id);

  // ── Form ──────────────────────────────────────────────────────────────────
  // Every dropdown stores primitive number id — dropdown matches with ===
  // Full name/cca2 are looked up from API arrays at submit time

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      name:         listing?.name         || 'New Listing',
      country_code: listing?.country_id   ?? undefined,
      state:        listing?.state_id     ?? undefined,
      city:         listing?.city_id      ?? undefined,
      district:     listing?.district_id  ?? undefined,
      address:      listing?.street       || '',
      postalAddress: listing?.apt         || '',
    },
  });

  const selectedCountryId = watch('country_code');
  const selectedStateId   = watch('state');
  const selectedCityId    = watch('city');

  // ── Cascading Queries ─────────────────────────────────────────────────────

  const { data: countriesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_COUNTRIES],
    queryFn:  getListingCountriesApi,
  });

  const { data: statesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_STATE, selectedCountryId],
    queryFn:  () => getListingStateApi({ country_id: Number(selectedCountryId) }),
    enabled:  Boolean(selectedCountryId),
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_CITIES, selectedStateId],
    queryFn:  () => getListingCityApi({ state_id: Number(selectedStateId) }),
    enabled:  Boolean(selectedStateId),
  });

  const { data: districtsData = [] } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_DISTRICTS, selectedCityId],
    queryFn:  () => getListingDistrictsApi({ city_id: Number(selectedCityId) }),
    enabled:  Boolean(selectedCityId),
  });

  // ── Dropdown Options — value is always primitive id ───────────────────────

  const countriesOptions = countriesData.map((item: any) => ({
    label: item.name,
    value: item.id,         // number — matches form value with ===
  }));

  const statesOptions = statesData.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const citiesOptions = citiesData.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const districtsOptions = districtsData.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  // ── Lookup helpers — id → full object at submit time ─────────────────────

  const findCountry  = (id: number) => countriesData.find((c: any) => c.id === id);
  const findState    = (id: number) => statesData.find((s: any)    => s.id === id);
  const findCity     = (id: number) => citiesData.find((c: any)    => c.id === id);
  const findDistrict = (id: number) => districtsData.find((d: any) => d.id === id);

  // ── Build Payload ─────────────────────────────────────────────────────────

  const buildPayload = (data: AddressFormValues): CreateListingDetailsPayload => {
    const countryObj  = findCountry(Number(data.country_code));
    const stateObj    = findState(Number(data.state));
    const cityObj     = findCity(Number(data.city));
    const districtObj = findDistrict(Number(data.district));

    return {
      channel_id,
      listing_id,
      user_id: String(user?.id),
      listing: {
        name: propertyDetail?.name || 'New Listing',
        lat:  propertyDetail?.lat  ?? undefined,
        lng:  propertyDetail?.lng  ?? undefined,

        country_id:   countryObj?.id,
        country_code: countryObj?.sortname,   // "SA"
        country_name: countryObj?.name,       // "Saudi Arabia"

        state_id: stateObj?.id,
        state:    stateObj?.name,

        city_id: cityObj?.id,
        city:    cityObj?.name,

        district_id: districtObj?.id,
        district:    districtObj?.name,

        street: data.address,
        apt:    data.postalAddress,
      },
    };
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const { mutate: createListingDetailsPayload, isPending, isIdle } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onSuccess: ({ message }) => {
        Toast.show({ type: 'success', text1: message || 'Created successfully' });
        navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE);
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  const { mutate: editListingDetailsPayload, isPending: isPendingEdit, isIdle: isIdleEdit } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: editListingApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: message || 'Saved successfully' });
        goBack();
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onNext = (data: AddressFormValues) => {
    // const countryObj  = findCountry(Number(data.country_code));
    // const stateObj    = findState(Number(data.state));
    // const cityObj     = findCity(Number(data.city));
    // const districtObj = findDistrict(Number(data.district));

    // updateListing({
    //   country_id:   countryObj?.id,
    //   country_code: countryObj?.sortname || '',
    //   country_name: countryObj?.name     || '',
    //   state_id:     stateObj?.id,
    //   state:        stateObj?.name       || '',
    //   city_id:      cityObj?.id,
    //   city:         cityObj?.name        || '',
    //   district_id:  districtObj?.id,
    //   district:     districtObj?.name    || '',
    //   street:       data.address,
    //   apt:          data.postalAddress,
    // });
    // createListingDetailsPayload(buildPayload(data));
        navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE);
  };

  const onSaveExit = (data: AddressFormValues) => {
    const countryObj  = findCountry(Number(data.country_code));
    const stateObj    = findState(Number(data.state));
    const cityObj     = findCity(Number(data.city));
    const districtObj = findDistrict(Number(data.district));

    updateListing({
      country_id:   countryObj?.id,
      country_code: countryObj?.sortname || '',
      country_name: countryObj?.name     || '',
      state_id:     stateObj?.id,
      state:        stateObj?.name       || '',
      city_id:      cityObj?.id,
      city:         cityObj?.name        || '',
      district_id:  districtObj?.id,
      district:     districtObj?.name    || '',
      street:       data.address,
      apt:          data.postalAddress,
    });

    const payload = buildPayload(data);
    if (isEdit) {
      editListingDetailsPayload(payload);
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    navigation,
    isLoading: (isPending && !isIdle) || (isPendingEdit && !isIdleEdit),
    isEdit,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
  };
}