import {
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId as setCrashlyticsUserId,
  setAttributes as setCrashlyticsAttributes,
  crash,
} from '@react-native-firebase/crashlytics';

export class CrashlyticsService {
  static initiated = false;

  static async init(): Promise<void> {
    if (this.initiated) return;
    this.initiated = true;

    await setCrashlyticsCollectionEnabled(getCrashlytics(), true);

    this.registerGlobalErrorHandlers();
  }

  static log(message: string): void {
    log(getCrashlytics(), message);
  }

  static recordError(error: Error, jsErrorName?: string): void {
    recordError(getCrashlytics(), error, jsErrorName);
  }

  static async setUserId(userId: string): Promise<void> {
    await setCrashlyticsUserId(getCrashlytics(), userId);
  }

  static async setAttributes(attributes: Record<string, string>): Promise<void> {
    await setCrashlyticsAttributes(getCrashlytics(), attributes);
  }

  static testCrash(): void {
    crash(getCrashlytics());
  }

  private static registerGlobalErrorHandlers(): void {
    const defaultHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      CrashlyticsService.recordError(error, isFatal ? 'FatalError' : 'JSError');
      defaultHandler(error, isFatal);
    });

    // Metro/RN's promise polyfill doesn't surface unhandled rejections by default
    const rejectionTracking = require('promise/setimmediate/rejection-tracking');
    rejectionTracking.enable({
      allRejections: true,
      onUnhandled: (_id: number, error: Error) => {
        if (__DEV__) console.warn('Unhandled promise rejection:', error);
        CrashlyticsService.recordError(error, 'UnhandledPromiseRejection');
      },
      onHandled: () => {},
    });
  }
}
