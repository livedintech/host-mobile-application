import { emailRegex } from '@/utility/regex';
import * as yup from 'yup';

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