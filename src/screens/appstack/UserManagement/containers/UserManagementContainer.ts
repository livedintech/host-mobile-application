import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { goBack, navigate } from '@/services/navigationService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteUserManagementApi, editUserManagementApi, getUserManagementApi, getUserManagementListingsApi, getUserManagementRoleApi, userManagementCraeteApi } from '@/services/userManagement';
import { userManagementCreateUserApiPayload, userManagementCreateUserApiResponse, userManagementDeleteUserApiPayload, userManagementDeleteUserApiResponse, userManagementEditUserApiPayload, userManagementEditUserApiResponse } from '@/types/api/userManagementTypes';
import STORAGE_CONST from '@/constants/storage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { queryClient } from '@/services/api';
import { useEffect } from 'react';
export interface User {
  id: string;
  name: string;
  role: string;
  access: string;
}
const userManagementSchema = yup.object({
  name: yup.string().required('Name is required'),

  phone: yup
    .string()
    .required('Phone number is required')
    .min(8, 'Invalid phone number'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),

  role: yup.string().required('Role is required'),

  listings: yup
    .array()
    .of(yup.string().notRequired()),

  password: yup
    .string()
    .notRequired()
    .when('role', {
      is: (val: string) => val === 'operator', // ya operator id
      then: schema =>
        schema
          .required('Password is required for operator')
          .min(6, 'Minimum 6 characters'),
    }),
});
export type UserFormData = yup.InferType<typeof userManagementSchema>;


export default function useUserManagementContainer(mode?: 'create' | 'edit') {
  const { params } = useRoute();
  const editUser = params?.editUser;

  const { control, handleSubmit, reset, formState: { errors } } =
    useForm<UserFormData>({
      resolver: yupResolver(userManagementSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        role: '',
        listings: [],
        password: '',
      },
    });


  useEffect(() => {
    if (mode === 'edit' && editUser) {
      if (editUser) {
        reset({
          name: editUser.name,
          phone: editUser?.phone,
          email: editUser?.email,
          role: editUser?.role_id,
          listings: editUser?.listing_scope?.listing_ids,
        });
      }
    }
  }, [mode, reset, editUser]);

  const handleCreateUser = () => {
    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'create' });
  };

  const handleEditUser = (item: { name: string; phone: string; email: string; role_id: number, listing_scope: { listing_ids: number[] } }) => {
    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'edit', editUser: item });
  };

  const handleDeleteUser = (id: number) => {
    userManagementDeletePayload({
      id: id
    })
  };

  const onFormSubmit = (data: UserFormData) => {
    const payload: userManagementCreateUserApiPayload = {
      role_id: data.role,
      name: data.name,
      email: data.email,
      phone: data.phone,
      listing_ids: data.listings,
      surname: '.'
    };
    if (mode === 'create') {
      userManagementCraetePayload(payload);
    } else {
      const editPayload = { id: editUser?.id, ...payload };
      userManagementEditPayload(editPayload);
    }

  };

  // Create User 
  const {
    mutate: userManagementCraetePayload,
    isPending,
    isIdle,
  } = useMutation<userManagementCreateUserApiResponse, Error, userManagementCreateUserApiPayload>({
    mutationFn: userManagementCraeteApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT]
      });
      goBack()
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  // Edit User 
  const {
    mutate: userManagementEditPayload,
    isPending: isPendingUserManagementEdit,
    isIdle: isIdleUserManagementEdit,
  } = useMutation<userManagementEditUserApiResponse, Error, userManagementEditUserApiPayload>({
    mutationFn: editUserManagementApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT]
      });
      goBack()
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });
  // Delete User 
  const {
    mutate: userManagementDeletePayload,
    isPending: isPendingUserManagementDelete,
    isIdle: isIdleUserManagementDelete,
  } = useMutation<userManagementDeleteUserApiResponse, Error, userManagementDeleteUserApiPayload>({
    mutationFn: deleteUserManagementApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT]
      });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  // Lisitngs
  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getUserManagementListingsApi,
  });

  // Roles
  const { data: roles = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_ROLES],
    queryFn: getUserManagementRoleApi,
  });

  // User Management List
  const { data: userManagement = [],isLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT],
    queryFn: getUserManagementApi,
  });

  const listingOptions = listings?.map((item: { name: string, id: string }) => ({
    label: item?.name,
    value: item?.id,
  })) || [];

  const rolesOptions = roles?.map((item: { role_name: string, id: string }) => ({
    label: item?.role_name,
    value: item?.id,
  })) || [];

  return {
    control,
    errors,
    handleSubmit,
    onFormSubmit,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    isLoading:isLoading ||  isPending && !isIdle || isPendingUserManagementEdit && !isIdleUserManagementEdit || isPendingUserManagementDelete && !isIdleUserManagementDelete,
    listingOptions,
    rolesOptions,
    roles,
    userManagement,
    refetch
  };

}