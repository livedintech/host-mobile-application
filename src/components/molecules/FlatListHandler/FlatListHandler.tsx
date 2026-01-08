import React, { useState, useCallback } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  RefreshControl,
} from 'react-native';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

import { Colors } from '@/theme/colors';
import SpinnerLoader from '../SmallLoader';
import EmptyComponent from '../EmptyView';


function defaultKeyExtractor(item: any) {
  return `${item.id}`;
}

type FlatListHandlerPropType = {
  data: Array<any>;
  isLoading: boolean;
  listEmptyText?: string;
  shouldFetchMore?: boolean;
  meta: UseInfiniteQueryResult;
  renderItem: ListRenderItem<any>;
  renderSkeleton?: () => React.ReactNode;
  HeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  footerLoadingCondition?: boolean;
  keyExtractor?: (a: any) => string;
} & Omit<FlatListProps<any>, 'data' | 'renderItem' | 'keyExtractor'>;

export default function FlatListHandler({
  data,
  meta,
  isLoading,
  renderItem,
  renderSkeleton,
  listEmptyText,
  shouldFetchMore = true,
  footerLoadingCondition = false,
  keyExtractor = defaultKeyExtractor,
  ...flatListProps
}: FlatListHandlerPropType) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMore = useCallback(() => {
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = meta;
    if (shouldFetchMore && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [meta, shouldFetchMore]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    meta.refetch().finally(() => {
      setIsRefreshing(false);
    });
  }, [meta]);

  const renderEmpty = () => {
    if (isLoading && renderSkeleton) return renderSkeleton();
    if (isLoading) return <SpinnerLoader size="large" />;
    return <EmptyComponent title={listEmptyText} />;
  };

  const renderFooter = () => {
    if (footerLoadingCondition || meta.isFetchingNextPage) {
      return renderSkeleton ? renderSkeleton() : <SpinnerLoader size="small" />;
    }
    return null;
  };

  return (
    <FlatList
      bounces={Platform.OS === 'ios' ? true : false}
      alwaysBounceVertical={Platform.OS === 'ios' ? true : false}
      contentInsetAdjustmentBehavior="automatic"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={10}
      windowSize={5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={flatListProps.HeaderComponent}  // ✅ This line is required
      refreshControl={
        <RefreshControl
          title=""
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          tintColor={Colors.INDIAN_RED}
        />
      }
      onEndReached={fetchMore}
      onEndReachedThreshold={0.2}
      {...flatListProps}
    />
  );
}
