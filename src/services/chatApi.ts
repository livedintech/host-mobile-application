import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import Utils from "@/utility/Utils";
import apiService from "./apiService";
import {  assignUserToChatPayloadType, chatDetailSavedRepliesPayloadType, createChatArchiveByConversationIdPayloadType, createChatSnoozeByConversationIdPayloadType, markReadChatPayloadType, sendMessagePayloadType } from "@/types/api/chatTypes";
type ChatListParams = {
  page?: number;
  limit?: number;
  unread?: boolean;
  archived?: boolean;
  snoozed?: boolean;
  marketplace?: boolean;
  search?:string;
};

export const getChatListApi = async ({
  page = 1,
  limit = 10,
  ...filters
}: ChatListParams) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_CHAT_LIST,
    {},
  );

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
export const createInboxArchiveApi = async (payload: createChatArchiveByConversationIdPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_ARCHIVE,
        { conversation_id: payload.conversation_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Archive Chat
export const createInboxUnArchiveApi = async (payload: createChatArchiveByConversationIdPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_UNARCHIVE,
        { conversation_id: payload.conversation_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Snooze Chat
export const createInboxSnoozeApi = async (payload: createChatSnoozeByConversationIdPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_SNOOZE,
        { conversation_id: payload.conversation_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// UnSnooze Chat
export const createInboxUnSnoozeApi = async (payload: createChatSnoozeByConversationIdPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_CHAT_INBOX_UNSNOOZE,
        { conversation_id: payload.conversation_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Chat Detail Api
export const getChatDetailApi = async (payload: createChatArchiveByConversationIdPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_CHAT_DETAIL,
        { conversation_id: payload.conversation_id }, // params
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
        SERVICE_CONFIG_URLS.APP.GET_CHAT_LIST_CITY
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


//Get Users 
export const GetAssignChatToUserApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.ASSIGN_USER
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
export const assignUserToChatApi = async (payload: assignUserToChatPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_ASSIGN_USER,
        { conversation_id: payload.conversation_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const getChatDetailSavedRepliesApi = async (
  payload: chatDetailSavedRepliesPayloadType
) => {

  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_SAVED_REPLIES_CHAT_DETAIL,
    {
      offset: 0,
      limit: 0,
      listing_id: payload.listing_id,
      is_active: payload.is_active,
    }
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
export const deleteChatMessageApi = async (payload: deleteChatMessagePayloadType) => {
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