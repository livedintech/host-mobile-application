import { Alert, Linking, NativeScrollEvent, PermissionsAndroid, Platform } from 'react-native'
import { get, set, xor, sortBy, debounce, chunk } from 'lodash'
import Color from 'color'

class Utility {
  private setAuthCallbackHolder: Function | null = null

  setAuthCallback(cb: Function) {
    this.setAuthCallbackHolder = cb
  }

  getAuthCallback() {
    return this.setAuthCallbackHolder
  }

  isPlatformAndroid = () => Platform.OS === 'android'
  isPlatformIOS = () => Platform.OS === 'ios'

  async openURLCall(url: string) {
    return Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('Cannot handle URL:', url)
          return false
        } else {
          return Linking.openURL(url)
        }
      })
      .catch(err => {
        console.error('An error occurred while opening URL:', err)
        return false
      })
  }

  getValue(...param: Parameters<typeof get>) {
    return get(...param)
  }

  setValue(...param: Parameters<typeof set>) {
    return set(...param)
  }

  xorArray(...param: Parameters<typeof xor>) {
    return xor(...param)
  }

  debounce(...param: Parameters<typeof debounce>) {
    return debounce(...param)
  }

  sortBy(...param: Parameters<typeof sortBy>) {
    return sortBy(...param)
  }

  chunk(...param: Parameters<typeof chunk>) {
    return chunk(...param)
  }

  getCachedSearchCb(cb: (text: string) => void, threshold = 3000) {
    let timerId: NodeJS.Timeout | null = null
    return (text: string) => {
      if (timerId) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => cb(text), threshold)
    }
  }

  getCountCutoffString(count: number, limit = 100): string {
    if (count > 1000000) return `${Math.floor(count / 1000000)}m+`
    if (count > 1000) return `${Math.floor(count / 1000)}k+`
    if (count > limit) return `${limit - 1}+`
    return count.toString()
  }

  getFormattedText(num = 0, prefix = '', postfix = ''): string {
    const wholeNumber = Math.floor(num)
    const decimal = (num % 1).toFixed(2).substring(2)
    const formattedWhole = String(wholeNumber).padStart(2, '0')
    return `${prefix}${formattedWhole}.${decimal}${postfix}`
  }

  isEmpty(value: string | number | boolean | Array<any> | object): boolean {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'number' && Number.isNaN(value)) ||
      value === false ||
      value === 0 ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    )
  }

  isNotEmptyArray(value: any): boolean {
    return Array.isArray(value) && value.length > 0
  }

  createDynamicUrl(dynamicUrl: string, object: Record<string, string | number>): string {
    for (const key in object) {
      dynamicUrl = dynamicUrl.replace(`{${key}}`, String(object[key]))
    }
    return dynamicUrl
  }

  parseUrl = (url: string): Record<string, string | null> => {
    const result: Record<string, string | null> = {}
    const queryString = url.split('?')[1]
    if (!queryString) return result

    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=')
      result[key] = value ? decodeURIComponent(value) : null
    })

    return result
  }
}

// Color Utilities
export const getShade = (color: string, shade: number): string => {
  const baseColor = Color(color)
  const black = Color('black')
  const diff = shade < 0 ? baseColor.lightness() : black.lightness()
  const newLightness = Math.abs(diff * shade)
  return baseColor.lightness(newLightness).hex()
}

export const lightenColor = (colorString: string, amount: number): string => {
  return Color(colorString).lighten(amount).hex()
}

export const opacityColor = (colorString: string, amount: number): string => {
  return Color(colorString).alpha(amount).hexa()
}

// Scroll Utility
export const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
  onEndReachedThreshold: number,
): boolean => {
  const paddingToBottom = contentSize.height * onEndReachedThreshold
  return (
    Math.ceil(layoutMeasurement.height + contentOffset.y) >=
    contentSize.height - paddingToBottom
  )
}

// Count Formatter
export const getFormattedCount = (count: number): string => {
  return count < 10 ? `0${count}` : count.toString()
}
export const limitCharacters = (text: any, limit: any) => {
  if (text?.length <= limit) {
    return text;
  } else {
    return text?.slice(0, limit) + '...';
  }
};

/**
 * Format Currency
 * @param {number} number
 * @param {string} currency
 * @returns
 */
export const formatCurrency = (number: any, currency = 'AED') => {
  return Intl.NumberFormat('en-US', {
    currency: currency,
    style: 'currency',
  }).format(number);
};
export const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Gallery Permission Error:', err);
      return false;
    }
  }
  return true;
};

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera Permission Error:', err);
      return false;
    }
  }
  return true;
};
export async function requestVideoPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);
    return (
      granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
      (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED)
    );
  }
  return true;
}
export const handleCall = (number: number | string) => {
  const phoneNumber = number;

  if (phoneNumber) {
    const url = `tel:${phoneNumber}`;

    // Attempt to open the URL
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to make a phone call.');
    });
  } else {
    Alert.alert('Error', 'Phone number is not available.');
  }
};
export const handleEmail = (email: string) => {
  if (email) {
    const url = `mailto:${email}`;

    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to open email client.');
    });
  } else {
    Alert.alert('Error', 'Email address is not available.');
  }
};

const normalizeDriveLink = (url: string) =>
  url.replace('/u/0/', '/').trim();

export const handleOpenLink = async (url: string) => {
  const normalized = normalizeDriveLink(url);
  if (!normalized) {
    Alert.alert('Error', 'Link is not available.');
    return;
  }

  try {
    await Linking.openURL(normalized);
  } catch {
    Alert.alert('Error', 'Unable to open link.');
  }
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default new Utility()
