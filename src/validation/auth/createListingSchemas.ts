import * as yup from 'yup';

export const stepOneSchema = yup.object({
    propertyType: yup
        .string()
        .required('Please select a property type'),
});

export type StepOneFormValues = yup.InferType<typeof stepOneSchema>;

export const addressSchema = yup.object({
    country: yup.string().required('Country is required'),
    state: yup.string().required('State/Province is required'),
    city: yup.string().required('City is required'),
    district: yup.string().required('District is required'),
    address: yup.string().required('Address is required'),
    postalAddress: yup.string().required('Postal address is required'),
});

export type AddressFormValues = yup.InferType<typeof addressSchema>;

export const stepTwoSchema = yup.object({
    size: yup.string().required('Size is required'),
    bedrooms: yup.string().required('Required'),
    beds: yup.string().required('Required'),
    kitchen: yup.string().required('Required'),
    pool: yup.string().required('Required'),
    longTermStay: yup.string().required('Required'),
    minDayStay: yup.string().required('Required'),
    otherFeatures: yup
        .array()
        .transform((value, originalValue) => {
            // Agar string mile toh usay array mein wrap kar dein
            return typeof originalValue === 'string' ? [originalValue] : value;
        })
        .of(yup.string())
        .min(1, 'Select at least one feature')
        .required('Required'),
});

export type StepTwoFormValues = yup.InferType<typeof stepTwoSchema>;


export const describeHouseSchema = yup.object().shape({
    title: yup.string().required('House title is required'),
    description: yup.string()
        .required('Description is required')
        .min(10, 'Must be at least 10 characters')
        .max(250, 'Cannot exceed 250 characters'),
    bookingType: yup.string().required('Required'),
    guestEligibility: yup.string().required('Required'),
    checkInTime: yup.string().required('Required'),
    checkOutTime: yup.string().required('Required'),
});

export type DescribeHouseFormValues = yup.InferType<typeof describeHouseSchema>;

export const pricingSchema = yup.object().shape({
  weekdayPrice: yup
    .number()
    .typeError('Must be a number')
    .required('Weekday Price is required'),
  weekendPrice: yup
    .number()
    .typeError('Must be a number')
    .required('Weekend Price is required'),
  discount: yup
    .number()
    .typeError('Must be a number')
    .required('Discount is required'),
  taxVat: yup
    .number()
    .typeError('Must be a number')
    .required('Tax(VAT) is required'),
  markupPrice: yup
    .number()
    .typeError('Must be a number')
    .required('Markup Price is required'),
  cleaningFee: yup
    .number()
    .typeError('Must be a number')
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

export const documentUploadSchema = yup.object().shape({
  propertyOwnership: yup
    .mixed()
    .required('Property ownership document is required'),

  authorityLicense: yup
    .mixed()
    .nullable()
    .notRequired(),

  nationalId: yup
    .mixed()
    .nullable()
    .notRequired(),
});

export type DocumentFormValues = yup.InferType<typeof documentUploadSchema>;
