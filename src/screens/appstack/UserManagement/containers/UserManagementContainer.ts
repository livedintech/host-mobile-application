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
import {
  userManagementCreateUserApiPayload,
  userManagementEditUserApiPayload,
} from '@/types/api/userManagementTypes';

const userManagementSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required').min(8, 'Invalid phone number'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  role: yup.string().required('Role is required'),
  listings: yup.array().of(yup.string()).optional(),
  password: yup.string().when('role', {
    is: (val: string) => val === 'operator',
    then: schema => schema.required('Password is required for operator').min(6, 'Min 6 chars'),
    otherwise: schema => schema.notRequired(),
  }),
});

export type UserFormData = yup.InferType<typeof userManagementSchema>;

export default function useUserManagementContainer(mode?: 'create' | 'edit') {
  const queryClient = useQueryClient();
  const { params } = useRoute<any>();
  const editUser = params?.editUser;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: yupResolver(userManagementSchema),
    defaultValues: { name: '', phone: '', email: '', role: '', listings: [], password: '' },
  });

  useEffect(() => {
    if (mode === 'edit' && editUser) {
      reset({
        name: editUser.name,
        phone: editUser.phone,
        email: editUser.email,
        role: editUser.role_id,
        listings: editUser.listing_scope?.listing_ids?.map(Number) || [],
      });
    }
  }, [mode, editUser, reset]);

  // --- Queries ---
  const { data: userManagement = [], isLoading: isListLoading, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT],
    queryFn: getUserManagementApi,
  });

  const { data: listings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getUserManagementListingsApi,
  });

  const { data: roles = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_ROLES],
    queryFn: getUserManagementRoleApi,
  });

  // --- Mutations ---
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

  // --- Submit Handler ---
  const onFormSubmit = (data: UserFormData) => {
    const commonData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role_id: data.role,
      surname: '.',
      password:data.password,
    };

    const listingIds = data.listings?.filter((id): id is string => !!id) || [];

    if (mode === 'create') {
      const createPayload: userManagementCreateUserApiPayload = { ...commonData, listing_ids: listingIds };
      createMutation(createPayload);
    } else {
      const editPayload: userManagementEditUserApiPayload = {
        id: Number(editUser?.id),
        ...commonData,
        listing_scope: { type: 'specific', listing_ids: listingIds },
      };
      editMutation(editPayload);
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onFormSubmit: onFormSubmit as any, // Cast to any to resolve SubmitHandler mismatch
    handleCreateUser: () => navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'create' }),
    handleEditUser: (item: any) => navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'edit', editUser: item }),
    handleDeleteUser: (id: number) => deleteMutation({ id }),
    userManagement,
    refetch,
    isLoading: isListLoading,
    isSubmitting: isCreating || isEditing || isDeleting,
    listingOptions: listings.map((i: any) => ({ label: i.name, value: i.id })),
    rolesOptions: roles.map((i: any) => ({ label: i.role_name, value: i.id })),
    roles,
  };
}