import React, { FC, ReactNode } from 'react';
import { ScrollView, RefreshControl, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { Colors } from '@/theme/colors';

interface RefreshableScrollViewProps extends ScrollViewProps {
    children: ReactNode;
    isLoading?: boolean;
    skeletonComponent?: ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
}

const RefreshableScrollView: FC<RefreshableScrollViewProps> = ({
    children,
    isLoading,
    skeletonComponent,
    refreshing,
    onRefresh,
    style,
    ...rest
}) => {
    return (
        <ScrollView
            style={[styles.container, style]}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || false}
                    onRefresh={onRefresh}
                    tintColor={Colors.BLACK}
                    colors={[Colors.BLACK]}
                />
            }
            {...rest}
        >
            {isLoading ? skeletonComponent : children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RefreshableScrollView;