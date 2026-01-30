export interface userManagementCreateUserApiPayload {
    kind?: string;
    role_id?: string;
    host_type_id?: number;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    password?: string;
    country?: string;
    city?: string;
    dob?: string;
    gender?: string;
    listing_ids?: string[];
}
export interface userManagementCreateUserApiResponse {
    status: string;
    message: string;
    data: {

    };
}
export interface userManagementEditUserApiPayload {
    id: number
    role_id?: string;
    name?: string;
    surname?: string;
    listing_scope: {
        type: string;
        listing_ids?: string[];
    }
}
export interface userManagementEditUserApiResponse {
    status: string;
    message: string;
    data: {

    };
}
export interface userManagementDeleteUserApiPayload {
    id: number
}
export interface userManagementDeleteUserApiResponse {
    status: string;
    message: string;
    data: {

    };
}