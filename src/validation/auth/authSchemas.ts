import { emailRegex } from '@/utility/regex';
import * as yup from 'yup';

// ---------- Login Schema ----------
export const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .matches(emailRegex, 'Please enter a valid email address'),

    password: yup
        .string()
        .required('Password is required'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;