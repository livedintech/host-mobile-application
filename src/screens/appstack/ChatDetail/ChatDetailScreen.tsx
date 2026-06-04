import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import InputField from '@/components/molecules/Input/InputField';
import {
  StyleSheet,
  View,
  Keyboard,
  Image,
  TextInput,
  Platform,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import ImageViewing from 'react-native-image-viewing';
import Video from 'react-native-video';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useChatContainer, ChatMessage } from './ChatDetailContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack, navigate } from '@/services/navigationService';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';
import InquiryModal from './InquiryModal';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useTranslation } from 'react-i18next';
import AppButton from '@/components/molecules/AppButton/AppButton';

dayjs.extend(advancedFormat);

dayjs.extend(utc);
dayjs.extend(localizedFormat);

dayjs.extend(utc);

const formatDateRange = (arrival: string, departure: string) => {
  const start = dayjs(arrival);
  const end = dayjs(departure);

  if (start.format('MMMM') === end.format('MMMM')) {
    return `${start.format('Do')} - ${end.format('Do')} ${start.format(
      'MMMM',
    )}`;
  }

  return `${start.format('Do MMMM')} - ${end.format('Do MMMM')}`;
};
interface MessageWithTimeLabel extends ChatMessage {
  showTimeLabel?: boolean;
  timeLabel?: string;
}

const getTimeLabel = (date: string | Date): string => {
  // Convert to local time for display comparison
  const messageDate = dayjs(date).local();
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');

  if (messageDate.isSame(today, 'day')) {
    return 'Today';
  }

  if (messageDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }

  if (messageDate.isAfter(today.subtract(7, 'day'))) {
    return messageDate.format('dddd, MMM D'); // e.g. "Tuesday, Apr 8"
  }

  return messageDate.format('ddd, MMM D, YYYY'); // e.g. "Mon, Apr 7, 2026"
};

