import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { CreateAccountPayload, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload, SocialAuthPayload, VerifyOtpPayload , UpdatePasswordPayload} from "@/types/api/authTypes";
import Utils from "@/utility/Utils";

// Check User
export const CheckUserApi = async (payload: LoginPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.CHECK_USER,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Login
export const loginApi = async (payload: LoginPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.LOGIN,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Forgot Password
export const forgotPasswordApi = async (payload: ForgotPasswordPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.FOROGT_PASSWORD,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Change Password
export const changePasswordApi = async (payload: any) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.CHANGE_PASSWORD,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response; // This allows React Query to catch the error
};

// Delete Account (Soft Delete)
// @/services/authService.ts

// Delete Account (Updated to POST and new endpoint)
export const deleteAccountApi = async () => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.DELETE_ACCOUNT,
        {}
    );

    // If ok is true, we RETURN data. This triggers onSuccess.
    if (ok) {
        return data; 
    }

    // If ok is false, we THROW response. This triggers onError.
    // If you 'return response' instead of 'throw', it goes to onSuccess!
    throw response; 
};

// Verify OTP
export const verifyOtpApi = async (payload: VerifyOtpPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.VERIFY_OTP,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Resend Otp
export const resendOtpApi = async (payload: VerifyOtpPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.SEND_OTP,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const getSelectListingApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_SELECT_LISTING
    );

    if (ok) {
        return data?.data;
    }

    throw response.message;
};


// Reset Password
export const resetPasswordApi = async (payload: ResetPasswordPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.RESET_PASSWORD,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Resend Otp
export const createAccountApi = async (payload: CreateAccountPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.CREATE_ACCOUNT,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

//Get Cities 
export const getCitiesApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.AUTH.CITIES
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get Districts
export const getDistrictsApi = async (city?: string | never[]) => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.AUTH.DISTRICTS,
        { city }
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Get ChartData
export const getChartDataApi = async (
  city?: string,
  location?: string,
  bedrooms?: string
) => {
  try {
    const { ok, response, data } = await apiService.get(
      SERVICE_CONFIG_URLS.AUTH.CHART_DATA,
      { city, location, bedrooms }
    );
      console.log('data:::',data);
    if (ok && data) {
  
        
      return data; 
    }

    // fallback if data is missing
    return { monthly: '0', yearly: '0', months: [] };
  } catch (error) {
    console.error('Chart API error:', error);
    return { monthly: '0', yearly: '0', months: [] };
  }
};

// Social Authentication (Google)
export const socialAuthApi = async (payload: SocialAuthPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.GOOGLE_LOGIN,
        payload, 
    );
    
    if (ok) {
        return data;
    }
    
    throw response;
};

// Social Authentication (Google)
export const socialAppleAuthApi = async (payload: SocialAuthPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.GOOGLE_LOGIN,
        payload, 
    );
    
    if (ok) {
        return data;
    }
    
    throw response;
};

// Update Password (First Time Login)
export const updateFirstTimePasswordApi = async (payload: UpdatePasswordPayload) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.AUTH.UPDATE_PASSWORD,
    payload
  );

  if (ok) {
    return data;
  }

  throw response;
};

// export const getSubscriptionFeaturesApi = async (payload: {subscription_id:number}) => {
//     const url = Utils.createDynamicUrl(
//         SERVICE_CONFIG_URLS.APP.GET_SUBSCRIPTION_FEATURES,
//         { id: payload.subscription_id },
//     );

//     const { ok, response, data } = await apiService.get(url, {...payload}); // body
//     if (ok) {
//         return data;
//     }
//     throw new Error(response.message || 'Failed to fetch sub-categories');
// }; 

export const getSubscriptionFeaturesApi = async (payload: {subscription_id:number}) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_SUBSCRIPTION_FEATURES,
        { id: payload.subscription_id }, // params
    );

    const { ok, response, data } = await apiService.get(url, {}); // body
    if (ok) {
        return data?.data || [];
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};
