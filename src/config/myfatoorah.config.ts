import { MFCountry, MFEnvironment } from 'myfatoorah-reactnative';
import { MY_FATOORAH_API } from '@env';

// MyFatoorah configuration interface
interface MyFatoorahConfig {
  apiKey: string;
  country: MFCountry;
  environment: MFEnvironment;
  actionBarTitle: string;
  actionBarTitleColor: string;
  actionBarBackgroundColor: string;
}

// Main configuration
export const myFatoorahConfig: MyFatoorahConfig = {
  apiKey: MY_FATOORAH_API,
  country: MFCountry.SAUDIARABIA, // Change to MFCountry.PAKISTAN if needed
  environment: MFEnvironment.LIVE, // Production environment
  actionBarTitle: 'Secure Payment',
  actionBarTitleColor: '#FFFFFF',
  actionBarBackgroundColor: '#000000',
};

// Validation helper
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!myFatoorahConfig.apiKey) {
    errors.push('MyFatoorah API key is missing in .env file');
  }

  if (myFatoorahConfig.apiKey && myFatoorahConfig.apiKey.length < 20) {
    errors.push('MyFatoorah API key appears to be invalid (too short)');
  }

  if (myFatoorahConfig.apiKey === 'your_api_key_here') {
    errors.push('Please replace placeholder API key with actual key');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Available countries for easy reference
export const AVAILABLE_COUNTRIES = {
  SAUDI_ARABIA: MFCountry.SAUDIARABIA,
  KUWAIT: MFCountry.KUWAIT,
  UAE: MFCountry.UNITEDARABEMIRATES,
  QATAR: MFCountry.QATAR,
  BAHRAIN: MFCountry.BAHRAIN,
  OMAN: MFCountry.OMAN,
  JORDAN: MFCountry.JORDAN,
  EGYPT: MFCountry.EGYPT,
} as const;

// Helper function to get country name
export const getCountryName = (country: MFCountry): string => {
  const countryMap: Record<string, string> = {
    [MFCountry.SAUDIARABIA]: 'Saudi Arabia',
    [MFCountry.KUWAIT]: 'Kuwait',
    [MFCountry.UNITEDARABEMIRATES]: 'United Arab Emirates',
    [MFCountry.QATAR]: 'Qatar',
    [MFCountry.BAHRAIN]: 'Bahrain',
    [MFCountry.OMAN]: 'Oman',
    [MFCountry.JORDAN]: 'Jordan',
    [MFCountry.EGYPT]: 'Egypt',
  };

  return countryMap[country] || 'Unknown';
};

// Helper to check if environment is production
export const isProduction = (): boolean => {
  return myFatoorahConfig.environment === MFEnvironment.LIVE;
};

// Helper to get environment name
export const getEnvironmentName = (): string => {
  return myFatoorahConfig.environment === MFEnvironment.LIVE 
    ? 'Production' 
    : 'Test/Sandbox';
};

// Export config as default
export default myFatoorahConfig;

// Type exports
export type { MyFatoorahConfig };