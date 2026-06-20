import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { Colors } from '@/theme/colors';
import { AppImageProps } from './type';

// Never let a slow/edge-case network image spin the loader forever.
const LOADER_TIMEOUT_MS = 6000;

// local require() assets resolve to a number and are available instantly —
// only { uri } sources go over the network and actually need a loader.
const getSourceKey = (source: AppImageProps['source']): string | number | undefined => {
  if (source == null) return undefined;
  if (typeof source === 'number') return source;
  if (Array.isArray(source)) return source.map(getSourceKey).join('|');
  return (source as { uri?: string }).uri;
};

const isRemoteSource = (source: AppImageProps['source']): boolean =>
  typeof getSourceKey(source) === 'string';

const AppImage = ({
  source,
  fallbackSource,
  style,
  containerStyle,
  resizeMode = 'cover',
  showLoader = true,
  loaderColor = Colors.PRIMARY_TEAL,
  loaderSize = 'small',
  onLoadStart,
  onLoad,
  onLoadEnd,
  onError,
  ...rest
}: AppImageProps) => {
  const sourceKey = getSourceKey(source);
  // Callers often pass a fresh `{ uri }` literal on every render. Keep the
  // reference stable across re-renders so FastImage only sees a "new"
  // source when the uri/asset actually changes — otherwise it can re-kick
  // off its load sequence on unrelated parent re-renders and the loading
  // state gets out of sync (image frozen, or loader stuck spinning).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableSource = useMemo(() => source, [sourceKey]);
  const remote = isRemoteSource(source);
  const [isLoading, setIsLoading] = useState(remote);
  const [hasError, setHasError] = useState(false);

  // Reset load state whenever the source actually changes — without this,
  // a recycled list row (FlatList) keeps the previous image's stale
  // loading/error state and either freezes or spins forever.
  useEffect(() => {
    setIsLoading(remote);
    setHasError(false);

    if (!remote) return undefined;

    const timeout = setTimeout(() => setIsLoading(false), LOADER_TIMEOUT_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoad = (event: Parameters<NonNullable<AppImageProps['onLoad']>>[0]) => {
    setIsLoading(false);
    onLoad?.(event);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  const handleError = (event: Parameters<NonNullable<AppImageProps['onError']>>[0]) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };

  return (
    <View style={[styles.container, style, containerStyle]}>
      <FastImage
        {...rest}
        source={hasError && fallbackSource ? fallbackSource : stableSource}
        style={StyleSheet.absoluteFillObject}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />

      {showLoader && remote && isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.ANTI_FLASH_WHITE,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppImage;
