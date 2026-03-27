export interface User {
  id: number;
  host_key: string | null;
  fcm_token: string | null;
  parent_user_id: number | null;
  role_id: number;
  host_type_id: number;
  name: string;
  surname: string;
  email: string;
  email_verification_code: string | null;
  email_verified: number; // 0 | 1 bhi kar sakte ho
  phone: string | null;
  phone_verification_code: string | null;
  phone_verified: number | null;
  dob: string; // ISO date string
  gender: string | null;
  country: string | null;
  city: string | null;
  host_activation_id: number | null;
  email_verified_at: string | null;
  plan_verified: number;
  is_block: number;
  able_to_block_calender: number;
  cleaning_per_cycle: number | null;
  country_code: string | null;
  phone_with_code: string | null;
  business_name: string | null;
  signup_step: number | null;
  profile_picture: string;
  created_at: string;
  updated_at: string;
  role_key : string;
  has_listing : Boolean;
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
