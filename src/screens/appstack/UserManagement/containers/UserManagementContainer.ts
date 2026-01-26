import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate, goBack } from '@/services/navigationService';

export interface User {
  id: string;
  name: string;
  role: string;
  access: string;
}

export interface UserFormData {
  username: string;
  phoneNumber: string;
  email: string;
  role: string;
  listings: string[];
  staffRoleType?: string[];
}

// Mock Data managed within the container
const MOCK_USERS: User[] = [
  { id: '1', name: 'Abdur Hassan', role: 'Manager', access: 'Multiple Lists' },
  { id: '2', name: 'Ossama Ahmed', role: 'Manager', access: 'All Lists' },
];

export const ROLE_OPTIONS = [
  { label: 'Owner', value: 'owner' },
  { label: 'Manager', value: 'manager' },
];

export const STAFF_TYPE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Support', value: 'support' },
  { label: 'Maintenance', value: 'maintenance' },
];

export const LISTING_OPTIONS = [
  { label: 'Property Alpha', value: '1' },
  { label: 'Property Beta', value: '2' },
];

export default function useUserManagementContainer(mode?: 'create' | 'edit', userId?: string) {
  const users = MOCK_USERS;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      username: '',
      phoneNumber: '',
      email: '',
      role: '',
      listings: [],
      staffRoleType: [],
    },
  });


  useEffect(() => {
    if (mode === 'edit' && userId) {
      const userToEdit = users.find(u => u.id === userId);
      if (userToEdit) {
        reset({
          username: userToEdit.name,
          phoneNumber: '+966 501234 235',
          email: 'user@example.com',
          role: userToEdit.role.toLowerCase(),
          listings: ['1'],
          staffRoleType: [],
        });
      }
    }
  }, [mode, userId, reset, users]);

  const handleCreateUser = () => {
    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'create' });
  };

  const handleEditUser = (id: string) => {
    navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM, { mode: 'edit', userId: id });
  };

  const handleDeleteUser = (id: string) => {
    Toast.show({ type: 'success', text1: 'User Deleted', position: 'bottom' });
    console.log('Deleted user ID:', id);
  };

  const onFormSubmit = (data: UserFormData) => {
    console.log('Submitting data:', data);
    Toast.show({
      type: 'success',
      text1: mode === 'edit' ? 'User Updated' : 'User Created',
      position: 'bottom',
    });
    goBack();
  };

  return {
    users,
    control,
    errors,
    handleSubmit,
    onFormSubmit,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  };
}