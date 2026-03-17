import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '111966524619-sco2bcssusilk7du74od8itl00hcmmor.apps.googleusercontent.com', // ← yeh Firebase Console se lena hai
    iosClientId: '111966524619-1i4aklgclvouap7et8a10hbii65n63ib.apps.googleusercontent.com', // ← plist CLIENT_ID
    offlineAccess: true,
  });
};