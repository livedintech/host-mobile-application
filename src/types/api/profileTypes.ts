// types/api/profileTypes.ts

export interface ProfilePicture {
  uri: string;
  type?: string;
  name?: string;
}

export interface UpdateProfilePayload {
  profile_picture?: ProfilePicture;
  name?: string;
  gender?: string;
  country_id?: number;
  city_id?: number;
  permanent_address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    gender?: string;
    country?: string;
    city?: string;
    phone?: string;
  };
}