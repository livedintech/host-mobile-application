import * as yup from 'yup';

export interface MeetingDetailsFormValues {
  fullName: string;
  email: string;
  country: string | null;
  city: string | null;
  phone?: string;
  country_code?: string;
}

export const meetingDetailsSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),

  phone: yup.object({
    phone: yup.string().ensure().notRequired().nullable(),
    actualPhone: yup.string().ensure().notRequired().nullable(),
  }).notRequired(),

  email: yup
    .string()
    .trim()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    ),

  country: yup.string().required('Please select a country').nullable(),
  city: yup.string().required('Please select a city').nullable(),
});
