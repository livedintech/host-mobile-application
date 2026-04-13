import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const ACTIVE_COLOR = '#41B597';
const INACTIVE_COLOR = '#1A1A1A';

const getIcon = (routeName: string) => {
  switch (routeName) {
    case 'HOME_SCREEN':    return require('@/assets/img/home_icon.png');
    case 'LISTING_SCREEN': return require('@/assets/img/calendar_icon.png');
    case 'CHAT_SCREEN':    return require('@/assets/img/inbox_icon.png');
    case 'TASK_SCREEN':    return require('@/assets/img/taskBottomTabIcon.png');
    case 'MORE_SCREEN':    return require('@/assets/img/more_icon.png');
    default:               return require('@/assets/img/home_icon.png');
  }
};

const getLabel = (routeName: string) => {
  switch (routeName) {
    case 'HOME_SCREEN':    return 'Home';
    case 'LISTING_SCREEN': return 'Calendar';
    case 'CHAT_SCREEN':    return 'Inbox';
    case 'TASK_SCREEN':    return 'Tasks';
    case 'MORE_SCREEN':    return 'More';
    default:               return '';
  }
};

const TabItems = ({ state, navigation }: any) => (
  <View style={styles.tabRow}>
    {state.routes.map((route: any, index: number) => {
      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      return (
        <Pressable
          key={route.key}
          onPress={onPress}
          android_ripple={{
            color: 'rgba(65,181,151,0.18)',
            borderless: true,
            radius: 40,
          }}
          style={styles.tabItem}
        >
          {/* Active indicator dot */}
          {/* {isFocused && <View style={styles.activeDot} />} */}

          <Image
            source={getIcon(route.name)}
            style={[
              styles.icon,
              { tintColor: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR },
              isFocused && styles.iconActive,
            ]}
          />
          <Text
            style={[
              styles.label,
              { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR },
              isFocused && styles.labelActive,
            ]}
          >
            {getLabel(route.name)}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const BottomTab = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.absoluteWrapper,
        { bottom:0 },
      ]}
      pointerEvents="box-none"
    >
      {Platform.OS === 'ios' ? (
        // ── iOS — native BlurView (pehle wala best tha) ─────────
        <View style={styles.borderShell}>
          <BlurView
            style={styles.glassInner}
            blurType="light"
            blurAmount={30}
            reducedTransparencyFallbackColor="rgba(232, 232, 232, 0.25)"
          >
            <View style={styles.iosOverlay}>
              <TabItems state={state} navigation={navigation} />
            </View>
          </BlurView>
        </View>
      ) : (
        // ── Android — liquid glass simulation ───────────────────
        <View style={styles.borderShell}>
          {/* Base frosted gradient */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.55)',
              'rgba(235, 242, 240, 0.30)',
              'rgba(215, 230, 226, 0.20)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top shine — wet glass reflection */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.45)',
              'rgba(255, 255, 255, 0.00)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.androidShine}
          />

          {/* Subtle tint overlay */}
          <View style={styles.androidNoise} />

          {/* Tab content */}
          <View style={styles.androidContent}>
            <TabItems state={state} navigation={navigation} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },

  // ── Border shell — GlassCard style ──────────────────────────
  borderShell: {
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: 'rgba(232, 232, 232, 0.25)',

    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomColor: 'rgba(180, 180, 180, 0.45)',
    borderRightColor: 'rgba(180, 180, 180, 0.35)',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },

  // ── iOS ──────────────────────────────────────────────────────
  glassInner: {
    height: 70,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  iosOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // ── Android ──────────────────────────────────────────────────
  androidShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },

  androidNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 220, 215, 0.50)',
  },

  androidContent: {
    height: 70,
  },

  // ── Shared tab layout ────────────────────────────────────────
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },

  // Small teal dot above active icon
  activeDot: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  iconActive: {
    transform: [{ scale: 1.08 }],
  },

  label: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  labelActive: {
    fontWeight: '700',
  },
});

export default BottomTab;