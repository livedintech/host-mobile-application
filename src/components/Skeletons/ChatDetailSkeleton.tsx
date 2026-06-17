import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Metrics from '@/utility/Metrics';

const ChatDetailSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={15}>
      <View style={styles.container}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => {
          const isHost = index % 2 === 0;
          return (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                isHost && styles.hostMessage,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  { width: isHost ? '55%' : '65%' },
                ]}
              />
            </View>
          );
        })}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: Metrics.verticalScale(10),
  },

  messageWrapper: {
    marginVertical: 8,
    alignItems: 'flex-start',
  },

  hostMessage: {
    alignItems: 'flex-end',
  },

  bubble: {
    height: Metrics.verticalScale(50),
    borderRadius: 15,
  },
});

export default ChatDetailSkeleton;
