import * as yup from 'yup';

export interface MeetingDetailsFormValues {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  countryCode: {
    cca2: string;
    callingCode: string;
  };
}

export const meetingDetailsSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),

  countryCode: yup.object({
      cca2: yup.string().required(),
      callingCode: yup.string().required(),
    }).required(),  

  phone: yup
    .string()
    .required('Phone number is required')
    .min(7, 'Enter a valid phone number'),

  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),

  country: yup
    .string()
    .required('Please select a country'),

  city: yup
    .string()
    .required('Please select a city'),
});