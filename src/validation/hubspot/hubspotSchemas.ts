import * as yup from 'yup';

export interface MeetingDetailsFormValues {
  fullName: string;
  email: string;
  country: number | null;
  state: number | null;
  city: number | null;
  district?: number | null;
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

  email: yup.string().required('Email is required').email('Enter a valid email address'),

  country: yup.number().required('Please select a country').nullable(),
  state: yup.number().required('Please select a state').nullable(),
  city: yup.number().required('Please select a city').nullable(),
  district: yup.number().nullable().notRequired(),
});
