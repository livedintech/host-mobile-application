import { getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';

const linking = {
  prefixes: [
    'livedin://',
    'livedinapp://',
    'https://app.livedin.co',
  ],
  config: {
    screens: {
      MANAGE_BOOKING_SCREEN: 'airbnb-callback',
      DEEP_LINK_HANDLER_SCREEN: 'signup',
      CHAT_DETAIL_SCREEN: {
        path: 'chat',
        parse: {
          conversation_id: (id: string) => id,
        },
      },
    },
  },
  getStateFromPath: (path: string, options: any) => {
    if (path.startsWith('chat')) {
      const params = Object.fromEntries(
        new URLSearchParams(path.split('?')[1] ?? '')
      );
      return {
        index: 1,
        routes: [
          { name: 'ROOT_STACK' },
          { name: 'CHAT_DETAIL_SCREEN', params },
        ],
      };
    }
    return defaultGetStateFromPath(path, options);
  },
};

export default linking;