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

// ─── House Guidelines Schema ─────────────────────────────────────────────────
export const houseGuidelinesSchema = yup.object({
  arrival_guide: yup
    .string()
    .required('Arrival guide is required')
    .min(20, 'Must be at least 20 characters'),

  house_rules: yup
    .string()
    .required('House rules are required')
    .min(20, 'Must be at least 20 characters'),

  checkout_instructions: yup
    .string()
    .required('Checkout instructions are required')
    .min(20, 'Must be at least 20 characters'),
});

export type HouseGuidelinesFormValues = {
  arrival_guide: string;
  house_rules: string;
  checkout_instructions: string;
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Cancel Policies Schema ──────────────────────────────────────────────────
export const cancelPoliciesSchema = yup.object({
  cancel_policy_airbnb: yup
    .string()
    .required('Cancel policy for Airbnb is required'),

  cancel_policy_gathern: yup
    .string()
    .required('Cancel policy for Gathern is required'),

  cancel_policy_booking: yup
    .string()
    .required('Cancel policy for Booking.com is required'),
});

export type CancelPoliciesFormValues = {
  cancel_policy_airbnb: string;
  cancel_policy_gathern: string;
  cancel_policy_booking: string;
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── AI Dynamic Pricing Schema ───────────────────────────────────────────────
export const aiDynamicPricingSchema = yup.object({
  pricing_mode: yup
    .number()
    .typeError('Please select a pricing mode')
    .required('Please select a pricing mode')
    .oneOf([1, 2], 'Invalid pricing mode'),

  manual_price_override: yup
    .boolean()
    .default(false),
});

export type AiDynamicPricingFormValues = {
  pricing_mode: number | null;
  manual_price_override: boolean;
};
// ─────────────────────────────────────────────────────────────────────────────

export const pricingSchema = yup.object().shape({
  weekday_base_price: yup
    .string()
    .required('Weekday base price is required'),

  weekend_base_price: yup
    .string()
    .required('Weekend base price is required'),

  discount: yup
    .string()
    .required('Discount is required'),

  tax_vat: yup
    .string()
    .required('Tax(VAT) is required'),

  markup_price: yup
    .string()
    .required('Markup price is required'),

  cleaning_fee: yup
    .string()
    .required('Cleaning fee is required'),

  airbnb_discount: yup
    .string()
    .required('Airbnb discount is required'),

  gathern_discount: yup
    .string()
    .required('Gathern discount is required'),

  booking_discount: yup
    .string()
    .required('Booking.com discount is required'),

  extra_guest_fee: yup
    .string()
    .required('Extra guest fee is required'),
});

export type PricingFormValues = {
  weekday_base_price: string;
  weekend_base_price: string;
  cleaning_fee: string;
  security_deposit?: string; // Optional if not in form
  extra_guest_fee: string;
  discount: string;
  tax_vat: string;
  markup_price: string;
  airbnb_discount: string;
  gathern_discount: string;
  booking_discount: string;
};

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