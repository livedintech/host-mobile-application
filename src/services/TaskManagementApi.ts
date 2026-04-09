import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import apiService from './apiService';
import Utils from '@/utility/Utils';
import {
  AddSectionPayload,
  InsertChecklistItemPayload,
  taskManagementCreateApiPayload,
  UpdateChecklistItemPayload
} from '@/types/api/taskManagentType';

//Get Category
export const getTaskManagementCategory = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_CATEGORY_TASK_MANAGEMENT,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

//Get Listing
export const getTaskManagementListing = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_LISTING_TASK_MANAGEMENT,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};
export const getTaskManagementListingCleaning = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_LISTING_TASK_MANAGEMENT_CLEANING,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

//Get Vendor
export const getTaskManagementVendor = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_VENDOR_TASK_MANAGEMENT,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

// Create TASK DRAFT
export const taskManagementCreateTask = async (
  payload: taskManagementCreateApiPayload,
) => {
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
export const getTaskChecklist = async (
  id: number | string,
  taskType: string,
) => {
  if (!id || !taskType) {
    throw new Error('Both id and taskType are required');
  }

  const endpoint =
    SERVICE_CONFIG_URLS.APP.GET_TASK_MANAGEMENT_CHECKLIST.replace(
      '{id}',
      String(id),
    ).replace('{tasktype}', taskType);

  const { ok, response, data } = await apiService.get(endpoint);

  if (ok) {
    return data;
  }

  throw response.message || 'Failed to fetch task checklist';
};

//ADD SECTION FOR CHECKLIST
export const taskManagementAddChecklist = async (
  payload: AddSectionPayload,
) => {
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
export const taskManagementInsertChecklist = async (
  payload: InsertChecklistItemPayload,
) => {
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
export const getTaskChecklistDetail = async (
  id: number | string,
  taskType: string,
) => {
  if (!id || !taskType) {
    throw new Error('Both id and taskType are required');
  }

  const endpoint =
    SERVICE_CONFIG_URLS.APP.GET_TASK_MANAGEMENT_CHECKLIST_DETAIL.replace(
      '{id}',
      String(id),
    ).replace('{tasktype}', taskType);

  const { ok, response, data } = await apiService.get(endpoint);

  if (ok) {
    return data;
  }

  throw response.message || 'Failed to fetch task checklist';
};

//EDIT SINGLE CHECKLIST
interface editChecklistItemPayload {
  task_id: number;
  ids: number[];
}

export const filterChecklistItem = async (payload: editChecklistItemPayload) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_SINGLE_CHECKLIST_ITEM_UPDATE,
    { id: payload.task_id },
  );

  const { ok, response, data } = await apiService.put(url, payload);

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to edit automation template');
};

//CHECKLIST ITEM NAME UPDATE
export const updateSingleChecklistItem = async (
  payload: UpdateChecklistItemPayload,
) => {
  const { ok, response, data } = await apiService.put(
    SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_ITEM_NAME_UPDATE,
    payload,
  );

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to update checklist item');
};

// TASK CRAETE STATUS UPDATE
interface taskCreateStatusUpdatePayload {
  task_id: number;
  is_draft: 0 | 1;
  description: string;
}
export const taskCreateStatusUpdate = async (
  payload: taskCreateStatusUpdatePayload,
) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_STATUS_UPDATE,
    payload,
  );
  if (ok) {
    return data;
  }
  throw response;
};

// GET ALL TASK LIST

type GetHostTaskListParams = {
  page: number;
  per_page: number;
  listing_id?: number;
  vendor_id?: number;
  status?: string;
};

export const getHostTaskList = async ({
  page,
  per_page,
  listing_id,
  vendor_id,
  status,
}: GetHostTaskListParams) => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('per_page', String(per_page));

  // 🔥 backend expects flat params (NOT arrays)
  if (listing_id) queryParams.append('listing_id', String(listing_id));
  if (vendor_id) queryParams.append('vendor_id', String(vendor_id));
  if (status) queryParams.append('status', status);

  const { ok, data, response } = await apiService.get(
    `${SERVICE_CONFIG_URLS.APP.GET_HOST_TASK_LIST}?${queryParams.toString()}`,
  );

  if (ok) {
    return {
      ...data,
      data: data.data.data,
      meta: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
      },
    };
  }

  throw response;
};



//GET TASK DETAIL
export const getTaskDetail = async (
  taskId: number | string,
  taskType: string,
) => {
  const baseUrl = SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_TASK_DETAIL.replace(
    '{taskid}',
    String(taskId),
  );

  const url = `${baseUrl}?task_type=${taskType}`;

  const { ok, response, data } = await apiService.get(url);

  if (ok) {
    return data?.data;
  }

  throw new Error(response?.message || 'Failed to fetch task detail');
};

// VENDOR UPDATE API
export const vendorUpdate = async ({
  taskId,
  vendor_id,
}: {
  taskId: number | string;
  vendor_id: number;
}) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_VENDOR_UPDATE,
    { id: taskId },
  );

  const { ok, response, data } = await apiService.put(url, {
    vendor_id, 
  });

  if (ok) return data;

  throw new Error(response?.message || 'Failed to update vendor');
};



// DELETE TASK
export const deleteTaskManagement = async (taskId: number | string) => {
  if (!taskId) {
    throw new Error('taskId is required');
  }

  const endpoint = SERVICE_CONFIG_URLS.APP.TASK_MANAGEMENT_DELETE.replace(
    '{id}',
    String(taskId),
  );

  const { ok, response, data } = await apiService.delete(endpoint);

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to delete task');
};