const processMessagesWithTimeLabels = (
  messages: ChatMessage[],
): MessageWithTimeLabel[] => {
  if (messages.length === 0) return [];

  return messages.map((message, index) => {
    // In newest-first array + inverted FlatList:
    // index + 1 is the OLDER message (rendered ABOVE current)
    // We show the label ABOVE a group = on the oldest message of that day
    // So compare with the NEXT item (which is older)
    const olderMessage =
      index < messages.length - 1 ? messages[index + 1] : null;

    // Show label if there's no older message (last/oldest in list)
    // OR if older message is from a different day
    const showLabel =
      !olderMessage ||
      dayjs(message.createdAt).local().format('YYYY-MM-DD') !==
      dayjs(olderMessage.createdAt).local().format('YYYY-MM-DD');

    return {
      ...message,
      showTimeLabel: showLabel,
      timeLabel: showLabel ? getTimeLabel(message.createdAt) : undefined,
    };
  });
};
const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const route = useRoute();
  const params = route?.params as
    | { conversation_id?: string; listing_id: string }
    | undefined;
  const conversation_id = params?.conversation_id;
  const listing_id = params?.listing_id;
  const [keyboardOffset, setKeyboardOffset] = useState({
    iso: Platform.OS === 'ios' ? 60 : 0,
    android: Platform.OS === 'android' ? 55 : 55,
  });
  const [menuY, setMenuY] = useState(0);

  const {
    messages,
    inputText,
    showAiSuggestion,
    currentSuggestion,
    setShowAiSuggestion,
    setSelectedAiSuggestionId,
    showSavedReplies,
    setShowSavedReplies,
    selectedMessageId,
    setSelectedMessageId,
    showAttachmentMenu,
    setShowAttachmentMenu,
    sendMessage,
    setInputText,
    handleCopyText,
    handleTaskCreation,
    handleTranslate,
    handleDeleteMessage,
    selectedMessageData,
    setSelectedMessageData,
    menuPosition,
    replyingToMessage,
    handleReplyToMessage,
    cancelReply,
    scrollToMessage,
    handleCamera,
    handleVideo,
    handleGallery,
    handleDocument,
    previewImageUri,
    setPreviewImageUri,
    isImageViewerVisible,
    setIsImageViewerVisible,
    handleMessageSelect,
    flatListRef,
    SAVED_REPLIES,
    isLoading,
    refetch,
    conversationData,
    sendAiSuggestion,
    assigned_to_ids,
    data,
    feedback,
    aiFeedbackType,
    setAiFeedbackType,
    feedbackControl,
    feedbackErrors,
    feedbackReviewValue,
    handleSubmitFeedback,
  } = useChatContainer();

  console.log('conversationData', conversationData);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardOffset({
        android: 55,
        iso: 80,
      });
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset({
        android: 0,
        iso: 0,
      });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | number | null
  >(null);

  const [isInquiryDismissed, setIsInquiryDismissed] = useState(false);
  const [isReservationDismissed, setIsReservationDismissed] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const [scrollButtonOpacity] = useState(new Animated.Value(0));
  const inputAreaAnim = useRef(new Animated.Value(1)).current;

  const [agentMsgExpanded, setAgentMsgExpanded] = useState(false);
  const [isEditingAiMessage, setIsEditingAiMessage] = useState(false);
  const [editedAiText, setEditedAiText] = useState('');
  const aiMessageSheetRef = useRef<BottomSheetModal>(null);
  const aiMessageSnapPoints = useMemo(() => ['60%'], []);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!showAiSuggestion) {
      setIsEditingAiMessage(false);
      setEditedAiText('');
    }
  }, [showAiSuggestion]);

  useEffect(() => {
    const hide = showAiSuggestion && !!currentSuggestion?.agent_message;
    Animated.timing(inputAreaAnim, {
      toValue: hide ? 0 : 1,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [showAiSuggestion, currentSuggestion?.agent_message]);

  const messagesWithTimeLabels = useMemo(
    () => processMessagesWithTimeLabels(messages),
    [messages],
  );

  const [prevMessageCount, setPrevMessageCount] = useState(
    messagesWithTimeLabels.length,
  );

  useEffect(() => {
    if (messagesWithTimeLabels.length > prevMessageCount) {
      const newMessageCount = messagesWithTimeLabels.length - prevMessageCount;

      if (isAtBottom) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        }, 100);
      } else {
        setUnreadCount(prev => prev + newMessageCount);
        Animated.timing(scrollButtonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      setPrevMessageCount(messagesWithTimeLabels.length);
    }
  }, [messagesWithTimeLabels.length, isAtBottom, prevMessageCount]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    const atBottom = offsetY <= 100;

    if (atBottom !== isAtBottom) {
      setIsAtBottom(atBottom);

      if (atBottom) {
        setUnreadCount(0);
        Animated.timing(scrollButtonOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    setUnreadCount(0);
    setIsAtBottom(true);
  };

  const renderTimeLabel = (timeLabel: string) => (
    <View style={styles.timeLabelContainer}>
      <AppText
        text={timeLabel}
        fontSize={12}
        color={Colors.GREY_SHADOW}
        type="Regular"
      />
    </View>
  );

  const handleReplyQuotePress = (replyToId: string | number) => {
    scrollToMessage(replyToId, messagesWithTimeLabels);

    setHighlightedMessageId(replyToId);
    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 2000);
  };

  const renderReplyQuote = (replyTo: ChatMessage['replyTo']) => {
    if (!replyTo) return null;

    return (
      <AppPressable
        onPress={() => handleReplyQuotePress(replyTo._id)}
        style={styles.replyQuoteContainer}
      >
        <AppText
          text={
            replyTo.text.length > 80
              ? replyTo.text.substring(0, 80) + '...'
              : replyTo.text
          }
          fontSize={11}
          color={Colors.DRAVIT_GREY}
          numberOfLines={2}
        />
      </AppPressable>
    );
  };

  const renderMessage = ({ item }: { item: MessageWithTimeLabel }) => {
    const isHost = Number(item.user._id) === Number(user?.id);
    const isAutomated = item.user._id === 3;
    const isSelected = selectedMessageId === item._id;
    const isHighlighted = highlightedMessageId === item._id;

    return (
      <View>
        {item.showTimeLabel &&
          item.timeLabel &&
          renderTimeLabel(item.timeLabel)}

        <View style={[styles.messageWrapper, isHost && styles.hostMessage]}>
          {isAutomated && (
            <View
              style={[
                styles.automatedLabel,
                isHost && styles.automatedLabelRight,
              ]}
            >
              <AppText
                text={t('app.chat_detail.automated_message')}
                fontSize={10}
                color={Colors.GREY_SHADOW}
              />
            </View>
          )}
          {/* <AppText
            text={item.user.name}
            fontSize={11}
            type="Medium"
            color={Colors.GREY_SHADOW}
            mb={4}
            style={isHost ? { textAlign: 'right' } : { textAlign: 'left' }}
          /> */}

          <AppPressable
            onLongPress={e => {
              const { pageY } = e.nativeEvent;
              setMenuY(Math.max(10, pageY - 180));
              handleMessageSelect(item);
            }}
            style={[
              styles.messageBubble,
              isHost ? styles.hostBubble : styles.guestBubble,
              isAutomated && styles.automatedBubble,
              isSelected && styles.messageBubbleSelected,
              isHighlighted && styles.messageBubbleHighlighted,
            ]}
          >
            {/* Show reply quote if replying to another message */}
            {item.replyTo && renderReplyQuote(item.replyTo)}

            {/* Document Message */}
            {item.document && (
              <View style={styles.documentContainer}>
                <View
                  style={[
                    styles.documentIcon,
                    isHost && styles.documentIconHost,
                  ]}
                >
                  <Svgicons
                    path="docIcon"
                    size={24}
                    color={isHost ? Colors.WHITE : Colors.BRUNSWICK_GREEN}
                  />
                </View>
                <AppPressable style={styles.documentInfo}>
                  <AppText
                    text={item.document.name}
                    fontSize={14}
                    type="Bold"
                    color={isHost ? Colors.WHITE : Colors.MIDNIGHT}
                  />
                  <AppText
                    text={`${(item.document.size / 1024).toFixed(2)} KB`}
                    fontSize={11}
                    color={isHost ? Colors.WHITE : Colors.GREY_SHADOW}
                  />
                </AppPressable>
              </View>
            )}

            {/* Image Message with Preview */}
            {item.image && !item.document && (
              <AppPressable
                onPress={() => {
                  setPreviewImageUri(item.image ?? null);
                  setIsImageViewerVisible(true);
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </AppPressable>
            )}

            {/* Video Message */}
            {item.video && (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: item.video }}
                  style={styles.messageVideo}
                  controls
                  resizeMode="contain"
                  paused
                />
              </View>
            )}

            {/* Text Message */}
            {item.text && (
              <AppText
                text={item.text}
                fontSize={13}
                color={isHost && !isAutomated ? Colors.BLACK : Colors.MIDNIGHT}
              />
            )}

            {/* Message Time */}
            <AppText
              text={dayjs(item.createdAt).local().format('h:mm A')}
              fontSize={11}
              color={
                isHost && !isAutomated ? Colors.GREY_SHADOW : Colors.GREY_SHADOW
              }
              style={{
                textAlign: 'right',
                alignSelf: 'stretch',
              }}
              mt={8}
            />
          </AppPressable>
        </View>
      </View>
    );
  };

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0.5,
      });
    }, 500);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 60 : keyboardOffset.android
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <GradientBorder
                borderRadius={16}
                borderWidth={1}
                style={styles.arrowCircleInner}
              >
                <AppPressable
                  style={styles.arrowCircleInner}
                  onPress={() => goBack()}
                >
                  <Svgicons path="arrowLeftIcon" size={26} />
                </AppPressable>
              </GradientBorder>

              {/* ✅ Dynamic conversation name from API */}
              <AppText
                text={conversationData?.name || 'Chat'}
                fontSize={18}
                type="Bold"
                color={Colors.MIDNIGHT}
              />

              <Menu>
                <MenuTrigger
                  customStyles={{ triggerWrapper: styles.menuTrigger }}
                >
                  <Svgicons path="menu" size={28} color={Colors.CHARCOAL} />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{ optionsContainer: styles.popupMenu }}
                >
                  {conversationData?.formatted_booking_id &&
                    conversationData?.booking_id && (
                      <MenuOption
                        style={styles.menuItem}
                        onSelect={() =>
                          navigate(
                            NavigationRoutes.APP_STACK
                              .REVIEW_MANAGEMENT_DETAIL_SCREEN,
                            {
                              booking_id:
                                conversationData?.formatted_booking_id,
                            },
                          )
                        }
                      >
                        <AppText
                          text={t('app.chat_detail.reservation_details')}
                          fontSize={14}
                          color={Colors.BLACK}
                        />
                        <Svgicons path="reservationDetailIcon" size={24} />
                      </MenuOption>
                    )}

                  <MenuOption
                    style={styles.menuItem}
                    onSelect={() => {
                      navigate(NavigationRoutes.APP_STACK.LISTING_STACK, {
                        listing_id: conversationData?.listing_id || listing_id,
                      });
                    }}
                  >
                    <AppText
                      text={t('app.chat_detail.view_calendar')}
                      fontSize={14}
                      color={Colors.BLACK}
                    />
                    <Svgicons path="viewCalendarIcon" size={24} />
                  </MenuOption>

                  {user?.role_key !== 'supervisor' && (
                    <MenuOption
                      style={styles.menuItem}
                      onSelect={() => {
                        navigate(NavigationRoutes.APP_STACK.ASSIGN_CHAT, {
                          conversation_id: conversation_id,
                          guestName: conversationData?.name,
                          assigned_to_ids: assigned_to_ids,
                          listing_id:
                            conversationData?.listing_id || listing_id,
                          propertyName:
                            conversationData?.listing.be_listing_name,
                        });
                      }}
                    >
                      <AppText
                        text={t('app.assign_chat.title')}
                        fontSize={14}
                        color={Colors.BLACK}
                      />
                      <Svgicons path="expandIcon" size={22} />
                    </MenuOption>
                  )}
                </MenuOptions>
              </Menu>
            </View>

            {/* Messages List */}
            <FlatListSimpleHandler
              ref={flatListRef}
              data={messagesWithTimeLabels}
              isLoading={isLoading}
              renderItem={renderMessage}
              listEmptyText=" "
              keyExtractor={item => item._id.toString()}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
              }}
              contentContainerStyle={[
                styles.messagesList,
                {
                  paddingBottom:
                    (data?.conversation?.thread_type === 'inquiry' &&
                      !isInquiryDismissed) ||
                      (data?.conversation?.thread_type === 'reservation_request' &&
                        !isReservationDismissed)
                      ? Metrics.verticalScale(250)
                      : 0,
                },
              ]}
              keyboardShouldPersistTaps="handled"
              onScrollToIndexFailed={handleScrollToIndexFailed}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              inverted
            />

            {/* ✅ Scroll to Bottom Button (WhatsApp style) */}
            {!isAtBottom && (
              <Animated.View
                style={[
                  styles.scrollToBottomButton,
                  { opacity: scrollButtonOpacity },
                ]}
              >
                <AppPressable
                  onPress={scrollToBottom}
                  style={styles.scrollButtonInner}
                >
                  <Svgicons
                    path="ChevronDownIcon"
                    size={20}
                    color={Colors.WHITE}
                  />
                  {unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <AppText
                        text={unreadCount > 99 ? '99+' : unreadCount.toString()}
                        fontSize={10}
                        type="Bold"
                        color={Colors.WHITE}
                      />
                    </View>
                  )}
                </AppPressable>
              </Animated.View>
            )}

            {/* Context Menu */}
            {selectedMessageId && selectedMessageData && (
              <AppPressable
                style={styles.menuBackdrop}
                onPress={() => {
                  setSelectedMessageId(null);
                  setSelectedMessageData(null);
                }}
              >
                <View
                  style={[
                    styles.contextMenu,
                    menuPosition.isHost
                      ? styles.contextMenuRight
                      : styles.contextMenuLeft,
                    { top: menuY },
                  ]}
                  onStartShouldSetResponder={() => true}
                  onTouchEnd={e => e.stopPropagation()}
                >
                  <AppPressable
                    style={styles.menuOption}
                    onPress={() => {
                      handleReplyToMessage(selectedMessageData);
                      setSelectedMessageId(null);
                      setSelectedMessageData(null);
                    }}
                  >
                    <View style={styles.menuTextContainer}>
                      <AppText
                        text={t('app.chat_detail.reply')}
                        fontSize={13}
                      />
                    </View>
                    <Svgicons path="chatIcon" size={16} />
                  </AppPressable>
                  <AppPressable
                    style={styles.menuOption}
                    onPress={() => {
                      if (selectedMessageData.text) {
                        handleCopyText(selectedMessageData.text);
                      }
                      setSelectedMessageId(null);
                      setSelectedMessageData(null);
                    }}
                  >
                    <View style={styles.menuTextContainer}>
                      <AppText text={t('app.chat_detail.copy')} fontSize={13} />
                    </View>
                    <Svgicons path="docIcon" size={16} />
                  </AppPressable>

                  <AppPressable
                    style={styles.menuOption}
                    onPress={() => {
                      if (selectedMessageData.text) {
                        handleTaskCreation(selectedMessageData.text);
                      }
                      setSelectedMessageId(null);
                      setSelectedMessageData(null);
                      navigate(NavigationRoutes.APP_STACK.CREATE_TASK, {
                        listing_id: conversationData?.listing_id,
                        fromChat: true,
                        conversation_id: conversationData?.id,
                        copyText: selectedMessageData.text,
                      });
                    }}
                  >
                    <View style={styles.menuTextContainer}>
                      <AppText
                        text={t('app.chat_detail.create_task')}
                        fontSize={13}
                      />
                    </View>
                    <Svgicons path="taskIcon" size={16} />
                  </AppPressable>

                  {/* ✅ Only show delete for logged-in user's messages */}
                  {/* {Number(selectedMessageData.user._id) === Number(user?.id) && (
                    <AppPressable
                      style={[styles.menuOption, { borderBottomWidth: 0 }]}
                      onPress={() => {
                        handleDeleteMessage(selectedMessageData._id);
                        setSelectedMessageId(null);
                        setSelectedMessageData(null);
                      }}
                    >
                      <View style={styles.menuTextContainer}>
                        <AppText
                          text={t('app.chat_detail.delete')}
                          fontSize={13}
                          color={Colors.INDIAN_RED}
                        />
                      </View>
                      <Svgicons path="deleteIcon" size={16} />
                    </AppPressable>
                  )} */}
                </View>
              </AppPressable>
            )}

            {/* AI Suggestion */}
            {showAiSuggestion && currentSuggestion?.agent_message && (
              <View style={styles.aiWrapper}>
                <AppText
                  text={t('app.chat_detail.ai_suggestions')}
                  fontSize={11}
                  color={Colors.GREY_SHADOW}
                  mb={8}
                  textAlign="center"
                />

                <View style={styles.aiBubble}>
                  <AppPressable
                    onPress={() => setShowAiSuggestion(false)}
                    style={styles.aiClose}
                  >
                    <Svgicons path="closeIcon" size={12} />
                  </AppPressable>

                  {aiFeedbackType && (
                    <View style={styles.aiFeedbackSection}>
                      <InputField
                        name="feedback_review"
                        control={feedbackControl as any}
                        errors={feedbackErrors}
                        placeholder={
                          aiFeedbackType === 'up'
                            ? 'What did you like? (optional)'
                            : 'What should be different?'
                        }
                        containerStyle={[
                          styles.aiFeedbackInputContainer,
                          {
                            paddingHorizontal: 0,
                            borderColor:Colors.PERSIAN_GREEN
                          },
                        ]}
                        rightIcon={
                          <View
                            style={{ opacity: feedbackReviewValue?.trim() ? 1 : 0.4 }}
                            pointerEvents={feedbackReviewValue?.trim() ? 'auto' : 'none'}
                          >
                            <AppButton title='Send' onPress={handleSubmitFeedback} px={10} py={5} fontSize={12}/>
                          </View>
                        }
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.agentMessageBox,
                      { marginTop: aiFeedbackType ? 0 : 12 },
                    ]}
                  >
                    {isEditingAiMessage ? (
                      <TextInput
                        value={editedAiText}
                        onChangeText={setEditedAiText}
                        multiline
                        autoFocus
                        style={styles.aiEditInput}
                        placeholderTextColor={Colors.GREY_SHADOW}
                      />
                    ) : (
                      <>
                        <AppText
                          text={currentSuggestion.agent_message}
                          fontSize={13}
                          color={Colors.BRUNSWICK_GREEN}
                          numberOfLines={4}
                        />
                        {currentSuggestion.agent_message?.length > 180 && (
                          <AppPressable
                            onPress={() => {
                              setAgentMsgExpanded(true);
                              aiMessageSheetRef.current?.present();
                            }}
                            style={styles.agentMsgToggle}
                          >
                            <AppText
                              text="Show more"
                              fontSize={11}
                              color={Colors.PERSIAN_GREEN}
                              type="Bold"
                            />
                          </AppPressable>
                        )}
                      </>
                    )}
                  </View>

                  <View style={styles.aiFooter}>
                    <View style={styles.aiThumbsRow}>
                      <AppPressable
                        disabled={feedback != null}
                        onPress={() => {
                          setAiFeedbackType(aiFeedbackType === 'up' ? null : 'up')
                          setAgentMsgExpanded(false)
                        }}
                        style={[
                          styles.thumbCircle,
                          {
                            backgroundColor:
                              feedback === true || aiFeedbackType === 'up'
                                ? Colors.PERSIAN_GREEN
                                : Colors.ANTI_FLASH_WHITE,
                            opacity: feedback != null ? 0.5 : 1,
                          },
                        ]}
                      >
                        <Svgicons
                          path="thumbsUpIcon"
                          size={14}
                          color={
                            feedback === true || aiFeedbackType === 'up'
                              ? Colors.WHITE
                              : Colors.GREY_SHADOW
                          }
                        />
                      </AppPressable>
                      <AppPressable
                        disabled={feedback != null}
                        onPress={() => {
                          setAiFeedbackType(aiFeedbackType === 'down' ? null : 'down')
                          setAgentMsgExpanded(false)
                        }}
                        style={[
                          styles.thumbCircle,
                          {
                            backgroundColor:
                              feedback === false || aiFeedbackType === 'down'
                                ? Colors.INDIAN_RED
                                : Colors.ANTI_FLASH_WHITE,
                            opacity: feedback != null ? 0.5 : 1,
                          },
                        ]}
                      >
                        <Svgicons
                          path="thumbsDownIcon"
                          size={14}
                          color={
                            feedback === false || aiFeedbackType === 'down'
                              ? Colors.WHITE
                              : Colors.GREY_SHADOW
                          }
                        />
                      </AppPressable>
                    </View>
                  </View>

                  <View style={styles.aiFooter}>
                    <AppPressable
                      onPress={() => {
                        setShowAiSuggestion(false);
                        setSelectedAiSuggestionId(currentSuggestion.id);
                        setInputText(currentSuggestion.agent_message);
                      }}
                    >
                      <AppText
                        text={t('app.chat_detail.edit')}
                        fontSize={12}
                        type="Bold"
                        color={Colors.PINE_FOREST}
                      />
                    </AppPressable>

                    <AppPressable onPress={() => sendAiSuggestion()}>
                      <AppText
                        text={t('app.chat_detail.send_now')}
                        fontSize={12}
                        type="Bold"
                        ml={15}
                        color={Colors.PINE_FOREST}
                      />
                    </AppPressable>
                  </View>
                </View>
              </View>
            )}

            {/* Full AI Suggestion Modal */}
            <BottomSheetModal
              ref={aiMessageSheetRef}
              index={0}
              snapPoints={aiMessageSnapPoints}
              enablePanDownToClose
              topInset={insets.top}
              onDismiss={() => setAgentMsgExpanded(false)}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  pressBehavior="close"
                />
              )}
            >
              <View style={styles.aiFullMessageHeader}>
                <AppText
                  text={t('app.chat_detail.ai_suggestions')}
                  fontSize={14}
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                />
              </View>
              <BottomSheetScrollView
                contentContainerStyle={styles.aiFullMessageContent}
                showsVerticalScrollIndicator={false}
              >
                <AppText
                  text={currentSuggestion?.agent_message}
                  fontSize={14}
                  lineHeight={22}
                  color={Colors.BRUNSWICK_GREEN}
                />
              </BottomSheetScrollView>
            </BottomSheetModal>

            {/* Reply Indicator in Input Area */}
            {replyingToMessage && (
              <View style={styles.replyingIndicatorContainer}>
                <View style={styles.replyingIndicatorContent}>
                  <AppText
                    text={t('app.shared.replying_to', {
                      name: replyingToMessage.user.name,
                    })}
                    fontSize={12}
                    type="Bold"
                    color={Colors.BRUNSWICK_GREEN}
                  />
                  <AppText
                    text={replyingToMessage.text || 'Media message'}
                    fontSize={11}
                    color={Colors.GREY_SHADOW}
                    numberOfLines={1}
                  />
                </View>
                <AppPressable onPress={cancelReply}>
                  <Svgicons
                    path="closeIcon"
                    size={18}
                    color={Colors.GREY_SHADOW}
                  />
                </AppPressable>
              </View>
            )}

            {/* Input Area */}
            <Animated.View
              pointerEvents={showAiSuggestion && currentSuggestion?.agent_message ? 'none' : 'auto'}
              style={{
                maxHeight: inputAreaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 120],
                }),
                opacity: inputAreaAnim,
                overflow: 'hidden',
              }}
            >
              <View style={styles.inputArea}>
                <AppPressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowSavedReplies(!showSavedReplies);
                  }}
                  style={[
                    styles.plusAction,
                    {
                      /* UPDATED LOGIC HERE */
                      backgroundColor:
                        showSavedReplies && inputText.length === 0
                          ? Colors.TEAL_PRIMARY_ALT
                          : Colors.TRANSPARENT,
                    },
                  ]}
                >
                  <GlassCard style={styles.plusAction}>
                    <Svgicons
                      /* UPDATED LOGIC HERE AS WELL */
                      path={
                        showSavedReplies && inputText.length === 0
                          ? 'chatIconWhite'
                          : 'chatIcon'
                      }
                      size={20}
                    />
                  </GlassCard>
                </AppPressable>

                {/* <View style={styles.combinedInputContainer}> */}
                <GlassCard style={styles.mainCardItem}>
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={() => setShowSavedReplies(false)}
                    placeholder={t('app.chat_detail.write_message')}
                    placeholderTextColor={Colors.SECRET_CHOCOLATE}
                    style={styles.input}
                    multiline
                  />
                  {/* <Svgicons path='attachmentIcon' onPress={()=>{
                  setShowAttachmentMenu(!showAttachmentMenu);
                }}/> */}
                </GlassCard>
                {/* </View> */}

                <AppPressable
                  onPress={sendMessage}
                  disabled={!inputText.trim()}
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled,
                  ]}
                >
                  <GlassCard style={styles.plusAction}>
                    <View
                      style={{
                        transform: [{ scaleX: i18n.dir() === 'rtl' ? -1 : 1 }],
                      }}
                    >
                      <Svgicons
                        path={!inputText.trim() ? 'sendIcon' : 'sendWhite'}
                        size={18}
                        color={Colors.WHITE}
                      />
                    </View>
                  </GlassCard>
                </AppPressable>
              </View>
            </Animated.View>

            {/* Saved Replies */}
            {showSavedReplies && inputText.length === 0 && (
              <View style={styles.savedRepliesWrapper}>
                <AppText
                  text={t('app.chat_detail.saved_replies')}
                  type="Bold"
                  mb={16}
                  color={Colors.BLACK}
                  fontSize={18}
                />
                {!SAVED_REPLIES.length && (
                  <View>
                    <AppText
                      text="No saved replies found"
                      type="SemiBold"
                      fontSize={16}
                      mt={5}
                      mb={7}
                    />
                    <AppText
                      text="Create reusable responses from the Saved Replies option in the Inbox menu to quickly reply to messages without typing the same thing again."
                      color={Colors.DARK_CHARCOAL_OPACITY}
                      fontSize={12}
                      pr={50}
                    />
                  </View>
                )}
                <View style={styles.repliesGrid}>
                  {SAVED_REPLIES.map(
                    (reply: { id: number; body: string; title: string }) => (
                      <GlassCard
                        key={reply?.id}
                        width="31%"
                        style={styles.replyGlassCard}
                      >
                        <AppPressable
                          onPress={() => {
                            setInputText(reply?.body);
                            // Optional: Hide replies after selecting one
                            setShowSavedReplies(false);
                          }}
                          style={styles.replyPressable}
                        >
                          <AppText
                            text={reply?.title}
                            fontSize={12}
                            color={Colors.BLACK}
                            style={{ textAlign: 'center' }}
                            numberOfLines={1}
                          />
                        </AppPressable>
                      </GlassCard>
                    ),
                  )}
                </View>
              </View>
            )}

            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <View style={styles.attachmentMenu}>
                <AppPressable
                  style={styles.attachmentOption}
                  onPress={handleCamera}
                >
                  <View style={styles.attachmentIconWrapper}>
                    <Svgicons path="cameraIcon" size={20} />
                  </View>
                  <AppText text={t('app.chat_detail.camera')} fontSize={13} />
                </AppPressable>

                <AppPressable
                  style={styles.attachmentOption}
                  onPress={handleVideo}
                >
                  <View style={styles.attachmentIconWrapper}>
                    <Svgicons path="videoIcon" size={20} />
                  </View>
                  <AppText text={t('app.chat_detail.video')} fontSize={13} />
                </AppPressable>

                <AppPressable
                  style={styles.attachmentOption}
                  onPress={handleGallery}
                >
                  <View style={styles.attachmentIconWrapper}>
                    <Svgicons path="imageIcon" size={20} />
                  </View>
                  <AppText text={t('app.chat_detail.gallery')} fontSize={13} />
                </AppPressable>

                {/* <AppPressable
                  style={[styles.attachmentOption, { borderBottomWidth: 0 }]}
                  onPress={handleDocument}
                >
                  <View style={styles.attachmentIconWrapper}>
                    <Svgicons path="docIcon" size={20} />
                  </View>
                  <AppText text={t('app.chat_detail.document')} fontSize={13} />
                </AppPressable> */}
              </View>
            )}

            {/* Image Viewer Modal */}
            {previewImageUri && (
              <ImageViewing
                images={[{ uri: previewImageUri }]}
                imageIndex={0}
                visible={isImageViewerVisible}
                onRequestClose={() => setIsImageViewerVisible(false)}
              />
            )}
            {/* </View>
        </KeyboardStickyView> */}
            <InquiryModal
              visible={
                data?.conversation?.thread_type === 'inquiry' &&
                !isInquiryDismissed
              }
              inquiryId={data?.conversation?.id}
              description={`${formatDateRange(
                data?.conversation?.arrival_date,
                data?.conversation?.departure_date,
              )}, ${data?.conversation?.number_of_guests} ${t(
                'app.chat.guests',
              )}`}
              name={`Inquiry - ${data?.conversation?.listing?.title}`}
              onClose={() => setIsInquiryDismissed(true)}
            />
            <InquiryModal
              visible={
                data?.conversation?.thread_type === 'reservation_request' &&
                !isReservationDismissed
              }
              inquiryId={data?.conversation?.id}
              threadType={data?.conversation?.thread_type}
              guestName={data?.conversation?.name}
              startDate={data?.conversation?.arrival_date}
              endDate={data?.conversation?.departure_date}
              description={`${formatDateRange(
                data?.conversation?.arrival_date,
                data?.conversation?.departure_date,
              )}, ${data?.conversation?.number_of_guests} ${t(
                'app.chat.guests',
              )}`}
              name={data?.conversation?.name}
              onClose={() => setIsReservationDismissed(true)}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuTrigger: {
    padding: 8,
  },
  popupMenu: {
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    padding: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    width: 250,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  timeLabelContainer: {
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 15,
  },
  replyQuoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  replyQuoteBorder: {
    width: 3,
    backgroundColor: Colors.BRUNSWICK_GREEN,
    marginRight: 8,
    alignSelf: 'stretch',
  },
  replyQuoteContent: {
    flex: 1,
  },
  messageWrapper: {
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  hostMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 15,
  },
  messageBubbleSelected: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  messageBubbleHighlighted: {
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    shadowColor: Colors.TEAL_20_OPACITY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hostBubble: {
    backgroundColor: Colors.TEAL_20_OPACITY,
    borderBottomRightRadius: 2,
  },
  guestBubble: {
    // backgroundColor: '#F2F2F2',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  automatedBubble: {
    borderStyle: 'dotted',
    borderWidth: 1.5,
    borderColor: Colors.TEAL_20_OPACITY,
    backgroundColor: '#F9FCFB',
  },
  automatedLabel: {
    alignItems: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  automatedLabelRight: {
    alignItems: 'flex-end',
    marginRight: 5,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  contextMenu: {
    position: 'absolute',
    // bottom: '55%',
    backgroundColor: 'white',
    borderRadius: 12,
    width: 200,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 1000,
  },
  contextMenuLeft: {
    left: 20,
  },
  contextMenuRight: {
    right: 20,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  menuTextContainer: {
    flex: 1,
  },
  aiWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  aiBubble: {
    borderStyle: 'dotted',
    borderWidth: 1.5,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#F9FCFB',
  },
  aiClose: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
    zIndex: 99999,
  },
  aiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiThumbsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  aiActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiFeedbackSection: {
    marginTop: Metrics.verticalScale(20),
  },
  aiFeedbackInputContainer: {
    borderRadius: 10,
  },
  aiFeedbackButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  replyingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F0F7F4',
    borderTopWidth: 1,
    borderTopColor: Colors.BRUNSWICK_GREEN,
    justifyContent: 'space-between',
  },
  replyingIndicatorContent: {
    flex: 1,
  },
  savedRepliesWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
  },
  repliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  replyGlassCard: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  replyPressable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyChip: {
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
  },
  attachmentMenu: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 170,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
    gap: 10,
  },
  attachmentIconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Colors.TRANSPARENT,
  },
  plusAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 0,
    backgroundColor: Colors.TRANSPARENT,
  },
  combinedInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 25,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.MIDNIGHT,
    maxHeight: 100,
    padding: 0,
    backgroundColor: 'transparent',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // borderWidth: 1,
    // borderColor: Colors.EMERALD_TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.EMERALD_TEAL,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.WHITE,
    // opacity: 0.6,
    // borderWidth: 0,
  },
  messageImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  videoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  messageVideo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  documentIconHost: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  documentInfo: {
    flex: 1,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ✅ Scroll to bottom button styles
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 999,
  },
  scrollButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.INDIAN_RED,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  mainCardItem: {
    flex: 1,
    width: '100%',
    borderRadius: 17,
    paddingHorizontal: Metrics.scale(30),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: Colors.TRANSPARENT,
  },
  agentMessageBox: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,128,90,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  agentMsgToggle: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  aiEditInput: {
    fontSize: 13,
    color: Colors.BRUNSWICK_GREEN,
    padding: 0,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  aiFullMessageHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  aiFullMessageContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  //   screenContent: {
  //   flex: 1,
  //   flexDirection: 'column',
  // },
});

export default ChatScreen;
