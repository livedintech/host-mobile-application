export interface User {
  
}
export interface LoginPayload {
  
}
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    user: User
  };
}