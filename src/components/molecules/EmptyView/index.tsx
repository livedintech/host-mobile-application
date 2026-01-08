import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';

type EmptyComponentProps = {
    title?: string
}

export default function EmptyComponent(props: EmptyComponentProps) {
    const { title = "No Data Found" } = props

    return (
        <View style={styles.container}>
            <AppText text={title} fontSize={16} type="SemiBold" />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})