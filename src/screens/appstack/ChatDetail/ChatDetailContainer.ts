// ChatContainer.tsx - Custom Chat Hook with Full State Management
import { useState, useCallback, useEffect } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';

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
}

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
    };

    addMessage(newMessage);
    setInputText('');
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
    setShowAttachmentMenu(false);
  }, [inputText, addMessage]);

  // Send saved reply
  const sendSavedReply = useCallback(
    (replyText: string) => {
      const newMessage: ChatMessage = {
        _id: Date.now(),
        text: replyText,
        createdAt: new Date(),
        user: { _id: 1, name: 'Host' },
      };

      addMessage(newMessage);
      setInputText('');
      setShowSavedReplies(false);
      setShowAttachmentMenu(false);
    },
    [addMessage],
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
      };

      addMessage(message);
      setShowAttachmentMenu(false);
    } catch (error) {
      console.log('Camera Error:', error);
    }
  }, [addMessage]);

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
      };

      addMessage(message);
      setShowAttachmentMenu(false);
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return;
      }

      console.log('Video Error:', error);
    }
  }, [addMessage]);

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
      };

      addMessage(message);
      setShowAttachmentMenu(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  }, [addMessage]);

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
        };

        addMessage(message);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      console.log('Document Error:', error);
    }
  }, [addMessage]);

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
  };
};
