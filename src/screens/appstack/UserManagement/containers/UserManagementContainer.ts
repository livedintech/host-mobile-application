import { useForm } from 'react-hook-form';
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
  getVendorServices
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
  console.log("editUser",editUser);



  // 1. Fetch Roles & Listings
  const { data: roles = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_ROLES],
    queryFn: getUserManagementRoleApi,
  });

  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getUserManagementListingsApi,
  });
  const { data: vendorServices = [] } = useQuery({
    queryKey: ['GET_VENDOR_SERVICES'], // Ensure this key exists in your constants or use string
    queryFn: getVendorServices,
  });
  console.log("vendorServices",vendorServices)

  const {
    data: userManagement = [],
    isLoading: isListLoading,
    refetch,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT],
    queryFn: getUserManagementApi,
  });


  const staffRoleTypeOptions = vendorServices.map((service: any) => ({
    label: service.name || service.label, // Adjust based on your API response keys
    value: service.id || service.value,
  }));

  // 2. Validation Schema
  const userManagementSchema = yup.object({
    name: yup.string().required('Name is required'),
    phoneNumber: yup.string().required('Phone number is required').min(7, 'Invalid phone number'),
    country: yup.object().required(),
    email: yup.string().required('Email is required').email('Invalid email address'),
    role: yup.string().required('Role is required'),
 staffRoleType: yup.array().test('is-staff-req', 'Staff role type is required', function (value) {
    const { role } = this.parent;
    const selectedRole = roles?.find((r: any) => String(r.id) === String(role));
    
    if (selectedRole?.role_type === 'operator') {
      return value && value.length > 0;
    }
    return true;
  }),
    assignAllProperties: yup.boolean(),
    listings: yup.array().when('assignAllProperties', {
      is: false,
      then: (schema) => schema.min(1, 'Please select at least one property').required(),
      otherwise: (schema) => schema.optional(),
    }),
    password: yup.string().test('is-password-req', 'Password is required', function (value) {
      const { role } = this.parent;
      const selectedRole = roles?.find((r: any) => String(r.id) === String(role));
      if (selectedRole?.role_type === 'operator' && !value && mode === 'create') return false;
      return true;
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
      console.log('Listing scope type:', editUser.listing_scope?.type);
const serviceIds = editUser.services?.map((service: any) => service.id) || [];

      reset({
        name: editUser.name,
        phoneNumber: editUser.phone
          ? String(editUser.phone).replace('966', '')
          : '',
        country: { cca2: 'SA', callingCode: '966' },
        email: editUser.email,
        role: Number(editUser.role_id),
        staffRoleType: serviceIds ,
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
    const combinedPhone = `${data.country.callingCode}${data.phoneNumber}`;
    const allIds = listings.map((l: any) => Number(l.id));
    const selectedIds = data.listings?.map((id: any) => Number(id)) || [];

    const finalListingIds = data.assignAllProperties ? allIds : selectedIds;

    const payload = {
      name: data.name,
      email: data.email,
      phone: combinedPhone,
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
          type: data.assignAllProperties ? 'all' : 'specific',
          listing_ids: finalListingIds,
        },
      });
    }
  };

  const handleDeleteUser = (id: number) => {
    console.log("deleteClick",id)
    Alert.alert('Delete User', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
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
    roles,listings,
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
  };
}
