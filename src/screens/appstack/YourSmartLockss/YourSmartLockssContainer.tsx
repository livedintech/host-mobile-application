// import { useForm } from 'react-hook-form';
// import { navigate } from '@/services/navigationService';
// import NavigationRoutes from '@/navigation/NavigationRoutes';
// import {
//   getDropdownListingApi,
//   GetSmartLockListApi,
//   SmartLockMappingsAssignApi,
//   getListings,
// } from '@/services/smartLockApi';
// import STORAGE_CONST from '@/constants/storage';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import Toast from 'react-native-toast-message';
// import {
//   smartLockApiResponseType,
//   smartLockMappingAssignPayloadType,
// } from '@/types/api/smartLockTypes';
// import { queryClient } from '@/services/api';
// import { useEffect, useState } from 'react';

// export default function useYourSmartLockssContainer() {
//   const {
//     control,
//     formState: { errors },
//     setValue,
//   } = useForm();

//   const getBatteryColor = (level: number) => {
//     if (level > 80) return '#00A699';
//     if (level > 20) return '#FBC02D';
//     return '#FF5252';
//   };

//   // Dropdown Listing
//   const { data: dropdownOption = [], isLoading: isLoadingDropdownOption } =
//     useQuery({
//       queryKey: [STORAGE_CONST.GET_SMARTLOCK_DROPDOWN_LIST],
//       queryFn: getDropdownListingApi,
//     });

//   // Transform API response for DropdownField
//   const LISTING_OPTIONS =
//     dropdownOption?.map((item: { id: number; value: string }) => ({
//       label: item.value,
//       value: item.id.toString(), // value ko string me convert karen, React Hook Form ke liye
//     })) || [];

//   // Listing
//   const {
//     data: locksData = [],
//     isLoading: isLoadingLocks,
//     refetch,
//   } = useQuery({
//     queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
//     queryFn: GetSmartLockListApi,
//   });

//   useEffect(() => {
//     if (locksData?.length) {
//       locksData.forEach((lock: any) => {
//         if (lock.listing_id) {
//           setValue(`lock_${lock.lock_id}_listing`, lock.listing_id.toString(), {
//             shouldDirty: false,
//           });
//         }
//       });
//     }
//   }, [locksData]);

//   const {
//     mutate: SmartLockMappingsAssignPayload,
//     isPending,
//     isIdle,
//   } = useMutation<
//     smartLockApiResponseType,
//     Error,
//     smartLockMappingAssignPayloadType
//   >({
//     mutationFn: SmartLockMappingsAssignApi,
//     onSuccess: ({ message }) => {
//       Toast.show({
//         type: 'success',
//         text1: message,
//       });
//       queryClient.invalidateQueries({
//         queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
//       });

//       // queryClient.invalidateQueries({
//       //     queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
//       // });
//       // queryClient.refetchQueries({
//       //     queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
//       // });
//     },
//     onError: error => {
//       Toast.show({
//         type: 'error',
//         text1: error.message || 'Something went wrong',
//       });
//     },
//   });

//   const goToScreen = (lock_id: number) => {
//     navigate(NavigationRoutes.APP_STACK.ACTIVE_CODES, { lock_id });
//   };
//   const selectDropdown = (itemID: string, lock_id: number) => {
//     const payload = {
//       lock_id: lock_id,
//       listing_id: itemID,
//     };

//     SmartLockMappingsAssignPayload(payload);
//   };

//   const { data: listingsData = [], isLoading: isLoadingListings } = useQuery({
//     queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
//     queryFn: getDropdownListingApi, // Using the API function you provided
//   });

//   return {
//     locksData: locksData,
//     listingsData,
//     hasListings: listingsData.length > 0,
//     LISTING_OPTIONS,
//     control,
//     errors,
//     getBatteryColor,
//     handleConnectNewAccount: () =>
//       navigate(NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS),
//     refetch,
//     goToScreen,
//     //   isLoading: isPending || isLoadingLocks,
//     isLoading: isLoadingLocks || isPending,
//     selectDropdown,
//     hasLocks: locksData.length > 0,
//   };
// }



import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  getDropdownListingApi,
  GetSmartLockListApi,
  SmartLockMappingsAssignApi,
} from '@/services/smartLockApi';
import STORAGE_CONST from '@/constants/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  smartLockApiResponseType,
  smartLockMappingAssignPayloadType,
} from '@/types/api/smartLockTypes';
import { queryClient } from '@/services/api';
import { useEffect } from 'react';

export default function useYourSmartLockssContainer() {
  const { control, formState: { errors }, setValue } = useForm();

  // 1. Fetch Listings (Properties) - First priority check
  const { data: listingsData = [], isLoading: isLoadingListings } = useQuery({
    queryKey: [STORAGE_CONST.GET_SMARTLOCK_DROPDOWN_LIST],
    queryFn: getDropdownListingApi,
  });


  // 2. Fetch Smart Locks - Second priority check
  const { data: locksData = [], isLoading: isLoadingLocks, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST],
    queryFn: GetSmartLockListApi,
  });

  const LISTING_OPTIONS = listingsData?.map((item: { id: number; value: string }) => ({
    label: item.value,
    value: item.id.toString(),
  })) || [];
  console.log("tetstst",LISTING_OPTIONS)

  useEffect(() => {
    if (locksData?.length) {
      locksData.forEach((lock: any) => {
        if (lock.listing_id) {
          setValue(`lock_${lock.lock_id}_listing`, lock.listing_id.toString(), { shouldDirty: false });
        }
      });
    }
  }, [locksData]);

  const { mutate: SmartLockMappingsAssignPayload, isPending } = useMutation<
    smartLockApiResponseType, Error, smartLockMappingAssignPayloadType
  >({
    mutationFn: SmartLockMappingsAssignApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_SMARTLOCK_LIST] });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const getBatteryColor = (level: number) => {
    if (level > 80) return '#00A699';
    if (level > 20) return '#FBC02D';
    return '#FF5252';
  };

  return {
    locksData,
    listingsData,
    LISTING_OPTIONS,
    control,
    errors,
    getBatteryColor,
    handleConnectNewAccount: () => navigate(NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS),
    refetch,
    goToScreen: (lock_id: number) => navigate(NavigationRoutes.APP_STACK.ACTIVE_CODES, { lock_id }),
    isLoading: isLoadingLocks || isLoadingListings || isPending,
    selectDropdown: (itemID: string, lock_id: number) => {
      SmartLockMappingsAssignPayload({ lock_id, listing_id: itemID });
    },
  };
}