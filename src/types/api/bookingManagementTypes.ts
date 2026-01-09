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
  user: number
}
export interface createMapListingbyUserIDType {
  user: number,
  listing_id: number
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