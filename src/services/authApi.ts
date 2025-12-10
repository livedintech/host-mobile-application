import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import {LoginPayload, } from "@/types/api/authTypes";

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