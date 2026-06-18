import { ImageSourcePropType } from 'react-native';

export type ChatStatus = 'All' | 'Archived' | 'Snoozed' | 'Unread' | 'Marketplace';

export interface ChatMessage {
  id: string;
  name: string;
  img: string;
  is_mute?:boolean;
  is_archived?:boolean;
  unread_count?:string;
  last_message?:string;
  last_message_date?:string;
  last_message_media?: {
    type: 'image' | 'video' | 'document' | string;
    url: string;
    name?: string;
    size?: number | null;
  } | null;
}
