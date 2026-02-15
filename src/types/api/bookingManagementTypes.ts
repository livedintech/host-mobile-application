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