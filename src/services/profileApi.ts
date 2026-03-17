import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import { UpdateProfilePayload } from "@/types/api/profileTypes";
import { useAuthStore } from "@/store/useAuthStore";
import { BASE_URL_DEV } from "@env";

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
  if (payload.phone)              formData.append('phone', payload.phone);
  if (payload.email)              formData.append('email', payload.email);

  // ✅ fetch directly use karo — apisauce/axios bypass
  const response = await fetch(
    `${BASE_URL_DEV}${SERVICE_CONFIG_URLS.APP.UPDATE_PROFILE}`,
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