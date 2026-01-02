import { emailRegex } from '@/utility/regex';
import * as yup from 'yup';

// ---------- Login With Phone Number Schema ----------
export const checkUserisExistSchema = yup.object({
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{8,15}$/, 'Phone number must be 8-15 digits'),
    country: yup
        .object()
        .shape({
            cca2: yup.string().required('Country code is required'),
            callingCode: yup.string().required('Calling code is required'),
        })
        .required(),
});

export type checkUserisExistFormValues = yup.InferType<typeof checkUserisExistSchema>;

// ---------- Login With Phone Number Schema ----------
export const loginWithPhoneSchema = yup.object({
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{8,15}$/, 'Phone number must be 8-15 digits'),
    country: yup
        .object()
        .shape({
            cca2: yup.string().required('Country code is required'),
            callingCode: yup.string().required('Calling code is required'),
        })
        .required(),
});

export type loginWithPhoneFormValues = yup.InferType<typeof loginWithPhoneSchema>;

export const profileSchema = yup.object({
    full_name: yup
        .string()
        .required('Full name is required')
        .min(3, 'Name is too short'),
    gender: yup
        .string()
        .required('Gender is required'),
    country: yup
        .string()
        .required('Country is required'),
    city: yup
        .string()
        .required('City is required'),
    address: yup
        .string()
        .required('Permanent address is required'),
    phone_country: yup
        .object()
        .shape({
            cca2: yup.string().required(),
            callingCode: yup.string().required(),
        })
        .required(),
    phone_number: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{8,15}$/, 'Phone number must be 8-15 digits'),
});

export type profileFormValues = yup.InferType<typeof profileSchema>;


export const changePasswordSchema = yup.object({
    oldPassword: yup
        .string()
        .required('Old password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;