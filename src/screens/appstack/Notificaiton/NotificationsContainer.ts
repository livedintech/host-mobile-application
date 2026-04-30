import { useMemo, useState } from 'react';
import { goBack } from '@/services/navigationService';

export interface Notification {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  dateGroup: 'Today' | 'Yesterday';
}

const MOCK_DATA: Notification[] = [
  { id: '1', icon: 'messageIcon', title: 'New Message', description: "You've received a new message from Ahmed Al-Faisal for Oasis Tower", time: '8:28am', isUnread: true, dateGroup: 'Today' },
  { id: '2', icon: 'airbnbIcon', title: 'Listing Imported', description: 'Al Riyadh Apartment was imported successfully.', time: '8:28am', isUnread: true, dateGroup: 'Today' },
  { id: '3', icon: 'taskIcon', title: 'New Task Assigned', description: 'You have unread messages from Fatima Al-Zahra', time: '13:01pm', isUnread: true, dateGroup: 'Today' },
  { id: '4', icon: 'lockIcon', title: 'Unlock Activity', description: 'Lock accessed at Oasis Tower.', time: '8:28am', isUnread: true, dateGroup: 'Today' },
  { id: '5', icon: 'bookingIcon', title: 'New Booking', description: 'A new reservation has been received for Al Riyadh Apartment', time: '8:28am', isUnread: false, dateGroup: 'Yesterday' },
];

const DAY_MONTH_FORMAT: Intl.DateTimeFormatOptions = { weekday: undefined, month: 'long', day: 'numeric' };

function formatGroupLabel(group: 'Today' | 'Yesterday'): string {
  const date = new Date();
  if (group === 'Yesterday') date.setDate(date.getDate() - 1);
  return `${group}, ${date.toLocaleDateString('en-US', DAY_MONTH_FORMAT)}`;
}

export default function useNotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_DATA);

  const todayData = useMemo(() => notifications.filter(n => n.dateGroup === 'Today'), [notifications]);
  const yesterdayData = useMemo(() => notifications.filter(n => n.dateGroup === 'Yesterday'), [notifications]);

  const todayLabel = useMemo(() => formatGroupLabel('Today'), []);
  const yesterdayLabel = useMemo(() => formatGroupLabel('Yesterday'), []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isUnread: false })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const handleNotificationPress = (item: Notification) => {
    setNotifications(prev => prev.map(n => (n.id === item.id ? { ...n, isUnread: false } : n)));
  };

  return {
    todayData,
    yesterdayData,
    todayLabel,
    yesterdayLabel,
    handleMarkAllRead,
    handleDeleteNotification,
    handleNotificationPress,
    goBack,
  };
}
