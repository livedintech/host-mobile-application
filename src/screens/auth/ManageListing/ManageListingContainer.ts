import { useState, useEffect, useCallback, useRef } from 'react';
import { navigate, reset } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getSelectListingApi } from '@/services/authApi';
import STORAGE_CONST from '@/constants/storage';

export default function useManageListingContainer() {
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(null);
  const [showBackModal, setShowBackModal] = useState(false);
  const confirmedRef = useRef(false);
  const navigation = useNavigation();
  const { params } = useRoute();

  const dlName     = (params as any)?.name     || '';
  const dlEmail    = (params as any)?.email    || '';
  const dlCountry  = (params as any)?.country  || '';
  const dlState    = (params as any)?.state    || '';
  const dlCity     = (params as any)?.city     || '';
  const dlDistrict = (params as any)?.district || '';
  const dlRef      = (params as any)?.ref      || '';

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (confirmedRef.current) return;
      if (e.data.action.type === 'RESET') return;
      e.preventDefault();
      setShowBackModal(true);
    });
    return unsubscribe;
  }, [navigation]);

  const confirmGoBack = useCallback(() => {
    confirmedRef.current = true;
    setShowBackModal(false);
    reset(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
  }, []);

  const cancelGoBack = useCallback(() => {
    setShowBackModal(false);
  }, []);

  const onSelect = (value: number | null) => {
    if (!value) return;
    confirmedRef.current = true;
    const payload = {
      country_code:    (params as any)?.country_code,
      phone_number:    (params as any)?.phone_number,
      phone_with_code: (params as any)?.phone_with_code,
      listing_count:   localSelectedId,
      pricing:         plan?.price,
      name:            dlName,
    };
    if (value === 1) {
      navigate(NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT, { payload });
    } else {
      navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_DETAIL_FORM, {
        payload,
        name:     dlName,
        email:    dlEmail,
        phone:    (params as any)?.phone_number,
        country:  dlCountry,
        state:    dlState,
        city:     dlCity,
        district: dlDistrict,
        ref:      dlRef,
      });
    }
  };

  const { data: data = [], isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.SELECT_LISTING],
    queryFn: getSelectListingApi,
  });

  const listingData =
    data
      ?.map((item: { name: string; id: string }) => ({
        label: item.name,
        value: item.id,
      }))
      .reverse() || [];

  const plan = data.find(item => item.id === 1);


  return {
    isLoading: isLoading,
    localSelectedId,
    setLocalSelectedId,
    onSelect,
    listingData,
    refetch,
    showBackModal,
    confirmGoBack,
    cancelGoBack,
  };
}