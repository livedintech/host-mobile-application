import i18n from '@/locales/i18n/i18n';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { aiFeedbackSchema, AiFeedbackFormValues } from '@/validation/chat/chatSchemas';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import { FlatList } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import STORAGE_CONST from '@/constants/storage';
import {
  ChatMessageSendApi,
  getChatDetailApi,
  getChatDetailSavedRepliesApi,
  deleteChatMessageApi,
  getPendingAgentMessageReviewApi,
  updateAgentMessageReviewApi,
} from '@/services/chatApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import Toast from 'react-native-toast-message';
import {
  createChatSnoozeByConversationIdResponseType,
  sendMessagePayloadType,
} from '@/types/api/chatTypes';
import { subscribeToChatThreadChannel } from '@/services/socketService';

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
  const isFocused = useIsFocused();
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

  // Core Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationData, setConversationData] = useState<any>(null);

  // UI State
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | number | null
  >(null);
  const [selectedAiSuggestionId, setSelectedAiSuggestionId] = useState<
    number | null
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
  });

  /* ------------------------------- REALTIME SOCKET ------------------------------ */

  useEffect(() => {
    if (!conversation_id || !isFocused) return;

    let unsubscribe: (() => void) | undefined;
    subscribeToChatThreadChannel(conversation_id, () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, conversation_id],
      });
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(error => {
      console.warn('Chat thread socket subscription failed', error);
    });

    return () => unsubscribe?.();
  }, [conversation_id, isFocused]);

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

      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_AI_SUGGESTIONS],
      });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

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

  // Scrolls to the latest message after sending, then clears the "just sent" flag
  const scrollToBottomAfterSend = useCallback(() => {
    setJustSentMessage(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      setTimeout(() => setJustSentMessage(false), 500);
    }, 100);
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !conversation_id) return;

    const bodyText = inputText.trim();

    // Optimistic message so the UI updates instantly, before the API responds
    addMessage({
      _id: `temp-${Date.now()}`,
      text: bodyText,
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
    });

    scrollToBottomAfterSend();

    setInputText('');
    setReplyingToMessage(null);
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
    setShowAttachmentMenu(false);

    const payload: any = {
      conversation_id,
      body: bodyText,
      reply_to: replyingToMessage?._id,
    };

    if (selectedAiSuggestionId) {
      payload.agent_message_reviews_id = selectedAiSuggestionId;
    }

    chatMessagesSend(payload);
  }, [
    inputText,
    conversation_id,
    replyingToMessage,
    selectedAiSuggestionId,
    user,
    addMessage,
    scrollToBottomAfterSend,
    chatMessagesSend,
  ]);

  // Send saved reply
  const sendSavedReply = useCallback(
    (replyText: string) => {
      addMessage({
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
      });

      scrollToBottomAfterSend();

      setInputText('');
      setReplyingToMessage(null);
      setShowSavedReplies(false);
      setShowAttachmentMenu(false);

      // TODO: Call API to send the saved reply
    },
    [addMessage, replyingToMessage, scrollToBottomAfterSend, user],
  );

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

  // Builds the shared message fields (sender + reply quote) for locally-composed messages
  const buildOutgoingMessageBase = useCallback(
    (): Pick<ChatMessage, '_id' | 'createdAt' | 'user' | 'replyTo'> => ({
      _id: `temp-${Date.now()}`,
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
    }),
    [user, replyingToMessage],
  );

  // Adds the message optimistically, scrolls to it, and resets reply/attachment-menu state
  const sendOutgoingMedia = useCallback(
    (mediaFields: Partial<ChatMessage>) => {
      addMessage({ ...buildOutgoingMessageBase(), text: '', ...mediaFields });
      scrollToBottomAfterSend();
      setReplyingToMessage(null);
      setShowAttachmentMenu(false);
    },
    [addMessage, buildOutgoingMessageBase, scrollToBottomAfterSend],
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

      sendOutgoingMedia({ image: image.path });
      // TODO: Upload image and call API
    } catch (error) {
      console.warn('Camera Error:', error);
    }
  }, [sendOutgoingMedia]);

  const handleVideo = useCallback(async () => {
    try {
      const video = await ImageCropPicker.openCamera({
        mediaType: 'video',
        compressVideoPreset: 'MediumQuality',
        compressVideoQuality: 0.8,
      });

      sendOutgoingMedia({ video: video.path });
      // TODO: Upload video and call API
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }
      console.warn('Video Error:', error);
    }
  }, [sendOutgoingMedia]);

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

      const isVideo = media.mime?.includes('video');
      sendOutgoingMedia({
        image: isVideo ? undefined : media.path,
        video: isVideo ? media.path : undefined,
      });
      // TODO: Upload media and call API
    } catch (error) {
      console.warn('Gallery Error:', error);
    }
  }, [sendOutgoingMedia]);

  const handleDocument = useCallback(async () => {
    try {
      const [res] = await pick({
        type: [types.pdf, types.docx, types.allFiles],
      });

      if (res) {
        sendOutgoingMedia({
          text: `📄 ${res.name}`,
          document: {
            uri: res.uri,
            name: res.name || 'Document',
            type: res.type || 'application/octet-stream',
            size: res.size || 0,
          },
        });
        // TODO: Upload document and call API
      }
    } catch (error) {
      console.warn('Document Error:', error);
    }
  }, [sendOutgoingMedia]);

  const { data: pendingReviewData } = useQuery(
    {
      queryKey: [STORAGE_CONST.GET_AI_SUGGESTIONS, conversation_id],
      queryFn: () =>
        getPendingAgentMessageReviewApi({
          message_thread_id: conversation_id ?? '',
        }),
      enabled: Boolean(conversation_id),
    },
  );

  useEffect(() => {
    if (pendingReviewData?.agent_message) {
      setAiSuggestion(pendingReviewData);
      setShowAiSuggestion(true);
    } else {
      setAiSuggestion(null);
      setShowAiSuggestion(false);
    }
  }, [pendingReviewData]);

  const currentSuggestion = aiSuggestion;

  const sendAiSuggestion = useCallback((customText?: string) => {
    const textToSend = customText ?? currentSuggestion?.agent_message;
    if (!textToSend || !conversation_id) {
      return;
    }

    addMessage({
      _id: `temp-${Date.now()}`,
      text: textToSend,
      createdAt: new Date(),
      user: {
        _id: Number(user?.id),
        name: user?.name || 'You',
      },
    });

    scrollToBottomAfterSend();
    setShowAiSuggestion(false);

    chatMessagesSend({
      conversation_id,
      body: textToSend,
      agent_message_reviews_id: currentSuggestion?.id,
    });
  }, [currentSuggestion, conversation_id, addMessage, scrollToBottomAfterSend, chatMessagesSend, user]);

  const feedback = pendingReviewData?.feedback

  const [aiFeedbackType, setAiFeedbackType] = useState<'up' | 'down' | null>(null);

  const {
    control: feedbackControl,
    formState: { errors: feedbackErrors },
    handleSubmit: handleFeedbackFormSubmit,
    setValue: setFeedbackValue,
    reset: resetFeedback,
    watch: watchFeedback,
  } = useForm<AiFeedbackFormValues>({
    resolver: yupResolver(aiFeedbackSchema) as any,
    defaultValues: { feedbackType: null, feedback_review: '' },
  });

  const feedbackReviewValue = watchFeedback('feedback_review');

  useEffect(() => {
    setFeedbackValue('feedbackType', aiFeedbackType);
    resetFeedback({ feedbackType: aiFeedbackType, feedback_review: '' });
  }, [aiFeedbackType, currentSuggestion?.id]);

  const { mutate: submitFeedbackMutate } = useMutation({
    mutationFn: updateAgentMessageReviewApi,
    onSuccess: () => {
      setAiFeedbackType(null);
      resetFeedback({ feedbackType: null, feedback_review: '' });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_AI_SUGGESTIONS, conversation_id],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  const handleSubmitFeedback = useCallback(() => {
    handleFeedbackFormSubmit((data: AiFeedbackFormValues) => {
      if (!currentSuggestion?.id || !aiFeedbackType) return;
      submitFeedbackMutate({
        id: currentSuggestion.id,
        feedback: aiFeedbackType === 'up',
        feedback_review: data.feedback_review?.trim() || undefined,
      });
    })();
  }, [currentSuggestion, aiFeedbackType, handleFeedbackFormSubmit, submitFeedbackMutate]);

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
    currentSuggestion,
    setSelectedAiSuggestionId,

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
    data,
    feedback,

    // AI Feedback
    aiFeedbackType,
    setAiFeedbackType,
    feedbackControl,
    feedbackErrors,
    feedbackReviewValue,
    handleSubmitFeedback,
  };
};
