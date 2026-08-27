export interface editStatusSavedRepliesTypesApiPayload {
    id: string;
    is_active: boolean
}

export interface savedRepliesTypesApiPayload {
    id: string;
    title: string;
    body: string;
    listing_ids?: string[];
    auto_apply_new_listings?: boolean
}

export interface savedRepliesTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}

export interface deleteSavedRepliesTypesApiPayload {
    id: string;
}
