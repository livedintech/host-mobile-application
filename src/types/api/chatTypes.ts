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