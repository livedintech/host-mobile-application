const linking = {
  prefixes: [
    'livedin://',
    'livedinapp://',
    'https://app.livedin.co',
  ],
  config: {
    screens: {
      ManageBooking: 'airbnb-callback',
      AUTH_STACK: {
        screens: {
          CREATE_ACCOUNT_SCREEN: 'signup',
        },
      },
    },
  },
};

export default linking;