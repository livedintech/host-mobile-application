import PusherJS, { Channel } from 'pusher-js/react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { getChatBroadcastConfigApi, ChatBroadcastConfig } from './chatApi';

// pusher-js's react-native build exports the class as `.Pusher`, not as the
// module default, so the default import resolves to a non-constructable object.
const Pusher: typeof PusherJS = (PusherJS as any).Pusher ?? PusherJS;
type Pusher = PusherJS;

let pusherClient: Pusher | null = null;
let configPromise: Promise<ChatBroadcastConfig> | null = null;

const getPusherClient = async (): Promise<Pusher> => {
  if (pusherClient) return pusherClient;

  if (!configPromise) {
    configPromise = getChatBroadcastConfigApi();
  }
  const config = await configPromise;

  pusherClient = new Pusher(config.key, {
    cluster: 'mt1', // unused with a custom wsHost, but pusher-js requires it to be set
    wsHost: config.wsHost,
    wsPort: config.wsPort,
    wssPort: config.wssPort,
    forceTLS: config.forceTLS,
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: Channel) => ({
      authorize: (socketId: string, callback: (error: Error | null, authData: any) => void) => {
        fetch(config.auth_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            [config.auth_header]: `Bearer ${useAuthStore.getState()?.token}`,
          },
          body: `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channel.name)}`,
        })
          .then(res => res.json())
          .then(data => callback(null, data))
          .catch(error => callback(error, null));
      },
    }),
  } as any);

  return pusherClient;
};

export const CHAT_SOCKET_EVENTS = {
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_READ: 'message.read',
  MESSAGE_TYPING: 'message.typing',
  THREAD_RECEIVED: 'thread.received',
};

// Pusher channels don't replay events missed while disconnected (network blip,
// app backgrounded, etc). Re-running `onUpdate` whenever the socket (re)connects
// closes that gap so a reconnect always re-syncs instead of silently going stale.
const bindReconnectSync = (client: Pusher, onUpdate: () => void) => {
  client.connection.bind('connected', onUpdate);
  return () => client.connection.unbind('connected', onUpdate);
};

export const subscribeToUserChatChannel = async (
  userId: number,
  onUpdate: () => void,
): Promise<() => void> => {
  const client = await getPusherClient();
  const channel = client.subscribe(`private-App.Models.User.${userId}`);

  channel.bind(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onUpdate);
  channel.bind(CHAT_SOCKET_EVENTS.THREAD_RECEIVED, onUpdate);
  const unbindReconnectSync = bindReconnectSync(client, onUpdate);

  return () => {
    channel.unbind(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onUpdate);
    channel.unbind(CHAT_SOCKET_EVENTS.THREAD_RECEIVED, onUpdate);
    unbindReconnectSync();
    client.unsubscribe(`private-App.Models.User.${userId}`);
  };
};

export const subscribeToChatThreadChannel = async (
  conversationId: string | number,
  onUpdate: () => void,
): Promise<() => void> => {
  const client = await getPusherClient();
  const channel = client.subscribe(`messages.${conversationId}`);

  channel.bind(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onUpdate);
  channel.bind(CHAT_SOCKET_EVENTS.MESSAGE_READ, onUpdate);
  const unbindReconnectSync = bindReconnectSync(client, onUpdate);

  return () => {
    channel.unbind(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onUpdate);
    channel.unbind(CHAT_SOCKET_EVENTS.MESSAGE_READ, onUpdate);
    unbindReconnectSync();
    client.unsubscribe(`messages.${conversationId}`);
  };
};
