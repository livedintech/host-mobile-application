import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { smartLockActiveCodesPayloadType, smartLockConnectPayloadType, smartLockGeneratePasscodePayloadType, smartLockMappingAssignPayloadType } from "@/types/api/smartLockTypes";
import Utils from "@/utility/Utils";

export const getDropdownListingApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_SMART_LOCK_DROPDOWN_LIST
    );

    if (ok) {
        return data?.data;
    }

    throw response.message;
};


export const GetSmartLockListApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_SMART_LOCK_LIST
    );

    if (ok) {
        return data?.data;
    }

    throw response.message;
};

export const SmartLockConnectApi = async (payload: smartLockConnectPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CONNECT_SMART_LOCK,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Active Codes 
export const getSmartLockActiveCodesApi = async (payload: smartLockActiveCodesPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.SMART_LOCK_ACTIVE_CODES,
        { lockId: payload.lockId }, // params
    );

    const { ok, response, data } = await apiService.get(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Activity Logs 
export const getSmartLockActivityLogsApi = async (payload: smartLockActiveCodesPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.SMART_LOCK_ACTIVITY_LOGS,
        { lockId: payload.lockId }, // params
    );

    const { ok, response, data } = await apiService.get(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const passcodeGenerateApi = async (payload: smartLockGeneratePasscodePayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.SMART_LOCK_PASSCODE_GENERATE,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const SmartLockMappingsAssignApi = async (payload: smartLockMappingAssignPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CONNECT_SMART_LOCK_MAPPINGS_ASSIGN,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};