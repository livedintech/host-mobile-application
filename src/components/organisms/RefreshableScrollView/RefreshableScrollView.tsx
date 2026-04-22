import React, { FC, ReactNode } from 'react';
import { ScrollView, RefreshControl, StyleSheet, ScrollViewProps } from 'react-native';
import { Colors } from '@/theme/colors';
import SpinnerLoader from '@/components/molecules/SmallLoader';

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
    const renderContent = () => {
        if (isLoading) {
            // Use provided skeletonComponent or default SpinnerLoader
            return skeletonComponent || <SpinnerLoader />;
        }
        return children;
    };

    return (
        <ScrollView
            style={[styles.container, style]}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || false}
                    onRefresh={onRefresh}
                    tintColor={Colors.MEDIUM_JUNGLE_GREEN}
                    colors={[Colors.MEDIUM_JUNGLE_GREEN]}
                />
            }
            {...rest}
        >
            {renderContent()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RefreshableScrollView;
