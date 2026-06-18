import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { Alert } from 'react-native';
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
  getVendorServices,
} from '@/services/userManagement';
import STORAGE_CONST from '@/constants/storage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function useUserManagementContainer(mode?: 'create' | 'edit') {
  const {user} = useAuthStore();
  const queryClient = useQueryClient();
  const { params } = useRoute<any>();
  const editUser = params?.editUser;

  // 1. Fetch Roles & Listings
  const { data: roles = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_ROLES, user?.id],
    queryFn: getUserManagementRoleApi,
  });

  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING,user?.id],
    queryFn: getUserManagementListingsApi,
  });
  const { data: vendorServices = [] } = useQuery({
    queryKey: ['GET_VENDOR_SERVICES',user?.id], // Ensure this key exists in your constants or use string
    queryFn: getVendorServices,
  });

  const {
    data: userManagement = [],
    isLoading: isListLoading,
    refetch,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT, user?.id],
    queryFn: getUserManagementApi,
  });

  const staffRoleTypeOptions = vendorServices.map((service: any) => ({
    label: service.name || service.label, // Adjust based on your API response keys
    value: service.id || service.value,
  }));

  

  // 2. Validation Schema
  const userManagementSchema = yup.object({
    name: yup.string().required(i18n.t('app.validation.name_required')),
    phoneNumber: yup
      .string()
      .required(i18n.t('app.validation.phone_required'))
      .min(7, 'Invalid phone number'),
    country: yup.object().required(),
    email: yup
      .string()
      .required(i18n.t('app.validation.email_required'))
      .email('Invalid email address'),
    role: yup.string().required(i18n.t('app.validation.role_required')),

    // Conditional Validation for Staff Role Type
    staffRoleType: yup.array().when('role', {
      is: (val: any) => {
        const selectedRole = roles?.find(
          (r: any) => String(r.id) === String(val),
        );
        return selectedRole?.role_type === 'operator';
      },
      then: schema => schema.min(1, i18n.t('app.validation.staff_role_required')).required(),
      otherwise: schema => schema.optional().nullable(),
    }),

    assignAllProperties: yup.boolean(),
    listings: yup.array().when('assignAllProperties', {
      is: false,
      then: schema =>
        schema.min(1, 'Please select at least one property').required(),
      otherwise: schema => schema.optional(),
    }),

    // Conditional Validation for Password
    password: yup.string().when(['role'], {
      is: (role: any) => {
        const selectedRole = roles?.find(
          (r: any) => String(r.id) === String(role),
        );
        return selectedRole?.role_type === 'operator' && mode === 'create';
      },
      then: schema => schema.required(i18n.t('app.validation.password_required')),
      otherwise: schema => schema.optional().nullable(),
    }),
  });

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(userManagementSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      country: { cca2: 'SA', callingCode: '966' },
      email: '',
      role: '',
      staffRoleType: [],
      listings: [],
      password: '',
      assignAllProperties: false,
    },
  });

  // 3. Sync Edit Data
  useEffect(() => {
  if (mode === 'edit' && editUser) {
    const isAll = !!editUser.is_all_listing;
    const serviceIds = editUser.services?.map((service: any) => service.id) || [];
    
    const localPhone =
      editUser.phone && editUser.phone_with_code
        ? editUser.phone.replace(editUser.phone_with_code, '')
        : editUser.phone;

    reset({
      name: editUser.name || '',
      phoneNumber: localPhone || '',
      country: {
        cca2: editUser.country_code || 'SA',
        callingCode: editUser.phone_with_code || '966',
      },
      email: editUser.email || '',
      role: Number(editUser.role_id) || '',
      staffRoleType: serviceIds,
      listings: editUser.listing_scope?.listing_ids?.map(Number) || [],
      password: '',
      assignAllProperties: isAll,
    });

    setValue('assignAllProperties', isAll);
  }
}, [mode, editUser, reset, setValue]);

  // 4. Mutations
  const invalidateMainList = () =>
    queryClient.invalidateQueries({
      queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT],
    });

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

  // 5. Submit Logic
  const onFormSubmit = (data: any) => {
    // const combinedPhone = `${data.country.callingCode}${data.phoneNumber}`;
    const country_code = data.country.cca2;        // 'PK'
    const phone_number = data.phoneNumber;         // '3001234567'
    const phone_with_code = data.country.callingCode; // '92'
    const allIds = listings.map((l: any) => Number(l.id));
    const selectedIds = data.listings?.map((id: any) => Number(id)) || [];

    const finalListingIds = data.assignAllProperties ? allIds : selectedIds;

    const payload = {
  name: data.name,
  email: data.email,
  country_code: country_code,
  phone_number: phone_number,
  phone_with_code: phone_with_code,
  role_id: data.role,
  surname: '.',
  password: data.password,
  is_all_listing: data.assignAllProperties,
  services: data.staffRoleType,
};

    if (mode === 'create') {
      createMutation({ ...payload, listing_ids: finalListingIds });
    } else {
      editMutation({
        id: Number(editUser?.id),
        ...payload,
        listing_scope: {
          type: data.assignAllProperties ? 'specific' : 'specific',
          listing_ids: finalListingIds,
        },
      });
    }
  };

  const handleDeleteUser = (id: number) => {
    Alert.alert('Delete User', 'Are you sure?', [
      { text: i18n.t('common.cancel'), style: 'cancel' },
      {
        text: i18n.t('common.delete'),
        style: 'destructive',
        onPress: () => deleteMutation({ id }),
      },
    ]);
  };

  return {
    control,
    errors,
    handleSubmit,
    onFormSubmit,
    setValue,
    userManagement,
    refetch,
    isLoading: isListLoading,
    isSubmitting: isCreating || isEditing || isDeleting,
    listingOptions: listings.map((i: any) => ({ label: i.name, value: i.id })),
    rolesOptions: roles.map((i: any) => ({ label: i.role_name, value: i.id })),
    staffRoleTypeOptions,
    roles,
    listings,
    handleCreateUser: () =>
      navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, {
        mode: 'create',
      }),
    handleEditUser: (item: any) =>
      navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, {
        mode: 'edit',
        editUser: item,
      }),
    handleDeleteUser,
    permissionToEditPhoneNumber: mode === 'edit' && !!editUser
  };
}
