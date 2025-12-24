// For SVG imports
declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  import React from 'react';
  const content: React.FC<SvgProps>;
  export default content;
}

// For environment variables
declare module '@env' {
  export const BASE_URL_DEV: string;
  export const BASE_URL_PROD: string;
  export const BASE_URL_QA: string;
  export const MY_FATOORAH_API: string;
}
