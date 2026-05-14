import * as yup from 'yup';
import { emailRegex } from '@/utility/regex';

export const createBookingSchema = yup.object({
  listing_selection: yup.string().nullable().default(''),
  listing_id: yup.string().optional().default(''),
  // start_date: yup.string().required('Check-in date is required').default(''),
  country: yup
    .object({
      cca2: yup.string().default('SA'),
      callingCode: yup.string().default('966'),
    })
    .when('$bookingType', {
      is: 'direct',
      then: s => s.required(),
      otherwise: s => s.nullable().notRequired(),
    }),

  phoneNumber: yup.string().when('$bookingType', {
    is: 'direct',
    then: s =>
      s
        .required('Phone number is required')
        .matches(/^\d{7,15}$/, 'Invalid phone number'),
    otherwise: s => s.nullable().notRequired(),
  }),

  // phone: yup.string().when('$bookingType', {
  //   is: 'direct',
  //   then: (s) =>
  //     s.required('Phone number is required')
  //     .matches(
  //       /^\+?\d{7,15}$/,
  //       'Phone number must be valid (7-15 digits, + optional)'
  //     ),
  //   otherwise: (s) => s.nullable().notRequired(),
  // }),
  // 1. Start Date Validation
  start_date: yup.string().when('$bookingType', {
    is: 'direct',
    then: s =>
      s
        .required('Start date is required')
        .test(
          'is-not-past',
          'Check-in cannot be in the past',
          function (value) {
            if (!value) return true;
            const selected = new Date(value);
            selected.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return selected >= today;
          },
        ),
    otherwise: s => s.nullable().notRequired(),
  }),

  end_date: yup
    .string()
    .required('End date is required') // Now required for everyone
    .test(
      'is-after-start',
      'End date must be after start date',
      function (value) {
        const { start_date } = this.parent;
        if (!start_date || !value) return true;

        const start = new Date(start_date).setHours(0, 0, 0, 0);
        const end = new Date(value).setHours(0, 0, 0, 0);

        return end > start;
      },
    ),

  // --- PRICING FIELDS (Only required if NOT direct booking) ---
  // rate: yup.string().when('$bookingType', {
  //   is: 'pricing',
  //   then: (s) =>
  //     s.required('Price is required')
  //     .test('max-limit', 'Price cannot exceed SAR 375,000', (value) => {
  //         if (!value) return true;
  //         const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  //         return numericValue <= 375000;
  //     }),
  //   otherwise: (s) => s.nullable().notRequired(),
  // }),

  rate: yup.string().when('$bookingType', {
    is: 'pricing',
    then: s => s.required('Price is required'),
    otherwise: s => s.nullable().notRequired(),
  }),

  // --- DIRECT BOOKING FIELDS (Only required if direct booking) ---
  booking_type: yup.string().when('$bookingType', {
    is: 'direct',
    then: s => s.required('Please select stay type'),
    otherwise: s => s.nullable().notRequired(),
  }),
  name: yup.string().when('$bookingType', {
    is: 'direct',
    then: s => s.required('Name is required'),
    otherwise: s => s.nullable().notRequired(),
  }),
  email: yup.string().when('$bookingType', {
    is: 'direct',
    then: s =>
      s
        .required('Email address is required')
        .matches(emailRegex, 'Invalid email format'),
    otherwise: s => s.nullable().notRequired(),
  }),
});

export type createBookingFormValues = yup.InferType<typeof createBookingSchema>;
