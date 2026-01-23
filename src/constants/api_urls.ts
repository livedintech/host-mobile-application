const authController = 'api/v2';

export const SERVICE_CONFIG_URLS = {
  AUTH: {
    CHECK_USER: `${authController}/check-user`,
    LOGIN: `${authController}/login`,
    FOROGT_PASSWORD: `${authController}/forgot-password`,
    VERIFY_OTP: `${authController}/verify-otp`,
    SEND_OTP: `${authController}/send-otp`,
    RESET_PASSWORD: `${authController}/reset-password`,
    CREATE_ACCOUNT: `${authController}/register`,
    CITIES: `${authController}/external-cities`,
    DISTRICTS: `${authController}/external-districts`,
    CHART_DATA: `${authController}/external-get-amount-latest-mom`,
    PAYMENT_SAVE_CARD: `${authController}/save-card`
  },
  APP: {
    CREATE_CHANNEX_ACCOUNT: `${authController}/create/channex/account/{user_id}`,
    GET_CHANNEX_ACCOUNT: `${authController}/channels/{user_id}`,
    GET_CHANNEX_LISTINGS: `${authController}/channex/listings/{channel_id}`,
    GET_USER_LISTINGS_BY_USER_ID: `${authController}/user/listings/{user}`,
    CREATE_MAP_LISTING_BY_USER_ID: `${authController}/mapListing/{user}`,
    CREATE_GATHERN_CREATE_CHANNEL: `${authController}/gathern/create-channel?user_id={user_id}`,
    GET_GATHERN_LISTING: `${authController}/gathern/listings?channel_id={channel_id}`,
    CREATE_LISTING: `${authController}/channelmanagement/create-listing`,
    CREATE_LISTING_DETAILS: `${authController}/channelmanagement/create-listing/details`,
    CREATE_LISTING_PRICING: `${authController}/channelmanagement/create-listing/pricing`,
    GET_MANAGE_YOUR_LISTINGS: `${authController}/user/listings/{user}`,
  }
};
