export interface createChatArchiveByConversationIdPayloadType {
  conversation_id?: string | undefined,
}
export interface chatDetailSavedRepliesPayloadType {
  listing_id: string,
  is_active:boolean
}
export interface createChatArchiveByConversationIdResponseType {
  status: string;
  message: string;
  data: {

  };
}
// Archive Chat
export interface createChatSnoozeByConversationIdPayloadType {
  conversation_id?: string,
}
export interface createChatSnoozeByConversationIdResponseType {
  status: string;
  message: string;
  data: {

  };
}

export interface inquiryPayloadType {
  thread_id?: string | number;
  amount?: string | number;
  message?:string;
}

export interface sendMessagePayloadType {
  conversation_id?: string,
  body?: string,
  type?: string,
  provenance?:string;
  reply_to?:string;
  agent_message_reviews_id?: Number
}
export interface assignUserToChatPayloadType {
  conversation_id?: string | number,
  user_id?: string,
}

export interface markReadChatPayloadType {
  conversation_id?: string | number,
  last_message_id?: string | number,
}

export interface getPendingAgentMessageReviewPayloadType {
  message_thread_id: string | number;
}

export interface updateAgentMessageReviewPayloadType {
  id: string | number;
  feedback: boolean;
  feedback_review?: string;
}