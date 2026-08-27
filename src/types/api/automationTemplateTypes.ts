export interface automationTemplateEditStatusTypesApiPayload {
    id: string;
    is_active: boolean
}
export interface AutomationTemplateTypesApiPayload {
    id?: string;
    name: string;
    body: string;
    event: string;
    temp_event_time: string;
    listing_ids?: (string | number)[];
    is_active: boolean;
}

export interface AutomationTemplateTypesApiResponse {
    status: string;
    message: string;
    data: {
        id?: number;
        name?: string;
        event?: string;
        body?: string;
        temp_event_time?: string;
        is_active?: boolean;
        listing_ids?: string[];
    };
}

export interface EventTimeItem {
    value: string;
    label: string;
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
