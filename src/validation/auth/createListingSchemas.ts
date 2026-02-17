import { CountryValue } from '@/components/molecules/Input/CountryPickerField';
import * as yup from 'yup';



export const stepOneSchema = yup.object({
  propertyType: yup
    .string()
    .required('Please select a property type'),
});

export type StepOneFormValues = yup.InferType<typeof stepOneSchema>;


// Types used in container/screen for payload building
export type CountryOption = {
  id: number;
  cca2: string;
  name: string;
};

export type DropdownOption = {
  id: number;
  name: string;
};

export const addressSchema = yup.object({
  name: yup.string().required('Name is required'),

  country_code: yup
    .number()
    .required('Country is required')
    .typeError('Country is required'),

  state: yup
    .number()
    .required('State is required')
    .typeError('State is required'),

  city: yup
    .number()
    .required('City is required')
    .typeError('City is required'),

  district: yup
    .number()
    .required('District is required')
    .typeError('District is required'),

  address:       yup.string().required('Address is required'),
  postalAddress: yup.string().required('Postal address is required'),
});

export type AddressFormValues = yup.InferType<typeof addressSchema>;


// ─── Step 2 Schema (image ke mutabiq) ───────────────────────────────────────
export const stepTwoSchema = yup.object({
  size_sqm: yup
    .string()
    .required('Size is required'),

  bedrooms: yup
    .string()
    .required('Number of Bedrooms is required'),

  beds: yup
    .string()
    .required('Number of Beds is required'),

  kitchen: yup
    .string()
    .required('Kitchen is required')
    .oneOf(['true', 'false'], 'Kitchen must be Yes or No'),

  pool: yup
    .string()
    .required('Pool is required')
    .oneOf(['true', 'false'], 'Pool must be Yes or No'),

  long_term_stay: yup
    .string()
    .required('Long term Stay is required')
    .oneOf(['true', 'false'], 'Long term Stay must be Yes or No'),

  min_gap_night: yup
    .string()
    .required('Minimum Gap Night is required'),

  min_nights: yup
    .string()
    .required('Minimum Night Stay is required'),

  max_nights: yup
    .string()
    .required('Maximum Night Stay is required'),

  amenities: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Please select at least one house feature')
    .required('Please select at least one house feature'),
});

export type StepTwoFormValues = {
  size_sqm: string;
  bedrooms: string;
  beds: string;
  kitchen: string;
  pool: string;
  long_term_stay: string;
  min_gap_night: string;
  min_nights: string;
  max_nights: string;
  amenities: string[];
};
// ─────────────────────────────────────────────────────────────────────────────


export const describeHouseSchema = yup.object().shape({
  name: yup.string().required('House title is required'),
  listing_descriptions: yup.string()
    .required('Description is required')
    .min(10, 'Must be at least 10 characters')
    .max(250, 'Cannot exceed 250 characters'),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

// ─── Booking Details Schema ──────────────────────────────────────────────────
export const bookingDetailsSchema = yup.object({
  booking_type: yup
    .string()
    .required('Booking type is required'),

  guest_eligibility: yup
    .string()
    .required('Guest eligibility is required'),

  check_in_time: yup
    .string()
    .required('Check-in time is required'),

  check_out_time: yup
    .string()
    .required('Check-out time is required'),
});

export type BookingDetailsFormValues = {
  booking_type: string;
  guest_eligibility: string;
  check_in_time: string;
  check_out_time: string;
};
// ─────────────────────────────────────────────────────────────────────────────

export const pricingSchema = yup.object().shape({
  weekdayPrice: yup
    .string()
    .required('Weekday Price is required'),

  weekendPrice: yup
    .string()
    .required('Weekend Price is required'),

  discount: yup
    .string()
    .required('Discount is required'),

  taxVat: yup
    .string()
    .required('Tax(VAT) is required'),

  markup: yup
    .string()
    .required('Markup is required'),

  security_deposit: yup
    .string()
    .required('Security Deposit is required'),

  cleaningFee: yup
    .string()
    .required('Cleaning Fee is required'),
});

export type PricingFormValues = yup.InferType<typeof pricingSchema>;

export const disclosureSchema = yup.object().shape({
  securityCameras: yup.string().required('Please select an option'),
  noiseMonitor: yup.string().required('Please select an option'),
  weaponsOnProperty: yup.string().required('Please select an option'),
});

export type DisclosureFormValues = yup.InferType<typeof disclosureSchema>;

export interface DocumentPickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export const documentUploadSchema = yup.object().shape({
  propertyOwnership: yup
    .mixed<DocumentPickerResult>()
    .nullable()
    .required('Property ownership document is required'),

  authorityLicense: yup
    .mixed<DocumentPickerResult>()
    .nullable()
    .required('Authority license is required'),

  nationalId: yup
    .mixed<DocumentPickerResult>()
    .nullable()
    .required('National ID is required'),
});

export type DocumentFormValues = yup.InferType<typeof documentUploadSchema>;