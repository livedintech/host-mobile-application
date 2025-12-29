import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";

export interface SavePaymentPayload {
    country: string | null;
    status: string | null;
    card_token: string | null;
    card_holder_name: string | null;
    zipcode: string | null;
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