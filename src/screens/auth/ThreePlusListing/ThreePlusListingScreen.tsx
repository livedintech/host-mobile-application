import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

// ─── APNA CALENDLY URL YAHAN RAKHO ───────────────────────────────────────────
const CALENDLY_URL = 'https://calendly.com/haseeb-tariq-livedin/30min';
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = '#1a4a3a';

type Props = {
  info?: { name: string; city: string; country: string };
  onBack?: () => void;
  onBooked?: (payload: any) => void;
};

export default function ThreePlusListingScreen({ info, onBooked }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const webRef = useRef<WebView>(null);


  const handleBooked = onBooked ?? ((payload: any) => console.log('Booked:', payload));

  const url = `${CALENDLY_URL}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; }
          .calendly-inline-widget { min-width: 320px; height: 100vh; }
        </style>
      </head>
      <body>
        <div
          class="calendly-inline-widget"
          data-url="${url}&hide_gdpr_banner=1&primary_color=${BRAND.replace('#', '')}"
        ></div>
        <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
        <script>
          window.addEventListener('message', function(e) {
            if (e.data && e.data.event && e.data.event.indexOf('calendly') === 0) {
              window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.event === 'calendly.event_scheduled') {
        handleBooked(data.payload);
      }
    } catch (_) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Heading */}
      <Text style={styles.heading}>
        {t('auth.three_plus_listing.heading')}
      </Text>

      {/* Calendly WebView */}
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={BRAND} />
            <Text style={styles.loaderText}>{t('auth.three_plus_listing.loading')}</Text>
          </View>
        )}
        <WebView
          ref={webRef}
          source={{ html }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setLoading(false)}
          onMessage={handleMessage}
          style={{ opacity: loading ? 0 : 1 }}
        />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBarWrap}>
        <View style={styles.bottomBar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 4,
  },
  logo: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 14,
    color: '#333',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  webviewContainer: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    color: BRAND,
    marginTop: 10,
    fontSize: 14,
  },
  bottomBarWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  bottomBar: {
    width: 100,
    height: 5,
    backgroundColor: '#1a1a1a',
    borderRadius: 999,
  },
});