import { useNavigation } from '@react-navigation/native';

export default function useSubscriptionHistoryContainer() {
  const navigation = useNavigation();

  const listings = [
    { id: '1', title: 'LP 12.12' },
    { id: '2', title: 'LP 12.42' },
    { id: '3', title: 'LP 12.62' },
    { id: '4', title: 'LP 12.82' },
  ];

  const features = [
    { id: 1, label: '24/7 Guest\nCommunication', icon: 'phoneIcon' },
    { id: 2, label: '10 Revenue\nManagement', icon: 'percentIcon'},
    { id: 3, label: 'Task\nManagement', icon: 'briefcaseIcon'},
    { id: 4, label: 'Multi-\ncalendar', icon: 'calendarGridIcon'},
  ];

  return { listings, features, navigation };
}