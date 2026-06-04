import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = 'https://livedin.subscriptionflow.com/en/hosted-page/subscribe';

type RouteParams = {
  planId: string;
  qtyFrom: number;
  full_name?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
};

const PaymentScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { planId, full_name, email, country_code, phone_number } = route.params ?? {};
  const [loading, setLoading] = React.useState(true);
const webViewRef = React.useRef<WebView>(null);
  const user = useAuthStore((s) => s.user);

  const nameParts = (full_name || user?.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') || firstName;

  const resolvedEmail = email || user?.email || '';
  const resolvedCountry = country_code || user?.country_code || 'SA';
  const resolvedAddress = user?.permanent_address || 'Riyadh, Saudi Arabia';
  const resolvedPhone = phone_number || user?.phone || '';

  const queryString = [
    `payment_widget=true`,
    `ai_firstName=${encodeURIComponent(firstName)}`,
    `ai_lastName=${encodeURIComponent(lastName)}`,
    `ai_email=${resolvedEmail}`,
    `ai_billing_country=${resolvedCountry}`,
    `ai_billing_address1=${encodeURIComponent(resolvedAddress)}`,
    `ai_phone=${encodeURIComponent(resolvedPhone)}`,
  ].join('&');

  const subscriptionUrl = `${BASE_URL}/${planId}/product/c07c72c2-b5f8-41c7-8f90-fbf8de2d2440?${queryString}`;
  console.log('subscriptionUrl', subscriptionUrl);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: subscriptionUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        mixedContentMode="compatibility"
        sharedCookiesEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
        setSupportMultipleWindows={false}
        // Force ALL URLs to load inside WebView — prevent external browser from opening
        onShouldStartLoadWithRequest={() => true}
        onOpenWindow={(e) => {
          const url = e.nativeEvent?.targetUrl;
          if (url && webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.location.href = '${url}'; true;`);
          }
        }}
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        onMessage={(event) => console.log('MSG:', event.nativeEvent.data)}
        onError={(error) => console.log('ERROR:', error.nativeEvent)}
        onHttpError={(error) => console.log('HTTP ERROR:', error.nativeEvent)}
        onNavigationStateChange={(navState) => console.log('NAV:', navState.url)}
        onLoadEnd={() => setLoading(false)}
        style={styles.webview}
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
