const authController = 'api';

export const SERVICE_CONFIG_URLS = {
  AUTH: {
    CHECK_USER: `${authController}/check-user`,
    LOGIN: `${authController}/login`,
    FOROGT_PASSWORD: `${authController}/forgot-password`,
    VERIFY_OTP: `${authController}/verify-otp`,
    SEND_OTP: `${authController}/send-otp`,
    RESET_PASSWORD: `${authController}/reset-password`,
    CREATE_ACCOUNT: `${authController}/register`,
  },
};
