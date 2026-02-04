import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import Utils from "@/utility/Utils";
import { automationTemplateEditStatusTypesApiPayload, AutomationTemplateTypesApiPayload, deleteAutomationTemplateTypesApiPayload } from "@/types/api/automationTemplateTypes";

// Get List
export const getAutomationTemplateApi = async ({
  page = 1,
  limit = 10,
}) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_AUTOMATIONS_TEMPLATE,
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

// Create 
export const createAutomationTemplateApi = async (payload: AutomationTemplateTypesApiPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_AUTOMATIONS_TEMPLATE,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Edit 
export const editAutomationTemplateApi = async (payload: AutomationTemplateTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_AUTOMATIONS_TEMPLATE,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.put(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 

// Delete
export const deleteAutomationTemplateApi = async (payload: deleteAutomationTemplateTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DELETE_AUTOMATIONS_TEMPLATE,
        { id: payload.id }, //URL
    );

    const { ok, response, data } = await apiService.delete(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

//Get Message Templates Variables
export const getAutomationTemplateVariablesApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_AUTOMATIONS_TEMPLATE_MESSAGE_VARIABLES
    );

    if (ok) {
        return data;
    }

    throw response.message;
};

//Get Message Templates Variables
export const getAutomationTemplateEventsApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_AUTOMATIONS_TEMPLATE_EVENTS
    );

    if (ok) {
        return data;
    }

    throw response.message;
};

// Edit Status Saved Replies
export const editStatusAutomationTemplateApi = async (payload: automationTemplateEditStatusTypesApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_STATUS_AUTOMATIONS_TEMPLATE,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.patch(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
}; 