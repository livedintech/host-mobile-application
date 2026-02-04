import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import Utils from "@/utility/Utils";
import { aiAutoReplyTypesApiPayload, deleteaiAutoReplyTypesApiPayload, editAiAutoReplyTypesApiPayload, editStatusAiAutoReplyTypesApiPayload } from "@/types/api/aiAutoReplyTypes";

// Get Ai Auto Reply List
export const getaiAutoReplyApi = async ({
  page = 1,
  limit = 10,
}) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_AI_AUTO_REPLY,
    {},
  );

  const res = await apiService.get(url, {
    page,
    limit,
  });

  if (res.ok) {
    return res.data.data;
  }

  throw new Error(res.response.message);
};

// Create Ai Auto Reply 
export const createAiAutoReplyApi = async (payload: aiAutoReplyTypesApiPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_AI_AUTO_REPLY,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Edit Ai Auto Reply
export const editAiAutoReplyApi = async (payload: editAiAutoReplyTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_AI_AUTO_REPLY,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.put(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 
// Delete
export const deleteAiAutoReplyApi = async (payload: deleteaiAutoReplyTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DELETE_AI_AUTO_REPLY,
        { id: payload.id }, //URL
    );

    const { ok, response, data } = await apiService.delete(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Edit Status
export const editStatusAiAutoReplyApi = async (payload: editStatusAiAutoReplyTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_STATUS_AI_AUTO_REPLY,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.patch(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 