import { CountryValue } from '@/components/molecules/Input/CountryPickerField';
import i18n from '@/locales/i18n/i18n';
import * as yup from 'yup';



export const stepOneSchema = yup.object({
  propertyType: yup
    .string()
    .required(i18n.t('app.validation.property_type_required')),
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
  name: yup.string().required(i18n.t('app.validation.name_required')),

  country_code: yup.number().when('$hasCountries', {
    is: true,
    then: (s) => s.required(i18n.t('app.validation.country_required')).typeError(i18n.t('app.validation.country_required')),
    otherwise: (s) => s.nullable().optional(),
  }),

  state: yup.number().when('$hasStates', {
    is: true,
    then: (s) => s.required(i18n.t('app.validation.state_required')).typeError(i18n.t('app.validation.state_required')),
    otherwise: (s) => s.nullable().optional(),
  }),

  city: yup.number().when('$hasCities', {
    is: true,
    then: (s) => s.required(i18n.t('app.validation.city_required')).typeError(i18n.t('app.validation.city_required')),
    otherwise: (s) => s.nullable().optional(),
  }),

  district: yup.number().when('$hasDistricts', {
    is: true,
    then: (s) => s.required(i18n.t('app.validation.district_required')).typeError(i18n.t('app.validation.district_required')),
    otherwise: (s) => s.nullable().optional(),
  }),

  address:       yup.string()
    .required(i18n.t('app.validation.address_required'))
    .max(255, i18n.t('app.confirm_address.validation_address_max')),
  postalAddress: yup.string()
    .required(i18n.t('app.validation.postal_required'))
    .max(255, i18n.t('app.confirm_address.validation_postal_max')),
});

export type AddressFormValues = {
  name: string;
  country_code: number | undefined;
  state: number | undefined;
  city: number | undefined;
  district: number | undefined;
  address: string;
  postalAddress: string;
};


// ─── Step 2 Schema (image ke mutabiq) ───────────────────────────────────────
export const stepTwoSchema = yup.object({
  size_sqm: yup
    .string()
    .required(i18n.t('app.validation.size_required')),

  bedrooms: yup
    .string()
    .required(i18n.t('app.validation.bedrooms_required')),

  beds: yup
    .string()
    .required(i18n.t('app.validation.beds_required')),

  kitchen: yup
    .string()
    .required(i18n.t('app.validation.kitchen_required'))
    .oneOf(['true', 'false'], i18n.t('app.validation.kitchen_invalid')),

  pool: yup
    .string()
    .required(i18n.t('app.validation.pool_required'))
    .oneOf(['true', 'false'], i18n.t('app.validation.pool_invalid')),

  long_term_stay: yup
    .string()
    .required(i18n.t('app.validation.long_term_stay_required'))
    .oneOf(['true', 'false'], i18n.t('app.validation.long_term_stay_invalid')),

  min_gap_night: yup
    .string()
    .required(i18n.t('app.validation.min_gap_night_required')),

  min_nights: yup
    .string()
    .required(i18n.t('app.validation.min_nights_required')),

  max_nights: yup
    .string()
    .required(i18n.t('app.validation.max_nights_required')),

  amenities: yup
    .array()
    .of(yup.string().required())
    .min(1, i18n.t('app.validation.amenities_required'))
    .required(i18n.t('app.validation.amenities_required')),
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
  name: yup.string().required(i18n.t('app.validation.house_title_required')),
  listing_descriptions: yup.string()
    .required(i18n.t('app.describe_house.validation_description_required'))
    .min(10, i18n.t('app.validation.description_min_10'))
    .max(250, i18n.t('app.validation.description_max_250')),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

// ─── Booking Details Schema ──────────────────────────────────────────────────
export const bookingDetailsSchema = yup.object({
  booking_type: yup
    .string()
    .required(i18n.t('app.validation.booking_type_required')),

  guest_eligibility: yup
    .string()
    .required(i18n.t('app.validation.guest_eligibility_required')),

  check_in_time: yup
    .string()
    .required(i18n.t('app.validation.checkin_time_required')),

  check_out_time: yup
    .string()
    .required(i18n.t('app.validation.checkout_time_required')),
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
    .required(i18n.t('app.validation.arrival_guide_required'))
    .min(20, i18n.t('app.validation.min_20_chars')),

  house_rules: yup
    .string()
    .required(i18n.t('app.validation.property_rules_required'))
    .min(20, i18n.t('app.validation.min_20_chars')),

  checkout_instructions: yup
    .string()
    .required(i18n.t('app.validation.checkout_instructions_required'))
    .min(20, i18n.t('app.validation.min_20_chars')),
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
    .required(i18n.t('app.validation.airbnb_policy_required')),

  cancel_policy_gathern: yup
    .string()
    .required(i18n.t('app.validation.gathern_policy_required')),

  cancel_policy_booking: yup
    .string()
    .required(i18n.t('app.validation.bookingcom_policy_required')),
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
    .typeError(i18n.t('app.validation.pricing_mode_required'))
    .required(i18n.t('app.validation.pricing_mode_required'))
    .oneOf([1, 2], i18n.t('app.validation.pricing_mode_invalid')),

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
    .required(i18n.t('app.validation.weekday_base_price_required')),

  weekend_base_price: yup
    .string()
    .required(i18n.t('app.validation.weekend_base_price_required')),

  discount: yup
    .string()
    .required(i18n.t('app.validation.discount_required')),

  tax_vat: yup
    .string()
    .required(i18n.t('app.validation.tax_required')),

  markup_price: yup
    .string()
    .required(i18n.t('app.validation.markup_required')),

  cleaning_fee: yup
    .string()
    .required(i18n.t('app.validation.cleaning_fee_required')),

  airbnb_discount: yup
    .string()
    .required(i18n.t('app.validation.airbnb_discount_required')),

  gathern_discount: yup
    .string()
    .required(i18n.t('app.validation.gathern_discount_required')),

  booking_discount: yup
    .string()
    .required(i18n.t('app.validation.booking_discount_required')),

  extra_guest_fee: yup
    .string()
    .optional(),
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
  securityCameras: yup.string().required(i18n.t('app.validation.option_required')),
  noiseMonitor: yup.string().required(i18n.t('app.validation.option_required')),
  weaponsOnProperty: yup.string().required(i18n.t('app.validation.option_required')),
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
    .required(i18n.t('app.validation.ownership_required')),

  authorityLicense: yup
    .mixed<DocumentPickerResult>()
    .nullable()
    .required(i18n.t('app.validation.authority_required')),

  nationalId: yup
    .mixed<DocumentPickerResult>()
    .nullable()
    .required(i18n.t('app.validation.national_id_required')),
});

export type DocumentFormValues = yup.InferType<typeof documentUploadSchema>;