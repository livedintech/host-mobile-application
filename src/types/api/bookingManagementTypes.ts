export interface createChannelsUserIdPayload {
  user_id: number
}
export interface getChannelsUserIdPayload {
  user_id: number
}
export interface getChannexListingsByIdPayload {
  channel_id: string
}
export interface getUserListingsByUserID {
  user: number;
  conntection_type?: string;
  limit?: number
}
export interface createMapListingbyUserIDType {
  user: number,
  listing_id: number
  // channel_id: string

}
export interface creatGathernChannelType {
  user_id: number,
  platform_user_id: string
}

export interface createListingImportType {
  listing_id: number,
  channel_id: string,
  user_id?: number
}
export interface createListingImportGathernType {
  parent_listing_id: number;
  property_id: string;
  property_title: string;
  mapping_type: string;
  pms_uuid: string;
}
export interface CreateGathernUserPayloadType {
  gender: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  country_code: string;
  mobile: string;
  platform_user_id: string;
  check_in_hour?: string;
  check_out_hour?: string;
}
export interface creatGathernChannelResponse {
  status: string;
  message: string;
  data: {
    channel: {
      id: number;
      user_id: number;
      ch_channel_id: string;
      connection_type: string;
      created_at: string;
      updated_at: string;
    }
  };
}

export interface getManageListingDetailByIdApiTypePayload {
  listing_id: string;
  user_id: number,
}

export interface CreateEditlistingStatePayloadType {
    country_id: string | number
}
export interface CreateEditlistingCitiesPayloadType {
    state_id: string | number
}
export interface CreateEditlistingDistrictsPayloadType {
    city_id: string | number
}

export interface DeleteListingPayloadType {
    user_id: string | number | undefined;
    listing_id: string | number;
    reason: string;


}
