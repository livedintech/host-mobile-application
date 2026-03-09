import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { userManagementCreateUserApiPayload, userManagementDeleteUserApiPayload, userManagementEditUserApiPayload } from "@/types/api/userManagementTypes";
import Utils from "@/utility/Utils";

// Create Account
export const userManagementCraeteApi = async (payload: userManagementCreateUserApiPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_USER_MANAGEMENT,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

//Get Listings 
export const getUserManagementListingsApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_USER_MANAGEMENT_LISTING
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get Listings 
export const getUserManagementRoleApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_USER_MANAGEMENT_ROLE
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get User Management 
export const getUserManagementApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_USER_MANAGEMENT
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

// Edit Manage User
export const editUserManagementApi = async (payload: userManagementEditUserApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.EDIT_USER_MANAGEMENT,
        { id: payload.id },
    );

    const { ok, response, data } = await apiService.put(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};
// Delete Manage User
export const deleteUserManagementApi = async (payload: userManagementDeleteUserApiPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DELETE_USER_MANAGEMENT,
        { id: payload.id }, //URL
    );

    const { ok, response, data } = await apiService.delete(url, {}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const getCountriesApi = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_COUNTRIES
  );

	if (ok) {
    return data.data;
  }

  throw response.message;
};

export const getProfileCitiesApi = async (countryId: string | number) => {
  const { ok, response, data } = await apiService.get(
    `${SERVICE_CONFIG_URLS.APP.GET_CITIES}?country_id=${countryId}`
  );

  if (ok) {
    return data?.data || [];
  }

  // FIX 3: Ensure you are throwing a clean error message
  throw response?.message || "Failed to fetch cities";
};