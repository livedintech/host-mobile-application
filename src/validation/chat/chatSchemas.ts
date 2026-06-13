import * as yup from 'yup';

export const aiFeedbackSchema = yup.object({
  feedbackType: yup.string().nullable().default(null),
  feedback_review: yup.string().default('').when('feedbackType', {
    is: 'down',
    then: schema => schema.required('Please describe what should be different'),
  }),
});

export type AiFeedbackFormValues = {
  feedbackType: string | null;
  feedback_review: string;
};
