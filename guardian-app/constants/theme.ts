export { Colors } from './colors';
import { Colors } from './colors';

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 28,
    xxl: 32,
    pill: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      mono: 'SpaceMono-Regular',
    },
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      hero: 36,
      display: 44,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    }
  },
  shadows: {
    soft: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    },
    glass: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 24,
      elevation: 6,
    },
    lifted: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 32,
      elevation: 8,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
    }),
    // Legacy aliases
    neonPurple: {
      shadowColor: '#4A3728',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    neonPink: {
      shadowColor: '#8D6E63',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    softNeumorphism: {
      shadowColor: '#2D1E17',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 4,
    },
    dangerGlow: {
      shadowColor: '#C0505F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
  },
};

export default Theme;
