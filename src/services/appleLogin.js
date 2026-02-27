import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { zustandStorage } from '@/storage/mmkv';


export const appleAuthLogin = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.FULL_NAME,
        AppleAuthRequestScope.EMAIL,
      ],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      let storedUserInfo = await zustandStorage.getItem('SOCIAL_LOGIN'); // Storage me check karein
      let newUserInfo = {
        user: appleAuthRequestResponse.user,
        email: appleAuthRequestResponse.email || storedUserInfo?.email || '',
        fullName:
          appleAuthRequestResponse.fullName || storedUserInfo?.fullName || {},
      };

      if (appleAuthRequestResponse?.email) {
        await zustandStorage.setItem('SOCIAL_LOGIN', newUserInfo);
      }

      return {
        error: null,
        userInfo: newUserInfo,
      };
    } else {
      return {
        error: 'User is not authenticated',
        userInfo: null,
      };
    }
  } catch (error) {
    return {
      error: error.message || 'Unknown error',
      userInfo: null,
    };
  }
};
