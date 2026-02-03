export interface savedRepliesTypesApiPayload {
    id?: string;
    title: string;
    body: string;
    listing_ids?: string[];
    auto_apply_new_listings: boolean
}

export interface savedRepliesTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}

export interface deleteSavedRepliesTypesApiPayload {
    id: number;
}
export interface deleteSavedRepliesTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}