import {SERVICE_CONFIG_URLS} from "@/constants/api_urls";
import apiService from "./apiService";
import Utils from "@/utility/Utils";
import {AddSectionPayload, InsertChecklistItemPayload, taskManagementCreateApiPayload} from "@/types/api/taskManagentType"




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

//GET CHECKLIST 
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



//ADD SECTION FOR CHECKLIST 
export const taskManagementAddChecklist = async (payload : AddSectionPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_ADD_SECTION,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

//INSERT CHECKLIST ITEM FOR THAT SECTION 
export const taskManagementInsertChecklist = async (payload:InsertChecklistItemPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_INSERT_CHECKLIST,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};


// GET CHECKLIST DETAIL
export const getTaskChecklistDetail = async (id: number | string, taskType: string) => {
  if (!id || !taskType) {
    throw new Error('Both id and taskType are required');
  }

  const endpoint = SERVICE_CONFIG_URLS.APP.GET_TASK_MANAGEMENT_CHECKLIST_DETAIL
    .replace('{id}', String(id))
    .replace('{tasktype}', taskType);

  const { ok, response, data } = await apiService.get(endpoint);

  if (ok) {
    return data; 
  }

  throw response.message || 'Failed to fetch task checklist';
};

// UPDATE CHECKLIST ITEM 
interface editChecklistItemPayload {
  task_id: number;
  ids: number[];
}

export const editChecklistItem = async (
  payload: editChecklistItemPayload
) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_SINGLE_CHECKLIST_ITEM_UPDATE,
    { id: payload.task_id } 
  );

  const { ok, response, data } = await apiService.put(url, payload);

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to edit automation template');
};
