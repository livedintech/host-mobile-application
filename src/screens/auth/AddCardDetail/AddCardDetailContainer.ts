import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const paymentDetailsSchema = yup.object().shape({
  cardNumber: yup.string().required('Required').min(19, 'Invalid Card'),
  expDate: yup.string().required('Required').matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'MM/YY'),
  cvv: yup.string().required('Required').min(3).max(4),
  country: yup.string().required('Required'),
  cardHolder: yup.string().required('Required'),
  zipCode: yup.string().required('Required'),
});

export default function usePaymentDetailsContainer() {
  const [isDefault, setIsDefault] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(paymentDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '4691 5100 2231 1234',
      expDate: '03/26',
      cvv: '341',
      country: '1', // Saudi Arabia ID
      cardHolder: 'Ahmed Arif',
      zipCode: '164134',
    },
  });

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  const formatExpDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    return cleaned;
  };

  const onSubmit = (data: any) => console.log('Final Data:', { ...data, isDefault });

  return { control, errors, isDefault, setIsDefault, handleSubmit: handleSubmit(onSubmit), formatCardNumber, formatExpDate };
}