import { CountryValue } from '@/components/molecules/Input/CountryPickerField';
import * as yup from 'yup';



export const stepOneSchema = yup.object({
  propertyType: yup
    .string()
    .required('Please select a property type'),
});

export type StepOneFormValues = yup.InferType<typeof stepOneSchema>;

export type AddressFormValues = {
  name: string;
  country_code: CountryValue | null;
  state: string;
  city: string;
  street: string;
  apt?: string;
};

export const addressSchema = yup.object({
  name:yup.string().required('Name is required'),
  country_code: yup.object({
    cca2: yup.string().required('Country is required'),
  }).required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  street: yup.string().required('Street address is required'),
  apt: yup.string().required('Apartment / Unit is required'),
});


export const stepTwoSchema = yup.object({
  bedrooms: yup.string().required('Bedrooms is required'),
  beds: yup.string().required('Beds is required'),
  bathrooms: yup.string().required('Bathrooms is required'),
  min_nights: yup.string().required('Min nights is required'),
  amenities: yup
    .array()
    .of(yup.string())
    .min(1, 'Amenities is required'),
  check_in_time: yup.string().required('Check-in time is required'),
  check_out_time: yup.string().required('Check-out time is required'),
  instant_booking: yup
    .string()
    .required('Instant booking is required')
    .oneOf(['true', 'false'], 'Instant booking must be Yes or No'),
    
});


export type StepTwoFormValues = {
  bedrooms: string;
  beds: string;
  bathrooms: string;
  min_nights: string;
  check_in_time: string;
  check_out_time: string;
  instant_booking: string;
 amenities: string[];
};

export const describeHouseSchema = yup.object().shape({
  name: yup.string().required('House title is required'),
  listing_descriptions: yup.string()
    .required('Description is required')
    .min(10, 'Must be at least 10 characters')
    .max(250, 'Cannot exceed 250 characters'),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

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



// Infer type directly from schema
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