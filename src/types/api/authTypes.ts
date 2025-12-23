export interface User {
  
}
export interface LoginPayload {
  
}
export interface CheckUserExistPayload {
  
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
  status: string;
  message: string;
  data: {
    access_token: string;
    user: User
  };
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