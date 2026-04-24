import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { goBack } from '@/services/navigationService';
import { useTranslation } from 'react-i18next';

interface NoAiAutoReplyScreenProps {
    onCreatePress: () => void;
}

const NoAiAutoReplyScreen = ({ onCreatePress }: NoAiAutoReplyScreenProps) => {
    const { t } = useTranslation();
    return (
            <View style={styles.container}>
             

                {/* Center Content */}
                <View style={styles.content}>
                    <Svgicons path="noAiAutoReplyIcon" size={Metrics.scale(320)} />
                    
                    <AppText
                        text={t('app.no_ai_auto_reply.title')}
                        fontSize={28}
                        type="Bold"
                        color={Colors.BLACK}
                        textAlign="center"
                        style={styles.title}
                    />

                    <AppText
                        text={t('app.no_ai_auto_reply.description')}
                        fontSize={14} 
                        color={Colors.DARK_CHARCOAL_OPACITY} 
                        textAlign="center"
                        lineHeight={20}
                        style={styles.description}
                    />
                </View>

                {/* Footer Action */}
                {/* <View style={styles.footer}>
                    <AppButton
                        title="Create New Reply"
                        onPress={onCreatePress}
                        backgroundColor={Colors.TEAL_PRIMARY_ALT}
                        borderColor={Colors.TEAL_PRIMARY_ALT}
                    />
                </View> */}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.verticalScale(40),
    },
    header: {
        paddingHorizontal: Metrics.scale(22),
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(40),
        marginBottom: Metrics.verticalScale(100), // Offset for footer
    },
    title: {
        marginTop: Metrics.verticalScale(30),
        marginBottom: Metrics.verticalScale(15),
    },
    description: {
        paddingHorizontal: Metrics.scale(10),
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Metrics.scale(22),
        paddingBottom: Metrics.verticalScale(40),
    }
});

export default NoAiAutoReplyScreen;