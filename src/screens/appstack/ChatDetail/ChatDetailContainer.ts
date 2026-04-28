import i18n from '@/locales/i18n/i18n';
// ChatContainer.tsx - Complete Code with improved scroll management
import { useState, useCallback, useEffect, useRef } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import STORAGE_CONST from '@/constants/storage';
import {
  ChatMessageSendApi,
  ChatMessageSendWithMediaApi,
  getChatDetailApi,
  getChatDetailSavedRepliesApi,
  deleteChatMessageApi,
} from '@/services/chatApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import Toast from 'react-native-toast-message';
import {
  createChatSnoozeByConversationIdResponseType,
  sendMessagePayloadType,
} from '@/types/api/chatTypes';

export interface ChatMessage {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
  image?: string;
  video?: string;
  document?: {
    uri: string;
    name: string;
    type: string;
    size: number;
  };
  replyTo?: {
    _id: string | number;
    text: string;
    userName: string;
  };
}

interface SavedReply {
  id: number;
  label: string;
  value: string;
}

// const SAVED_REPLIES: SavedReply[] = [
//   {
//     id: 1,
//     label: 'Wifi Pass',
//     value: 'Here is the Wi-Fi password for your stay: 12345678',
//   },
//   {
//     id: 2,
//     label: 'Cleaning',
//     value: 'Cleaning will be done daily between 10 AM and 12 PM.',
//   },
//   {
//     id: 3,
//     label: 'Check in',
//     value: 'You can check in anytime after 3:00 PM.',
//   },
//   { id: 4, label: 'Check out', value: 'Please check out before 11:00 AM.' },
//   {
//     id: 5,
//     label: 'Bathroom',
//     value: 'Fresh towels and toiletries are provided in the bathroom.',
//   },
//   { id: 6, label: 'Bedsheet', value: 'Bedsheets are changed every 3 days.' },
//   { id: 7, label: 'Timings', value: 'Breakfast is served from 8 AM to 10 AM.' },
//   { id: 8, label: 'Booking', value: 'Your booking has been confirmed.' },
//   {
//     id: 9,
//     label: 'Microwave',
//     value: 'The microwave is available in the kitchen.',
//   },
// ];

// Helper function to transform API data to ChatMessage format
const transformApiMessages = (
  apiMessages: any[],
  currentUserId: number,
): ChatMessage[] => {
  if (!Array.isArray(apiMessages)) {
    console.warn('apiMessages is not an array:', apiMessages);
    return [];
  }

  return apiMessages.map(msg => ({
    _id: msg._id || Math.random().toString(),
    text: msg.text || '',
    createdAt: new Date(msg.created_at),
    user: {
      // ✅ Use sender_type to determine user ID
      // If sender_type is 'host', use the logged-in user's ID
      // If sender_type is 'guest', use a different ID (e.g., 999 for guest)
      _id: msg.sender_type === 'host' ? currentUserId : 999,
      name: msg.user.name,
    },
    image: msg.media?.type === 'image' ? msg.media.url : undefined,
    video: msg.media?.type === 'video' ? msg.media.url : undefined,
    document:
      msg.media?.type === 'document'
        ? {
            uri: msg.media.url,
            name: msg.media.name || 'Document',
            type: msg.media.mime_type || 'application/octet-stream',
            size: msg.media.size || 0,
          }
        : undefined,
    replyTo: msg.reply_to
      ? {
          _id: msg.reply_to._id,
          text: msg.reply_to.text || 'Media message',
          userName: msg.reply_to.user?.name || 'User',
        }
      : undefined,
  }));
};

