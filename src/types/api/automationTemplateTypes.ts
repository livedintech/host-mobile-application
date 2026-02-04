export interface automationTemplateEditStatusTypesApiPayload {
    id: string;
    is_active: boolean
}
export interface AutomationTemplateTypesApiPayload {
    id?: string;
    title: string;
    body: string;
    listing_ids?: string[];
    auto_apply_new_listings: boolean
}

export interface AutomationTemplateTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}

export interface deleteAutomationTemplateTypesApiPayload {
    id: number;
}
export interface deleteAutomationTemplateTypesApiResponse {
    status: string;
    message: string;
    data: {

    };
}