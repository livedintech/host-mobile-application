import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '1037607741313-5hcsrnfu7qmg9v4rmnkqqohkudjcqvpm.apps.googleusercontent.com',
    offlineAccess: true,
  });
};