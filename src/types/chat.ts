import { ImageSourcePropType } from 'react-native';

export type ChatStatus = 'All' | 'Archived' | 'Snoozed' | 'Unread' | 'Marketplace';

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  date: string;
  status: ChatStatus;
  unreadCount?: number;
  img: ImageSourcePropType;
}
