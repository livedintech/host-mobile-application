import {SERVICE_CONFIG_URLS} from "@/constants/api_urls";
import apiService from "./apiService";
import Utils from "@/utility/Utils";
import {taskManagementCreateApiPayload} from "@/types/api/taskManagentType"




//Get Category 
export const getTaskManagementCategory = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_CATEGORY_TASK_MANAGEMENT
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get Listing
export const getTaskManagementListing = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_LISTING_TASK_MANAGEMENT
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get Vendor
export const getTaskManagementVendor = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_VENDOR_TASK_MANAGEMENT
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

// Create TASK DRAFT
export const taskManagementCreateTaskDraft = async (payload: taskManagementCreateApiPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_TASK_MANAGEMENT,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};


export const getTaskChecklist = async (id: number | string, taskType: string) => {
  if (!id || !taskType) {
    throw new Error('Both id and taskType are required');
  }

  const endpoint = SERVICE_CONFIG_URLS.APP.GET_TASK_MANAGEMENT_CHECKLIST
    .replace('{id}', String(id))
    .replace('{tasktype}', taskType);

  const { ok, response, data } = await apiService.get(endpoint);

  if (ok) {
    return data; 
  }

  throw response.message || 'Failed to fetch task checklist';
};
