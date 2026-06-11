import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import { ProfilePicture, UpdateProfilePayload } from "@/types/api/profileTypes";
import { useAuthStore } from "@/store/useAuthStore";
import apiService, { BASE_URL } from "./apiService";
import Utils from "@/utility/Utils";
import { CreateEditlistingStatePayloadType } from "@/types/api/bookingManagementTypes";


export const updateProfileApi = async (payload: UpdateProfilePayload) => {
  // ✅ Store directly access karo — hook nahi
  const token = useAuthStore.getState().token;

  const formData = new FormData();

  if (payload.profile_picture) {
    formData.append('profile_picture', {
      uri: payload.profile_picture.uri,
      type: payload.profile_picture.type || 'image/jpeg',
      name: payload.profile_picture.name || `profile_${Date.now()}.jpg`,
    } as any);
  }

  if (payload.name)               formData.append('name', payload.name);
  if (payload.gender)             formData.append('gender', payload.gender);
  if (payload.country_id)         formData.append('country_id', String(payload.country_id));
  if (payload.city_id)            formData.append('city_id', String(payload.city_id));
  if (payload.permanent_address)  formData.append('permanent_address', payload.permanent_address);
  // if (payload.phone)              formData.append('phone', payload.phone);
  // if (payload.email)              formData.append('email', payload.email);

  // ✅ fetch directly use karo — apisauce/axios bypass
  const response = await fetch(
    `${BASE_URL}${SERVICE_CONFIG_URLS.APP.UPDATE_PROFILE}`,
    {
      method: 'POST',
      headers: {
        // ✅ Content-Type bilkul mat lagao — fetch khud boundary set karega
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw data;
};


export const getProfileCountriesApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.COUNTRIES
    );

    if (ok) {
        const countries = data?.data;
        if (countries == null) {
            if (__DEV__) {
                console.warn('[API] Countries response missing data field:', data);
            }
            return [];
        }
        return countries;
    }

    throw new Error(response?.message || 'Failed to fetch countries');
};

//City
export const getProfileCitiesApi = async (payload: CreateEditlistingStatePayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.PROFILE_CITIES,
        { country_id: payload.country_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        const cities = data?.data;
        if (cities == null) {
            if (__DEV__) {
                console.warn('[API] Cities response missing data field:', data);
            }
            return [];
        }
        return cities;
    }
    throw new Error(response?.message || 'Failed to fetch cities');
};


// ✅ Sirf image upload
export const uploadProfilePictureApi = async (image: ProfilePicture) => {
  const token = useAuthStore.getState().token;
  
  const formData = new FormData();
  formData.append('profile_picture', {
    uri: image.uri,
    type: image.type || 'image/jpeg',
    name: image.name || `profile_${Date.now()}.jpg`,
  } as any);

  const response = await fetch(
    `${BASE_URL}${SERVICE_CONFIG_URLS.APP.UPDATE_PROFILE}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    }
  );

  const data = await response.json();
  if (response.ok) return data;
  throw data;
};

// ✅ Image remove
export const removeProfilePictureApi = async () => {
  const token = useAuthStore.getState().token;

  const formData = new FormData();
  formData.append('profile_picture', ''); // empty string = remove

  const response = await fetch(
    `${BASE_URL}${SERVICE_CONFIG_URLS.APP.UPDATE_PROFILE}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    }
  );

  const data = await response.json();
  if (response.ok) return data;
  throw data;
};