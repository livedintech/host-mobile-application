import * as yup from 'yup';

export interface MeetingDetailsFormValues {
fullName: string;
  email: string;
  city: string;
  country: string;
  phone_number: string;     // e.g., '44448881'
  phone_with_code: string;  // e.g., '966'
  listing_count: number;
  pricing: string;
  // Keep others if needed for your form
  phone?: string; 
  country_code?: string;
}

export const meetingDetailsSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),  

  countryCode: yup.object({
    cca2: yup.string().notRequired().nullable(),
    callingCode: yup.string().notRequired().nullable(),
  }).notRequired(),  

  phone: yup.object({
    phone: yup.string()
      .ensure()
      .notRequired() // 👈 Change this
      .nullable(),   // 👈 And this
    actualPhone: yup.string()
      .ensure()
      .notRequired()
      .nullable(),
  }).notRequired(),

  email: yup.string().required('Email is required').email('Enter a valid email address'),
  country: yup.string().required('Please select a country'),
  city: yup.string().required('Please select a city'),
});