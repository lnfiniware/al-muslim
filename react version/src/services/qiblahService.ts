// Qiblah Service
// Calculates the direction to Mecca (Qiblah) from any location

export interface QiblahDirection {
  angle: number; // 0-360 degrees
  direction: string; // N, NE, E, SE, S, SW, W, NW
}

const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

const getCompassDirectionName = (angle: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(angle / 22.5) % 16;
  return directions[index];
};

export const qiblahService = {
  /**
   * Calculate Qiblah direction from coordinates
   * Returns angle in degrees (0° = North, 90° = East, 180° = South, 270° = West)
   */
  calculateQiblah(latitude: number, longitude: number): QiblahDirection {
    const lat1 = toRad(latitude);
    const lon1 = toRad(longitude);
    const lat2 = toRad(MECCA_LAT);
    const lon2 = toRad(MECCA_LNG);

    const dLon = lon2 - lon1;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let angle = Math.atan2(y, x);
    angle = toDegrees(angle);
    angle = (angle + 360) % 360; // Normalize to 0-360

    return {
      angle: Math.round(angle * 10) / 10,
      direction: getCompassDirectionName(angle),
    };
  },

  /**
   * Get compass direction from angle
   */
  getCompassDirection(angle: number): string {
    return getCompassDirectionName(angle);
  },

  /**
   * Format angle for display
   */
  formatAngle(angle: number): string {
    return `${angle}°`;
  },

  /**
   * Get emoji/symbol for direction
   */
  getDirectionEmoji(direction: string): string {
    const emojis: Record<string, string> = {
      N: '⬆️',
      NNE: '↗️',
      NE: '↗️',
      ENE: '➡️',
      E: '➡️',
      ESE: '↘️',
      SE: '↘️',
      SSE: '⬇️',
      S: '⬇️',
      SSW: '↙️',
      SW: '↙️',
      WSW: '⬅️',
      W: '⬅️',
      WNW: '↖️',
      NW: '↖️',
      NNW: '⬆️',
    };
    return emojis[direction] || '➡️';
  },
};
