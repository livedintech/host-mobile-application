// useConfirmAddressContainer.ts
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { addressSchema, AddressFormValues } from '@/validation/auth/createListingSchemas';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
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
  const isEdit  = Boolean(listing?.listing_id);

  // Tracks which dropdowns have data so yup validates them conditionally
  const optionsCtxRef = useRef({ hasCountries: false, hasStates: false, hasCities: false, hasDistricts: false });

  // ── Form ──────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: ((values: any, _ctx: any, options: any) =>
      yupResolver(addressSchema)(values, optionsCtxRef.current, options)) as any,
    defaultValues: {
      name:          listing?.name || i18n.t('common.new_listing'),
      country_code:  listing?.country?.id  ?? undefined,
      state:         listing?.state?.id    ?? undefined,
      city:          listing?.city?.id     ?? undefined,
      district:      listing?.district?.id ?? undefined,
      address:       listing?.street || listing?.address || propertyDetail?.street || '',
      postalAddress: listing?.apt || propertyDetail?.apt || '',
    },
  });

  const selectedCountryId = watch('country_code');
  const selectedStateId   = watch('state');
  const selectedCityId    = watch('city');

  // ── Cascading Queries ─────────────────────────────────────────────────────
  const { data: countriesData = [], isLoading: isLoadingCountriesData } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_COUNTRIES],
    queryFn:  getListingCountriesApi,
  });

  const { data: statesData = [], isLoading: isLoadingStatesData } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_STATE, selectedCountryId],
    queryFn:  () => getListingStateApi({ country_id: Number(selectedCountryId) }),
    enabled:  Boolean(selectedCountryId),
  });

  const { data: citiesData = [], isLoading: isLoadingCitiesData } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_CITIES, selectedStateId],
    queryFn:  () => getListingCityApi({ state_id: Number(selectedStateId) }),
    enabled:  Boolean(selectedStateId),
  });

  const { data: districtsData = [], isLoading: isLoadingDistrictsData } = useQuery({
    queryKey: [STORAGE_CONST.LISTING_CRATE_EDIT_DISTRICTS, selectedCityId],
    queryFn:  () => getListingDistrictsApi({ city_id: Number(selectedCityId) }),
    enabled:  Boolean(selectedCityId),
  });

  // ── Dropdown Options ──────────────────────────────────────────────────────
  const countriesOptions = countriesData.map((item: any) => ({ label: item.name, value: item.id }));
  const statesOptions    = statesData.map((item: any)    => ({ label: item.name, value: item.id }));
  const citiesOptions    = citiesData.map((item: any)    => ({ label: item.name, value: item.id }));
  const districtsOptions = districtsData.map((item: any) => ({ label: item.name, value: item.id }));

  // Keep ref in sync with latest options so resolver reads fresh context on each validation
  optionsCtxRef.current = {
    hasCountries: countriesOptions.length > 0,
    hasStates:    statesOptions.length    > 0,
    hasCities:    citiesOptions.length    > 0,
    hasDistricts: districtsOptions.length > 0,
  };

  // ── Auto-select dropdowns from map-geocoded address (create mode only) ───
  const matchByName = (list: any[], name?: string) =>
    name ? list.find((item: any) => item.name?.toLowerCase().trim() === name.toLowerCase().trim()) : undefined;

  useEffect(() => {
    if (isEdit || selectedCountryId) return;
    const match = matchByName(countriesData, propertyDetail?.country_name);
    if (match) setValue('country_code', match.id);
  }, [countriesData]);

  useEffect(() => {
    if (isEdit || selectedStateId) return;
    const match = matchByName(statesData, propertyDetail?.state);
    if (match) setValue('state', match.id);
  }, [statesData]);

  useEffect(() => {
    if (isEdit || selectedCityId) return;
    const match = matchByName(citiesData, propertyDetail?.city);
    if (match) setValue('city', match.id);
  }, [citiesData]);

  useEffect(() => {
    if (isEdit || watch('district')) return;
    const match = matchByName(districtsData, propertyDetail?.district);
    if (match) setValue('district', match.id);
  }, [districtsData]);

  // ── Lookup helpers ────────────────────────────────────────────────────────
  const findCountry  = (id: number) => countriesData.find((c: any) => c.id === id);
  const findState    = (id: number) => statesData.find((s: any)    => s.id === id);
  const findCity     = (id: number) => citiesData.find((c: any)    => c.id === id);
  const findDistrict = (id: number) => districtsData.find((d: any) => d.id === id);

  // ── Build Payload ─────────────────────────────────────────────────────────
  const buildPayload = (
    data: AddressFormValues,
    isSaveAndExit: boolean = false,
  ): CreateListingDetailsPayload => {
    const countryObj  = findCountry(Number(data.country_code));
    const stateObj    = findState(Number(data.state));
    const cityObj     = findCity(Number(data.city));
    const districtObj = findDistrict(Number(data.district));

    return {
      user_id:       String(user?.id),
      channel_id,
      listing_id:    String(listing_id),
      save_and_exit: isSaveAndExit ? 1 : 0,
      listing: {
        name:         propertyDetail?.name || i18n.t('common.new_listing'),
        street:       data.address,
        apt:          data.postalAddress,
        zipcode:      data.postalAddress,
        city:         cityObj?.name     || '',
        state:        stateObj?.name    || '',
        district:     districtObj?.name || '',
        country_code: countryObj?.sortname || countryObj?.code || '',
        lat:          propertyDetail?.lat ?? 24.7136,
        lng:          propertyDetail?.lng ?? 46.6753,
      },
    };
  };

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createListingDetailsPayload, isPending, isIdle } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onSuccess: ({ message }) => {
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.created') });
        navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE);
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
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
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.saved') });

        // ✅ PROPERTY_DETAIL tak pop karo — dono paths work karenge
        // 1. Direct:       Main → ConfirmAddress (edit) → pops 1 screen
        // 2. Via location: Main → Location → CreateListingStepOne → ConfirmAddress → pops 3 screens
        navigation.dispatch(
          StackActions.popTo(NavigationRoutes.APP_STACK.PROPERTY_DETAIL),
        );
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
      },
    });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: AddressFormValues) => {
    const countryObj = findCountry(Number(data.country_code));
    const stateObj   = findState(Number(data.state));
    const cityObj    = findCity(Number(data.city));

    updateListing({
      street:       data.address,
      apt:          data.postalAddress,
      country_code: countryObj?.sortname || countryObj?.code || '',
      state:        stateObj?.name || '',
      city:         cityObj?.name  || '',
    });

    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE),
    });
  };

  const onSaveExit = (data: AddressFormValues) => {
    updateListing({
      street: data.address,
      apt:    data.postalAddress,
    });

    const payload = buildPayload(data, true);
    if (isEdit) {
      editListingDetailsPayload(payload);
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: () => resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any),
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
    isLoading:
      (isPending && !isIdle) ||
      (isPendingEdit && !isIdleEdit) ||
      isLoadingCountriesData ||
      isLoadingStatesData ||
      isLoadingCitiesData ||
      isLoadingDistrictsData,
    isEdit,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
  };
}