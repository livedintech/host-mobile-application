import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Pixel-perfect Airbnb "Bélo" Icon
export const AirbnbIcon = ({ size = 12, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.65c-.56 0-1.12-.22-1.54-.64l-7.44-7.44a5.3 5.3 0 010-7.5c2.06-2.06 5.42-2.06 7.48 0l1.5 1.5 1.5-1.5c2.06-2.06 5.42-2.06 7.48 0a5.3 5.3 0 010 7.5l-7.44 7.44c-.42.42-.98.64-1.54.64z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gathern-style minimalist Arch/Door Icon
export const GathernIcon = ({ size = 12, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 21V9a8 8 0 1116 0v12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);