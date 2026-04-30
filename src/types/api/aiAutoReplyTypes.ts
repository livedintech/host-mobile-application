export interface editStatusAiAutoReplyTypesApiPayload {
    id: string;
    is_enabled: boolean
}

export interface editAiAutoReplyTypesApiPayload {
    id:string
    name?: string;
    match_keywords: string;
    template: string;
    listing_id?: string[];
    auto_send: boolean;
    is_enabled: boolean;
    priority?:string
}
export interface aiAutoReplyTypesApiPayload {
    name?: string;
    match_keywords: string;
    template: string;
    listing_ids?: string[];
    auto_send: boolean;
    is_enabled: boolean;
    priority?:string
}

export interface aiAutoReplyTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}

export interface deleteaiAutoReplyTypesApiPayload {
    id: string;
}
export interface deleteaiAutoReplyTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}

export interface aiAllowStatusPayload {
    is_ai_allow: boolean;
}

export interface aiAllowStatusResponse {
    status: string;
    message: string;
}