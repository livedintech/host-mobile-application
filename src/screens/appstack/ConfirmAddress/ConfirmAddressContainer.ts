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
    clearErrors,
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
  // Normalize away case/diacritics/extra-whitespace differences between
  // Google's geocoded names and the backend's list — otherwise a near-miss
  // silently breaks the whole cascade and the dropdowns never auto-fill
  // ("data freeze" symptom).
  const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g');
  const normalize = (value?: string) =>
    (value || '')
      .normalize('NFD')
      .replace(DIACRITICS_REGEX, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');

  // Google's geocoder and this backend's place list disagree far more than
  // case/diacritics — confirmed live: Google returns "Al Qassim Province"
  // for the exact same region the backend lists only as "Qasim". That's a
  // real spelling variant (Qasim vs Qassim) plus an added "Al " article and
  // " Province" descriptor — normalize() alone can never bridge that.
  // Strip common geographic descriptor words/articles, then allow a small
  // edit-distance ("Levenshtein") tolerance for genuine transliteration
  // spelling variants (Hail/Ha'il, Asir/Aseer, Qasim/Qassim, etc.).
  const GEO_DESCRIPTOR_WORDS = new Set([
    'province', 'region', 'governorate', 'emirate', 'state',
    'prefecture', 'county', 'district', 'municipality', 'area',
  ]);
  const stripGeoWords = (value: string) => {
    const words = value.split(' ').filter(w => w && !GEO_DESCRIPTOR_WORDS.has(w));
    if (words[0] === 'al') words.shift();
    return words.join(' ');
  };
  const levenshteinDistance = (a: string, b: string) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prevRow = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const currRow = [i];
      for (let j = 1; j <= b.length; j++) {
        currRow[j] = a[i - 1] === b[j - 1]
          ? prevRow[j - 1]
          : 1 + Math.min(prevRow[j - 1], prevRow[j], currRow[j - 1]);
      }
      prevRow = currRow;
    }
    return prevRow[b.length];
  };
  const namesAreCloseEnough = (normalizedA: string, normalizedB: string) => {
    if (!normalizedA || !normalizedB) return false;
    if (normalizedA === normalizedB) return true;
    const strippedA = stripGeoWords(normalizedA);
    const strippedB = stripGeoWords(normalizedB);
    if (strippedA === strippedB) return true;
    const longest = Math.max(strippedA.length, strippedB.length);
    const tolerance = Math.max(1, Math.floor(longest * 0.25));
    return levenshteinDistance(strippedA, strippedB) <= tolerance;
  };

  const matchByName = (list: any[], name?: string) => {
    if (!name) return undefined;
    const target = normalize(name);
    return (
      list.find((item: any) => normalize(item.name) === target) ??
      list.find((item: any) => namesAreCloseEnough(normalize(item.name), target))
    );
  };

  // Country is matched by ISO code first (reliable across locales), falling
  // back to a normalized name match for older payloads that lack a code.
  const matchCountry = (list: any[], code?: string, name?: string) => {
    if (code) {
      const target = code.toLowerCase().trim();
      const byCode = list.find(
        (item: any) =>
          item.sortname?.toLowerCase() === target || item.code?.toLowerCase() === target,
      );
      if (byCode) return byCode;
    }
    return matchByName(list, name);
  };

  // Re-sync (not "set once") is what lets the form pick up a pin change made
  // after this screen has already been visited once. The previous guard
  // ("only run if this field has never been set") permanently blocked
  // re-matching after the first successful fill — so going back to the
  // location screen, moving the pin, and returning kept showing the very
  // first resolved address no matter how many times you changed it.
  // Each effect re-fires only when the *source* (propertyDetail) signature
  // actually changes, and cascades a clear down to the dependent dropdowns
  // so a country change can't leave a mismatched state/city/district behind.
  const autoFillRef = useRef({ country: '', state: '', city: '', district: '', street: '', apt: '' });

  // Edit mode's defaultValues come from the original listing (so the
  // "direct edit address" entry point — which never visits the location
  // picker — keeps showing the listing's real saved address). Only trust
  // propertyDetail's geocoded fields in edit mode once there's positive,
  // EXPLICIT proof the picker just ran for this listing right now.
  //
  // This used to be inferred by comparing propertyDetail.lat/lng against
  // the original listing's lat/lng — but propertyDetail is a single GLOBAL
  // store shared across the whole app session (ManageListingContainer's
  // goToPropertyDetail only sets `name` when opening a listing, never
  // resets lat/lng/country/state/city/district). If the user had previously
  // edited a *different* listing's location in this same session, that
  // listing's leftover coordinates would almost certainly differ from this
  // one's, making "pin moved" look true and overwriting this listing's
  // correct, saved address with another listing's unrelated geocoded data.
  // The location picker now tags its navigation with this flag explicitly,
  // so there's zero ambiguity about whose data propertyDetail holds.
  const pinMoved = Boolean(params?.paramData?._locationPickerConfirmed);
  const shouldSyncFromPropertyDetail = !isEdit || pinMoved;

  // clearErrors(name) deletes that field's error directly and synchronously
  // — no schema re-run involved at all. That's deliberate: trigger()/
  // setValue(..., {shouldValidate:true}) both re-run the *entire* yup
  // schema asynchronously, and when up to 4 of these effects fire within
  // the same render commit, multiple overlapping async validation passes
  // can race each other. Since we already know the value we just set is
  // valid — we just matched it against the live options list — there's
  // nothing to "validate"; we just need that one field's stale error gone.
  //
  // Each cascade-clear (state/city/district) below is gated on the new
  // match actually *differing* from what's currently selected. Confirmed
  // live: a fresh mount always runs the country match once regardless of
  // whether the country really changed, and unconditionally wiping its
  // dependents every time meant a single downstream match failure (e.g.
  // the Qasim/Qassim case above) permanently erased a perfectly valid
  // existing state/city/district that never needed to be touched.
  useEffect(() => {
    if (!shouldSyncFromPropertyDetail) return;
    const key = propertyDetail?.country_code || propertyDetail?.country_name || '';
    if (!key || autoFillRef.current.country === key) return;
    const match = matchCountry(countriesData, propertyDetail?.country_code, propertyDetail?.country_name);
    if (!match) return;
    autoFillRef.current.country = key;
    const countryChanged = String(selectedCountryId ?? '') !== String(match.id);
    setValue('country_code', match.id);
    clearErrors('country_code');
    if (countryChanged) {
      autoFillRef.current.state = '';
      autoFillRef.current.city = '';
      autoFillRef.current.district = '';
      setValue('state', undefined as any);
      setValue('city', undefined as any);
      setValue('district', undefined as any);
    }
  }, [countriesData, shouldSyncFromPropertyDetail, propertyDetail?.country_code, propertyDetail?.country_name, selectedCountryId]);

  useEffect(() => {
    if (!shouldSyncFromPropertyDetail) return;
    const key = propertyDetail?.state || '';
    if (!key || autoFillRef.current.state === key) return;
    const match = matchByName(statesData, propertyDetail?.state);
    if (!match) return;
    autoFillRef.current.state = key;
    const stateChanged = String(selectedStateId ?? '') !== String(match.id);
    setValue('state', match.id);
    clearErrors('state');
    if (stateChanged) {
      autoFillRef.current.city = '';
      autoFillRef.current.district = '';
      setValue('city', undefined as any);
      setValue('district', undefined as any);
    }
  }, [statesData, shouldSyncFromPropertyDetail, propertyDetail?.state, selectedStateId]);

  useEffect(() => {
    if (!shouldSyncFromPropertyDetail) return;
    const key = propertyDetail?.city || '';
    if (!key || autoFillRef.current.city === key) return;
    const match = matchByName(citiesData, propertyDetail?.city);
    if (!match) return;
    autoFillRef.current.city = key;
    const cityChanged = String(selectedCityId ?? '') !== String(match.id);
    setValue('city', match.id);
    clearErrors('city');
    if (cityChanged) {
      autoFillRef.current.district = '';
      setValue('district', undefined as any);
    }
  }, [citiesData, shouldSyncFromPropertyDetail, propertyDetail?.city, selectedCityId]);

  useEffect(() => {
    if (!shouldSyncFromPropertyDetail) return;
    const key = propertyDetail?.district || '';
    if (!key || autoFillRef.current.district === key) return;
    const match = matchByName(districtsData, propertyDetail?.district);
    if (!match) return;
    autoFillRef.current.district = key;
    setValue('district', match.id);
    clearErrors('district');
  }, [districtsData, shouldSyncFromPropertyDetail, propertyDetail?.district]);

  // Same re-sync treatment for the free-text fields — otherwise they're
  // also frozen on the first geocoded street/postal code forever.
  useEffect(() => {
    if (!shouldSyncFromPropertyDetail) return;
    if (propertyDetail?.street && autoFillRef.current.street !== propertyDetail.street) {
      autoFillRef.current.street = propertyDetail.street;
      setValue('address', propertyDetail.street);
    }
    if (propertyDetail?.apt && autoFillRef.current.apt !== propertyDetail.apt) {
      autoFillRef.current.apt = propertyDetail.apt;
      setValue('postalAddress', propertyDetail.apt);
    }
  }, [shouldSyncFromPropertyDetail, propertyDetail?.street, propertyDetail?.apt]);

  // ── Lookup helpers ────────────────────────────────────────────────────────
  const findCountry  = (id: number) => countriesData.find((c: any) => c.id === id);
  const findState    = (id: number) => statesData.find((s: any)    => s.id === id);
  const findCity     = (id: number) => citiesData.find((c: any)    => c.id === id);
  const findDistrict = (id: number) => districtsData.find((d: any) => d.id === id);

  // ── Build Payload ─────────────────────────────────────────────────────────
  // In edit mode, only trust propertyDetail's lat/lng if the picker just
  // confirmed them for *this* listing (same reasoning as shouldSyncFromPropertyDetail
  // above) — otherwise propertyDetail may hold a different listing's leftover
  // coordinates from earlier in this app session, and saving would silently
  // corrupt this listing's real location with someone else's.
  const payloadLat = isEdit && !pinMoved ? Number(listing?.lat) : propertyDetail?.lat;
  const payloadLng = isEdit && !pinMoved ? Number(listing?.lng) : propertyDetail?.lng;

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
        lat:          Number.isFinite(payloadLat) ? payloadLat : 24.7136,
        lng:          Number.isFinite(payloadLng) ? payloadLng : 46.6753,
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