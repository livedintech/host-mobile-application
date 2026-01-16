import { useState, useCallback, useEffect } from 'react';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';

export const useChatDetailContainer = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [showSavedReplies, setShowSavedReplies] = useState(false);

  useEffect(() => {
    // Initial data matching your design
    setMessages([
      {
        _id: 1,
        text: 'Yes, your details have already been shared with the gate guard.',
        createdAt: new Date(),
        user: { _id: 1, name: 'Me' },
      },
      {
        _id: 2,
        text: 'Amazing, thank you! Is there parking available?',
        createdAt: new Date(),
        user: { _id: 2, name: 'Guest' },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    setShowAiSuggestion(false);
    setShowSavedReplies(false);
  }, []);

  const toggleSavedReplies = () => {
    setShowSavedReplies(!showSavedReplies);
  };

  return {
    messages,
    onSend,
    showAiSuggestion,
    setShowAiSuggestion,
    showSavedReplies,
    setShowSavedReplies,
    toggleSavedReplies
  };
};