import { ImageSourcePropType } from 'react-native';

export type ChatStatus = 'All' | 'Archived' | 'Snoozed' | 'Unread' | 'Marketplace';

export interface ChatMessage {
  id: string;
  thread_id: string;
  name: string;
  last_message_at: string;
  last_message_content: string;
  status: ChatStatus;
  unreadCount?: number;
  img: ImageSourcePropType;
}
