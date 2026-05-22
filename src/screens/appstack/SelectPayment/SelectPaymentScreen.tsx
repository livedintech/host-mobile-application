import React, { useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '@/theme/colors';
import useSelectPaymentContainer from './SelectPaymentContainer';

const SelectPaymentScreen = () => {
  const { webViewUrl } = useSelectPaymentContainer();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const handleOpenWindow = (syntheticEvent: any) => {
    const url = syntheticEvent?.nativeEvent?.targetUrl;
    if (url && webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.location.href = '${url}'; true;`);
    }
  };

  if (!webViewUrl) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        javaScriptCanOpenWindowsAutomatically
        setSupportMultipleWindows={false}
        onOpenWindow={handleOpenWindow}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.MEDIUM_JUNGLE_GREEN} />
        </View>
      )}
    </View>
  );
};

export default SelectPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
});
