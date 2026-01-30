// ChatContainer.tsx - With Reply/Quote Message Functionality + Scroll to Message
import { useState, useCallback, useEffect, useRef } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import { FlatList } from 'react-native';

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
  // NEW: Reply functionality
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

export const useChatContainer = () => {
  // Core Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('messages', messages);
  console.log('inputText', inputText);

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

  // NEW: Ref for FlatList to control scrolling
  const flatListRef = useRef<FlatList>(null);

  // Initialize with sample messages
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        _id: 8,
        text: 'Yes, your details have already been shared with the gate guard.',
        createdAt: new Date(Date.now() - 900000),
        user: { _id: 1, name: 'Host' },
      },
      {
        _id: 7,
        text: 'Amazing, thank you! Is there parking available?',
        createdAt: new Date(Date.now() - 1800000),
        user: { _id: 2, name: 'Guest' },
      },
      {
        _id: 6,
        text: 'You can check in now, no problem.',
        createdAt: new Date(Date.now() - 3400000),
        user: { _id: 3, name: 'Automated' },
      },
      {
        _id: 5,
        text: 'You can check in now, no problem.',
        createdAt: new Date(Date.now() - 3500000),
        user: { _id: 1, name: 'Host' },
      },
      {
        _id: 4,
        text: "Also, can we check in a bit early? It's 1:15 PM and we're nearby.",
        createdAt: new Date(Date.now() - 3600000),
        user: { _id: 2, name: 'Guest' },
      },
      {
        _id: 3,
        text: 'Taxi sounds good — thanks!',
        createdAt: new Date(Date.now() - 3600000),
        user: { _id: 2, name: 'Guest' },
      },
      {
        _id: 2,
        text: 'You can also use Uber or Careem, both work well here.',
        createdAt: new Date(Date.now() - 7200000),
        user: { _id: 1, name: 'Host' },
      },
      {
        _id: 1,
        text: 'the fastest option is a taxi takes',
        createdAt: new Date(Date.now() - 7200000),
        user: { _id: 1, name: 'Host' },
      },
    ];
    setMessages(initialMessages);
  }, []);

  // Add message to chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [message, ...prev]);
  }, []);

  // Send text message
  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      _id: Date.now(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: { _id: 1, name: 'Host' },
      // NEW: Add reply info if replying to a message
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
    setReplyingToMessage(null); // Clear reply
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
    setShowAttachmentMenu(false);
  }, [inputText, addMessage, replyingToMessage]);

  // Send saved reply
  const sendSavedReply = useCallback(
    (replyText: string) => {
      const newMessage: ChatMessage = {
        _id: Date.now(),
        text: replyText,
        createdAt: new Date(),
        user: { _id: 1, name: 'Host' },
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
      setReplyingToMessage(null); // Clear reply
      setShowSavedReplies(false);
      setShowAttachmentMenu(false);
    },
    [addMessage, replyingToMessage],
  );

  // Send AI suggestion
  const sendAiSuggestion = useCallback(() => {
    const aiMessage: ChatMessage = {
      _id: Date.now(),
      text: 'Welcome! Your check-in is from 3:00PM to 10:00PM. Your name is shared with the gate guard. Door code and entry instructions will be sent 1 hour before arrival. Wi-Fi and other details are inside.',
      createdAt: new Date(),
      user: { _id: 1, name: 'Host' },
    };
    addMessage(aiMessage);
    setShowAiSuggestion(false);
  }, [addMessage]);

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
        isHost: message.user._id === 1,
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

  // NEW: Scroll to specific message
  const scrollToMessage = useCallback((messageId: string | number, messages: ChatMessage[]) => {
    const messageIndex = messages.findIndex(msg => msg._id === messageId);
    
    if (messageIndex !== -1 && flatListRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: messageIndex,
          animated: true,
          viewPosition: 0.5, // Center the message in view
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
        _id: Date.now(),
        text: '',
        createdAt: new Date(),
        user: { _id: 1, name: 'Host' },
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
    } catch (error) {
      console.log('Camera Error:', error);
    }
  }, [addMessage, replyingToMessage]);

  const handleVideo = useCallback(async () => {
    try {
      const video = await ImageCropPicker.openCamera({
        mediaType: 'video',
        compressVideoPreset: 'MediumQuality',
        compressVideoQuality: 0.8,
      });

      const message: ChatMessage = {
        _id: Date.now(),
        text: '',
        createdAt: new Date(),
        user: { _id: 1, name: 'Host' },
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
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }

      console.log('Video Error:', error);
    }
  }, [addMessage, replyingToMessage]);

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
        _id: Date.now(),
        text: '',
        createdAt: new Date(),
        user: { _id: 1, name: 'Host' },
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
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  }, [addMessage, replyingToMessage]);

  const handleDocument = useCallback(async () => {
    try {
      const [res] = await pick({
        type: [types.pdf, types.docx, types.allFiles],
      });

      if (res) {
        const message: ChatMessage = {
          _id: Date.now(),
          text: `📄 ${res.name}`,
          createdAt: new Date(),
          user: { _id: 1, name: 'Host' },
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
      }
    } catch (error) {
      console.log('Document Error:', error);
    }
  }, [addMessage, replyingToMessage]);

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
    flatListRef, // NEW: Expose ref
    
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
  };
};