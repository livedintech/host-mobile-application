// ChatDetailContainer.tsx
import { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import ImageCropPicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker'; // Updated Library

export const useChatDetailContainer = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | number | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  useEffect(() => {
    setMessages([
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
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => 
      GiftedChat.append(previousMessages, newMessages)
    );
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
    setShowAttachmentMenu(false);
  }, []);

  const toggleSavedReplies = useCallback(() => {
    setShowSavedReplies((prev) => !prev);
    setShowAttachmentMenu(false);
  }, []);

  const toggleMessageMenu = useCallback((messageId: string | number) => {
    setSelectedMessageId((prev) => prev === messageId ? null : messageId);
  }, []);

  const sendAiSuggestion = useCallback(() => {
    const aiMessage: IMessage = {
      _id: Date.now(),
      text: "Welcome! Your check-in is from 3:00PM to 10:00PM. Your name is shared with the gate guard. Door code and entry instructions will be sent 1 hour before arrival. Wi-Fi and other details are inside.",
      createdAt: new Date(),
      user: { _id: 1, name: 'Host' },
    };
    onSend([aiMessage]);
  }, [onSend]);

  const handleCopyText = useCallback((text: string) => {
    // Implement copy to clipboard functionality
    console.log('Copy text:', text);
    setSelectedMessageId(null);
  }, []);

  const handleTaskCreation = useCallback((text: string) => {
    // Implement task creation functionality
    console.log('Create task:', text);
    setSelectedMessageId(null);
  }, []);

  const handleTranslate = useCallback((text: string) => {
    // Implement translate functionality
    console.log('Translate:', text);
    setSelectedMessageId(null);
  }, []);

  // Camera Handler with Crop
  const handleCamera = useCallback(() => {
    ImageCropPicker.openCamera({
      width: 800,
      height: 800,
      cropping: true,
      cropperCircleOverlay: false,
      compressImageQuality: 0.8,
      mediaType: 'photo',
    })
      .then((image) => {
        const message: IMessage = {
          _id: Date.now(),
          text: '',
          createdAt: new Date(),
          user: { _id: 1, name: 'Host' },
          image: image.path,
        };
        onSend([message]);
      })
      .catch((error) => {
        console.log('Camera Error:', error);
      });
    setShowAttachmentMenu(false);
  }, [onSend]);

  // Video Handler
  const handleVideo = useCallback(() => {
    ImageCropPicker.openCamera({
      mediaType: 'video',
    })
      .then((video) => {
        const message: IMessage = {
          _id: Date.now(),
          text: '',
          createdAt: new Date(),
          user: { _id: 1, name: 'Host' },
          video: video.path,
        };
        onSend([message]);
      })
      .catch((error) => {
        console.log('Video Error:', error);
      });
    setShowAttachmentMenu(false);
  }, [onSend]);

  // Gallery Handler with Crop
  const handleGallery = useCallback(() => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 800,
      cropping: true,
      cropperCircleOverlay: false,
      compressImageQuality: 0.8,
      mediaType: 'any',
    })
      .then((media) => {
        const message: IMessage = {
          _id: Date.now(),
          text: '',
          createdAt: new Date(),
          user: { _id: 1, name: 'Host' },
          image: media.mime.includes('video') ? undefined : media.path,
          video: media.mime.includes('video') ? media.path : undefined,
        };
        onSend([message]);
      })
      .catch((error) => {
        console.log('Gallery Error:', error);
      });
    setShowAttachmentMenu(false);
  }, [onSend]);

  // Document Handler
  // const handleDocument = useCallback(async () => {
  //   try {
  //     const result = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
      
  //     if (result) {
  //       const doc = result[0];
  //       const message: IMessage = {
  //         _id: Date.now(),
  //         text: doc.name || 'Document',
  //         createdAt: new Date(),
  //         user: { _id: 1, name: 'Host' },
  //         // @ts-ignore
  //         document: {
  //           uri: doc.uri,
  //           name: doc.name,
  //           type: doc.type,
  //           size: doc.size,
  //         },
  //       };
  //       onSend([message]);
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled document picker');
  //     } else {
  //       console.log('Document Error:', err);
  //     }
  //   }
  //   setShowAttachmentMenu(false);
  // }, [onSend]);

  const handleDocument = async () => {
        try {
            const [res] = await pick({
                type: [types.pdf, types.docx, types.allFiles],
            });
            if (res) {
                onSend([{
                    _id: Math.random(),
                    createdAt: new Date(),
                    user: { _id: 1 },
                    text: `📄 ${res.name}`,
                }]);
            }
        } catch (err) {
            console.log("Document Picker Error: ", err);
        }
    };

  return {
    messages,
    onSend,
    showAiSuggestion,
    setShowAiSuggestion,
    showSavedReplies,
    setShowSavedReplies,
    toggleSavedReplies,
    selectedMessageId,
    toggleMessageMenu,
    sendAiSuggestion,
    handleCopyText,
    handleTaskCreation,
    handleTranslate,
    showAttachmentMenu,
    setShowAttachmentMenu,
    handleCamera,
    handleVideo,
    handleGallery,
    handleDocument,
  };
};