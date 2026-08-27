import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import Utils from '@/utility/Utils';
import apiService from './apiService';
import {
  assignUserToChatPayloadType,
  chatDetailSavedRepliesPayloadType,
  createChatArchiveByConversationIdPayloadType,
  createChatSnoozeByConversationIdPayloadType,
  inquiryPayloadType,
  markReadChatPayloadType,
  sendMessagePayloadType,
  getPendingAgentMessageReviewPayloadType,
  updateAgentMessageReviewPayloadType,
} from '@/types/api/chatTypes';
type ChatListParams = {
  page?: number;
  limit?: number;
  unread?: boolean;
  archived?: boolean;
  snoozed?: boolean;
  marketplace?: boolean;
  search?: string;
};

export const getChatListApi = async ({
  page = 1,
  limit = 10,
  ...filters
}: ChatListParams) => {
  const url = Utils.createDynamicUrl(SERVICE_CONFIG_URLS.APP.GET_CHAT_LIST, {});

  const res = await apiService.get(url, {
    page,
    limit,
    ...filters,
  });

  if (res.ok) {
    return res.data.data;
  }

  throw new Error(res.response.message);
};

// Archive Chat
export const createInboxArchiveApi = async (
  payload: createChatArchiveByConversationIdPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_ARCHIVE,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.post(url, {}); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Archive Chat
export const createInboxUnArchiveApi = async (
  payload: createChatArchiveByConversationIdPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_UNARCHIVE,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.post(url, {}); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Snooze Chat
export const createInboxSnoozeApi = async (
  payload: createChatSnoozeByConversationIdPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_SNOOZE,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.post(url, {}); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

// UnSnooze Chat
export const createInboxUnSnoozeApi = async (
  payload: createChatSnoozeByConversationIdPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_UNSNOOZE,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.post(url, {}); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Chat Detail Api
export type ChatBroadcastConfig = {
  broadcaster: string;
  key: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  auth_endpoint: string;
  auth_header: string;
};

export const getChatBroadcastConfigApi = async (): Promise<ChatBroadcastConfig> => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_BROADCAST_CONFIG,
  );
  if (ok) {
    return (data as any).data;
  }
  throw new Error(response.message || 'Failed to fetch broadcast config');
};

export const getChatDetailApi = async (
  payload: createChatArchiveByConversationIdPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_DETAIL,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.get(url, {}); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

//Get Chat List City
export const getChatListCityApi = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_LIST_CITY,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

// Chat Detail Send Message
export const ChatMessageSendApi = async (payload: sendMessagePayloadType) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_DETAIL_SEMD_MESSAGE,
    payload,
  );
  if (ok) {
    return data;
  }
  throw response;
};

// Chat Detail Send Message with Media (image/video)
export const ChatMessageSendWithMediaApi = async (payload: {
  conversation_id: string;
  media: { uri: string; type: string; name: string };
  reply_to?: string | number;
}) => {
  const formData = new FormData();
  formData.append('conversation_id', payload.conversation_id);
  if (payload.reply_to) {
    formData.append('reply_to', String(payload.reply_to));
  }
  formData.append('media', {
    uri: payload.media.uri,
    type: payload.media.type,
    name: payload.media.name,
  } as any);

  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_DETAIL_SEMD_MESSAGE,
    formData,
  );
  if (ok) {
    return data;
  }
  throw response;
};

//Get Users
export const GetAssignChatToUserApi = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.ASSIGN_USER,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

//Assign User To Chat
// export const assignUserToChatApi = async (payload: assignUserToChatPayloadType) => {
//     const { ok, response, data } = await apiService.post(
//         SERVICE_CONFIG_URLS.APP.CREATE_ASSIGN_USER,
//         payload,
//     );
//     if (ok) {
//         return data;
//     }
//     throw response;
// };
export const assignUserToChatApi = async (
  payload: assignUserToChatPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.CREATE_ASSIGN_USER,
    { conversation_id: payload.conversation_id ?? '' }, // params
  );

  const { ok, response, data } = await apiService.post(url, { ...payload }); // body
  if (ok) {
    return data;
  }
  throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const getChatDetailSavedRepliesApi = async (
  payload: chatDetailSavedRepliesPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_SAVED_REPLIES_CHAT_DETAIL,
    {
      offset: 0,
      limit: 0,
      listing_id: payload.listing_id,
      is_active: String(payload.is_active),
    },
  );

  const { ok, response, data } = await apiService.get(url, {});

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch saved replies');
};

// Mark Read
export const markReadChatApi = async (payload: markReadChatPayloadType) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_MARK_READ,
    payload,
  );
  if (ok) {
    return data;
  }
  throw response;
};

type deleteChatMessagePayloadType = {
  message_id: string | number;
};
export const deleteChatMessageApi = async (
  payload: deleteChatMessagePayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.DELETE_CHAT,
    { message_id: payload.message_id }, // maps to {message_id} in URL
  );

  const { ok, response, data } = await apiService.delete(url, {});

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to delete message');
};

// Inquiry Special Offer
export const inquirySpecialOfferApi = async (payload: inquiryPayloadType) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.INQUIRY_SPECIAL_OFFER,
    payload,
  );
  if (ok) {
    return data;
  }
  throw response;
};

// Inquiry Pre Approve
export const inquiryPreApproveApi = async (payload: inquiryPayloadType) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.INQUIRY_PRE_APPROVE,
    payload,
  );
  if (ok) {
    return data;
  }
  throw response;
};

export const submitBookingRequestApi = async (payload: {
  thread_id: string | number;
  accept: boolean;
  reason: string | null;
  decline_message_to_guest: string | null;
  decline_message_to_airbnb: string | null;
}) => {
  const url = SERVICE_CONFIG_URLS.APP.BOOKING_REQUEST_SUBMIT;

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};

export const alterationRequestRespondApi = async (payload: {
  thread_id: string | number;
  accept: boolean;
  reason?: string | null;
  decline_message_to_guest?: string | null;
  decline_message_to_airbnb?: string | null;
}) => {
  const url = SERVICE_CONFIG_URLS.APP.ALTERATION_REQUEST_RESPOND;

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};


// Update Agent Message Review (thumbs up / down feedback)
export const updateAgentMessageReviewApi = async (
  payload: updateAgentMessageReviewPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.AGENT_MESSAGE_REVIEWS_UPDATE,
    { id: payload.id },
  );

  const body: { feedback: boolean; feedback_review?: string } = {
    feedback: payload.feedback,
  };
  if (payload.feedback_review) {
    body.feedback_review = payload.feedback_review;
  }

  const { ok, response, data } = await apiService.put(url, body);

  if (ok) {
    return data?.data || data;
  }

  throw new Error(response?.message || 'Failed to submit feedback');
};

// Get Pending Agent Message Review
export const getPendingAgentMessageReviewApi = async (
  payload: getPendingAgentMessageReviewPayloadType,
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.AGENT_MESSAGE_REVIEWS_PENDING,
    {
      message_thread_id: payload.message_thread_id,
    },
  );

  const { ok, response, data } = await apiService.get(url, {});

  if (ok) {
    return data?.data;
  }

  throw new Error(
    response?.message || 'Failed to fetch pending message review',
  );
};