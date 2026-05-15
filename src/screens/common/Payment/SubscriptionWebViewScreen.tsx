import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';

// const PRODUCT_ID = 'c07c72c2-b5f8-41c7-8f90-fbf8de2d2440';
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
  const { planId, qtyFrom, full_name, email, country_code, phone_number } = route.params ?? {};
  const [loading, setLoading] = React.useState(true);
  const webViewRef = React.useRef<WebView>(null);
  const user = useAuthStore((s) => s.user);

  // Prefer nav params (new signup flow), fall back to auth store (logged-in user)
  const nameParts = (full_name || user?.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  const resolvedEmail = email || user?.email || '';
  const resolvedCountry = country_code || user?.country || '';
  const resolvedPhone = phone_number || user?.phone_with_code || user?.phone || '';
  const resolvedAddress = user?.permanent_address || '';

  const params = new URLSearchParams({
    charge_quantity: String(qtyFrom),
    payment_widget: 'true',
    ...(firstName && { ai_firstName: firstName }),
    ...(lastName && { ai_lastName: lastName }),
    ...(resolvedEmail && { ai_email: resolvedEmail }),
    ...(resolvedCountry && { ai_billing_country: resolvedCountry }),
    ...(resolvedAddress && { ai_billing_address1: resolvedAddress }),
    ...(resolvedPhone && { ai_phone: resolvedPhone }),
  });

  const subscriptionUrl = `${BASE_URL}/${planId}/product/c07c72c2-b5f8-41c7-8f90-fbf8de2d2440?${params.toString()}`;
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
