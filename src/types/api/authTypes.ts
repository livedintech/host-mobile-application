export type UserChannels = {
  total: number;
  airbnb: number;
  bcom: number;
  gathern: number;
};

export type UnexportedListing = {
  id: number;
  listing_id: string;
  title: string;
};
export interface User {
  id: number;
  host_key: string | null;
  fcm_token: string | null;
  parent_user_id: number | null;
  role_id: number;
  host_type_id: number | null;
  name: string;
  surname: string | null;
  email: string | null;
  email_verification_code: string | null;
  email_verified: string | null;
  phone: string;
  phone_verification_code: string | null;
  phone_verified: string | null;
  dob: string | null;
  gender: string | null;
  country_id: number;
  city_id: number;
  country: string;
  city: string;
  host_activation_id: number | null;
  email_verified_at: string | null;
  is_first_login: number;
  plan_verified: number;
  is_block: number;
  able_to_block_calender: number;
  cleaning_per_cycle: number | null;
  country_code: string | null;
  phone_with_code: string | null;
  business_name: string | null;
  signup_step: string | null;
  profile_picture: string;
  permanent_address: string | null;
  ttlock_username: string | null;
  ttlock_access_token: string | null;
  ttlock_refresh_token: string | null;
  ttlock_token_expires_at: string | null;
  ttlock_timezone: string | null;
  created_at: string;
  updated_at: string;
  account_user_kind: string | null;
  is_deleted: number;
  deleted_at: string | null;
  accepted_privacy_policy: boolean;
  is_all_listing: boolean | null;
  role_name: string;
  subs_customer_id: string | null;
  sub_plan_id: string | null;
  role_key: 'super_owner' | 'supervisor' | 'admin' | 'owner' | string;
  has_listing: boolean;
  has_import_listing: boolean;
  channels: UserChannels;
  unexported_listings: UnexportedListing[];
  incomplete_listings: any[];
}

export interface LoginPayload {

}
export interface CheckUserExistPayload {

}
export interface SocialAuthPayload {
  sub: string;
  name: string;
  email: string;
  fcm_token?: string;
}

export interface ForgotPasswordPayload {

}

export interface VerifyOtpPayload {
  country_code?: string;
  phone_number?: string;
  phone_with_code?: string;
  otp?: string;
}

export interface ResetPasswordPayload {

}

export interface CreateAccountPayload {

}
export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
    is_first_login: number;
  },

}

export interface CheckUserExistResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    user: User
  };
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
  data: {

  };
}
export interface OtpVerifyResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface CreateAccountResponse {
  status: string;
  message: string;
  data: {

  };
}

export interface UpdatePasswordPayload {
  user_id: number;
  new_password: string;
  new_password_confirmation: string;
}
