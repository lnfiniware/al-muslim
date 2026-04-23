import React from 'react';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Line,
} from 'react-native-svg';
import { View } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: any;
}

export function AppLogo({ size = 200 }: AppLogoProps) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          {/* Gradient backgrounds */}
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1B5E4A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0D3E2F" stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E8C19A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#D4A574" stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F5EFE7" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E8DFD5" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Outer circle background */}
        <Circle cx="100" cy="100" r="95" fill="url(#bgGradient)" />

        {/* Decorative outer ring */}
        <Circle cx="100" cy="100" r="92" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <Circle cx="100" cy="100" r="88" fill="none" stroke="url(#accentGradient)" strokeWidth="1" opacity="0.5" />

        {/* Inner circle container */}
        <Circle cx="100" cy="100" r="80" fill="#F5EFE7" />

        {/* Islamic geometric pattern - 8-pointed star background */}
        <G opacity="0.1">
          <Polygon
            points="100,20 140,45 155,85 140,125 100,150 60,125 45,85 60,45"
            fill="#1B5E4A"
          />
        </G>

        {/* Crescent Moon - Main Element */}
        <G>
          {/* Crescent shape using path */}
          <Path
            d="M 100 35 C 85 45 75 60 75 80 C 75 105 85 125 100 135 C 95 130 85 115 85 95 C 85 75 95 55 100 50 Z"
            fill="#1B5E4A"
          />
          <Path
            d="M 100 35 C 85 45 75 60 75 80 C 75 105 85 125 100 135 L 105 130 C 90 122 82 105 82 85 C 82 68 90 52 105 42 Z"
            fill="#D4A574"
            opacity="0.8"
          />
        </G>

        {/* Five-pointed Star inside crescent */}
        <G>
          {/* Star points */}
          <Polygon
            points="100,50 105,65 121,68 110,77 114,93 100,85 86,93 90,77 79,68 95,65"
            fill="#E8C19A"
          />
          {/* Star center highlight */}
          <Circle cx="100" cy="75" r="3" fill="#F5EFE7" />
        </G>

        {/* Islamic patterns - Geometric lines */}
        <G stroke="#D4A574" strokeWidth="1.5" fill="none" opacity="0.6">
          {/* Top arc pattern */}
          <Path d="M 60 75 Q 100 50 140 75" />
          {/* Middle arc pattern */}
          <Path d="M 55 100 L 145 100" />
          {/* Bottom arc pattern */}
          <Path d="M 60 125 Q 100 150 140 125" />
        </G>

        {/* Decorative circles for Islamic elegance */}
        <Circle cx="100" cy="100" r="65" fill="none" stroke="#D4A574" strokeWidth="1" opacity="0.4" />
        <Circle cx="100" cy="100" r="50" fill="none" stroke="#D4A574" strokeWidth="0.8" opacity="0.2" />

        {/* Corner ornaments */}
        <G opacity="0.5">
          <Circle cx="40" cy="40" r="2" fill="#D4A574" />
          <Circle cx="160" cy="40" r="2" fill="#D4A574" />
          <Circle cx="40" cy="160" r="2" fill="#D4A574" />
          <Circle cx="160" cy="160" r="2" fill="#D4A574" />
        </G>

        {/* Outer decorative frame */}
        <Circle cx="100" cy="100" r="98" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.3" />
      </Svg>
    </View>
  );
}
