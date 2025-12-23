import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { BaseToastProps } from 'react-native-toast-message';

export const CustomErrorToast: React.FC<BaseToastProps> = ({ text1 }) => (
    <View style={styles.container}>
        <AppText text={text1 || ''} style={styles.text} color={Colors.BLACK} fontSize={13} type='Bold' numberOfLines={2}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '90%',
        backgroundColor: Colors.WHITE,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(16),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderLeftWidth:5,
        borderColor: Colors.INDIAN_RED

    },
    text: {
        flex: 1,
        marginLeft: Metrics.scale(12),
    },
    undoText: {
        textDecorationLine: 'underline',
    },
});