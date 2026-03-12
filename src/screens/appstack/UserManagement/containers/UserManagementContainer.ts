import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { goBack, navigate } from '@/services/navigationService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteUserManagementApi,
  editUserManagementApi,
  getUserManagementApi,
  getUserManagementListingsApi,
  getUserManagementRoleApi,
  userManagementCraeteApi,
} from '@/services/userManagement';
import STORAGE_CONST from '@/constants/storage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

export default function useUserManagementContainer(mode?: 'create' | 'edit') {
  const queryClient = useQueryClient();
  const { params } = useRoute<any>();
  const editUser = params?.editUser;

  // 1. Get Roles first so we can use them in validation if needed
  const { data: roles = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_ROLES],
    queryFn: getUserManagementRoleApi,
  });

  // 2. Define Schema
  const userManagementSchema = yup.object({
    name: yup.string().required('Name is required'),
    phoneNumber: yup.string().required('Phone number is required').min(7, 'Invalid phone number'),
    country: yup.object().required(), 
    email: yup.string().required('Email is required').email('Invalid email address'),
    role: yup.string().required('Role is required'),
    // listings: yup.array().of(yup.string()).optional(),
    listings: yup.array()
        .of(yup.mixed())
        .min(1, 'Please select at least one listing')
        .required('Listing selection is required'),
    password: yup.string().test('is-password-req', 'Password is required', function(value) {
      const { role } = this.parent;
      const selectedRole = roles?.find((r: any) => String(r.id) === String(role));
      if (selectedRole?.role_type === 'operator' && !value) {
        return false;
      }
      return true;
    }),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<any>({
    resolver: yupResolver(userManagementSchema),
    defaultValues: { 
      name: '', 
      phoneNumber: '', 
      country: { cca2: 'SA', callingCode: '966' }, 
      email: '', 
      role: '', 
      listings: [], 
      password: '' 
    },
  });

  useEffect(() => {
    if (mode === 'edit' && editUser) {
      reset({
        name: editUser.name,
        phoneNumber: editUser.phone ? String(editUser.phone).replace('966', '') : '',
        country: { cca2: 'SA', callingCode: '966' },
        email: editUser.email,
        role: Number(editUser.role_id),
        listings: editUser.listing_scope?.listing_ids?.map(Number) || [],
        password: '',
      });
    }
  }, [mode, editUser, reset]);

  // --- Other Queries ---
  const { data: userManagement = [], isLoading: isListLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT],
    queryFn: getUserManagementApi,
  });

  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getUserManagementListingsApi,
  });

  const invalidateMainList = () => {
    queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT] });
  };

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: userManagementCraeteApi,
    onSuccess: res => {
      Toast.show({ type: 'success', text1: res.message });
      invalidateMainList();
      goBack();
    },
    onError: (err: any) => Toast.show({ type: 'error', text1: err.message }),
  });

  const { mutate: editMutation, isPending: isEditing } = useMutation({
    mutationFn: editUserManagementApi,
    onSuccess: res => {
      Toast.show({ type: 'success', text1: res.message });
      invalidateMainList();
      goBack();
    },
    onError: (err: any) => Toast.show({ type: 'error', text1: err.message }),
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserManagementApi,
    onSuccess: res => {
      Toast.show({ type: 'success', text1: res.message });
      invalidateMainList();
    },
    onError: (err: any) => Toast.show({ type: 'error', text1: err.message }),
  });

  const onFormSubmit = (data: any) => {
    const combinedPhoneNumber = `${data.country.callingCode}${data.phoneNumber}`;
    const commonData = {
      name: data.name,
      email: data.email,
      phone: combinedPhoneNumber, 
      role_id: data.role,
      surname: '.',
      password: data.password,
    };
    const listingIds = data.listings?.filter((id: any) => !!id) || [];

    if (mode === 'create') {
      createMutation({ ...commonData, listing_ids: listingIds });
    } else {
      editMutation({
        id: Number(editUser?.id),
        ...commonData,
        listing_scope: { type: 'specific', listing_ids: listingIds },
      });
    }
  };

  return {
    control, errors, handleSubmit, onFormSubmit,
    userManagement, refetch, isLoading: isListLoading,
    isSubmitting: isCreating || isEditing || isDeleting,
    listingOptions: listings.map((i: any) => ({ label: i.name, value: i.id })),
    rolesOptions: roles.map((i: any) => ({ label: i.role_name, value: i.id })),
    roles,
    handleCreateUser: () => navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'create' }),
    handleEditUser: (item: any) => navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'edit', editUser: item }),
    handleDeleteUser: (id: number) => deleteMutation({ id }),
  };
}