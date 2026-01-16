import React from 'react';
import { StyleSheet, View, Pressable, Keyboard } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, MessageText } from 'react-native-gifted-chat';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import { useChatDetailContainer } from './ChatDetailContainer';

const SAVED_REPLIES = ['Wifi Pass', 'Cleaning', 'Check in', 'Check out', 'Bathroom', 'Bedsheet', 'Timings', 'Booking'];

const ChatDetailScreen = () => {
    const {
        messages, onSend, showAiSuggestion, setShowAiSuggestion,
        showSavedReplies, toggleSavedReplies
    } = useChatDetailContainer();

    const renderBubble = (props: any) => {
        const isAutomated = props.currentMessage.user._id === 3;
        return (
            <View>
                {isAutomated && (
                    <AppText text="Automated Message" fontSize={10} color={Colors.GREY_SHADOW} mb={5} mr={10} />
                )}
                <Menu>
                    <MenuTrigger>
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                right: {
                                    backgroundColor: isAutomated ? 'transparent' : Colors.BRUNSWICK_GREEN,
                                    borderRadius: 15, borderBottomRightRadius: 2,
                                    ...(isAutomated && { borderStyle: 'dotted', borderWidth: 1.5, borderColor: Colors.BRUNSWICK_GREEN })
                                },
                                left: { backgroundColor: '#F2F2F2', borderRadius: 15, borderBottomLeftRadius: 2 },
                            }}
                        />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
                        <MenuOption onSelect={() => { }} style={styles.menuOption}>
                            <AppText text="Copy Text" fontSize={14} /><Svgicons path="docIcon" size={18} />
                        </MenuOption>
                        <MenuOption onSelect={() => { }} style={styles.menuOption}>
                            <AppText text="Task Creation" fontSize={14} /><Svgicons path="taskIcon" size={18} />
                        </MenuOption>
                        <MenuOption onSelect={() => { }} style={[styles.menuOption, { borderBottomWidth: 0 }]}>
                            <AppText text="Translate Message" fontSize={14} /><AppText text="AR" fontSize={12} color={Colors.GREY_SHADOW} />
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        );
    };

    const renderAccessory = () => {
        if (!showAiSuggestion) return null;
        return (
            <View style={styles.aiWrapper}>
                <AppText text="A.I Suggestions" fontSize={11} color={Colors.GREY_SHADOW} mb={8} />
                <View style={styles.aiBubble}>
                    <Pressable onPress={() => setShowAiSuggestion(false)} style={styles.aiClose}>
                        <Svgicons path="closeIcon" size={12} />
                    </Pressable>
                    <AppText
                        text="Welcome! Your check-in is from 3:00 PM to 10:00 PM. Door code: 4521..."
                        fontSize={13} color={Colors.BRUNSWICK_GREEN}
                    />
                    <View style={styles.aiFooter}>
                        <AppText text="Edit" fontSize={12} type="Bold" />
                        <Pressable onPress={() => onSend([{ _id: Math.random(), text: 'AI Suggested Response', createdAt: new Date(), user: { _id: 1 } }])}>
                            <AppText text="Send Now" fontSize={12} type="Bold" ml={15} />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    const renderChatFooter = () => {
        if (!showSavedReplies) return <View style={{ height: 20 }} />;
        return (
            <View style={styles.savedRepliesWrapper}>
                <AppText text="Saved Replies" type="Bold" mb={15} color={Colors.MIDNIGHT} fontSize={16} />
                <View style={styles.repliesGrid}>
                    {SAVED_REPLIES.map(item => (
                        <Pressable
                            key={item}
                            style={styles.replyChip}
                            onPress={() => onSend([{ _id: Math.random(), text: item, createdAt: new Date(), user: { _id: 1 } }])}
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
                        style: styles.inputStyle
                    }}
                    messages={messages}
                    onSend={onSend}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    renderAccessory={renderChatFooter}
                    renderChatFooter={renderAccessory}
                    isSendButtonAlwaysVisible
                    renderInputToolbar={(props) => (
                        <InputToolbar
                            {...props}
                            containerStyle={styles.inputToolbar}
                            renderActions={() => (
                                <Pressable onPress={() => { Keyboard.dismiss(); toggleSavedReplies(); }} style={[{ backgroundColor: showSavedReplies ? Colors.BRUNSWICK_GREEN : Colors.WHITE }, styles.plusAction]}>
                                    {showSavedReplies ? <Svgicons path="plusWhiteIcon" size={16} /> : <Svgicons path="plusIcon" size={16} />}
                                </Pressable>
                            )}
                        />
                    )}
                    renderSend={(props) => (
                        <Send {...props} containerStyle={styles.sendContainer}>
                            <View style={styles.sendCircle}><Svgicons path="sendIcon" size={16} color={Colors.WHITE} /></View>
                        </Send>
                    )}
                    renderMessageText={(props) => (
                        <MessageText {...props} textStyle={{
                            right: { color: props.currentMessage.user._id === 3 ? Colors.BRUNSWICK_GREEN : Colors.WHITE },
                            left: { color: Colors.MIDNIGHT }
                        }} />
                    )}
                />
            </View>
        </MenuProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    aiWrapper: { paddingHorizontal: 15, paddingBottom: 10, backgroundColor: 'white' },
    aiBubble: { borderStyle: 'dotted', borderWidth: 1.5, borderColor: Colors.BRUNSWICK_GREEN, borderRadius: 15, padding: 15, backgroundColor: '#F9FCFB' },
    aiClose: { position: 'absolute', right: 10, top: 10, padding: 5 },
    aiFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    inputToolbar: { borderTopWidth: 1, borderTopColor: Colors.WHITE, paddingVertical: 4 },
    plusAction: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: Metrics.scale(50), height: Metrics.scale(50), borderWidth: 1, borderColor: Colors.SUPER_GREY, borderRadius: 100, },
    sendContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    sendCircle: { backgroundColor: Colors.WHITE, width: Metrics.scale(50), height: Metrics.scale(50), borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.SUPER_GREY },
    savedRepliesWrapper: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
    repliesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    replyChip: { borderWidth: 1, borderColor: Colors.SUPER_GREY, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, marginBottom: 10 },
    popupMenu: { borderRadius: 12, width: 220, padding: 5, marginTop: -60 },
    menuOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
    inputStyle: {
        borderWidth: 1,
        borderColor: Colors.SUPER_GREY,
        borderRadius: 100,
        height: 48,
        width: '95%',
        margin: 'auto',
        marginTop: 20,
        fontSize: 13,
        paddingHorizontal: Metrics.scale(15)
    }
});

export default ChatDetailScreen;