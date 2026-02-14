import * as yup from 'yup';
import { emailRegex } from '@/utility/regex';


export const createBookingSchema = yup.object({
  listing_selection: yup.string().nullable().default(''),
  listing_id: yup.string().required('Please select a property').default(''),
  start_date: yup.string().required('Check-in date is required').default(''),
  end_date: yup.string().required('Check-out date is required')
    .test('not-same-day', 'Check-out must be after check-in', function (value) {
      return !value || value !== this.parent.start_date;
    }).default(''),

  // --- PRICING FIELDS (Only required if NOT direct booking) ---
  rate: yup.string().when('$bookingType', {
    is: 'pricing',
    then: (s) => s.required('Price is required'),
    otherwise: (s) => s.nullable().notRequired(),
  }),

  // --- DIRECT BOOKING FIELDS (Only required if direct booking) ---
  booking_type: yup.string().when('$bookingType', {
    is: 'direct',
    then: (s) => s.required('Please select stay type'),
    otherwise: (s) => s.nullable().notRequired(),
  }),
  name: yup.string().when('$bookingType', {
    is: 'direct',
    then: (s) => s.required('Name is required'),
    otherwise: (s) => s.nullable().notRequired(),
  }),
  email: yup.string().when('$bookingType', {
    is: 'direct',
    then: (s) => s.required('Email address is required').matches(emailRegex, 'Invalid email format'),
    otherwise: (s) => s.nullable().notRequired(),
  }),
  phone: yup.string().when('$bookingType', {
    is: 'direct',
    then: (s) => s.required('Phone number is required').matches(/^\d{8,10}$/, 'Phone number must be 8-10 digits'),
    otherwise: (s) => s.nullable().notRequired(),
  }),
});

export type createBookingFormValues = yup.InferType<typeof createBookingSchema>;
