import { useNavigation } from '@react-navigation/native';

export default function useTransactionHistoryContainer() {
  const navigation = useNavigation();

  const transactions = [
    {
      id: '1',
      date: '26 December 2025',
      cardType: 'mastercard',
      cardNumber: '4632',
      amount: 'SAR6,000.00',
    },
    {
      id: '2',
      date: '26 November 2025',
      cardType: 'mastercard',
      cardNumber: '4632',
      amount: 'SAR6,000.00',
    },
    {
      id: '3',
      date: '26 October 2025',
      cardType: 'visa',
      cardNumber: '4632',
      amount: 'SAR6,000.00',
    },
  ];

  return { transactions, navigation };
}