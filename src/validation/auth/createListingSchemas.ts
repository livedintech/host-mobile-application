import * as yup from 'yup';

export const stepOneSchema = yup.object({
    propertyType: yup
        .string()
        .required('Please select a property type'),
});

export type StepOneFormValues = yup.InferType<typeof stepOneSchema>;