export const useChatContainer = () => {
  const { user } = useAuthStore();

  // Safely get params
  const route = useRoute();
  const params = route?.params as
    | {
        conversation_id?: string;
        listing_id?: string;
        assigned_to_ids?: number[];
      }
    | undefined;
  const conversation_id = params?.conversation_id;
  const listing_id = params?.listing_id;
  const assigned_to_ids = params?.assigned_to_ids;
  console.log("assigned_to_ids",assigned_to_ids)


  // Core Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationData, setConversationData] = useState<any>(null);

  // UI State
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | number | null
  >(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // State to handle image preview
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // Message State
  const [selectedMessageData, setSelectedMessageData] =
    useState<ChatMessage | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, isHost: false });

  // Reply State
  const [replyingToMessage, setReplyingToMessage] =
    useState<ChatMessage | null>(null);

  // Ref for FlatList to control scrolling
  const flatListRef = useRef<FlatList>(null);

  // ✅ Track if user just sent a message (for auto-scroll)
  const [justSentMessage, setJustSentMessage] = useState(false);

  // Get Messages of a conversation
  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL,
      conversation_id,
    ],
    queryFn: () => getChatDetailApi({ conversation_id }),
    enabled: Boolean(conversation_id),
    refetchInterval: 4000,
  });

  // Get Saved Replies of a conversation
  const { data: savedReplies } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_DETAIL_SAVED_REPLIES, listing_id],
    queryFn: () =>
      getChatDetailSavedRepliesApi({
        listing_id: listing_id ?? '',
        is_active: true,
      }),
  });

  // Create User
  const { mutate: chatMessagesSend } = useMutation<
    createChatSnoozeByConversationIdResponseType,
    Error,
    sendMessagePayloadType
  >({
    mutationFn: ChatMessageSendApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_DETAIL],
      });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  console.log('API Data:', data);

  // Delete Message Mutation
  const { mutate: deleteChatMessage } = useMutation({
    mutationFn: (messageId: string | number) =>
      deleteChatMessageApi({ message_id: messageId }),
    onSuccess: () => {
      // Invalidate queries to refresh chat list and detail from server
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [
          STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL,
          conversation_id,
        ],
      });
      Toast.show({
        type: 'success',
        text1: i18n.t('app.chat_detail.message_deleted'),
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('app.chat_detail.delete_failed'),
      });
      // Optional: refetch to sync UI if optimistic update failed
      refetch();
    },
  });

  // Update messages when API data changes
  useEffect(() => {
    if (data?.messages) {
      // Don't block on user?.id here
      const transformedMessages = transformApiMessages(
        data.messages,
        Number(user?.id || 0), // Fallback to 0 if not loaded yet
      );
      setMessages(transformedMessages);
    }
    if (data?.conversation) {
      setConversationData(data.conversation);
    }
  }, [data, user?.id]);

  // Add message to chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [message, ...prev]);
  }, []);

  // ✅ Enhanced send message with auto-scroll flag
  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !conversation_id) return;

    const tempId = `temp-${Date.now()}`;

    // 👇 optimistic message (UI smooth)
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      text: inputText.trim(),
      createdAt: new Date(),
      user: {
        _id: Number(user?.id),
        name: user?.name || 'You',
      },
      replyTo: replyingToMessage
        ? {
            _id: replyingToMessage._id,
            text: replyingToMessage.text || 'Media message',
            userName: replyingToMessage.user.name,
          }
        : undefined,
    };

    // ✅ UI instantly update
    addMessage(optimisticMessage);

    // ✅ Set flag that user just sent message (for auto-scroll in ChatScreen)
    setJustSentMessage(true);

    const bodyText = inputText.trim();

    setInputText('');
    setReplyingToMessage(null);
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
    setShowAttachmentMenu(false);

    // ✅ Auto scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      // Reset flag after scroll
      setTimeout(() => setJustSentMessage(false), 500);
    }, 100);

    // ✅ API CALL
    chatMessagesSend({
      conversation_id,
      body: bodyText,
      reply_to: replyingToMessage?._id,
    });
  }, [
    inputText,
    conversation_id,
    replyingToMessage,
    user,
    addMessage,
    chatMessagesSend,
  ]);

  // Send saved reply
  const sendSavedReply = useCallback(
    (replyText: string) => {
      const newMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        text: replyText,
        createdAt: new Date(),
        user: {
          _id: Number(user?.id),
          name: user?.name || 'You',
        },
        replyTo: replyingToMessage
          ? {
              _id: replyingToMessage._id,
              text: replyingToMessage.text || 'Media message',
              userName: replyingToMessage.user.name,
            }
          : undefined,
      };

      addMessage(newMessage);

      // ✅ Set flag for auto-scroll
      setJustSentMessage(true);

      setInputText('');
      setReplyingToMessage(null);
      setShowSavedReplies(false);
      setShowAttachmentMenu(false);

      // ✅ Auto scroll
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setTimeout(() => setJustSentMessage(false), 500);
      }, 100);

      // TODO: Call API to send message
    },
    [addMessage, replyingToMessage, user],
  );

  // Send AI suggestion
  const sendAiSuggestion = useCallback(() => {
    const aiMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      text: 'Welcome! Your check-in is from 3:00PM to 10:00PM. Your name is shared with the gate guard. Door code and entry instructions will be sent 1 hour before arrival. Wi-Fi and other details are inside.',
      createdAt: new Date(),
      user: {
        _id: Number(user?.id),
        name: user?.name || 'You',
      },
    };
    addMessage(aiMessage);

    // ✅ Set flag for auto-scroll
    setJustSentMessage(true);

    setShowAiSuggestion(false);

    // ✅ Auto scroll
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      setTimeout(() => setJustSentMessage(false), 500);
    }, 100);

    // TODO: Call API to send message
  }, [addMessage, user]);

  // Message Actions
  const handleMessageSelect = (message: ChatMessage) => {
    if (selectedMessageId === message._id) {
      setSelectedMessageId(null);
      setSelectedMessageData(null);
    } else {
      setSelectedMessageId(message._id);
      setSelectedMessageData(message);
      setMenuPosition({
        top: 0,
        isHost: message.user._id === Number(user?.id),
      });
    }
  };

  // Handle reply action
  const handleReplyToMessage = useCallback((message: ChatMessage) => {
    setReplyingToMessage(message);
    setSelectedMessageId(null);
    setSelectedMessageData(null);
  }, []);

  // Cancel reply
  const cancelReply = useCallback(() => {
    setReplyingToMessage(null);
  }, []);

  // Scroll to specific message
  const scrollToMessage = useCallback(
    (messageId: string | number, messages: ChatMessage[]) => {
      const messageIndex = messages.findIndex(msg => msg._id === messageId);

      if (messageIndex !== -1 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: messageIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    },
    [],
  );

  const handleCopyText = useCallback((text: string) => {
    if (text) {
      Clipboard.setString(text);
    }
    setSelectedMessageId(null);
  }, []);
  const handleTaskCreation = useCallback((text: string) => {
    console.log('Create task:', text);
    setSelectedMessageId(null);
  }, []);

  const handleTranslate = useCallback((text: string) => {
    console.log('Translate:', text);
    setSelectedMessageId(null);
  }, []);

  const handleDeleteMessage = useCallback(
    (messageId: string | number) => {
      // 1. Optimistic UI update: Remove from local state immediately
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setSelectedMessageId(null);
      setSelectedMessageData(null);

      // 2. Trigger API Call
      deleteChatMessage(messageId);
    },
    [deleteChatMessage],
  );

  // Media Handlers
  const handleCamera = useCallback(async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      const message: ChatMessage = {
        _id: `temp-${Date.now()}`,
        text: '',
        createdAt: new Date(),
        user: {
          _id: Number(user?.id),
          name: user?.name || 'You',
        },
        image: image.path,
        replyTo: replyingToMessage
          ? {
              _id: replyingToMessage._id,
              text: replyingToMessage.text || 'Media message',
              userName: replyingToMessage.user.name,
            }
          : undefined,
      };

      addMessage(message);

      // ✅ Set flag for auto-scroll
      setJustSentMessage(true);

      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

      // ✅ Auto scroll
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setTimeout(() => setJustSentMessage(false), 500);
      }, 100);

      // TODO: Upload image and call API
    } catch (error) {
      console.log('Camera Error:', error);
    }
  }, [addMessage, replyingToMessage, user]);

  const handleVideo = useCallback(async () => {
    try {
      const video = await ImageCropPicker.openCamera({
        mediaType: 'video',
        compressVideoPreset: 'MediumQuality',
        compressVideoQuality: 0.8,
      });

      const message: ChatMessage = {
        _id: `temp-${Date.now()}`,
        text: '',
        createdAt: new Date(),
        user: {
          _id: Number(user?.id),
          name: user?.name || 'You',
        },
        video: video.path,
        replyTo: replyingToMessage
          ? {
              _id: replyingToMessage._id,
              text: replyingToMessage.text || 'Media message',
              userName: replyingToMessage.user.name,
            }
          : undefined,
      };

      addMessage(message);

      // ✅ Set flag for auto-scroll
      setJustSentMessage(true);

      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

      // ✅ Auto scroll
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setTimeout(() => setJustSentMessage(false), 500);
      }, 100);

      // TODO: Upload video and call API
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }
      console.log('Video Error:', error);
    }
  }, [addMessage, replyingToMessage, user]);

  const handleGallery = useCallback(async () => {
    try {
      const media = await ImageCropPicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
        mediaType: 'any',
      });

      const message: ChatMessage = {
        _id: `temp-${Date.now()}`,
        text: '',
        createdAt: new Date(),
        user: {
          _id: Number(user?.id),
          name: user?.name || 'You',
        },
        image: media.mime?.includes('video') ? undefined : media.path,
        video: media.mime?.includes('video') ? media.path : undefined,
        replyTo: replyingToMessage
          ? {
              _id: replyingToMessage._id,
              text: replyingToMessage.text || 'Media message',
              userName: replyingToMessage.user.name,
            }
          : undefined,
      };

      addMessage(message);

      // ✅ Set flag for auto-scroll
      setJustSentMessage(true);

      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

      // ✅ Auto scroll
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setTimeout(() => setJustSentMessage(false), 500);
      }, 100);

      // TODO: Upload media and call API
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  }, [addMessage, replyingToMessage, user]);

  const handleDocument = useCallback(async () => {
    try {
      const [res] = await pick({
        type: [types.pdf, types.docx, types.allFiles],
      });

      if (res) {
        const message: ChatMessage = {
          _id: `temp-${Date.now()}`,
          text: `📄 ${res.name}`,
          createdAt: new Date(),
          user: {
            _id: Number(user?.id),
            name: user?.name || 'You',
          },
          document: {
            uri: res.uri,
            name: res.name || 'Document',
            type: res.type || 'application/octet-stream',
            size: res.size || 0,
          },
          replyTo: replyingToMessage
            ? {
                _id: replyingToMessage._id,
                text: replyingToMessage.text || 'Media message',
                userName: replyingToMessage.user.name,
              }
            : undefined,
        };

        addMessage(message);

        // ✅ Set flag for auto-scroll
        setJustSentMessage(true);

        setReplyingToMessage(null);
        setShowAttachmentMenu(false);

        // ✅ Auto scroll
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: 0, animated: true });
          setTimeout(() => setJustSentMessage(false), 500);
        }, 100);

        // TODO: Upload document and call API
      }
    } catch (error) {
      console.log('Document Error:', error);
    }
  }, [addMessage, replyingToMessage, user]);

  console.log('messages');
  return {
    // State
    messages,
    inputText,
    isLoading,
    showAiSuggestion,
    showSavedReplies,
    selectedMessageId,
    showAttachmentMenu,
    previewImageUri,
    setPreviewImageUri,
    isImageViewerVisible,
    setIsImageViewerVisible,
    selectedMessageData,
    setSelectedMessageData,
    menuPosition,
    replyingToMessage,
    flatListRef,
    conversationData,
    justSentMessage,

    // Setters
    setInputText,
    setShowAiSuggestion,
    setShowSavedReplies,
    setSelectedMessageId,
    setShowAttachmentMenu,

    // Methods
    sendMessage,
    sendSavedReply,
    sendAiSuggestion,
    addMessage,
    handleCopyText,
    handleTaskCreation,
    handleTranslate,
    handleDeleteMessage,
    handleCamera,
    handleVideo,
    handleGallery,
    handleDocument,
    handleMessageSelect,
    handleReplyToMessage,
    cancelReply,
    scrollToMessage,
    SAVED_REPLIES: savedReplies?.data?.items,
    refetch,

    //ASSIGN CHAT IDS
    assigned_to_ids,
    data
  };
};
