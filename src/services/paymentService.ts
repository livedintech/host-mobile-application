import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { getSubscriptionSaveCardsPayloadType, savePaymentinfoPayloadType } from "@/types/api/paymentTypes";

export interface SavePaymentPayload {
    country: string | null;
    status: string | null;
    card_token: string | null;
    card_holder_name: string | null;
    zipcode: string | null;
    customer_identifier?: string | null
}

export const savePaymentIdentifierApi = async (payload: SavePaymentPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.PAYMENT_SAVE_CARD,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const subscriptionSavedCardsApi = async (payload: SavePaymentPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.AUTH.SUBSCRIPTION_SAVE_CARD,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};


export const getSubscriptionSaveCardsApi = async (payload: getSubscriptionSaveCardsPayloadType) => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.SUBSCRIPTION_SAVED_CARDS,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const savePaymentinfoApi = async (payload: savePaymentinfoPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.SAVE_PAYMENT_INFO,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const subscriptionActiveApi = async (payload: savePaymentinfoPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.SUBSCRIPTION_ACTIVE,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export interface SubscriptionCalculateParams {
    properties_count: number;
    billing_cycle: 'monthly' | 'yearly';
    plan_key: 'starter' | 'ai_suite';
}

export interface SubscriptionPlan {
    plan_id: string;
    plan_key: string;
    plan_name: string;
    billing_cycle: string;
    currency: string;
    properties_count: number;
    price_per_property: number;
    total_price: number;
    matched_tier: { qty_from: number; qty_to: number };
}

export interface SubscriptionCalculateResponse {
    status: string;
    data: {
        properties_count: number;
        billing_cycle: string;
        plans: SubscriptionPlan[];
    };
}

export const subscriptionCalculateApi = async (params: SubscriptionCalculateParams) => {
    const { ok, response, data } = await apiService.get<SubscriptionCalculateResponse>(
        SERVICE_CONFIG_URLS.APP.SUBSCRIPTION_CALCULATE,
        params,
    );
    if (ok && data) {
        return data;
    }
    throw response;
};