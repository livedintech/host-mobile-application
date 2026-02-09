// ChatContainer.tsx - Complete Code with Dynamic User IDs
import { useState, useCallback, useEffect, useRef } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { ChatMessageSendApi, getChatDetailApi } from '@/services/chatApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import Toast from 'react-native-toast-message';
import { createChatSnoozeByConversationIdResponseType, sendMessagePayloadType } from '@/types/api/chatTypes';

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

const SAVED_REPLIES: SavedReply[] = [
  {
    id: 1,
    label: 'Wifi Pass',
    value: 'Here is the Wi-Fi password for your stay: 12345678',
  },
  {
    id: 2,
    label: 'Cleaning',
    value: 'Cleaning will be done daily between 10 AM and 12 PM.',
  },
  {
    id: 3,
    label: 'Check in',
    value: 'You can check in anytime after 3:00 PM.',
  },
  { id: 4, label: 'Check out', value: 'Please check out before 11:00 AM.' },
  {
    id: 5,
    label: 'Bathroom',
    value: 'Fresh towels and toiletries are provided in the bathroom.',
  },
  { id: 6, label: 'Bedsheet', value: 'Bedsheets are changed every 3 days.' },
  { id: 7, label: 'Timings', value: 'Breakfast is served from 8 AM to 10 AM.' },
  { id: 8, label: 'Booking', value: 'Your booking has been confirmed.' },
  {
    id: 9,
    label: 'Microwave',
    value: 'The microwave is available in the kitchen.',
  },
];

// Helper function to transform API data to ChatMessage format
const transformApiMessages = (apiMessages: any[]): ChatMessage[] => {
  if (!Array.isArray(apiMessages)) {
    console.warn('apiMessages is not an array:', apiMessages);
    return [];
  }

  return apiMessages.map(msg => ({
    _id: msg._id,
    text: msg.text || '',
    createdAt: new Date(msg.created_at),
    user: {
      // Keep original user ID - no transformation
      _id: Number(msg.user._id),
      name: msg.user.name,
    },
    image: msg.media?.type === 'image' ? msg.media.url : undefined,
    video: msg.media?.type === 'video' ? msg.media.url : undefined,
    document: msg.media?.type === 'document' ? {
      uri: msg.media.url,
      name: msg.media.name || 'Document',
      type: msg.media.mime_type || 'application/octet-stream',
      size: msg.media.size || 0,
    } : undefined,
    replyTo: msg.reply_to ? {
      _id: msg.reply_to._id,
      text: msg.reply_to.text || 'Media message',
      userName: msg.reply_to.user?.name || 'User',
    } : undefined,
  }));
};

export const useChatContainer = () => {
  const { user } = useAuthStore();
  console.log('user',user?.id);
  
  
  // Safely get params
  const route = useRoute();
  const params = route?.params as { conversation_id?: string } | undefined;
  const conversation_id = params?.conversation_id;

  console.log('Logged in user:', user);
  console.log('Conversation ID:', conversation_id);

  // Core Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationData, setConversationData] = useState<any>(null);

  // UI State
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | number | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // State to handle image preview
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // Message State
  const [selectedMessageData, setSelectedMessageData] = useState<ChatMessage | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, isHost: false });

  // Reply State
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);

  // Ref for FlatList to control scrolling
  const flatListRef = useRef<FlatList>(null);

  // Get Messages of a conversation
  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, conversation_id],
    queryFn: () => getChatDetailApi({ conversation_id }),
    enabled: Boolean(conversation_id),
      refetchInterval: 4000,

  });

  // Create User 
  const {
    mutate: chatMessagesSend,
  } = useMutation<createChatSnoozeByConversationIdResponseType, Error, sendMessagePayloadType>({
    mutationFn: ChatMessageSendApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_LIST]
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_DETAIL]
      });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  console.log('API Data:', data);

  // Update messages when API data changes
  useEffect(() => {
    if (data?.messages) {
      const transformedMessages = transformApiMessages(data.messages);
      console.log('Transformed Messages:', transformedMessages);
      console.log('Logged-in user ID:', user?.id);
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

  // Send text message
  // const sendMessage = useCallback(() => {
  //   if (!inputText.trim()) return;

  //   const newMessage: ChatMessage = {
  //     _id: `temp-${Date.now()}`,
  //     text: inputText.trim(),
  //     createdAt: new Date(),
  //     user: { 
  //       _id: Number(user?.id),
  //       name: user?.name || 'You'
  //     },
  //     replyTo: replyingToMessage
  //       ? {
  //           _id: replyingToMessage._id,
  //           text: replyingToMessage.text || 'Media message',
  //           userName: replyingToMessage.user.name,
  //         }
  //       : undefined,
  //   };

  //   console.log('Sending message:', newMessage);

  //   addMessage(newMessage);
  //   setInputText('');
  //   setReplyingToMessage(null);
  //   setShowAiSuggestion(false);
  //   setShowSavedReplies(false);
  //   setShowAttachmentMenu(false);

  //   // TODO: Call API to send message
  //   // sendMessageApi({ conversation_id, text: inputText.trim(), reply_to: replyingToMessage?._id });
  // }, [inputText, addMessage, replyingToMessage, user]);


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

  const bodyText = inputText.trim();

  setInputText('');
  setReplyingToMessage(null);
  setShowAiSuggestion(false);
  setShowSavedReplies(false);
  setShowAttachmentMenu(false);

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
          name: user?.name || 'You'
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
      setInputText('');
      setReplyingToMessage(null);
      setShowSavedReplies(false);
      setShowAttachmentMenu(false);

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
        name: user?.name || 'You'
      },
    };
    addMessage(aiMessage);
    setShowAiSuggestion(false);

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
  const scrollToMessage = useCallback((messageId: string | number, messages: ChatMessage[]) => {
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
  }, []);

  const handleCopyText = useCallback((text: string) => {
    console.log('Copy text:', text);
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

  const handleDeleteMessage = useCallback((messageId: string | number) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId));
    setSelectedMessageId(null);
    
    // TODO: Call API to delete message
  }, []);

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
          name: user?.name || 'You'
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
      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

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
          name: user?.name || 'You'
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
      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

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
          name: user?.name || 'You'
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
      setReplyingToMessage(null);
      setShowAttachmentMenu(false);

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
            name: user?.name || 'You'
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
        setReplyingToMessage(null);
        setShowAttachmentMenu(false);

        // TODO: Upload document and call API
      }
    } catch (error) {
      console.log('Document Error:', error);
    }
  }, [addMessage, replyingToMessage, user]);

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

    SAVED_REPLIES,
    refetch,
  };
};