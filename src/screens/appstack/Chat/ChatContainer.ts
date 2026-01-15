import { useState, useMemo } from 'react';
import { ChatMessage, ChatStatus } from '@/types/chat';
import { useForm } from 'react-hook-form';

const MOCK_DATA: ChatMessage[] = [
  { id: '1', name: 'Abdulrahman Al Hassan', message: 'Already shared your information with..', date: '05/01/26', status: 'Unread', unreadCount: 3, img: require('@/assets/img/dummy/airbnb.png') },
  { id: '2', name: 'Ahmed Shaikh', message: 'Hi, just wanted to confirm the check..', date: '05/01/26', status: 'Archived', img: require('@/assets/img/dummy/n.png') },
  { id: '3', name: 'Youssef Rehman', message: 'We are running late and will check in..', date: '05/01/26', status: 'Marketplace', unreadCount: 10, img: require('@/assets/img/dummy/n.png') },
  { id: '4', name: 'Mariam Osmaan', message: 'Can you please share the Wi-Fi pas..', date: '05/01/26', status: 'Snoozed', img: require('@/assets/img/dummy/livedin.png') },
];

export const useChatContainer = () => {
  const [activeTab, setActiveTab] = useState<ChatStatus>('All');
  const [chats, setChats] = useState<ChatMessage[]>(MOCK_DATA);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState(false);

  const { control, reset, formState: { errors } } = useForm({
    defaultValues: { reservationStatus: '', listings: '', city: '' }
  });

  const filteredChats = useMemo(() => {
    let data = chats;
    if (activeTab === 'Unread') data = chats.filter(c => (c.unreadCount || 0) > 0);
    else if (activeTab !== 'All') data = chats.filter(c => c.status === activeTab);
    return data;
  }, [activeTab, chats]);

  const handleAction = (id: string, newStatus: ChatStatus) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, unreadCount: 0 } : c));
  };

  const resetFilters = () => {
    setFilterAssigned(false);
  };

  const handleResetAll = () => {
    reset();
    resetFilters();
  };

  return {
    activeTab, setActiveTab, filteredChats, handleAction, isFilterVisible, setFilterVisible, filterAssigned, setFilterAssigned, handleResetAll, control, errors
  };
};