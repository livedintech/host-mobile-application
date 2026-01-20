// ChatDetailScreen.tsx
import React from 'react';
import { StyleSheet, View, Pressable, Keyboard, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, MessageText } from 'react-native-gifted-chat';
import { MenuProvider } from 'react-native-popup-menu';
import Video from 'react-native-video';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import { useChatDetailContainer } from './ChatDetailContainer';

const SAVED_REPLIES = [
  'Wifi Pass',
  'Cleaning',
  'Check in',
  'Check out',
  'Bathroom',
  'Bedsheet',
  'Timings',
  'Booking',
  'Microwave'
];

const ChatDetailScreen = () => {
  const {
    messages,
    onSend,
    showAiSuggestion,
    setShowAiSuggestion,
    showSavedReplies,
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
  } = useChatDetailContainer();

  const renderBubble = (props: any) => {
    const isAutomated = props.currentMessage.user._id === 3;
    const isSelected = selectedMessageId === props.currentMessage._id;
    const hasDocument = props.currentMessage.document;

    return (
      <View>
        {isAutomated && (
          <View style={styles.automatedLabel}>
            <AppText
              text="Automated Message"
              fontSize={10}
              color={Colors.GREY_SHADOW}
            />
          </View>
        )}
        <Pressable onPress={() => toggleMessageMenu(props.currentMessage._id)}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: isAutomated ? 'transparent' : Colors.BRUNSWICK_GREEN,
                borderRadius: 15,
                borderBottomRightRadius: 2,
                ...(isAutomated && {
                  borderStyle: 'dotted',
                  borderWidth: 1.5,
                  borderColor: Colors.BRUNSWICK_GREEN,
                }),
              },
              left: {
                backgroundColor: '#F2F2F2',
                borderRadius: 15,
                borderBottomLeftRadius: 2,
              },
            }}
          >
            {hasDocument && (
              <View style={styles.documentContainer}>
                <View style={styles.documentIcon}>
                  <Svgicons path="docIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                </View>
                <View style={styles.documentInfo}>
                  <AppText 
                    text={hasDocument.name} 
                    fontSize={14} 
                    type="Bold"
                    color={props.currentMessage.user._id === 1 ? Colors.WHITE : Colors.MIDNIGHT}
                  />
                  <AppText 
                    text={`${(hasDocument.size / 1024).toFixed(2)} KB`} 
                    fontSize={11} 
                    color={props.currentMessage.user._id === 1 ? Colors.WHITE : Colors.GREY_SHADOW}
                  />
                </View>
              </View>
            )}
          </Bubble>
        </Pressable>

        {isSelected && (
          <View style={styles.contextMenu}>
            <Pressable
              style={styles.menuOption}
              onPress={() => handleCopyText(props.currentMessage.text)}
            >
              <AppText text="Copy Text" fontSize={14} />
              <Svgicons path="docIcon" size={18} />
            </Pressable>
            <Pressable
              style={styles.menuOption}
              onPress={() => handleTaskCreation(props.currentMessage.text)}
            >
              <AppText text="Task Creation" fontSize={14} />
              <Svgicons path="taskIcon" size={18} />
            </Pressable>
            <Pressable
              style={[styles.menuOption, { borderBottomWidth: 0 }]}
              onPress={() => handleTranslate(props.currentMessage.text)}
            >
              <AppText text="Translate Message" fontSize={14} />
              <AppText text="AR" fontSize={12} color={Colors.GREY_SHADOW} />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const renderMessageImage = (props: any) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: props.currentMessage.image }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderMessageVideo = (props: any) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: props.currentMessage.video }}
          style={styles.messageVideo}
          controls
          resizeMode="contain"
          paused
        />
      </View>
    );
  };

  const renderChatFooter = () => {
    if (!showAiSuggestion) return null;
    return (
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
            text="Welcome! Your check-in is from 3:00PM to 10:00PM. Your name is shared with the gate guard. Door code and entry instructions will be sent 1 hour before arrival. Wi-Fi and other details are inside."
            fontSize={13}
            color={Colors.BRUNSWICK_GREEN}
          />
          <View style={styles.aiFooter}>
            <Pressable>
              <AppText text="Edit" fontSize={12} type="Bold" />
            </Pressable>
            <Pressable onPress={sendAiSuggestion}>
              <AppText text="Send Now" fontSize={12} type="Bold" ml={15} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderAccessory = () => {
    if (!showSavedReplies) return null;
    return (
      <View style={styles.savedRepliesWrapper}>
        <AppText
          text="Saved Replies"
          type="Bold"
          mb={15}
          color={Colors.MIDNIGHT}
          fontSize={16}
        />
        <View style={styles.repliesGrid}>
          {SAVED_REPLIES.map((item) => (
            <Pressable
              key={item}
              style={styles.replyChip}
              onPress={() => {
                onSend([
                  {
                    _id: Math.random(),
                    text: item,
                    createdAt: new Date(),
                    user: { _id: 1 },
                  },
                ]);
              }}
            >
              <AppText text={item} fontSize={13} color={Colors.BRUNSWICK_GREEN} />
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  return (
    <MenuProvider skipInstanceCheck>
      <View style={styles.container}>
        <GiftedChat
          textInputProps={{
            placeholderTextColor: Colors.SECRET_CHOCOLATE,
            placeholder: 'Ask me any question',
            style: styles.inputStyle,
          }}
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          renderMessageVideo={renderMessageVideo}
          renderAccessory={renderAccessory}
          renderChatFooter={renderChatFooter}
          isSendButtonAlwaysVisible
          isInverted
          renderInputToolbar={(props) => (
            <View>
              <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                renderActions={() => (
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      toggleSavedReplies();
                    }}
                    style={[
                      styles.plusAction,
                      {
                        backgroundColor: showSavedReplies
                          ? Colors.BRUNSWICK_GREEN
                          : Colors.WHITE,
                      },
                    ]}
                  >
                    <View style={showSavedReplies ? styles.plusRotated : null}>
                      {showSavedReplies ? (
                        <Svgicons path="plusWhiteIcon" size={16} />
                      ) : (
                        <Svgicons path="plusIcon" size={16} />
                      )}
                    </View>
                  </Pressable>
                )}
              />
              
              {/* Attachment Options Menu */}
              {showAttachmentMenu && (
                <View style={styles.attachmentMenu}>
                  <Pressable 
                    style={styles.attachmentOption}
                    onPress={handleCamera}
                  >
                    <View style={styles.attachmentIconWrapper}>
                      <Svgicons path="cameraIcon" size={20} />
                    </View>
                    <AppText text="Camera" fontSize={13} ml={10} />
                  </Pressable>
                  
                  <Pressable 
                    style={styles.attachmentOption}
                    onPress={handleVideo}
                  >
                    <View style={styles.attachmentIconWrapper}>
                      <Svgicons path="videoIcon" size={20} />
                    </View>
                    <AppText text="Video" fontSize={13} ml={10} />
                  </Pressable>
                  
                  <Pressable 
                    style={styles.attachmentOption}
                    onPress={handleGallery}
                  >
                    <View style={styles.attachmentIconWrapper}>
                      <Svgicons path="imageIcon" size={20} />
                    </View>
                    <AppText text="Gallery" fontSize={13} ml={10} />
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.attachmentOption, { borderBottomWidth: 0 }]}
                    onPress={handleDocument}
                  >
                    <View style={styles.attachmentIconWrapper}>
                      <Svgicons path="docIcon" size={20} />
                    </View>
                    <AppText text="Document" fontSize={13} ml={10} />
                  </Pressable>
                </View>
              )}
            </View>
          )}
          renderSend={(props) => (
            <View style={styles.sendWrapper}>
              <Pressable 
                onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
                style={styles.attachButton}
              >
                <Svgicons path="attachmentIcon" size={20} color={Colors.MIDNIGHT} />
              </Pressable>
              
              <Send {...props} containerStyle={styles.sendContainer}>
                <View style={styles.sendCircle}>
                  <Svgicons path="sendIcon" size={16} color={Colors.WHITE} />
                </View>
              </Send>
            </View>
          )}
          renderMessageText={(props) => (
            <MessageText
              {...props}
              textStyle={{
                right: {
                  color:
                    props.currentMessage.user._id === 3
                      ? Colors.BRUNSWICK_GREEN
                      : Colors.WHITE,
                },
                left: { color: Colors.MIDNIGHT },
              }}
            />
          )}
        />
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  automatedLabel: {
    alignItems: 'flex-end',
    marginBottom: 5,
    marginRight: 10,
  },
  aiWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: 'white',
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
  },
  aiFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 15,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: Colors.WHITE,
    paddingVertical: 4,
  },
  plusAction: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    width: Metrics.scale(50),
    height: Metrics.scale(50),
    borderWidth: 1,
    borderColor: Colors.SUPER_GREY,
    borderRadius: 100,
  },
  plusRotated: {
    transform: [{ rotate: '45deg' }],
  },
  sendWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCircle: {
    backgroundColor: Colors.WHITE,
    width: Metrics.scale(50),
    height: Metrics.scale(50),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.SUPER_GREY,
  },
  savedRepliesWrapper: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  repliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  replyChip: {
    borderWidth: 1,
    borderColor: Colors.SUPER_GREY,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  contextMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 220,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  attachmentMenu: {
    position: 'absolute',
    bottom: 70,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 180,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  attachmentIconWrapper: {
    width: 30,
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: Colors.SUPER_GREY,
    borderRadius: 100,
    height: 48,
    width: '95%',
    margin: 'auto',
    marginTop: 20,
    fontSize: 13,
    paddingHorizontal: Metrics.scale(15),
    paddingRight: Metrics.scale(45),
  },
  imageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 5,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  videoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 5,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  documentInfo: {
    flex: 1,
  },
});

export default ChatDetailScreen;