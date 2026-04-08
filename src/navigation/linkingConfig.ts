const linking = {
  prefixes: [
    'livedin://',
    'livedinapp://',
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