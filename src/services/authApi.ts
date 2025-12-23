import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import {CreateAccountPayload, ForgotPasswordPayload, ForgotPasswordResponse, LoginPayload, ResetPasswordPayload, VerifyOtpPayload, } from "@/types/api/authTypes";

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