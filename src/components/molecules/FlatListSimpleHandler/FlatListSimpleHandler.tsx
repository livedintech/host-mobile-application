import React, { useState, useCallback, forwardRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  RefreshControl,
} from 'react-native';

import { Colors } from '@/theme/colors';
import SpinnerLoader from '../SmallLoader';
import EmptyComponent from '../EmptyView';

function defaultKeyExtractor(item: any) {
  return `${item.id}`;
}

type FlatListSimpleHandlerPropType = {
  data: Array<any>;
  isLoading: boolean;
  listEmptyText?: string;
  renderItem: ListRenderItem<any>;
  renderSkeleton?: () => React.ReactNode;

  /** Pull to refresh optional */
  onRefresh?: () => Promise<any> | void;

  HeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  keyExtractor?: (a: any) => string;
} & Omit<FlatListProps<any>, 'data' | 'renderItem' | 'keyExtractor'>;

const FlatListSimpleHandler = forwardRef<
  FlatList<any>,
  FlatListSimpleHandlerPropType
>(function FlatListSimpleHandler(
  {
    data,
    isLoading,
    renderItem,
    renderSkeleton,
    listEmptyText,
    onRefresh,
    keyExtractor = defaultKeyExtractor,
    ...flatListProps
  },
  ref,
) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [onRefresh]);

  const renderEmpty = () => {
    if (isLoading && renderSkeleton) return renderSkeleton();
    if (isLoading) return <SpinnerLoader size="large" />;
    return <EmptyComponent title={listEmptyText} />;
  };

  return (
    <FlatList
      ref={ref}
      bounces={Platform.OS === 'ios'}
      alwaysBounceVertical={Platform.OS === 'ios'}
      contentInsetAdjustmentBehavior="automatic"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={10}
      windowSize={5}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={flatListProps.HeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            title=""
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.MEDIUM_JUNGLE_GREEN}
          />
        ) : undefined
      }
      {...flatListProps}
    />
  );
});

export default FlatListSimpleHandler;
