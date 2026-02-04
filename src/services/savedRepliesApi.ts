import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import Utils from "@/utility/Utils";
import { deleteSavedRepliesTypesApiPayload, editStatusSavedRepliesTypesApiPayload, savedRepliesTypesApiPayload } from "@/types/api/savedRepliesTypes";



// Get Saved Replies List
export const getSavedRepliesApi = async ({
  page = 1,
  limit = 10,
}) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_SAVED_REPLIES,
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

// Create Saved Replies 
export const createSaveReplyApi = async (payload: savedRepliesTypesApiPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_SAVED_REPLIES,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Edit Saved Replies
export const editSaveReplyApi = async (payload: savedRepliesTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_SAVED_REPLIES,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.put(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 

// Delete
export const deleteSaveReplyApi = async (payload: deleteSavedRepliesTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DELETE_SAVED_REPLIES,
        { id: payload.id }, //URL
    );

    const { ok, response, data } = await apiService.delete(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Edit Status Saved Replies
export const editStatusSaveReplyApi = async (payload: editStatusSavedRepliesTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_STATUS_SAVED_REPLIES,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.patch(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 