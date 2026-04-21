import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SpinnerLoaderProps } from './types';
import { Colors } from '@/theme/colors';

export default function SpinnerLoader(props: SpinnerLoaderProps) {
    const { containerStyles, size = "large" } = props
    return (
      <View style={[styles.container, containerStyles]}>
        <ActivityIndicator size={size} color={Colors.MEDIUM_JUNGLE_GREEN} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})