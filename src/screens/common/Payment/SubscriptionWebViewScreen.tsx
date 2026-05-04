import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '@/theme/colors';

// const PRODUCT_ID = 'c07c72c2-b5f8-41c7-8f90-fbf8de2d2440';
const BASE_URL = 'https://livedin.subscriptionflow.com/en/hosted-page/subscribe';

type RouteParams = { planId: string; qtyFrom: number };

const PaymentScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { planId, qtyFrom } = route.params ?? {};
  const [loading, setLoading] = React.useState(true);
  const webViewRef = React.useRef<WebView>(null);

  const subscriptionUrl = `${BASE_URL}/${planId}/product/c07c72c2-b5f8-41c7-8f90-fbf8de2d2440?charge_quantity=${qtyFrom}`;
  console.log('subscriptionUrl',subscriptionUrl);

console.log('PRODUCT_ID::',planId);
console.log('qtyFrom',qtyFrom);

  // Intercept new-window requests (popups) and load them in the same WebView
  const handleOpenWindow = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const url = nativeEvent?.targetUrl;
    if (url && webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.location.href = '${url}'; true;`);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
      javaScriptCanOpenWindowsAutomatically={true}
        ref={webViewRef}
        source={{ uri: subscriptionUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
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

export default PaymentScreen;

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
