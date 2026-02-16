import apiService from "./apiService";
import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import { createChannelsUserIdPayload, createMapListingbyUserIDType, creatGathernChannelType, getChannelsUserIdPayload, getChannexListingsByIdPayload, getUserListingsByUserID } from "@/types/api/bookingManagementTypes";
import Utils from "@/utility/Utils";

export const createChannelsUserbyId = async (payload: createChannelsUserIdPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_CHANNEX_ACCOUNT,
        { user_id: payload.user_id },
    );

    const { ok, response, data } = await apiService.post(url, {});
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const getChannelsUserbyId = async (payload: getChannelsUserIdPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_CHANNEX_ACCOUNT,
        { user_id: payload.user_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

/// Import Listing form airbnb
//Temp
export const getChannexListingsById = async (payload: getChannexListingsByIdPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_CHANNEX_LISTINGS,
        { channel_id: payload.channel_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data?.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};
// Perminant
// export const getChannexListingsById = async (
//   page = 1,
//   limit = 10,
//   payload: getChannexListingsByIdPayload
// ) => {
//   const url = Utils.createDynamicUrl(
//     SERVICE_CONFIG_URLS.APP.GET_CHANNEX_LISTINGS,
//     { channel_id: payload.channel_id }
//   );

//   const res = await apiService.get(url, {
//     params: {
//       page,
//       limit,
//     },
//   });

//   if (res.ok) {
//     return res.data.data;
//   }

//   throw new Error(res.response?.message || 'Something went wrong');
// };

export const getUserListingsByUserIDApi = async (payload: getUserListingsByUserID) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_USER_LISTINGS_BY_USER_ID,
        { user: payload.user },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};
// Post: Map Listing for new host
export const createMapListingbyUserIDApi = async (payload: createMapListingbyUserIDType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_MAP_LISTING_BY_USER_ID,
        { user: payload.user }, // params
    );

    const { ok, response, data } = await apiService.post(url, {listing_id: payload?.listing_id }); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Post: Create Gathern Create Channel
export const creatGathernChannelApi = async (payload: creatGathernChannelType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_GATHERN_CREATE_CHANNEL,
        { user_id: payload.user_id }, // params
    );

    const { ok, response, data } = await apiService.post(url, {platform_user_id: payload?.platform_user_id}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Get Gathern Listing

export const getGathernListingApi = async (payload: getChannexListingsByIdPayload) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_GATHERN_LISTING,
        { channel_id: payload.channel_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data?.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};