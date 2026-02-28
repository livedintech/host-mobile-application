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