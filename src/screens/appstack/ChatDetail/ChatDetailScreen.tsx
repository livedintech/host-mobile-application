// ChatScreen.tsx - Updated UI Design
import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Keyboard,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking
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
import { goBack } from '@/services/navigationService';

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

const ChatScreen = () => {
  const {
    messages,
    inputText,
    showAiSuggestion,
    setShowAiSuggestion,
    showSavedReplies,
    setShowSavedReplies,
    selectedMessageId,
    setSelectedMessageId,
    showAttachmentMenu,
    setShowAttachmentMenu,
    sendMessage,
    sendSavedReply,
    sendAiSuggestion,
    setInputText,
    handleCopyText,
    handleTaskCreation,
    handleTranslate,
    handleDeleteMessage,

    handleCamera,
    handleVideo,
    handleGallery,
    handleDocument,
    previewImageUri,
    setPreviewImageUri,
    isImageViewerVisible,
    setIsImageViewerVisible,
  } = useChatContainer();

  // Handle document preview
const handleDocumentPreview = (document: ChatMessage['document']) => {
  if (!document) return;

  try {
    const uri = Platform.OS === 'android' ? `file://${document.uri}` : document.uri;
    Linking.openURL(uri).catch(() => {
    });
  } catch (error) {
    console.log('Document preview error:', error);
  }
};



  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0)
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  }, [messages]);

  // Render individual message bubble
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isHost = item.user._id === 1;
    const isAutomated = item.user._id === 3;
    const isSelected = selectedMessageId === item._id;

    return (
      <View style={[styles.messageWrapper, isHost && styles.hostMessage]}>
        {isAutomated && (
          <View
            style={[
              styles.automatedLabel,
              isHost && styles.automatedLabelRight,
            ]}
          >
            <AppText
              text="Automated Message"
              fontSize={10}
              color={Colors.GREY_SHADOW}
            />
          </View>
        )}

        <Pressable
          onPress={() =>
            setSelectedMessageId(
              selectedMessageId === item._id ? null : item._id,
            )
          }
          style={[
            styles.messageBubble,
            isHost ? styles.hostBubble : styles.guestBubble,
            isAutomated && styles.automatedBubble,
          ]}
        >
        {/* Document Message */}
          {item.document && (
            <View style={styles.documentContainer}>
              <View
                style={[styles.documentIcon, isHost && styles.documentIconHost]}
              >
                <Svgicons
                  path="docIcon"
                  size={24}
                  color={isHost ? Colors.WHITE : Colors.BRUNSWICK_GREEN}
                />
              </View>
              <Pressable
                style={styles.documentInfo}
                onPress={() => handleDocumentPreview(item.document)}
              >
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
              </Pressable>
            </View>
          )}

          {/* Image Message */}
          {/* {item.image && !item.document && (
            <Image
              source={{ uri: item.image }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )} */}

          {/* Image Message with Preview */}
          {item.image && !item.document && (
            <Pressable
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
            </Pressable>
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
              color={isHost && !isAutomated ? Colors.WHITE : Colors.MIDNIGHT}
            />
          )}

          {/* Message Time */}
          <AppText
            text={item.createdAt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            fontSize={11}
            color={
              isHost && !isAutomated
                ? 'rgba(255,255,255,0.7)'
                : Colors.GREY_SHADOW
            }
            mt={8}
          />
        </Pressable>

        {/* Context Menu */}
        {isSelected && (
          <View
            style={[
              styles.contextMenu,
              isHost ? styles.contextMenuRight : styles.contextMenuLeft,
            ]}
          >
            <Pressable
              style={styles.menuOption}
              onPress={() => handleCopyText(item.text)}
            >
              <View style={styles.menuTextContainer}>
                <AppText text="Copy" fontSize={13} />
              </View>
              <Svgicons path="docIcon" size={16} />
            </Pressable>
            <Pressable
              style={styles.menuOption}
              onPress={() => handleTaskCreation(item.text)}
            >
              <View style={styles.menuTextContainer}>
                <AppText text="Create Task" fontSize={13} />
              </View>
              <Svgicons path="taskIcon" size={16} />
            </Pressable>
            <Pressable
              style={styles.menuOption}
              onPress={() => handleTranslate(item.text)}
            >
              <View style={styles.menuTextContainer}>
                <AppText text="Translate" fontSize={13} />
              </View>
              <AppText text="AR" fontSize={11} color={Colors.GREY_SHADOW} />
            </Pressable>
            {isHost && (
              <Pressable
                style={[styles.menuOption, { borderBottomWidth: 0 }]}
                onPress={() => handleDeleteMessage(item._id)}
              >
                <View style={styles.menuTextContainer}>
                  <AppText
                    text="Delete"
                    fontSize={13}
                    color={Colors.INDIAN_RED}
                  />
                </View>
                <Svgicons path="deleteIcon" size={16} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <GradientBorder
            borderRadius={16}
            borderWidth={1}
            style={styles.arrowCircleInner}
          >
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={26} />
            </Pressable>
          </GradientBorder>
          <AppText
            text="Abdulrahman Al Hassan"
            fontSize={18}
            type="Bold"
            color={Colors.MIDNIGHT}
          />
          {/* <Pressable style={styles.menuButton}>
            <Svgicons path="menu" size={36} />
          </Pressable> */}

          <Menu>
            <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
              <Svgicons path="menu" size={28} color={Colors.CHARCOAL} />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
              <MenuOption style={styles.menuItem}>
                <AppText
                  text="View Listing Calendar"
                  fontSize={14}
                  color={Colors.CHARCOAL}
                />
                <Svgicons path="listingCalendar" size={24} />
              </MenuOption>
              <MenuOption style={styles.menuItem}>
                <AppText
                  text="Reservation Details"
                  fontSize={14}
                  color={Colors.CHARCOAL}
                />
                <Svgicons path="reservationDetail" size={24} />
              </MenuOption>
              <MenuOption style={styles.menuItem}>
                <AppText
                  text="Assign Chat To User"
                  fontSize={14}
                  color={Colors.CHARCOAL}
                />
                <Svgicons path="expandIcon" size={24} />
              </MenuOption>
              <MenuOption style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                <AppText
                  text="Add Internal Notes"
                  fontSize={14}
                  color={Colors.CHARCOAL}
                />
                <Svgicons path="note" size={24} />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => String(item._id)}
          inverted
          contentContainerStyle={styles.messagesList}
          scrollEnabled={messages.length > 5}
        />

        {/* AI Suggestion */}
        {showAiSuggestion && (
          <View style={styles.aiWrapper}>
            <AppText
              text="A.I Suggestions"
              fontSize={11}
              color={Colors.GREY_SHADOW}
              mb={8}
            />
            <View style={styles.aiBubble}>
              <Pressable
                onPress={() => setShowAiSuggestion(false)}
                style={styles.aiClose}
              >
                <Svgicons path="closeIcon" size={12} />
              </Pressable>
              <AppText
                text="Welcome! Your check-in is from 3:00PM to 10:00PM. Your name is shared with the gate guard. Door code and entry instructions will be sent 1 hour before arrival."
                fontSize={13}
                color={Colors.BRUNSWICK_GREEN}
                mb={10}
              />
              <View style={styles.aiFooter}>
                <Pressable onPress={() => setShowAiSuggestion(false)}>
                  <AppText
                    text="Edit"
                    fontSize={12}
                    type="Bold"
                    color={Colors.PINE_FOREST}
                  />
                </Pressable>
                <Pressable onPress={sendAiSuggestion}>
                  <AppText
                    text="Send Now"
                    fontSize={12}
                    type="Bold"
                    ml={15}
                    color={Colors.PINE_FOREST}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputArea}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              setShowSavedReplies(!showSavedReplies);
            }}
            style={[
              styles.plusAction,
              {
                backgroundColor: showSavedReplies
                  ? Colors.BRUNSWICK_GREEN
                  : Colors.BRUNSWICK_GREEN,
              },
            ]}
          >
            <Svgicons path="plusWhiteIcon" size={20} />
          </Pressable>

          {/* Combined Input Container with Attachment */}
          <View style={styles.combinedInputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Send Message"
              placeholderTextColor={Colors.GREY_SHADOW}
              style={styles.input}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
              style={styles.attachButtonInside}
            >
              <Svgicons
                path="attachmentIcon"
                size={20}
                color={Colors.MIDNIGHT}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={sendMessage}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
          >
            <Svgicons path="sendIcon" size={18} color={Colors.WHITE} />
          </Pressable>
        </View>

        {/* Saved Replies */}
        {showSavedReplies && (
          <View style={styles.savedRepliesWrapper}>
            <AppText
              text="Saved Replies"
              type="Bold"
              mb={12}
              color={Colors.PINE_FOREST}
              fontSize={16}
            />
            <View style={styles.repliesGrid}>
              {SAVED_REPLIES.map(reply => (
                <Pressable
                  key={reply.id}
                  style={styles.replyChip}
                  onPress={() => {
                    setInputText(reply.value);
                    setShowSavedReplies(false);
                  }}
                >
                  <AppText
                    text={reply.label}
                    fontSize={13}
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <View style={styles.attachmentMenu}>
            <Pressable style={styles.attachmentOption} onPress={handleCamera}>
              <View style={styles.attachmentIconWrapper}>
                <Svgicons path="cameraIcon" size={20} />
              </View>
              <AppText text="Camera" fontSize={13} />
            </Pressable>

            <Pressable style={styles.attachmentOption} onPress={handleVideo}>
              <View style={styles.attachmentIconWrapper}>
                <Svgicons path="videoIcon" size={20} />
              </View>
              <AppText text="Video" fontSize={13} />
            </Pressable>

            <Pressable style={styles.attachmentOption} onPress={handleGallery}>
              <View style={styles.attachmentIconWrapper}>
                <Svgicons path="imageIcon" size={20} />
              </View>
              <AppText text="Gallery" fontSize={13} />
            </Pressable>

            <Pressable
              style={[styles.attachmentOption, { borderBottomWidth: 0 }]}
              onPress={handleDocument}
            >
              <View style={styles.attachmentIconWrapper}>
                <Svgicons path="docIcon" size={20} />
              </View>
              <AppText text="Document" fontSize={13} />
            </Pressable>
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  menuButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  hostBubble: {
    backgroundColor: Colors.BRUNSWICK_GREEN,
    borderBottomRightRadius: 2,
  },
  guestBubble: {
    backgroundColor: '#F2F2F2',
    borderBottomLeftRadius: 2,
  },
  automatedBubble: {
    borderStyle: 'dotted',
    borderWidth: 1.5,
    borderColor: Colors.BRUNSWICK_GREEN,
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
  contextMenu: {
    position: 'absolute',
    bottom: '110%',
    backgroundColor: 'white',
    borderRadius: 12,
    width: 200,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  contextMenuLeft: {
    left: 0,
  },
  contextMenuRight: {
    right: 0,
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
    position: 'relative',
  },
  aiClose: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  aiFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  savedRepliesWrapper: {
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    maxHeight: 250,
  },
  repliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  plusAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
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
    backgroundColor: Colors.WHITE,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.MIDNIGHT,
    maxHeight: 100,
    padding: 0,
  },
  attachButtonInside: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.PINE_FOREST,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.SUPER_GREY,
    opacity: 0.6,
    borderWidth: 0,
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
});

export default ChatScreen;
