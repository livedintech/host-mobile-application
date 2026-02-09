export interface createChatArchiveByConversationIdPayloadType {
  conversation_id?: string | undefined,
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
export interface sendMessagePayloadType {
  conversation_id?: string,
  body?: string,
  type?: string,
  provenance?:string;
  reply_to?:string

}
export interface assignUserToChatPayloadType {
  conversation_id?: string | number,
  user_id?: string,
}